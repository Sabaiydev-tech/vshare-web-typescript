import { gql } from "@apollo/client";

export const CREATE_FILE_PUBLIC = gql`
  mutation CreateFilesPublic($data: FilesInput!) {
    createFilesPublic(data: $data) {
      _id
      urlAll
      newFilename
    }
  }
`;

export const UPDATE_FILE_PUBLIC = gql`
  mutation UpdateFilesPublic($data: FilesInput!, $where: FilesWhereInputOne!) {
    updateFilesPublic(data: $data, where: $where) {
      _id
    }
  }
`;

export const QUERY_FILE = gql`
  query GetFile($where: FilesWhereInput, $noLimit: Boolean) {
    files(where: $where, noLimit: $noLimit) {
      data {
        _id
        filename
        newFilename
        filePassword
        fileType
        size
        status
        isPublic
        checkFile
        path
        newPath
        urlAll
        url
        dropUrl
        actionStatus
        actionDate
        createdBy {
          _id
          newName
          lastName
        }
        getLinkBy
        shortUrl
        longUrl
      }
      total
    }
  }
`;

export const QUERY_FILE_PUBLIC = gql`
  query FilesPublic(
    $where: FilesWhereInput
    $orderBy: OrderByInput
    $skip: Int
    $limit: Int
    $noLimit: Boolean
  ) {
    filesPublic(
      where: $where
      orderBy: $orderBy
      skip: $skip
      limit: $limit
      noLimit: $noLimit
    ) {
      total
      data {
        _id
        filename
        newFilename
        filePassword
        passwordUrlAll
        fileType
        size
        newPath
        totalDownload
        status
        isPublic
        checkFile
        path
        detail
        urlAll
        url
        permissionSharePublic
        aproveDownloadPublic
        ip
        folder_id {
          _id
          path
          folder_name
        }
        createdBy {
          _id
          newName
        }
        shortUrl
        longUrl
        favorite
        actionStatus
        expired
        createdAt
        updatedAt
        actionDate
      }
    }
  }
`;

export const QUERY_FILE_PUBLICV2 = gql`
  query FilePublic($id: [ID!]!) {
    filePublic(ID: $id) {
      total
      data {
        _id
        filename
        newFilename
        filePassword
        passwordUrlAll
        fileType
        size
        newPath
        totalDownload
        status
        isPublic
        checkFile
        path
        detail
        urlAll
        url
        permissionSharePublic
        aproveDownloadPublic
        ip
        folder_id {
          _id
          path
          folder_name
        }
        createdBy {
          _id
          newName
        }
        shortUrl
        longUrl
        favorite
        actionStatus
        expired
        createdAt
        updatedAt
        actionDate
      }
    }
  }
`;

export const QUERY_FILE_GET_LINK = gql`
  query QueryFileGetLinks($where: FilesWhereInput) {
    queryFileGetLinks(where: $where) {
      data {
        _id
        filename
        filePassword
        newFilename
        checkFile
        expired
        size
        status
        path
        newPath
        shortUrl
        longUrl
        url
        urlAll
        createdBy {
          _id
          newName
        }
      }
      total
    }
  }
`;
