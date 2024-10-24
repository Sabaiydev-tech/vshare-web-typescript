import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogContent,
  InputAdornment,
  InputLabel,
  TextField,
  Typography,
  createTheme,
  styled,
} from "@mui/material";
import CoppyLink from "assets/images/coppyLinkVote.svg?react";
import imageIcon from "assets/images/logo.png";
import React, { useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { FaFacebookF, FaQrcode, FaWhatsapp } from "react-icons/fa";
import { IoLogoTwitter, IoMdCheckmark } from "react-icons/io";
import { MdEmail } from "react-icons/md";
import { IVoteResultType } from "types/voteType";
import QRCode from "qrcode.react";

const ContainSocial = styled(Box)(() => ({
  backgroundColor: "#F0F0F0",
  width: "40px",
  height: "40px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "50%",
  fontSize: "20px",
  cursor: "pointer",
  "&:hover": {
    color: "white",
    backgroundColor: `rgba(23, 118, 107, 0.8)`,
  },
}));

type VoteResultProps = {
  data: IVoteResultType;
};
export default function ShareVote({ data }: VoteResultProps) {
  const theme = createTheme();
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleCopy = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setCopied(true);
    setLoading(false);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQR = () => {
    const originalCanvas: any = document.querySelector("#qr-code-canvas");
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = originalCanvas.width;
    tempCanvas.height = originalCanvas.height;
    const ctx: any = tempCanvas.getContext("2d");
    ctx.drawImage(originalCanvas, 0, 0);
    const img = new Image();
    img.src = imageIcon;
    img.onload = () => {
      const centerX = tempCanvas.width / 2 - img.width / 2;
      const centerY = tempCanvas.height / 2 - img.height / 2;
      ctx.drawImage(img, centerX, centerY, 50, 40);
      const pngUrl = tempCanvas
        .toDataURL("image/png")
        ?.replace("image/png", "image/octet-stream");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = "qr-code.png";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    };
  };


  const _shareEmail = async () => {
    const url = data?.voteData?.voteLink;
    const subject = "Hello";
    const body = `Link vote is: ${url}`;
    const mailtoUrl = `https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=&su=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl, "_blank");
  };
  const _shareWhatsapp = async () => {
    const url = data?.voteData?.voteLink;
    const encodedUrl = encodeURIComponent(url as string);
    const whatsappUrl = `https://web.whatsapp.com/send?text=${encodedUrl}`;
    window.open(whatsappUrl, "_blank");
  };

  const _shareFacebook = async () => {
    const url = data?.voteData?.voteLink;

    const encodedUrl = encodeURIComponent(url as string);
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    window.open(facebookUrl, "_blank");
  };

  const _shareTwitter = async () => {
    const url = data?.voteData?.voteLink;
    const encodedUrl = encodeURIComponent(url);
    const message = "Link vote is";
    const encodedMessage = encodeURIComponent(message);

    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedMessage}&url=${encodedUrl}`;

    window.open(twitterUrl, "_blank");
  };
  return (
    <React.Fragment>
      <Card sx={{ my: 5, boxShadow: "rgba(149, 157, 165, 0.2) 5px 8px 24px" }}>
        <Box
          sx={{ py: 3, borderBottom: `1px solid ${theme.palette.grey[300]}` }}
        >
          <Typography variant="h6" sx={{ mx: 4 }}>
            Share
          </Typography>
        </Box>
        <CardContent>
          <Box sx={{ my: 3, display: "flex", justifyContent: "center" }}>
            <Box
              sx={{
                width: "60%",
                p: 4,
                fontSize: "1rem",
                color: theme.palette.grey[700],
              }}
            >
              <InputLabel sx={{ color: theme.palette.grey[800] }}>
                Share this link
              </InputLabel>
              <TextField
                fullWidth
                variant="outlined"
                value={data?.voteData?.voteLink || ""}
                sx={{
                  ".MuiOutlinedInput-root": {
                    height: "45px",
                    borderRadius: "4px",
                  },
                  ".MuiOutlinedInput-input": {
                    padding: "10px 14px",
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end" sx={{ cursor: "pointer" }}>
                      <Box
                        sx={{
                          borderLeft: `1px solid ${theme.palette.grey[400]}`,
                          borderRadius: "4px",
                          display: "flex",
                          gap: 2,
                          alignItems: "center",
                        }}
                      >
                        <Box sx={{ ml: 1 }}>
                          <CopyToClipboard
                            text={data?.voteData?.voteLink || ""}
                            onCopy={handleCopy}
                          >
                            <span>
                              {loading ? (
                                <CircularProgress size={18} />
                              ) : copied ? (
                                <IoMdCheckmark size={20} />
                              ) : (
                                <CoppyLink />
                              )}
                            </span>
                          </CopyToClipboard>
                        </Box>
                      </Box>
                    </InputAdornment>
                  ),
                }}
              />
              <Box sx={{ my: 5 }}>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <ContainSocial onClick={() => _shareFacebook()}>
                    <FaFacebookF />
                  </ContainSocial>
                  <ContainSocial onClick={() => _shareEmail()}>
                    <MdEmail />
                  </ContainSocial>

                  <ContainSocial onClick={() => _shareWhatsapp()}>
                    <FaWhatsapp />
                  </ContainSocial>
                  <ContainSocial onClick={() => _shareTwitter()}>
                    <IoLogoTwitter />
                  </ContainSocial>
                  <ContainSocial onClick={() => setIsOpen(true)}>
                    <FaQrcode />
                  </ContainSocial>
                </Box>
              </Box>
            </Box>
          </Box>
        </CardContent>
        <Dialog maxWidth="sm" open={isOpen} onClose={handleClose}>
          <DialogContent>
            <div
              style={{
                position: "relative",
                display: "inline-block",
                textAlign: "center",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <QRCode
                id="qr-code-canvas"
                value={data?.voteData?.voteLink}
                level="H"
                size={300}
                fgColor="#000000"
                bgColor="#FFFFFF"
                renderAs="canvas"
              />
              <img
                src={imageIcon}
                alt="icon"
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "50px",
                  height: "40px",
                }}
              />
            </div>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Button
                sx={{
                  background: "#ffffff",
                  color: "#17766B",
                  fontSize: "14px",
                  padding: "2px 2rem",
                  borderRadius: "6px",
                  border: "1px solid #17766B",
                  "&:hover": {
                    border: "1px solid #17766B",
                    color: "#17766B",
                  },
                  margin: "1rem 0",
                }}
                onClick={downloadQR}
              >
                Download
              </Button>
            </Box>
          </DialogContent>
        </Dialog>
      </Card>
    </React.Fragment>
  );
}
