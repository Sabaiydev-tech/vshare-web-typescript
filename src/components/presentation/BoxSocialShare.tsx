import { useState } from "react";
import { Box, Button, Tooltip, Typography } from "@mui/material";
import {
  FileBoxPopup,
  FileBoxSocial,
} from "app/pages/file-uploader/styles/fileUploader.style";

// Icons
import {
  FacebookIcon,
  FacebookShareButton,
  FacebookMessengerIcon,
  FacebookMessengerShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
import dottIcon from "assets/images/dott-icon.png";
import QRCode from "react-qr-code";
import {
  BoxAdsAction,
  BoxAdsContainer,
} from "styles/presentation/presentation.style";
import { ShareSocial } from "components/social-media";
import { ENV_KEYS } from "constants/env.constant";

type Props = {
  _description?: string;
  countAction: number;
  isFile?: boolean;
  longUrl?: string;
  isHide?: boolean;

  handleDownloadAsZip?: () => void;
  handleDownloadFolderAsZip?: () => void;
};

function BoxSocialShare(props: Props) {
  const currentUrl = window.location.href;
  const [isMore, setIsMore] = useState(false);

  return (
    <FileBoxPopup>
      <FileBoxSocial className="box-social">
        <Box sx={{ padding: "1.5rem" }}>
          {!props?.isHide && (
            <Box
              className="button-ads"
              sx={{ display: "flex", position: "relative" }}
            >
              {props?.countAction > 0 && (
                <BoxAdsContainer>
                  <BoxAdsAction>{props?.countAction} close ads</BoxAdsAction>
                </BoxAdsContainer>
              )}
              <Button
                variant="contained"
                sx={{
                  width: { xs: "100%", md: "80%" },
                  mx: "auto !important",
                }}
                onClick={() => {
                  props.handleDownloadFolderAsZip?.();
                }}
              >
                Download
              </Button>
            </Box>
          )}
          <Box sx={{ textAlign: "start", padding: "1rem 0" }}>
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
                justifyContent: "space-between",
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
                    width: "60px",
                    height: "60px",
                    borderRadius: "100%",
                    background: "rgb(221, 221, 221,0.8)",
                    fontSize: "2rem",
                  }}
                >
                  <FacebookIcon size={40} round />
                </FacebookShareButton>
              </Tooltip>
              <Tooltip title="Messenger" placement="top">
                <FacebookMessengerShareButton
                  url={currentUrl || ""}
                  appId={ENV_KEYS.VITE_APP_FACEBOOk_APP_ID}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "60px",
                    height: "60px",
                    borderRadius: "100%",
                    background: "rgb(221, 221, 221,0.8)",
                    fontSize: "2rem",
                  }}
                >
                  <FacebookMessengerIcon size={40} round />
                </FacebookMessengerShareButton>
              </Tooltip>
              <Tooltip title={"WhatsApp"}>
                <WhatsappShareButton
                  url={currentUrl || ""}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "60px",
                    height: "60px",
                    borderRadius: "100%",
                    background: "rgb(221, 221, 221,0.8)",
                    fontSize: "2rem",
                  }}
                >
                  <WhatsappIcon size={40} round />
                </WhatsappShareButton>
              </Tooltip>
              <Tooltip title={"Twitter"}>
                <TwitterShareButton
                  url={currentUrl || ""}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "60px",
                    height: "60px",
                    borderRadius: "100%",
                    background: "rgb(221, 221, 221,0.8)",
                    fontSize: "2rem",
                  }}
                >
                  <TwitterIcon size={40} round />
                </TwitterShareButton>
              </Tooltip>
              <Box sx={{ position: "relative" }}>
                <Button
                  sx={{
                    position: "relative",
                    width: "60px",
                    height: "60px",
                    borderRadius: "100%",
                    background: "rgb(221, 221, 221,0.8)",
                    fontSize: "2rem",
                  }}
                  onClick={() => {
                    setIsMore(!isMore);
                  }}
                >
                  <img
                    src={dottIcon}
                    alt="dott-icon"
                    style={{
                      objectFit: "cover",
                    }}
                  />
                </Button>
                {isMore && (
                  <Typography
                    component={"div"}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMore(!isMore);
                    }}
                  >
                    <ShareSocial
                      title="More Media"
                      socialTypes={[
                        "copy",
                        "facebook",
                        "twitter",
                        "line",
                        "linkedin",
                        "whatsapp",
                        "viber",
                        "telegram",
                        "reddit",
                        "instapaper",
                        "livejournal",
                        "mailru",
                        "ok",
                        "hatena",
                        "email",
                        "workspace",
                      ]}
                      url={currentUrl || ""}
                    />
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
        <Box
          className="appbar appbar-bg-gradient-r"
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            width: "100%",
            paddingTop: "1.2rem",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              color: "#fff",
              padding: ".8rem",
              textAlign: { xs: "center", md: "start" },
              ml: ".4rem",
            }}
          >
            <Typography variant={"h4"} sx={{ m: 0, p: 0 }}>
              View on mobile phone
            </Typography>
            <Typography variant={"h6"} sx={{ my: 4, fontWeight: 400 }}>
              Scan to view on your mobile
              <br />
              phone for faster download
            </Typography>
            <Typography variant={"h6"} sx={{ fontWeight: 400 }}>
              Android users cn scan with
              <br />a browser, and iOS users can
              <br /> scan with camera
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
              size={150}
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
