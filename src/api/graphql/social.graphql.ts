import { gql } from "@apollo/client";

export const MUTATION_GOOGLE_AUTH = gql`
  mutation LoginWithGoogle($dataInput: tokenInput!, $loginFrom: LoginFrom) {
    loginWithGoogle(dataInput: $dataInput, loginFrom: $loginFrom) {
      data {
        _id
        accountId
        provider
        packageId {
          _id
          packageId
          name
          category
          annualPrice
          monthlyPrice
          discount
          description
          storage
          ads
          captcha
          multipleUpload
          numberOfFileUpload
          uploadPerDay
          fileUploadPerDay
          maxUploadSize
          multipleDownload
          downLoadOption
          support
          sort
          totalUsed
          textColor
          bgColor
          status
          createdAt
          updatedAt
        }
        firstName
        lastName
        gender
        phone
        email
        username
        newName
        address
        state
        zipCode
        country
        device
        browser
        status
        profile
        currentDevice
        newDevice
        twoFactorSecret
        twoFactorQrCode
        twoFactorIsEnabled
        twoFactorIsVerified
        createdAt
        updatedAt
        lastLoggedInAt
        codeAnonymous
        anonymousExpired
        storage
      }
      token
    }
  }
`;

export const MUTATION_FACEBOOK_OAUTH = gql`
  mutation LoginWithFacebook(
    $dataInput: dataUserFacebook!
    $loginFrom: LoginFrom
  ) {
    loginWithFacebook(dataInput: $dataInput, loginFrom: $loginFrom) {
      data {
        _id
        accountId
        provider
        packageId {
          _id
          packageId
          name
          category
          annualPrice
          monthlyPrice
          discount
          description
          storage
          ads
          captcha
          multipleUpload
          numberOfFileUpload
          uploadPerDay
          fileUploadPerDay
          maxUploadSize
          multipleDownload
          downLoadOption
          support
          sort
          totalUsed
          textColor
          bgColor
          status
          createdAt
          updatedAt
        }
        firstName
        lastName
        gender
        phone
        email
        username
        newName
        address
        state
        zipCode
        country
        device
        browser
        status
        profile
        currentDevice
        newDevice
        twoFactorSecret
        twoFactorQrCode
        twoFactorIsEnabled
        twoFactorIsVerified
        createdAt
        updatedAt
        lastLoggedInAt
        codeAnonymous
        anonymousExpired
        storage
      }
      token
    }
  }
`;

export const MUTATION_SOCIAL_AUTH = gql`
  mutation SocialAuth($where: UserInput!) {
    socialAuth(where: $where) {
      data {
        _id
        firstName
        lastName
        gender
        phone
        email
        username
        newName
        address
        state
        zipCode
        country
        device
        browser
        status
        profile
        otpEnabled
        otpVerified
        zipCode
        createdAt
        updatedAt
        userTypeId {
          _id
          name
        }
        roleId {
          _id
          name
        }
      }
      token
    }
  }
`;

export const LANDING_PAGE_PAYMENT_SIGNUP = gql`
  mutation Register($email: String!) {
    register(email: $email) {
      token
    }
  }
`;
