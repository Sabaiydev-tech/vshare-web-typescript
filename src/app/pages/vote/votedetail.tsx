import { useMutation } from "@apollo/client";
import {
  Box,
  Button,
  Card,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  createTheme
} from "@mui/material";
import { MUTION_VOTE_FILE } from "api/graphql/vote.graphql";
import { VoteEnum } from "components/vote/voteOption";
import { ENV_KEYS } from "constants/env.constant";
import { useFetchVoteFiles } from "hooks/vote/useFetchVote";
import useFilter from "hooks/vote/useFilter";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { BsFillShareFill } from "react-icons/bs";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import { IoHelpCircleSharp } from "react-icons/io5";
import { ITopVoteType, IVoteResultType, IVoteWithFile } from "types/voteType";
import { errorMessage, successMessage } from "utils/alert.util";
import { decryptDataLink } from "utils/secure.util";
import CardVote from "./cardVote";
import DialogShare from "components/dialog/DialogShare.SocialMedia";
import StickyShareButton from "./sticky.share.button";

interface IPropsType {
  topVote: {
    topVotes: ITopVoteType[];
    hotVotes: ITopVoteType[];
  };
  shareLink?: string;
}
export default function VoteDetails({ topVote, shareLink }: IPropsType) {
  const theme = createTheme();
  const [isOpenShare, setIsOpenShare] = useState(false);
  const filter = useFilter();
  const params = new URLSearchParams(location.search);
  const voteParams = params.get("lc");
  const decryptedData = decryptDataLink(voteParams);
  const isToken = localStorage.getItem("alBBtydfsTtW@wdVV");
  const [voted] = useMutation(MUTION_VOTE_FILE);
  const { data: voteFiles, refetch } = useFetchVoteFiles({
    id: decryptedData?._id,
    filter: filter,
  });
  const [newVoteData, setNewVoteData] = useState(voteFiles);
  const [eventVote, setEventVote] = useState<string[]>([]);

  const gridRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  let maxExtract = 0;
  let minLength = 0;
  let maxLength = 0;
  if (newVoteData?.voteData?.voteOption?.name === VoteEnum.EXTRACT_NUMBER) {
    maxExtract = newVoteData?.voteData?.voteOption.value[0];
  } else if (newVoteData?.voteData?.voteOption?.name === VoteEnum.RANGE) {
    minLength = newVoteData?.voteData?.voteOption.value[0];
    maxLength = newVoteData?.voteData?.voteOption.value[1];
  }

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        if (
          newVoteData?.filesData?.total > newVoteData?.filesData?.data?.length
        )
          filter.dispatch({
            type: filter.ACTION_TYPE.PAGE,
            payload: filter?.data?.page + 1,
          });
      }
    },
    [refetch],
  );

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(handleIntersection);

    if (gridRef.current) {
      const gridElement = gridRef.current;
      const lastChild = gridElement.lastElementChild;

      if (lastChild instanceof Element) {
        observerRef.current.observe(lastChild);
      }
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [newVoteData, handleIntersection]);


  useEffect(() => {
    setNewVoteData(voteFiles);
  }, [voteFiles]);

  const handleSelecte = (data: IVoteWithFile) => {
    setNewVoteData((prev: IVoteResultType) => {
      const selectedFilesCount = prev.filesData.data.filter(
        (file) => file.isSelected,
      ).length;

      const isCurrentlySelected = prev.filesData.data.some(
        (file) => file._id === data._id && file?.isSelected,
      );
      if (isCurrentlySelected) {
        return {
          ...prev,
          filesData: {
            ...prev.filesData,
            data: prev.filesData.data.map((file) => {
              if (file._id === data._id) {
                return { ...file, isSelected: false };
              }
              return file;
            }),
          },
        };
      }
      if (selectedFilesCount < maxLength) {
        return {
          ...prev,
          filesData: {
            ...prev.filesData,
            data: prev.filesData.data.map((file) => {
              if (file._id === data._id) {
                return { ...file, isSelected: true };
              }
              return file;
            }),
          },
        };
      }
      if (selectedFilesCount < maxExtract) {
        return {
          ...prev,
          filesData: {
            ...prev.filesData,
            data: prev.filesData.data.map((file) => {
              if (file._id === data._id) {
                return { ...file, isSelected: true };
              }
              return file;
            }),
          },
        };
      }
      return prev;
    });
    setEventVote((prev: string[]) => {
      if (!prev.includes(data._id)) {
        return [...prev, data._id];
      } else {
        return prev.filter((id) => id !== data._id);
      }
    });
  };

  const handleVote = async () => {
    if (!isToken || isToken == null) {
      window.location.href = `${ENV_KEYS.VITE_APP_URL_REDIRECT_LANDING_PAGE}auth/sign-in/${voteParams}`;
      return;
    }
    if (!eventVote) {
      return;
    }
    const { data: created } = await voted({
      variables: {
        where: {
          voteId: newVoteData.voteData?._id,
        },
        data: {
          fileIds: eventVote,
        },
      },
    });

    if (created?.voteFiles?.code == 200) {
      successMessage("Vote success", 2000);
    } else if (created?.voteFiles?.code == 403) {
      errorMessage("You have already voted", 2000);
    } else {
      errorMessage("You have already voted", 2000);
    }
  };

  return (
    <React.Fragment>
      <Card sx={{ my: 5, boxShadow: "rgba(149, 157, 165, 0.2) 5px 8px 24px" }}>
        <Box sx={{ m: 4 }}>
          <Box
            sx={{
              my: 5,
              display: { lg: "flex", sm: "block" },
              justifyContent: "space-between",
            }}
          >
            <FormControl sx={{ mt: 3 }}>
              <Select
                sx={{ height: 40, fontSize: "1rem" }}
                value={filter.data.select}
                onChange={(e) =>
                  filter.dispatch({
                    type: filter.ACTION_TYPE.SELECT,
                    payload: e.target.value,
                  })
                }
                MenuProps={{
                  PaperProps: {
                    sx: {
                      boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
                    },
                  },
                }}
              >
                <MenuItem sx={{ fontSize: "1rem" }} value="createdAt_DESC">
                  Latest upload
                </MenuItem>
                <MenuItem sx={{ fontSize: "1rem" }} value="score_DESC">
                  Max vote
                </MenuItem>
                <MenuItem sx={{ fontSize: "1rem" }} value="score_ASC">
                  Min vote
                </MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Box>
                <InputLabel>Start Date</InputLabel>
                <input
                  type="date"
                  style={{
                    marginTop: "4px",
                    height: "40px",
                    width: "150px",
                    fontSize: "1rem",
                    padding: "0 8px",
                    fontFamily: "inherit",
                    borderRadius: "4px",
                    border: `1px solid ${theme.palette.grey[400]}`,
                    transition: "borderColor 0.3s ease",
                  }}
                  value={filter.data.start_date}
                  onChange={(e) =>
                    filter.dispatch({
                      type: filter.ACTION_TYPE.START_DATE,
                      payload: e.target.value,
                    })
                  }
                />
              </Box>
              <Box>
                <InputLabel>End Date</InputLabel>
                <input
                  type="date"
                  style={{
                    marginTop: "4px",
                    height: "40px",
                    width: "150px",
                    fontSize: "1rem",
                    padding: "0 8px",
                    fontFamily: "inherit",
                    borderRadius: "4px",
                    border: `1px solid ${theme.palette.grey[400]}`,
                    transition: "borderColor 0.3s ease",
                  }}
                  value={filter.data.end_date}
                  onChange={(e) =>
                    filter.dispatch({
                      type: filter.ACTION_TYPE.END_DATE,
                      payload: e.target.value,
                    })
                  }
                />
              </Box>
            </Box>
          </Box>
          <Typography
            component="h6"
            sx={{
              mt: 4,
              fontSize: "1rem",
              fontWeight: 600,
              color: theme.palette.grey[700],
            }}
          >
            Make a choise
          </Typography>
          <Typography
            component="h6"
            sx={{
              fontSize: "1rem",
              fontWeight: 400,
              color: theme.palette.grey[600],
            }}
          >
            Total votes:{newVoteData?.filesData?.total}
          </Typography>
          <Box sx={{ my: 3 }}>
            <Grid
              ref={gridRef}
              container
              spacing={2}
              sx={{ overflowX: "auto", height: "500px" }}
            >
              {newVoteData?.filesData?.data &&
                newVoteData?.filesData?.data?.map(
                  (item: IVoteWithFile, index: number) => {
                    return (
                      <Grid
                        key={index}
                        item
                        xs={6}
                        sm={4}
                        md={3}
                        lg={3}
                        onClick={() => handleSelecte(item)}
                      >
                        <CardVote item={item} data={newVoteData} />
                      </Grid>
                    );
                  },
                )}
            </Grid>
          </Box>
        </Box>
        <Box sx={{ mx: 4 }}>
          <Box sx={{ mb: 5, display: "flex", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                type="button"
                variant="contained"
                sx={{ borderRadius: "8px", fontSize: "14px" }}
                endIcon={
                  <HiOutlineArrowNarrowRight
                    size={20}
                    style={{ marginTop: "2px" }}
                  />
                }
                onClick={handleVote}
              >
                Vote
              </Button>
            </Box>
            <Box>
              <Button
                type="button"
                variant={'outlined'}
                sx={{ borderRadius: "8px", fontSize: "14px" }}
                startIcon={<BsFillShareFill size={18} />}
                onClick={()=>setIsOpenShare(!isOpenShare)}
              >
                Share
              </Button>
              {isOpenShare && (
                  <Box
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsOpenShare(!isOpenShare);
                    }}
                  >
                    <DialogShare
                      onClose={() => setIsOpenShare(!isOpenShare)}
                      isOpen={isOpenShare}
                      url={shareLink || window.location.href}
                    />
                  </Box>
                )}
            </Box>
            {/* <StickyShareButton shareLink={shareLink || ""}/> */}
          </Box>
        </Box>
      </Card>
    </React.Fragment>
  );
}
