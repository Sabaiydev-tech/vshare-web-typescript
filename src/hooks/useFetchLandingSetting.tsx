import { useLazyQuery } from "@apollo/client";
import { QUERY_LANDING_SETTING } from "api/graphql/setting.graphql";
import { useEffect } from "react";

const useFetchLandingSetting = () => {
  const [getSetting, { data: get_setting }] = useLazyQuery(
    QUERY_LANDING_SETTING,
    {
      fetchPolicy: "no-cache",
    },
  );

  const customFetchSetting = async () => {
    try {
      await getSetting({
        variables: {
          where: { groupName: "file_seeting_landing_page" },
        },
      });
    } catch (error) {
      console.error("Error on Setting", error);
    }
  };

  useEffect(() => {
    customFetchSetting();
  }, []);

  return {
    data: get_setting?.general_settings?.data || [],
  };
};

export { useFetchLandingSetting };
