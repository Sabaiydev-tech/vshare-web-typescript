import { gql } from "@apollo/client";

export const QUERY_SEO = gql`
  query Data($where: SEOWhereInput) {
    getPublicSEO(where: $where) {
      data {
        _id
        title
        description
        keywords
        indexing
        url
        pageId {
          _id
        }
      }
    }
  }
`;

export const CREATE_DETAIL_ADVERTISEMENT = gql`
  mutation CreateDetailadvertisements($data: DetailadvertisementsInput!) {
    createDetailadvertisements(data: $data) {
      _id
    }
  }
`;

export const QUERY_ADVERTISEMENT = gql`
  query Data($where: AdvertisementWhereInput) {
    getAdvertisement(where: $where) {
      data {
        _id
        url
        amountClick
      }
    }
  }
`;

export const QUERY_GENERAL_BUTTON_DOWNLOAD = gql`
  query Data($where: General_settingsWhereInput) {
    general_settings(where: $where) {
      data {
        action
      }
    }
  }
`;

export const QUERY_MANAGE_LINK_DETAIL = gql`
  query GetManageLinkDetails(
    $where: ManageLinkWhereInput
    $limit: Int
    $skip: Int
  ) {
    getManageLinkDetails(where: $where, limit: $limit, skip: $skip) {
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
          longUrl
          url
          createdBy {
            _id
            newName
          }
        }
        type
      }
      total
    }
  }
`;
