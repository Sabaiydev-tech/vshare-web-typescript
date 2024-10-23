import { Box, Button } from "@mui/material";
import { FilBoxBottomContainer } from "app/pages/file-uploader/styles/fileUploader.style";
import {
  BoxAdsAction,
  BoxAdsContainer,
} from "styles/presentation/presentation.style";

type Props = {
  adAlive?: number;
  platform?: string;
  selectionData: boolean;

  onClickOpenApplication?: () => void;
  onClickDownloadData?: () => void;
};
function BaseDeeplinkDownload(props: Props) {
  return (
    <FilBoxBottomContainer>
      <Box sx={{ position: "relative", width: "100%" }}>
        {props.adAlive! > 0 && (
          <BoxAdsContainer>
            <BoxAdsAction>
              {props?.adAlive}
            </BoxAdsAction>
          </BoxAdsContainer>
        )}
        <Button
          fullWidth={true}
          variant="contained"
          disabled={props?.selectionData ? false : true}
          onClick={props.onClickDownloadData}
        >
          Download
        </Button>
      </Box>
      {(props?.platform === "android" || props?.platform === "ios") && (
        <Button
          onClick={props?.onClickOpenApplication}
          fullWidth={true}
          variant="contained"
        >
          Open app
        </Button>
      )}
    </FilBoxBottomContainer>
  );
}

export default BaseDeeplinkDownload;
