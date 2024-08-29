import { gql } from "@apollo/client";

export const CREATE_FILEDROP_LINK = gql`
  mutation CreatePublicFileDropUrl($input: PublicFileDropUrlInput) {
    createPublicFileDropUrl(input: $input) {
      _id
    }
  }
`;

export const UPDATE_FILE_DROP_STATUS = gql`
  mutation UpdateFilesPublic($data: FilesInput!, $where: FilesWhereInputOne!) {
    updateFilesPublic(data: $data, where: $where) {
      _id
    }
  }
`;

export const QUERY_FILE_DROP_PUBLIC = gql`
  query GetFileDrop($where: FilesWhereInput) {
    getFileDrop(where: $where) {
      total
      data {
        _id
        filename
        newFilename
        size
        status
        checkFile
        newPath
        url
        urlAll
        ip
        dropUrl
        longUrl
        dropStatus
        updatedAt
        createdBy {
          _id
          newName
        }
      }
    }
  }
`;

export const QUERY_FILE_DROP_PUBLIC_URL = gql`
  query GetPublicFileDropUrl($where: PublicFileDropUrlWhereInput) {
    getPublicFileDropUrl(where: $where) {
      total
      data {
        _id
        status
        createdBy {
          _id
          newName
        }
        folderId {
          _id
          newFolder_name
          path
          newPath
        }
        title
        description
        expiredAt
        allowDownload
        allowMultiples
        allowUpload
      }
    }
  }
`;

export const CREATE_FILE_DROP_PUBLIC = gql`
  mutation CreatePublicFileDrop($data: CreatePublicFileDropInput!) {
    createPublicFileDrop(data: $data) {
      _id
      urlAll
      newFilename
    }
  }
`;
