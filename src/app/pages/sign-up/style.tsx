import { Box, Button } from "@mui/material";
import { createTheme, styled } from "@mui/material/styles";
const theme = createTheme();

export const BoxSignUp = styled(Box)({
  width: "100%",
  display: "flex",
});

export const LeftBox = styled(Box)({
  padding: "1rem",
  width: "50%",
  background:
    "linear-gradient(90deg, rgba(22,209,187,1) 0%, rgba(23,118,107,1) 100%)",
  height: "100vh",
  color: "#ffffff",
  [theme.breakpoints.down("sm")]: {
    display: "none",
  },
});

export const BoxShowLogo = styled(Box)({
  textAlign: "start",
  img: {
    width: "40%",
  },
  [theme.breakpoints.between("sm", "md")]: {
    img: {
      width: "100%",
    },
  },
});

export const BoxShowText = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  padding: "4rem 0",
  h1: {
    fontSize: "4rem",
  },
  [theme.breakpoints.between("sm", "md")]: {
    h1: {
      fontSize: "2.5rem",
    },
  },
});

export const BoxShowDetail = styled(Box)({
  textAlign: "center",
  h4: {
    fontSize: "1.5rem",
    lineHeight: "1.5",
    margin: "1rem 0",
  },
  "@media(max-width: 800px)": {
    h4: {
      fontSize: "1.3rem",
    },
  },
});

export const ButtonLogin = styled(Button)({
  border: "1px solid #ffffff",
  padding: "0.8rem 5rem",
  color: "#ffffff",
  borderRadius: "3rem",
  marginTop: "3rem",
  fontSize: "1rem",
});

export const RightBox = styled(Box)({
  width: "50%",
  height: "100vh",
  padding: "0 4rem",
  display: "flex",
  alignContent: "center",
  justifyContent: "center",
  flexDirection: "column",
  [theme.breakpoints.down("sm")]: {
    width: "100%",
    padding: "0 0.5rem",
  },
  [theme.breakpoints.between("sm", "md")]: {
    padding: "0 0.5rem",
    marginTop: "-3rem",
  },
});

export const BoxShowSignUpDetail = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  h1: {
    fontSize: "3.5rem",
    color: "#17766B",
  },
  h4: {
    margin: "0 0 2rem 0",
  },
  [theme.breakpoints.down("sm")]: {
    width: "100%",
    h1: {
      fontSize: "2rem",
    },
  },
  [theme.breakpoints.between("sm", "md")]: {
    h1: {
      fontSize: "2.5rem",
    },
  },
});

export const BoxShowSocialMediaSignUp = styled(Box)({
  margin: "2rem",
  [theme.breakpoints.down("sm")]: {
    margin: "1rem 2rem 0.5rem 2rem",
  },
});

export const BoxShowFormik = styled(Box)({});

export const LeftBoxRowAuthenticationLimit = styled(Box)({
  padding: "1rem 0",
  textAlign: "center",

  h2: {
    fontSize: "1rem",
    marginBottom: "0.8rem",
  },

  h4: {
    fontSize: "0.9rem",
  },

  "h2, h4": {
    color: "#d33",
  },
});
