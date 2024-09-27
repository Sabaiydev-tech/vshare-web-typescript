import { useState } from "react";
import {
  Box,
  Tooltip,
  Typography,
  useMediaQuery,
  createTheme,
} from "@mui/material";
import {
  FileBoxPopup,
  FileBoxSocial,
} from "app/pages/file-uploader/styles/fileUploader.style";

// Icons
import {
  FacebookShareButton,
  FacebookMessengerIcon,
  FacebookMessengerShareButton,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
import QRCode from "react-qr-code";
import {
  BoxAdsAction,
  BoxAdsContainer,
} from "styles/presentation/presentation.style";
import { ENV_KEYS } from "constants/env.constant";
import { BsThreeDots } from "react-icons/bs";
import FacebookIcon from "assets/images/facebook-icon.png";
import TwitterIcon from "assets/images/twitter-icon.png";
import LoadingButton from "@mui/lab/LoadingButton";
import DialogShare from "components/dialog/DialogShare.SocialMedia";

type Props = {
  _description?: string;
  countAction: number;
  isFile?: boolean;
  longUrl?: string;
  isHide?: boolean;
  loading?: boolean;

  handleDownloadAsZip?: () => void;
  handleDownloadFolderAsZip?: () => void;
};

function BoxSocialShare(props: Props) {
  const currentUrl = window.location.href;
  const [isMore, setIsMore] = useState(false);
  const isMobile = useMediaQuery(`(max-width: 768px)`);
  const isTablet = useMediaQuery(`(max-width: 1280px)`);
  const theme = createTheme();

  return (
    <FileBoxPopup
      sx={{
        maxWidth: isTablet ? "1280px" : isMobile ? "100%" : "100%",
        margin: isTablet ? "0 auto" : "inherit",
      }}
    >
      <FileBoxSocial className="box-social">
        <Box sx={{ padding: isMobile ? "1rem" : "1.5rem" }}>
          <Box
            sx={{
              [theme.breakpoints.down(960)]: {
                display: "none",
              },
            }}
          >
            {props?.isHide && (
              <Box
                className="button-ads"
                sx={{ display: "flex", position: "relative" }}
              >
                {props?.countAction > 0 && (
                  <BoxAdsContainer>
                    <BoxAdsAction>{props?.countAction} close ads</BoxAdsAction>
                  </BoxAdsContainer>
                )}
                <LoadingButton
                  variant="contained"
                  sx={{
                    width: { xs: "100%", md: "80%" },
                    mx: "auto !important",
                  }}
                  loading={props?.loading || false}
                  onClick={() => {
                    props.handleDownloadFolderAsZip?.();
                  }}
                >
                  Download
                </LoadingButton>
              </Box>
            )}
          </Box>

          <Box sx={{ textAlign: "start", padding: isMobile ? "0" : "1rem 0" }}>
            <Typography variant="h5" sx={{ color: "rgb(0,0,0,0.9)" }}>
              Social Share
            </Typography>
            <Typography
              lineHeight={1}
              sx={{
                mt: 2,
                fontWeight: 500,
                color: "rgb(0,0,0,0.7)",
              }}
            >
              Share this link via
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 3,
              mt: 7,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-evenly",
                flexWrap: "wrap",
                gap: 3,
                mt: 7,
                width: "100%",
              }}
            >
              <Tooltip title="Facebook" placement="top">
                <FacebookShareButton
                  url={currentUrl || ""}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: isMobile ? "35px" : "50px",
                    height: isMobile ? "35px" : "50px",
                    borderRadius: "100%",
                    background: "rgb(221, 221, 221,0.8)",
                    fontSize: "2rem",
                  }}
                >
                  <img
                    src={FacebookIcon}
                    style={{ width: isMobile ? 20 : 28 }}
                    alt="facebook-icon"
                  />
                </FacebookShareButton>
              </Tooltip>
              <Tooltip title="Messenger" placement="top">
                <FacebookMessengerShareButton
                  url={currentUrl || ""}
                  appId={ENV_KEYS.VITE_APP_FACEBOOK}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: isMobile ? "35px" : "50px",
                    height: isMobile ? "35px" : "50px",
                    borderRadius: "100%",
                    background: "rgb(221, 221, 221,0.8)",
                    fontSize: "2rem",
                  }}
                >
                  <FacebookMessengerIcon size={isMobile ? 20 : 28} round />
                </FacebookMessengerShareButton>
              </Tooltip>
              <Tooltip title={"WhatsApp"}>
                <WhatsappShareButton
                  url={currentUrl || ""}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: isMobile ? "35px" : "50px",
                    height: isMobile ? "35px" : "50px",
                    borderRadius: "100%",
                    background: "rgb(221, 221, 221,0.8)",
                    fontSize: "2rem",
                  }}
                >
                  <WhatsappIcon size={isMobile ? 20 : 30} round />
                </WhatsappShareButton>
              </Tooltip>
              <Tooltip title={"Twitter"}>
                <TwitterShareButton
                  url={currentUrl || ""}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: isMobile ? "35px" : "50px",
                    height: isMobile ? "35px" : "50px",
                    borderRadius: "100%",
                    background: "rgb(221, 221, 221,0.8)",
                    fontSize: "2rem",
                  }}
                >
                  <img
                    src={TwitterIcon}
                    style={{ width: isMobile ? 20 : 30 }}
                    alt="facebook-icon"
                  />
                </TwitterShareButton>
              </Tooltip>
              <Box sx={{ position: "relative" }}>
                <Box
                  sx={{
                    position: "relative",
                    width: isMobile ? "35px" : "50px",
                    height: isMobile ? "35px" : "50px",
                    borderRadius: "30px",
                    background: "rgb(221, 221, 221,0.8)",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setIsMore(!isMore);
                  }}
                >
                  <BsThreeDots
                    style={{
                      padding: "5px",
                      backgroundColor: "#fff",
                      width: isMobile ? "20px" : "30px",
                      height: isMobile ? "20px" : "30px",
                      borderRadius: "50%",
                      color: "#17766B",
                    }}
                  />
                </Box>
                {isMore && (
                  <Box
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMore(!isMore);
                    }}
                  >
                    <DialogShare 
                      onClose={() => setIsMore(!isMore)}
                      isOpen={isMore}
                      url={currentUrl}
                    />
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
        <Box
          className="appbar appbar-bg-gradient-r"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            paddingTop: isMobile ? "0.5rem" : "1.2rem",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              color: "#fff",
              padding: ".8rem",
              ml: ".4rem",
            }}
          >
            <Typography
              variant={"h4"}
              sx={{ m: 0, p: 0, fontSize: isMobile ? 16 : 22 }}
            >
              View on mobile phone
            </Typography>
            <Typography
              variant={"h6"}
              sx={{
                my: isMobile ? 2 : 4,
                fontWeight: 400,
                fontSize: isMobile ? 13 : 15,
              }}
            >
              Scan to view on your mobile {!isMobile && <br />}
              phone for faster download
            </Typography>

            <Typography
              variant={"h6"}
              sx={{ fontWeight: 400, fontSize: isMobile ? 13 : 15 }}
            >
              Android users can scan with
              {!isMobile && <br />} a browser, and iOS users can
              {!isMobile && <br />} scan with camera
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: ".9rem",
            }}
          >
            <QRCode
              style={{
                backgroundColor: "#fff",
                border: "1px solid gray",
                padding: "7px",
                borderRadius: "7px",
              }}
              value={currentUrl}
              size={isMobile ? 120 : 150}
              level="H"
              fgColor="#000000"
              bgColor="#FFFFFF"
            />
          </Box>
        </Box>
      </FileBoxSocial>
    </FileBoxPopup>
  );
}

export default BoxSocialShare;
