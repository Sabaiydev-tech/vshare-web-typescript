import { gql } from "@apollo/client";

export const QUERY_PACKAGES = gql`
  query Data(
    $noLimit: Boolean
    $limit: Int
    $skip: Int
    $orderBy: OrderByInput
    $where: PackageWhereInput
  ) {
    getPackage(
      noLimit: $noLimit
      limit: $limit
      skip: $skip
      orderBy: $orderBy
      where: $where
    ) {
      data {
        _id
        packageId
        name
        category
        annualPrice
        monthlyPrice
        currencyId {
          _id
        }
        discount
        description
        storage
        ads
        captcha
        fileDrop
        multipleUpload
        numberOfFileUpload
        uploadPerDay
        fileUploadPerDay
        maxUploadSize
        multipleDownload
        downLoadOption
        support
        batchDownload
        unlimitedDownload
        customExpiredLink
        downloadFolder
        remoteUpload
        iosApplication
        androidApplication
        sort
        totalUsed
        textColor
        bgColor
        status
        createdAt
        updatedAt
        createdBy {
          firstName
          lastName
        }
      }
      total
    }
  }
`;

export const QUERY_PUBLIC_PACKAGES = gql`
  query GetPublicPackages(
    $where: PackageWhereInput
    $orderBy: OrderByInput
    $skip: Int
    $limit: Int
    $noLimit: Boolean
  ) {
    getPublicPackages(
      where: $where
      orderBy: $orderBy
      skip: $skip
      limit: $limit
      noLimit: $noLimit
    ) {
      data {
        _id
        packageId
        name
        category
        type
        monthlyPrice
        annualPrice
        discount
        description
        storage
        ads
        captcha
        fileDrop
        multipleUpload
        numberOfFileUpload
        uploadPerDay
        fileUploadPerDay
        maxUploadSize
        multipleDownload
        downLoadOption
        support
        batchDownload
        unlimitedDownload
        customExpiredLink
        downloadFolder
        remoteUpload
        iosApplication
        androidApplication
        sort
        totalUsed
        textColor
        bgColor
        lockFile
        lockFolder
        status
        createdAt
        updatedAt
          currencyId {
          _id
          code
        }
        createdBy {
          _id
          firstName
          lastName
          email
        }
        numberOfQueueDownload
        numberOfQueueUpload
      }
      total
    }
  }
`;

export const MUTATION_CREATE_PAYMENT = gql`
  mutation CreatePayment($input: CreatePaymentInput!) {
    createPayment(input: $input) {
      _id
      paymentId
      packageId {
        packageId
      }
      paymentMethod
      amount
      description
      status
      createdAt
      updatedAt
      orderedAt
    }
  }
`;

export const QUERY_PAYMENT = gql`
  query GetPayments(
    $where: PaymentWhereInput
    $orderBy: OrderByInput
    $skip: Int
    $limit: Int
    $noLimit: Boolean
  ) {
    getPayments(
      where: $where
      orderBy: $orderBy
      skip: $skip
      limit: $limit
      noLimit: $noLimit
    ) {
      data {
        _id
        paymentId
        packageId {
          _id
          packageId
          name
          category
          annualPrice
          monthlyPrice
          currencyId {
            _id
          }
          discount
          description
          storage
          ads
          captcha
          fileDrop
          multipleUpload
          numberOfFileUpload
          uploadPerDay
          fileUploadPerDay
          maxUploadSize
          multipleDownload
          downLoadOption
          support
          batchDownload
          unlimitedDownload
          customExpiredLink
          downloadFolder
          remoteUpload
          iosApplication
          androidApplication
          sort
          totalUsed
          textColor
          bgColor
          status
          createdAt
          updatedAt
          createdBy {
            firstName
            lastName
          }
        }
        category
        paymentMethod
        amount
        description
        countPurchase
        status
        createdAt
        updatedAt
        orderedAt
        expiredAt
      }
    }
  }
`;

export const QUERY_COUPON = gql`
  query Data($where: CouponWhereInput) {
    coupons(where: $where) {
      data {
        _id
        verifyCustomerID {
          _id
        }
        code
        amount
        status
        createdAt
        updatedAt
        verifyDate
        typeCouponID {
          _id
          typeCoupon
          startDate
          expird
          actionCoupon
          unit
          status
          createdAt
          updatedAt
        }
      }
    }
  }
`;

export const MUTATION_VERIFY_COUPON = gql`
  mutation VerifyCoupon($input: DiscountInput!) {
    verifyCoupon(input: $input) {
      _id
      typeCouponID {
        _id
        typeCoupon
        startDate
        expird
        actionCoupon
        unit
        statusCoupon
        status
        createdAt
        updatedAt
      }
      verifyCustomerID {
        _id
      }
      code
      amount
      status
      createdAt
      updatedAt
      verifyDate
    }
  }
`;

export const MUTATION_CHECKOUT = gql`
  mutation Checkout($input: CreatePaymentInput!) {
    checkout(input: $input) {
      data {
        updatedAt
        type
        status
        paymentMethod
        paymentId
        payerId {
          _id
        }
        _id
        advertisementId {
          _id
        }
        amount
        category
        countPurchase
        createdAt
        description
        expiredAt
        orderedAt
        packageId {
          _id
        }
      }
      secret
    }
  }
`;

export const QUERY_ONEPAY_SUBSCRIPTION = gql`
  query OnePaySubscription($where: OnePaySubscriptionWhereInput) {
    onePaySubscription(where: $where) {
      endpoint
      params {
        profile_id
        access_key
        locale
        lang
        transaction_type
        transaction_uuid
        reference_number
        device_fingerprint_id
        amount
        currency
        signed_date_time
        bill_to_forename
        bill_to_surname
        bill_to_email
        bill_to_phone
        bill_to_address_city
        bill_to_address_state
        bill_to_address_line1
        bill_to_address_postal_code
        bill_to_address_line2
        bill_to_address_country
        merchant_defined_data1
        merchant_defined_data2
        signed_field_names
        signature
      }
    }
  }
`;
