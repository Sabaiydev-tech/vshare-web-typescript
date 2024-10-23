import { useLazyQuery } from "@apollo/client";
import {
  QUERY_TOP_VOTE,
  QUERY_VOTE_FILES,
  QUERY_VOTE_RESULT,
} from "api/graphql/vote.graphql";
import React from "react";

const useFetchVoteResult = ({ id, filter }: { id: string; filter: any }) => {
  const [fetchVoteResult, { data, loading, refetch }] =
    useLazyQuery(QUERY_VOTE_RESULT);
  const { pageLimit, currentPageNumber } = filter;
  const skip = (currentPageNumber - 1) * pageLimit;

  const fetchVariables = {
    orderBy: "createdAt_DESC",
    limit: pageLimit,
    page: currentPageNumber,
    skip,
    where: { id },
  };

  const fetchVotesResult = () => {
    fetchVoteResult({
      variables: fetchVariables,
    });
  };
  React.useEffect(() => {
    fetchVotesResult();
  }, [pageLimit, currentPageNumber, id]);

  return {
    total: data?.getVoteResults.total,
    data: data?.getVoteResults?.data,
    loading,
    status: data?.getVoteResults?.code,
    fetchVotesResult,
    refetch,
  };
};

const useFetchVoteFiles = ({ id, filter }: { id: string; filter: any }) => {
  const [fetchVoteFiles, { data, loading, refetch }] =
    useLazyQuery(QUERY_VOTE_FILES);
  const { pageLimit, page, startDate, endDate, select } = filter.data;

  const fetchVariables = {
    orderBy: filter.data.select,
    limit: pageLimit,
    skip: page,
    where: {
      id,
      ...(startDate && endDate && { createdAtBetween: [startDate, endDate] }),
    },
  };

  const fetchVotesFiles = () => {
    fetchVoteFiles({
      variables: fetchVariables,
    });
  };
  React.useEffect(() => {
    refetch();
    fetchVotesFiles();
  }, [pageLimit, id, select, filter.data]);

  return {
    data: data?.getVoteWithFiles?.data,
    loading,
    status: data?.getVoteWithFiles?.code,
    fetchVotesFiles,
    refetch,
  };
};

const useFetchTopVote = ({ id, filter }: { id: string; filter: any }) => {
  const [fetchTopVote, { data, loading, refetch }] =
    useLazyQuery(QUERY_TOP_VOTE);
  const { offset } = filter;

  const fetchVariables = {
    limit: parseInt(offset),
    where: {
      id,
    },
  };

  const fetchTopVotes = () => {
    fetchTopVote({
      variables: fetchVariables,
    });
  };
  React.useEffect(() => {
    refetch();
    fetchTopVotes();
  }, [filter]);

  return {
    data: data?.getTopHotVotes?.data,
    loading,
    status: data?.getTopHotVotes?.code,
    fetchTopVotes,
    refetch,
  };
};

export { useFetchTopVote, useFetchVoteFiles, useFetchVoteResult };
