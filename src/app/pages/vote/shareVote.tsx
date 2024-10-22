import {
  Box,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
  InputLabel,
  TextField,
  Typography,
  createTheme,
  styled,
} from "@mui/material";
import CoppyLink from "assets/images/coppyLinkVote.svg?react";
import React from "react";
import {
  FaFacebookF,
  FaFacebookMessenger,
  FaQrcode,
  FaWhatsapp,
} from "react-icons/fa";
import { IoLogoTwitter } from "react-icons/io";
import { MdEmail } from "react-icons/md";
import { IVoteResultType } from "types/voteType";
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
                value={data?.voteData?.voteLink}
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
                          alignItems: "center",
                        }}
                      >
                        <IconButton>
                          <CoppyLink />
                        </IconButton>
                      </Box>
                    </InputAdornment>
                  ),
                }}
              />
              <Box sx={{ my: 5 }}>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <ContainSocial>
                    <FaFacebookF />
                  </ContainSocial>
                  <ContainSocial>
                    <MdEmail />
                  </ContainSocial>
                  <ContainSocial>
                    <FaFacebookMessenger />
                  </ContainSocial>
                  <ContainSocial>
                    <FaWhatsapp />
                  </ContainSocial>
                  <ContainSocial>
                    <IoLogoTwitter />
                  </ContainSocial>
                  <ContainSocial>
                    <FaQrcode />
                  </ContainSocial>
                </Box>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </React.Fragment>
  );
}
