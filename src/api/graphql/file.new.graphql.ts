import { gql } from "@apollo/client";

export const CHECK_GET_LINK = gql`
  query GetManageLinks($where: ManageLinkWhereInput) {
    getManageLinks(where: $where) {
      code
      message
      data {
        _id
        shortLink
        status
        createdAt
        password
        type
        expiredAt
      }
    }
  }
`;


export const GET_ONE_TIME_LINK_DETAIL = gql`
  query GetOneTimeLinkDetails(
    $where: OneTimeLinkDetailsWhereInput
    $orderBy: OrderBy
    $skip: Int
    $limit: Int
  ) {
    getOneTimeLinkDetails(
      where: $where
      orderBy: $orderBy
      skip: $skip
      limit: $limit
    ) {
      code
      message
      total
      data {
        _id
        fileId
        folderId
        fileData {
          _id
          filename
          newFilename
          filePassword
          fileType
          size
          status
          isPublic
          longUrl
          shortUrl
          newPath
          expired
          path
          fileType
          url
          createdBy {
            _id
            newName
          }
        }
        folderData {
          _id
          folder_type
          folder_name
          newPath
          newFolder_name
          path
          expired
          total_size
          access_password
          status
          shortUrl
          longUrl
          url
          createdBy {
            _id
            newName
          }
        }
        type
      }
    }
  }
`;

export const GET_MANAGE_LINK_DETAIL = gql`
  query GetManageLinkDetails(
    $where: ManageLinkWhereInput
    $orderBy: OrderBy
    $skip: Int
    $limit: Int
  ) {
    getManageLinkDetails(
      where: $where
      orderBy: $orderBy
      skip: $skip
      limit: $limit
    ) {
      message
      code
      total
      data {
        _id
        fileId
        folderId
        fileData {
          _id
          filename
          newFilename
          filePassword
          fileType
          size
          status
          isPublic
          longUrl
          shortUrl
          newPath
          expired
          path
          fileType
          url
          createdBy {
            _id
            newName
          }
        }
        folderData {
          _id
          folder_type
          folder_name
          newPath
          newFolder_name
          path
          total_size
          access_password
          status
          shortUrl
          expired
          longUrl
          url
          createdBy {
            _id
            newName
          }
        }
        type
      }
    }
  }
`;
