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
  query GetOneTimeLinkDetails($where: OneTimeLinkDetailsWhereInput, $orderBy: OrderBy, $skip: Int, $limit: Int) {
  getOneTimeLinkDetails(where: $where, orderBy: $orderBy, skip: $skip, limit: $limit) {
    code
    message
    total
    data {
      _id
      fileId
      folderId
      type
      folderData {
        _id
        folder_type
        file_id {
          _id
          filename
          newFilename
          fileType
          size
          totalFile
          totalDownload
          totalDownloadFaild
          totalFolder
          status
          isPublic
          expired
          shortUrl
          longUrl
          createdAt
          path
          newPath
          createdBy {
            _id
            newName
          }
        }
        parentkey {
          _id
          folder_name
          newFolder_name
          is_public
          status
        }
        folder_name
        newFolder_name
        total_size
        is_public
        checkFolder
        show_download_link
        expired
        totalItems
        pin
        shortUrl
        longUrl
        createdBy {
          _id
          firstName
          lastName
          gender
          phone
          email
          newName
        }
        createdAt
        path
        newPath
      }
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
      type
      folderData {
        _id
        folder_type
        file_id {
          _id
          filename
          newFilename
          fileType
          size
          totalFile
          totalDownload
          totalDownloadFaild
          totalFolder
          status
          isPublic
          expired
          shortUrl
          longUrl
          createdAt
          path
          newPath
          createdBy {
            _id
            newName
          }
        }
        parentkey {
          _id
          folder_name
          newFolder_name
          is_public
          status
        }
        folder_name
        newFolder_name
        total_size
        is_public
        checkFolder
        show_download_link
        expired
        totalItems
        pin
        shortUrl
        longUrl
        createdBy {
          _id
          firstName
          lastName
          gender
          phone
          email
          newName
        }
        createdAt
        path
        newPath
      }
    }
    }
  }
`;
