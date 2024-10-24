import { gql } from "@apollo/client";

export const MUTATION_UPLOAD_VOTE = gql`
  mutation UploadVoteFiles($data: FilesInput, $uploadVoteFilesId: ID!) {
    uploadVoteFiles(data: $data, id: $uploadVoteFilesId) {
      message
      code
      data {
        _id
        filename
        newFilename
        fileType
        size
        path
        newPath
      }
    }
  }
`;

export const QUERY_VOTE_RESULT = gql`
  query GetVoteResults(
    $where: VoteWhereOneInput
    $orderBy: OrderByInput
    $skip: Int
    $limit: Int
    $noLimit: Boolean
  ) {
    getVoteResults(
      where: $where
      orderBy: $orderBy
      skip: $skip
      limit: $limit
      noLimit: $noLimit
    ) {
      message
      code
      data {
        filesData {
          total
          data {
            _id
            filename
            newFilename
            fileType
            size
            totalDownloadFaild
            totalDownload
            newPath
            path
            createdBy {
              _id
              newName
            }
          }
        }
        voteData {
          _id
          topic
          description
          voteOption {
            name
            value
          }
          isVshareUser
          isActive
          voteSecurity
          blockVPN
          reCaptcha
          startVoteAt
          expiredAt
          hideSharebtn
          hideResultbtn
          fileType
          allowMultipleUpload
          voteLink
          uploadLink
          status
          createdAt
          updatedAt
          createdBy {
            _id
            newName
          }
          totalVoteParticipant
          totalVote
        }
      }
    }
  }
`;

export const QUERY_VOTE_FILES = gql`
  query GetVoteWithFiles(
    $where: VoteWhereOneInput
    $skip: Int
    $orderBy: OrderByInput
    $limit: Int
  ) {
    getVoteWithFiles(
      where: $where
      skip: $skip
      orderBy: $orderBy
      limit: $limit
    ) {
      message
      code
      data {
        voteData {
          _id
          topic
          description
          voteOption {
            name
            value
          }
          isVshareUser
          isActive
          voteSecurity
          blockVPN
          reCaptcha
          startVoteAt
          expiredAt
          hideSharebtn
          hideResultbtn
          fileType
          allowMultipleUpload
          voteLink
          uploadLink
          status
          createdAt
          updatedAt
          createdBy {
            _id
            newName
          }
          totalVoteParticipant
          totalVote
        }
        filesData {
          total
          data {
            _id
            filename
            newFilename
            newPath
            createdBy {
              _id
              newName
            }
            size
            fileType
          }
        }
      }
    }
  }
`;

export const MUTION_VOTE_FILE = gql`
  mutation VoteFiles($where: VoteFileWhereInput, $data: VoteFileInput) {
    voteFiles(where: $where, data: $data) {
      message
      code
      data
    }
  }
`;

export const QUERY_TOP_VOTE = gql`
  query GetTopHotVotes($where: VoteWhereOneInput, $limit: Int) {
    getTopHotVotes(where: $where, limit: $limit) {
      message
      code
      data {
        topVotes {
          percent
          score
          isVoted
          _id
          filename
          newFilename
          fileType
          size
          status
        }
        hotVotes {
          score
          isVoted
          _id
          filename
          newFilename
          fileType
          size
          percent
        }
      }
    }
  }
`;
