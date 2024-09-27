import { gql } from "@apollo/client";

export const QUERY_SETTING = gql`
  query getGeneralSetting(
    $where: General_settingsWhereInput
    $noLimit: Boolean
  ) {
    general_settings(where: $where, noLimit: $noLimit) {
      data {
        _id
        title
        action
        groupName
        status
        productKey
        categoryKey
      }
    }
  }
`;

export const QUERY_LANDING_SETTING = gql`
  query Data($where: General_settingsWhereInput) {
    general_settings(where: $where) {
      total
      data {
        _id
        groupName
        categoryKey
        productKey
        title
        action
        status
        createdAt
        updatedAt
      }
    }
  }
`;
