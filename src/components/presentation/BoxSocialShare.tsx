import { Fragment } from "react";
import { Box, Button, Typography } from "@mui/material";
import { FileBoxSocial } from "app/pages/file-uploader/styles/fileUploader.style";

// Icons
import facebookIcon from "assets/images/facebook-icon.png";
import messagerIcon from "assets/images/messager-icon.png";
import whatsappIcon from "assets/images/what-app-icon.png";
import twitterIcon from "assets/images/twitter-icon.png";
import dottIcon from "assets/images/dott-icon.png";
import QRCode from "react-qr-code";
import {
  BoxAdsAction,
  BoxAdsContainer,
} from "styles/presentation/presentation.style";

type Props = {
  _description?: string;
  countAction: number;
  isFile?: boolean;

  handleDownloadAsZip?: () => void;
  handleDownloadFolderAsZip?: () => void;
};

function BoxSocialShare(props: Props) {
  const currentUrl = window.location.href;

  const arrayMedias = [
    {
      id: 1,
      title: "Facebook",
      link: "",
      icon: (
        <img
          src={facebookIcon}
          alt="facebook-icon"
          style={{
            width: "32px",
            objectFit: "cover",
            height: "32px",
          }}
        />
      ),
    },
    {
      id: 2,
      title: "Messager",
      link: "",
      icon: (
        <img
          src={messagerIcon}
          alt="messager-icon"
          style={{
            width: "32px",
            objectFit: "cover",
            height: "32px",
          }}
        />
      ),
    },
    {
      id: 3,
      title: "WhatsApp",
      link: "",
      icon: (
        <img
          src={whatsappIcon}
          alt="whatsapp-icon"
          style={{
            width: "32px",
            objectFit: "cover",
            height: "32px",
          }}
        />
      ),
    },
    {
      id: 4,
      title: "Twitter",
      link: "",
      icon: (
        <img
          src={twitterIcon}
          alt="twitter-icon"
          style={{
            width: "32px",
            objectFit: "cover",
            height: "32px",
          }}
        />
      ),
    },
    {
      id: 99,
      title: "...",
      link: "",
      icon: (
        <img
          src={dottIcon}
          alt="dott-icon"
          style={{
            objectFit: "cover",
          }}
        />
      ),
    },
  ];

  return (
    <Fragment>
      <FileBoxSocial className="box-social">
        <Box sx={{ padding: "1.5rem" }}>
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
            {arrayMedias.map((item, index) => (
              <Button
                key={index}
                sx={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "100%",
                  background: "rgb(221, 221, 221,0.8)",
                  fontSize: "2rem",
                }}
              >
                {item.icon}
              </Button>
            ))}
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
    </Fragment>
  );
}

export default BoxSocialShare;
