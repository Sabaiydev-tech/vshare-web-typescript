import { Box, IconButton, createTheme } from "@mui/material";
import { Fragment } from "react";
import { CiBoxList } from "react-icons/ci";
import {
  BoxAdsAction,
  BoxAdsContainer,
} from "styles/presentation/presentation.style";
import BaseNormalButton from "components/BaseNormalButton";
import { FaDownload } from "react-icons/fa6";
import { FaTimes } from "react-icons/fa";

const theme = createTheme();

type Props = {
  dataFiles: any[];
  adAlive: number;

  handleClearSelector?: () => void;
  handleToggle?: () => void;
  handleDownloadGridFileAndFolder?: () => void;
};

function BaseGridDownload(props: Props) {
  return (
    <Fragment>
      <IconButton onClick={props?.handleToggle}>
        <CiBoxList />
      </IconButton>

      <Box
        sx={{
          display: "flex",
          gap: "1rem",
          // position: "relative",
          justifyContent: "flex-end",
          [theme.breakpoints.down(960)]: {
            display: "none",
          },
        }}
      >
        <Box sx={{ position: "relative" }}>
          {props?.dataFiles?.length > 0 && (
            <Fragment>
              {props?.adAlive > 0 && (
                <BoxAdsContainer>
                  <BoxAdsAction sx={{ padding: "2px 10px", fontSize: "10px" }}>
                    {props?.adAlive}
                  </BoxAdsAction>
                </BoxAdsContainer>
              )}
            </Fragment>
          )}

          <BaseNormalButton
            title="Download"
            disabled={props?.dataFiles?.length > 0 ? false : true}
            handleClick={props?.handleDownloadGridFileAndFolder}
            style={{
              color:
                props?.dataFiles?.length > 0 ? "#fff" : "#828282 !important",
              fontWeight: "bold",
              backgroundColor:
                props?.dataFiles?.length > 0 ? "#17766B" : "#fff",
              border: "1px solid",
              borderColor: props?.dataFiles?.length > 0 ? "#17766B" : "#ddd",
            }}
          >
            <FaDownload fontSize={12} style={{ marginRight: "8px" }} />
          </BaseNormalButton>
        </Box>

        <BaseNormalButton
          title=""
          style={{
            padding: "9px 8px",
            color: props?.dataFiles?.length > 0 ? "#fff" : "#828282 !important",
            fontWeight: "bold",
            backgroundColor: props?.dataFiles?.length > 0 ? "#17766B" : "#fff",
            border: "1px solid",
            borderColor: props?.dataFiles?.length > 0 ? "#17766B" : "#ddd",
          }}
          disabled={props?.dataFiles?.length > 0 ? false : true}
          handleClick={props?.handleClearSelector}
        >
          <FaTimes fontSize={14} />
        </BaseNormalButton>
      </Box>
    </Fragment>
  );
}

export default BaseGridDownload;
