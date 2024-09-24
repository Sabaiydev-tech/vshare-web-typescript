import { gql } from "@apollo/client";

export const RANDOM_FEED_VIDEO = gql`query RandomVideos($limit: Int!, $deviceId: String, $option: OptionType!) {
    randomVideos(limit: $limit, deviceId: $deviceId, option: $option) {
      success
      total
      error {
        message
        code
        details
      }
      data {
        id
        isActive
        chanelId
        chanel {
          id
          prefix
          profile
          name
          option {
            total_post
            total_view_fromPost
            total_like_fromPost
            total_download_fromPost
            total_dislike_fromPost
            total_share_fromPost
            total_follower
            total_following
          }
          createdAt
          userId
        }
      }
    }
  }`;