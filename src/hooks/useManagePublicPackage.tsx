import { useLazyQuery } from "@apollo/client";
import { QUERY_PUBLIC_PACKAGES } from "api/graphql/package.graphql";
import React, { useCallback, useEffect, useMemo } from "react";

const useManagePublicPackages = ({ filter = {} }: any) => {
  const [listPackage, { data: packageData }] = useLazyQuery(
    QUERY_PUBLIC_PACKAGES,
    {
      fetchPolicy: "no-cache",
    },
  );
  const [selectedRow, setSelectedRow] = React.useState([]);
  const customQueryPackage = useCallback(() => {
    listPackage({
      variables: {
        where: {
          excluded: true,
        },
      },
    });
  }, [listPackage]);

  useEffect(() => {
    customQueryPackage();
  }, [filter, customQueryPackage]);

  const data = useMemo(() => {
    return {
      selectedRow,
      setSelectedRow,
      customQueryPackage,
      data: packageData?.getPublicPackages?.data?.map((data, index) => ({
        ...data,
        no: index + 1,
      })),
      filteredData: packageData?.getPublicPackages?.data?.map(
        (data, index) => ({
          ...data,
          no: index + 1,
        }),
      ),
      filteredAnnualData: packageData?.getPublicPackages?.data?.map(
        (data, index) => ({
          ...data,
          no: index + 1,
          _type: "annual",
          _price: data.annualPrice,
        }),
      ),
      annualData: packageData?.getPublicPackages?.data?.map((data, index) => ({
        ...data,
        no: index + 1,
        _type: "annual",
        _price: data.annualPrice,
      })),
      filteredMonthlyData: packageData?.getPublicPackages?.data?.map(
        (data, index) => ({
          ...data,
          no: index + 1,
          _type: "monthly",
          _price: data.monthlyPrice,
        }),
      ),
      monthlyData: packageData?.getPublicPackages?.data?.map((data, index) => ({
        ...data,
        no: index + 1,
        _type: "monthly",
        _price: data.monthlyPrice,
      })),
      total: packageData?.getPublicPackages?.total,
    };
  }, [packageData, selectedRow, customQueryPackage, filter]);

  return data;
};


export default useManagePublicPackages;
