import { Box, Button, Card, CardContent } from "@mui/material";
import { createTheme, styled } from "@mui/material/styles";
import { Container } from "@mui/system";

const theme = createTheme();

export const customizeTheme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  spacing: 1,
});

export const BoxHomepage = styled(Box)({
  padding: "0 !important",
  background: "#FFFFFF",
  marginTop: "5rem",
  height: "auto",
  [theme.breakpoints.down("md")]: {
    marginTop: "4rem",
  },
});

export const ContainerHome = styled(Container)(({ theme }) => ({
  padding: "1.5rem 0",
  marginBottom: "4rem",
  height: "auto",
  [theme.breakpoints.down("md")]: {
    marginBottom: "2rem",
  },
}));

export const BoxUpload = styled(Box)(({ theme }) => ({
  img: {
    position: "absolute",
    left: "0",
  },
  [theme.breakpoints.down("sm")]: {
    img: {
      display: "none",
    },
  },
  [theme.breakpoints.between("sm", "md")]: {
    img: {
      width: "300px",
      top: "10%",
    },
  },
}));

export const DivdownloadFile = styled("div")({
  height: "auto",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "50vh",

  [theme.breakpoints.down("sm")]: {
    paddingLeft: "1rem",
    paddingRight: "1rem",
  },
});

export const BoxUploadHeader = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "0.5rem 0",
  [theme.breakpoints.between("sm", "md")]: {
    paddingTop: "2rem",
  },
});

export const BoxShowUploadDetail = styled(Box)(({ theme }) => ({
  width: "60%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  border: "2px dashed #85b7b1",
  padding: "1rem 0 2.5rem 0",
  background: "#EDF3F2",
  borderRadius: "10px",
  [theme.breakpoints.down("sm")]: {
    width: "92%",
    marginLeft: "4%",
    minWidth: "10rem",
  },

  "& .box-drag": {
    span: {
      color: "#5D596C",
      fontSize: "1.1rem",
      fontWeight: "600",
    },
  },
}));

export const ButtonUpload = styled(Button)(({ theme }) => ({
  background: "#16776C",
  color: "#ffffff",
  fontSize: "1.125rem",
  fontWeight: "400",
  padding: "0.2rem 2rem",
  marginTop: "0.8rem",

  "&:hover": {
    background: "#16776C",
  },
  [theme.breakpoints.down("sm")]: {
    fontSize: "12px",
  },
}));

export const DivDownloadBox = styled("div")(({ theme }) => ({
  border: "2px dashed #85b7b1",
  borderRadius: "10px",
  width: "60%",
  background: "#f2f7f6",
  padding: "3rem",
  color: "#3d3e3e",
  display: "flex",
  flexDirection: "column",
  [theme.breakpoints.down("sm")]: {
    width: "100%",
    padding: "1rem 0.5rem",
  },
  [theme.breakpoints.between("sm", "md")]: {
    width: "90%",
  },
}));

export const BoxDownloadHeader = styled(Box)(({ theme }) => ({
  margin: "0 0 1rem 0",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  h3: {
    fontSize: "16px",
  },
  h6: {
    fontSize: "14px",
  },
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    margin: "0",
    h3: {
      fontSize: "14px",
    },
    h6: {
      fontSize: "12px",
      marginTop: "0.5rem",
    },
  },
  [theme.breakpoints.between("sm", "md")]: {
    width: "90%",
    h3: {
      fontSize: "18px",
    },
    h6: {
      fontSize: "16px",
      marginTop: "0.5rem",
    },
  },
}));

export const DivDownloadFileBox = styled("div")(({ theme }) => ({
  background: "#f2f7f6",
  display: "flex",
  justifyContent: "space-between",
  color: "#3d3e3e",
  alignItems: "center",
  padding: "0.5rem 0",
  [theme.breakpoints.down("sm")]: {
    h6: {
      color: "#17766B",
      fontSize: "12px !important",
    },
  },
}));

export const DivDownloadFileBoxWrapper = styled("div")({
  width: "100%",
  display: "flex",
  justifyContent: "center",

  h1: {
    fontSize: 30,
    [theme.breakpoints.down("md")]: {
      fontSize: 24,
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: 16,
    },
  },
});

// ================== feature section ==============
export const BoxFeatureContainer = styled(Container)({
  paddingTop: "4rem",

  [theme.breakpoints.down("sm")]: {
    // padding: "1rem 1rem 0 0.5rem",
  },

  [theme.breakpoints.up("sm")]: {
    paddingLeft: "20px",
    paddingRight: "20px",
  },
});

export const BoxFeatureHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  b: {
    fontSize: "1.5rem",
    fontWeight: 500,
    lineHeight: 1.25,
    margin: "0",
    width: "100%",
    marginBottom: "1rem",
    textAlign: "center",
    height: "auto",
  },
  p: {
    fontSize: "1rem",
    fontWeight: 400,
    lineHeight: 1.6,
    margin: "0.2rem 0",
    height: "auto",
    padding: "0 0 0 1rem",
    flex: 1,
    marginLeft: "20px",
  },

  [theme.breakpoints.down(820)]: {
    padding: "0 0.8rem",
  },

  [theme.breakpoints.down("sm")]: {
    b: {
      fontSize: "1rem",
      marginBottom: "0.5rem",
    },
    p: {
      fontSize: "0.8rem",
      margin: "0",
      textAlign: "justify",
      textJustify: "distribute",
      hyphens: "auto",
      textAlignLast: "left",
      padding: "0",
    },
  },
}));

export const BoxShowFeature = styled(Box)(({ theme }) => ({
  margin: "3rem 0",
  [theme.breakpoints.down("sm")]: {
    margin: "1rem 0 3rem 0",
    background: "#F3F8F7",
    borderRadius: "8px",
    // padding: "0 10px",
  },
}));

export const CardFeature = styled(Card)({
  border: "none",
  background: "#F3F8F7",
  transition: "box-shadow 0.3s ease-in-out",
  padding: "1rem",
  boxShadow: "none",
  "&:hover": {
    background: "#F3F8F7",
  },
  cursor: "pointer",
  height: "250px",
});

export const CardContentFeature = styled(CardContent)(({ theme }) => ({
  padding: "1rem 0 !important",
  textAlign: "center",
  [theme.breakpoints.down("sm")]: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    h3: {
      fontSize: "18px",
    },
    h5: {
      fontSize: "16px",
      wordSpacing: "-3px",
      textAlign: "justify",
      textJustify: "distribute",
      hyphens: "auto",
      textAlignLast: "left",
    },
  },
}));

export const BoxFeatureCompIcon = styled(Box)(({ theme }) => ({
  img: {
    width: "50px",
    height: "50px",
    filter: "drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.3))",
  },
  [theme.breakpoints.down("sm")]: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "50px",
    height: "50px",
  },
}));

export const BoxFeatureViewMore = styled(Box)(({ theme }) => ({
  textAlign: "center",
  marginBottom: "3rem",
  [theme.breakpoints.down("sm")]: {
    marginBottom: "1rem",
    marginTop: "-2rem",
  },
}));

export const ButtonViewMore = styled(Button)(({ theme }) => ({
  fontSize: "1.2rem",
  color: "#0F6C61",
  position: "relative",
  overflow: "hidden",
  "& .MuiButton-endIcon": {
    transition: "transform 0.5s ease",
    animation: "$moveRightAndBack 5s infinite",
  },
  "@keyframes moveRightAndBack": {
    "0%": {
      transform: "translateX(0)",
    },
    "50%": {
      transform: "translateX(10px)",
    },
    "100%": {
      transform: "translateX(0)",
    },
  },
  [theme.breakpoints.down("sm")]: {
    fontSize: "1rem",
  },
}));

// ================== Sign up card ================

export const BoxSignUpCard = styled(Box)({
  marginTop: "6rem",
  padding: "0 2rem",
  [theme.breakpoints.down("sm")]: {
    padding: "0 1rem",
  },
});

export const SignUpCardContainer = styled(Container)({
  borderRadius: "10px",
  background:
    "linear-gradient(266deg, rgba(255, 255, 255, 0.00) 10.42%, #167D71 74.73%)",
  boxShadow: "4px 4px 15px 0px rgba(41, 41, 41, 0.10)",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "1rem 0",
  [theme.breakpoints.down("sm")]: {
    justifyContent: "center",
    flexDirection: "column",
    background:
      "linear-gradient(90deg, rgba(15,108,97,1) 11%, rgba(14,128,115,1) 39%, rgba(13,141,127,1) 58%, rgba(10,200,179,1) 100%)",
  },
});

export const SignUpCardLeftBox = styled(Box)({
  padding: "2rem 1rem",
  width: "50%",
  h2: {
    fontSize: "1.5rem",
    lineHeight: 1.25,
    fontWeight: 600,
    padding: "0 0 1rem 0",
    margin: "0",
    color: "#ffffff",
    height: "auto",
  },
  p: {
    fontSize: "0.9rem",
    fontWeight: 500,
    lineHeight: 1.25,
    color: "#ffffff",
    margin: "0",
    height: "auto",
  },
  [theme.breakpoints.down("sm")]: {
    width: "100%",
    padding: "0 1rem",
    h2: {
      fontSize: "1rem",
      fontWeight: 500,
    },
    p: {
      fontSize: "0.8rem",
      fontWeight: 400,
    },
  },
});

export const SignUpCardRightBox = styled(Box)(({ theme }) => ({
  width: "50%",
  display: "flex",
  textAlign: "center",
  justifyContent: "end",
  img: {
    width: "300px",
    marginTop: "-50px",
  },
  [theme.breakpoints.down("sm")]: {
    img: {
      display: "none",
    },
  },
}));

// ================== Pricing ================

export const PricingContainer = styled(Container)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  marginBottom: "2rem",
  padding: "2rem 0",
  b: {
    fontSize: "1.5rem",
    lineHeight: 1.25,
    fontWeight: 600,
    padding: "0",
    height: "auto",
  },
  p: {
    fontSize: "1.125rem",
    lineHeight: 1.25,
    fontWeight: 500,
    height: "auto",
    margin: "0",
  },
  [theme.breakpoints.down("sm")]: {
    padding: "0 1rem",
    marginTop: "1rem",
    b: {
      fontSize: "1rem",
      fontWeight: 500,
    },
    p: {
      textAlign: "center",
      fontSize: "0.8rem",
      fontWeight: 400,
    },
  },
});

// ================== Free trial ================

export const FreeTrialContainer = styled(Container)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  marginBottom: "2rem",
  padding: "2rem 0",
  h2: {
    fontSize: "1.5rem",
    lineHeight: 1.25,
    fontWeight: 600,
    padding: "0",
    height: "auto",
  },
  p: {
    fontSize: "1.125rem",
    lineHeight: 1.25,
    fontWeight: 500,
    height: "auto",
    margin: "0",
  },
  [theme.breakpoints.down("sm")]: {
    padding: "0 1rem",
    marginTop: "1rem",
    h2: {
      fontSize: "1rem",
      fontWeight: 500,
    },
    p: {
      textAlign: "center",
      fontSize: "0.8rem",
      fontWeight: 400,
    },
  },
});

// ================== Network ================

export const BoxNetworkContainer = styled(Container)({
  textAlign: "center",
  marginTop: "6rem",
  [theme.breakpoints.down("sm")]: {
    marginTop: "3rem",
  },
});

export const BoxNetworkHeader = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  b: {
    height: "auto",
    fontSize: "1.5rem",
    fontWeight: 600,
    padding: "0",
    margin: "0",
  },
  p: {
    height: "auto",
    fontSize: "1.125rem",
    fontWeight: 500,
    lineHeight: 1.25,
    margin: "0.5rem 0",
  },
  [theme.breakpoints.down("sm")]: {
    b: {
      fontSize: "1rem",
      fontWeight: 500,
    },
    p: {
      fontSize: "0.8rem",
      fontWeight: 400,
    },
  },
});

export const BoxShowNetworkMap = styled(Box)({
  img: {
    width: "100%",
    height: "auto",
  },
  [theme.breakpoints.down("sm")]: {
    marginTop: "0.5rem",
  },
});

export const BoxShowNetworkZone = styled(Box)({
  display: "flex",
  textAlign: "start",
  margin: "2rem 0",

  [theme.breakpoints.down("sm")]: {
    padding: "0.3rem",
  },
});

// ================== FAQ ================
export const BoxFAQ = styled(Box)({
  padding: "3rem 0 0 0",
  textAlign: "end",
  background:
    "linear-gradient(90deg, rgba(23, 118, 107, 1) 0%,rgba(11, 175, 156, 1) 100%)",
  img: {
    width: "80%",
    height: "100%",
    marginTop: "-700px",
    zIndex: "1",
  },
  [theme.breakpoints.down("sm")]: {
    padding: "1.5rem 0 0 0",
  },
});

export const BoxFAQContainer = styled(Container)({
  marginTop: "2rem",
  marginBottom: "4rem",
  zIndex: "9999999999",
  [theme.breakpoints.down("sm")]: {
    marginTop: "1rem",
  },
});

export const BoxFAQHeader = styled(Box)({
  color: "#ffffff",
  display: "flex",
  textAlign: "center",
  justifyContent: "center",
  flexDirection: "column",
  b: {
    fontSize: "1.5rem",
    fontWeight: 600,
    height: "auto",
  },
  p: {
    fontSize: "1.125rem",
    fontWeight: 500,
    height: "auto",
    marginTop: "0.5rem",
  },
  [theme.breakpoints.down("sm")]: {
    b: {
      fontSize: "1rem",
      fontWeight: 500,
    },
    p: {
      fontSize: "0.8rem",
      fontWeight: 400,
    },
  },
});

export const BoxFAQAccordion = styled(Box)({
  marginTop: "2rem",
  [theme.breakpoints.down("sm")]: {
    marginTop: "0",
  },

  paddingLeft: "1rem",
  paddingRight: "1rem",
});

// ================== contact us ================
export const BoxContactUs = styled(Box)({
  padding: "4rem 0",
  [theme.breakpoints.up("sm")]: {
    paddingLeft: "1.5rem",
    paddingRight: "1.5rem",
  },

  [theme.breakpoints.down("sm")]: {
    padding: "2rem 1rem",
  },
});

export const ContainerContactUs = styled(Container)({
  textAlign: "center",
});

export const BoxContactUsHeader = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  h1: {
    fontSize: "1.5rem",
    lineHeight: 1.25,
    fontWeight: 600,
    height: "auto",
  },
  p: {
    marginTop: "0.5rem",
    fontSize: "1.125rem",
    fontWeight: 500,
    lineHeight: 1.25,
    height: "auto",
  },
  [theme.breakpoints.down("sm")]: {
    b: {
      fontSize: "1rem",
      marginBottom: "0",
      padding: "0",
    },
    p: {
      fontSize: "0.8rem",
      margin: "0.5rem 0 0 0",
    },
  },
});

export const BoxShowContactForm = styled("form")({
  margin: "2rem 0",
  [theme.breakpoints.down("sm")]: {
    margin: "1rem 0",
  },
});

export const BoxShowSendMessageBTN = styled(Box)({
  textAlign: "start",
  marginTop: "2rem",
});

export const ButtonSendMessage = styled(Button)({
  background: "#17766B",
  "&:hover": {
    background: "#16776C",
  },
  [theme.breakpoints.down("sm")]: {
    marginTop: "0",
  },
});

// ================== footer ================
export const BoxFooter = styled(Box)({
  background: "#018273",
  padding: "3rem 0 0 0",
  [theme.breakpoints.down("sm")]: {
    padding: "2rem 0 0 0",
  },
});

export const ContainerFooter = styled(Container)({
  display: "flex",
  alignItems: "start",
  justifyContent: "space-between",
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    marginLeft: "0",
    padding: "0 0.8rem",
  },
});

export const BoxLeftFooter = styled(Box)({
  width: "40%",
  textAlign: "center",
  [theme.breakpoints.down("sm")]: {
    width: "100%",
  },
});

export const BoxShowLogo = styled(Box)({
  img: {
    width: "30%",
  },
  [theme.breakpoints.down("sm")]: {
    img: {
      width: "40%",
    },
  },
});

export const BoxShowSocialMedia = styled(Box)({
  margin: "1rem 0",
  [theme.breakpoints.down("sm")]: {
    margin: "0.5rem",
  },
});

export const BoxShowCompanyDetail = styled(Box)({
  color: "#ffffff",
  h3: {
    fontWeight: "600",
    padding: "0.5rem 0",
    textTransform: "uppercase",
  },
  h5: {
    fontWeight: "400",
    padding: "0.5rem 0",
  },
  [theme.breakpoints.down("sm")]: {
    h3: {
      fontSize: "18px",
      padding: "0.2rem 0",
    },
    h5: {
      fontSize: "14px",
      padding: "0.2rem 0",
    },
  },
});

export const BoxCenterFooter = styled(Box)({
  width: "30%",
  textAlign: "center",
  color: "#ffffff",
  paddingRight: "2rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  [theme.breakpoints.down("sm")]: {
    width: "100%",
    padding: "2rem 0",
  },
});

export const BoxRightFooter = styled(Box)({
  width: "30%",
  textAlign: "start",
  paddingLeft: "10%",
  color: "#ffffff",
  a: {
    textDecoration: "none",
    color: "#ffffff",
    margin: "1rem 0",
    "&:hover": {
      color: "#e6e6e6",
    },
    "&.active": {
      fontWeight: 700,
      color: "#FFCC6A",
      fontSize: "1.2rem",
    },
  },
  span: {
    margin: "0 0 2rem 0",
    fontWeight: "400",
    // textTransform: "uppercase",
    fontSize: "1rem",
  },
  [theme.breakpoints.down("sm")]: {
    width: "100%",
    paddingLeft: "0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    span: {
      fontSize: "0.8rem",
    },
    a: {
      textTransform: "uppercase",
      margin: "0",
    },
    "&.active": {
      color: "#FFCC6A",
      fontSize: "1rem",
    },
  },
});

export const BoxFooterCopyRight = styled(Box)({
  padding: "4rem 0 4rem 6rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  [theme.breakpoints.down("sm")]: {
    padding: "1.5rem 0.8rem",
  },

  [theme.breakpoints.between("sm", "md")]: {
    padding: "4rem 0 4rem 2rem",
  },

  [theme.breakpoints.down("sm")]: {
    marginBottom: "2.8rem",
  },
});

export const ContainerFooterCopyRight = styled(Container)({
  color: "#ffffff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  p: {
    textAlign: "center",
  },
  h4: {
    fontWeight: "200",
    fontSize: "18px",
  },
  h5: {
    fontWeight: "300",
    fontSize: "18px",
    marginLeft: "4rem",
  },
  [theme.breakpoints.down("sm")]: {
    alignItems: "start",
    justifyContent: "start",
    flexDirection: "column",
    h4: {
      fontSize: "12px",
      paddingBottom: "0.5rem",
    },
    h5: {
      fontSize: "12px",
      fontWeight: "100",
      marginLeft: "0",
      padding: "0.5rem 0",
    },
  },
});

export const BoxLiveChat = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "60px",
  height: "60px",
  borderRadius: "50%",
  background: "#ffffff",
  marginRight: "3rem",
  position: "fixed",
  bottom: "2.5rem",
  right: "2rem",
  boxShadow:
    "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
  [theme.breakpoints.down("sm")]: {
    width: "40px",
    height: "40px",
    right: "0 !important",
    bottom: "1rem",
  },
});

export const BoxBottomDownload = styled(Box)({
  display: "flex",
  justifyContent: "flex-end",
  gap: "2.5rem",
  padding: "1rem 2rem 0.5rem 2rem",

  [theme.breakpoints.down("md")]: {
    display: "none",
  },
});

export const BoxMultipleFolder = styled("div")({
  marginBottom: "20px",
});

export const BoxAdsContainer = styled("div")({
  position: "absolute",
  top: -10,
  right: 0,
  zIndex: 999,
});

export const BoxAdsAction = styled("button")({
  padding: "5px 14px",
  color: "#FFF",
  fontSize: "0.8rem",
  backgroundColor: "#EA5455",
  border: "none",
  outline: "none",
  borderTopLeftRadius: "5px",
  borderTopRightRadius: "5px",
  borderBottomRightRadius: "5px",
  transition: "2s all",
});
