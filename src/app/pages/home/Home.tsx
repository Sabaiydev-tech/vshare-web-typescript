import { motion } from "framer-motion";
import he from "he";
import React, { useCallback, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { TypeAnimation } from "react-type-animation";

// components
import {
  MUTATION_CONTACT,
  QUERY_ALL_FAQ,
  QUERY_ALL_MAIN_FEATURES,
  QUERY_ALL_SUB_FEATURES,
  QUERY_ANNOUNCEMENTS,
} from "api/graphql/support.graphql";
import { useDropzone } from "react-dropzone";
import { NavLink } from "react-router-dom";
import * as MUI from "styles/presentation/presentation.style";

// material ui component
import backgroundVector from "assets/images/background-vector.svg";
import catImage from "assets/images/cat-logo.png";
import showMap from "assets/images/network.jpg";
import vectorImage from "assets/images/vector.svg";
import { mapAnimation } from "constants/animation.constant";
import { errorMessage, successMessage } from "utils/alert.util";
const Feature = React.lazy(() => import("components/presentation/Feature"));
const FAQAccordion = React.lazy(
  () => import("components/presentation/FAQAccordion"),
);

// material ui component icons
import { useLazyQuery, useMutation } from "@apollo/client";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import TelegramIcon from "@mui/icons-material/Telegram";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  TextField,
  ThemeProvider,
  Typography,
  useMediaQuery,
} from "@mui/material";
import serverZone from "constants/serverZone.constant";
import useManageSetting from "hooks/useManageSetting";
import useTheme from "hooks/useTheme";
import { FaArrowUpFromBracket } from "react-icons/fa6";
import "swiper/css";
import createTheme from "theme";
import { Id } from "types";
import { ENV_KEYS } from "constants/env.constant";
const ShowFileDialog = React.lazy(
  () => import("components/dialog/DialogShowFIle"),
);

function Home() {
  const customTheme = useTheme();
  const theme = createTheme(customTheme.theme);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<any[]>([]);

  // Pass value to Show File Dialog
  const [expireDateLinks, setExpireDateLinks] = useState([]);
  const [expireDateLink, setExpireDateLink] = useState({});
  const [passwordLink, setPasswordLink] = useState(null);
  const [subPasswordLink, setSubPasswordLink] = useState(null);
  const [uploadPerday, setUploadPerday] = useState(null);
  const [uploadPerTime, setUploadPerTime] = useState(null);
  const [uploadMaxSize, setUploadMaxSize] = useState(null);

  const [open, setOpen] = useState(false);
  const [clickUpload, setClickUpload] = useState<boolean>(false);
  const [features, setFeatures] = useState<any[]>([]);
  const [subFeatures, setSubFeatures] = useState<any[]>([]);
  const [faq, setFaq] = useState<any[]>([]);
  const useDataSetting = useManageSetting();

  const settingKeys = {
    passwordLink: "HLINPFS",
    categoryKey: "AEADEFD",
    subPasswordLink: "HFPWFCE",
    uploadPerday: "MUPFAPD",
    uploadMaxSize: "MXULDFE",
    uploadPerTime: "MUPEAPD",
  };

  const handleClose = (value) => {
    setOpen(value);
  };

  const [queryFeature, { data: featureData }] = useLazyQuery(
    QUERY_ALL_MAIN_FEATURES,
  );
  const [querySubFeature, { data: subFeatureData }] = useLazyQuery(
    QUERY_ALL_SUB_FEATURES,
  );
  const [queryFAQ] = useLazyQuery(QUERY_ALL_FAQ, {
    fetchPolicy: "no-cache",
  });
  const [listAnouncement] = useLazyQuery(QUERY_ANNOUNCEMENTS, {
    fetchPolicy: "no-cache",
  });
  const [createContact] = useMutation(MUTATION_CONTACT);

  const handleAnnouncement = async () => {
    //   await listAnouncement({
    //     variables: {
    //       orderBy: "updatedAt_DESC",
    //       where: {
    //         status: "published",
    //         notificationTo: "anonymous",
    //       },
    //     },
    //   });
  };

  function findDataSetting(productKey) {
    const dataSetting = useDataSetting.data?.find(
      (data) => data?.productKey === productKey,
    );

    return dataSetting;
  }

  // Get data

  useEffect(() => {
    handleAnnouncement();
  }, [listAnouncement]);

  useEffect(() => {
    queryFeature({
      variables: {
        where: {
          status: "main",
        },
        limit: 4,
      },
    });
    setFeatures(featureData?.features?.data);
  }, [featureData]);

  useEffect(() => {
    querySubFeature({
      variables: {
        where: {
          status: "sub",
        },
        limit: 8,
      },
    });
    setSubFeatures(subFeatureData?.features?.data);
  }, [subFeatureData]);

  useEffect(() => {
    queryFAQ({
      variables: {
        where: {
          display: "client",
        },
      },
      onCompleted: (data) => {
        setFaq(data?.faqs?.data);
      },
    });
  }, []);

  useEffect(() => {
    function getDataSetting() {
      // password gen link
      const dataLink = findDataSetting(settingKeys.passwordLink);
      if (dataLink) {
        setPasswordLink(dataLink);
      }

      // data expire dates
      const dataExpires = useDataSetting.data?.filter(
        (data) => data?.categoryKey === settingKeys.categoryKey,
      );
      if (dataExpires?.length) {
        setExpireDateLinks(dataExpires || []);
        const dataExp = dataExpires?.find((el) => el?.status === "on");
        if (dataExp) {
          setExpireDateLink(dataExp);
        }
      }

      // password hide files
      const dataFile = findDataSetting(settingKeys.subPasswordLink);
      if (dataFile) {
        setSubPasswordLink(dataFile);
      }

      // Upload file per/days
      const dataUploadPerday = findDataSetting(settingKeys.uploadPerday);
      if (dataUploadPerday) {
        setUploadPerday(dataUploadPerday);
      }

      // Upload file per/time
      const dataUploadPertime = findDataSetting(settingKeys.uploadPerTime);
      if (dataUploadPertime) {
        setUploadPerTime(dataUploadPertime);
      }
     
      // Upload max size
      const dataUploadMaxSize = findDataSetting(settingKeys.uploadMaxSize);
      if (dataUploadMaxSize) {
        setUploadMaxSize(dataUploadMaxSize);
      }
    }

    getDataSetting();
  }, [useDataSetting.data]);

  const onDrop = useCallback(
    (acceptedFiles: any[]) => {
      setFiles([...files, ...acceptedFiles]);
      setOpen(true);
    },
    [files],
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
  });

  const handleDelete = (id: Id) => {
    setFiles(files.filter((_, i) => i !== id));
  };

  const handleRemoveAll = () => {
    setFiles([]);
  };

  const handleSubmitContact = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const contact = await createContact({
        variables: {
          body: {
            name: username,
            email: email,
            message: message,
          },
        },
      });
      if (contact?.data?.createContact?._id) {
        successMessage("Check your email for the respon!!", 3000);
        setUsername("");
        setEmail("");
        setMessage("");
      }
    } catch (error) {
      errorMessage("Somthing went wrong. Please try again later!", 3000);
    }
  };

  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    if (files.length > 0) {
      const fileList = files?.map((file, index) => {
        const newFile: any = new File([file.data], file.name, {
          type: file.type,
        });
        newFile.id = (index + 1).toString();
        newFile.path = file.path;
        newFile.sizeFile = file.size;

        const updatedFile = { file: newFile };
        return updatedFile;
      });
      setData(fileList);
    } else {
      setData([]);
      setOpen(false);
    }
  }, [files]);

  const isMobile = useMediaQuery("(max-width: 600px)");

  const { ref: ref1 } = useInView({
    threshold: 0.2,
  });

  const { ref: ref2, inView: inView2 } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  const { ref: ref3, inView: inView3 } = useInView({
    triggerOnce: true,
    threshold: 0.4,
  });

  const { ref: ref4, inView: inView4 } = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  const { ref: ref5, inView: inView5 } = useInView({
    triggerOnce: true,
    threshold: 0,
  });

  const { ref: ref6, inView: inView6 } = useInView({
    triggerOnce: true,
    threshold: 0.7,
  });

  const { ref: ref7, inView: inView7 } = useInView({
    triggerOnce: true,
    threshold: 0.8,
  });

  return (
    <React.Fragment>
      <ThemeProvider
        theme={{
          ...theme,
          breakpoints: MUI.customizeTheme.breakpoints,
        }}
      >
        <MUI.ContainerHome maxWidth="lg">
          <MUI.BoxUpload>
            <img src={vectorImage} alt="" />
            <MUI.BoxUploadHeader sx={{ marginBottom: "1.5rem" }}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: "1.5rem",
                  fontWeight: 600,
                  [theme.breakpoints.down("sm")]: {
                    fontSize: "1rem",
                    fontWeight: 500,
                  },
                }}
              >
                Start Sharing, Uploading It’s
              </Typography>
              &nbsp;&nbsp;
              <TypeAnimation
                sequence={["Fast", 3000, "Easy", 3500, "Secure", 4000]}
                wrapper="span"
                speed={10}
                style={{
                  fontSize: "1.5rem",
                  display: "inline-block",
                  fontWeight: 600,
                  color: "#17766B",
                  ...(isMobile && {
                    fontSize: "16px",
                    fontWeight: 500,
                  }),
                }}
                repeat={Infinity}
              />
            </MUI.BoxUploadHeader>
            <MUI.BoxShowUploadDetail
              {...getRootProps()}
              sx={{ marginLeft: "20%" }}
            >
              <IconButton>
                <UploadFileIcon
                  sx={{
                    color: "#16776C",
                    fontSize: "50px",
                  }}
                />
              </IconButton>
              <Typography
                sx={{
                  fontSize: "1.125rem",
                  fontWeight: 500,
                  margin: "0.5rem 0",
                  mb: 2,
                  [theme.breakpoints.down("sm")]: {
                    fontSize: "0.9rem",
                    fontWeight: 400,
                  },
                }}
              >
                Drag and drop your files here or click to
              </Typography>
              <Box sx={{ marginTop: "1rem" }}>
                <MUI.ButtonUpload
                  startIcon={
                    <FaArrowUpFromBracket
                      style={{ fontSize: isMobile ? "14px" : "18px" }}
                    />
                  }
                  variant="contained"
                  onClick={() => {
                    setOpen(true);
                    setClickUpload(!clickUpload);
                    setFiles([]);
                  }}
                >
                  Select file
                  <input {...getInputProps()} hidden />
                </MUI.ButtonUpload>
              </Box>
            </MUI.BoxShowUploadDetail>

            {data.length > 0 && (
              <ShowFileDialog
                open={open}
                files={data}
                onClose={handleClose}
                onDeleteData={handleDelete}
                selectMore={{ ...getRootProps() }}
                onRemoveAll={handleRemoveAll}
                dataFile={files}
                openModal={clickUpload}
                checkSend={() => setFiles([])}
                isFileDrop={false}
                dataPasswordLink={passwordLink}
                dataExpire={expireDateLink}
                dataExpires={expireDateLinks}
                dataSubPasswordLink={subPasswordLink}
                dataUploadPerDay={uploadPerday}
                dataMaxSize={uploadMaxSize}
                dataUploadPerTime={uploadPerTime}
              />
            )}
          </MUI.BoxUpload>
        </MUI.ContainerHome>

        <MUI.BoxFeatureContainer maxWidth="lg" ref={ref1}>
          <MUI.BoxFeatureHeader>
            <Typography
              sx={{
                fontSize: "1.5rem",
                fontWeight: 600,
                [theme.breakpoints.down("sm")]: {
                  fontSize: "1rem",
                  fontWeight: 500,
                },
              }}
            >
              Key Features
            </Typography>
            <Typography
              sx={{
                fontSize: "1.125rem",
                fontWeight: 500,
                marginTop: "0.5rem",
                [theme.breakpoints.down("sm")]: {
                  fontSize: "0.8rem",
                  textAlign: "center",
                  fontWeight: 400,
                },
              }}
            >
              Upload and share files for free. You can access them anywhere and
              share links with anyone.
            </Typography>
            <Typography
              sx={{
                fontSize: "1.125rem",
                fontWeight: 500,
                [theme.breakpoints.down("sm")]: {
                  fontSize: "0.8rem",
                  fontWeight: 400,
                  textAlign: "center",
                },
              }}
            >
              FileHosting is a file-sharing service that offers fast upload and
              download speeds.
            </Typography>
          </MUI.BoxFeatureHeader>
          <MUI.BoxShowFeature>
            {!isMobile && (
              <Grid container spacing={2}>
                {features?.map((val, index) => (
                  <Grid item lg={3} md={4} sm={6} xs={12} key={index}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      transition={{
                        delay: index * 0.2,
                        duration: 0.8,
                        ease: "easeOut",
                      }}
                      style={{ padding: "0.3rem 0.5rem" }}
                    >
                      <Feature
                        title={val.title}
                        content={val.Content1}
                        image={val.image}
                      />
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            )}
            {isMobile && (
              <Container
                style={{
                  width: "22rem",
                  background: "#F3F7F8",
                  borderRadius: "8px",
                }}
                maxWidth="lg"
              >
                <Carousel
                  showArrows={false}
                  showStatus={false}
                  showThumbs={false}
                  infiniteLoop={true}
                  autoPlay={true}
                  interval={3000}
                  transitionTime={800}
                  stopOnHover={true}
                >
                  {features?.map((val, index) => (
                    <Feature
                      key={index}
                      title={val.title}
                      content={val.Content1}
                      image={val.image}
                    />
                  ))}
                </Carousel>
              </Container>
            )}
          </MUI.BoxShowFeature>
        </MUI.BoxFeatureContainer>

        <MUI.BoxSignUpCard>
          <MUI.SignUpCardContainer maxWidth="lg" ref={ref2}>
            <MUI.SignUpCardLeftBox>
              <motion.h2
                variants={mapAnimation}
                initial="hidden"
                animate={inView2 ? "show" : "hidden"}
              >
                Sign up now for free
              </motion.h2>
              <motion.p
                variants={mapAnimation}
                initial="hidden"
                animate={inView2 ? "show" : "hidden"}
              >
                Get free 15GB permanant storage, upload up to 50 files at once
                no expired link, more features make your files more easy to
                managed
              </motion.p>
              <motion.div
                variants={mapAnimation}
                initial="hidden"
                animate={inView2 ? "show" : "hidden"}
              >
                <Button
                  variant="contained"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    background: "#ffffff",
                    border: "1px solid #ffffff",
                    color: "#17766B",
                    marginTop: "1.125rem",
                    fontWeight: "600",
                    "&:hover": {
                      border: "1px solid #17766B",
                      background: "#ffffff",
                      color: "#17766B",
                    },
                    [theme.breakpoints.down("sm")]: {
                      fontSize: "0.8rem",
                      fontWeight: 400,
                    },
                  }}
                  component={NavLink}
                  to="/auth/sign-up"
                >
                  Sign up
                </Button>
              </motion.div>
            </MUI.SignUpCardLeftBox>
            <MUI.SignUpCardRightBox>
              <img src={catImage} alt="" />
            </MUI.SignUpCardRightBox>
          </MUI.SignUpCardContainer>
        </MUI.BoxSignUpCard>

        <MUI.BoxNetworkContainer maxWidth="lg" ref={ref3}>
          <MUI.BoxNetworkHeader>
            <motion.b
              variants={mapAnimation}
              initial="hidden"
              animate={inView3 ? "show" : "hidden"}
            >
              Worldwide Data Server
            </motion.b>
            <motion.p
              variants={mapAnimation}
              initial="hidden"
              animate={inView3 ? "show" : "hidden"}
            >
              Fast file transfer from global data server. Make sure your
              downloads are always available and fast.
            </motion.p>
          </MUI.BoxNetworkHeader>

          <MUI.BoxShowNetworkMap>
            <motion.div
              variants={mapAnimation}
              initial="hidden"
              animate={inView3 ? "show" : "hidden"}
            >
              <img src={showMap} alt="" />
            </motion.div>
          </MUI.BoxShowNetworkMap>

          <MUI.BoxShowNetworkZone>
            <Grid
              container
              spacing={isMobile ? 2 : 2}
              sx={{
                textAlign: "start",
              }}
            >
              {serverZone?.map((val, index) => (
                <Grid
                  item
                  lg={4}
                  md={3}
                  sm={4}
                  xs={6}
                  key={index + 1}
                  sx={{
                    width: "50%",
                    paddingLeft: "1rem !important",
                    paddingTop: "1rem !important",

                    [theme.breakpoints.down("sm")]: {
                      paddingLeft: "0.66rem !important",
                      paddingTop: "0.68rem !important",
                    },
                  }}
                >
                  <motion.div
                    variants={mapAnimation}
                    initial="hidden"
                    animate={inView3 ? "show" : "hidden"}
                    style={{
                      border: "1px solid #DBDBDB",
                      borderRadius: "0.2rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "start",
                      padding: "0.5rem",
                    }}
                  >
                    <CheckCircleIcon
                      sx={{
                        color: "#17766B",
                        fontSize: "1.3rem",
                        [theme.breakpoints.down("sm")]: {
                          display: "none",
                        },
                      }}
                    />
                    &nbsp;&nbsp;
                    <Typography
                      sx={{
                        color: "#35B7A8",
                        fontSize: "0.9rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "start",
                        [theme.breakpoints.down("sm")]: {
                          fontSize: "0.8rem",
                        },
                      }}
                    >
                      {val.name}
                    </Typography>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </MUI.BoxShowNetworkZone>
        </MUI.BoxNetworkContainer>

        <MUI.BoxFeatureContainer maxWidth="lg" ref={ref4}>
          <MUI.BoxFeatureHeader>
            <Typography
              sx={{
                fontSize: "1.5rem",
                fontWeight: 600,
                [theme.breakpoints.down("sm")]: {
                  fontSize: "1rem",
                  fontWeight: 500,
                },
              }}
            >
              Features
            </Typography>
          </MUI.BoxFeatureHeader>
          <MUI.BoxShowFeature>
            {!isMobile && (
              <Grid container spacing={2}>
                {subFeatures?.map((val, index) => (
                  <Grid
                    item
                    lg={3}
                    md={4}
                    sm={6}
                    xs={12}
                    key={index}
                    sx={{
                      paddingLeft: "1rem !important",
                      paddingTop: "1rem !important",

                      [theme.breakpoints.down("sm")]: {
                        paddingLeft: "0.66rem !important",
                        paddingTop: "0.68rem !important",
                      },
                    }}
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{
                        opacity: inView4 ? 1 : 0,
                        scale: inView4 ? 1 : 0,
                      }}
                      exit={{ opacity: 0, scale: 0 }}
                      transition={{
                        delay: index * 0.2,
                        duration: 0.8,
                        ease: "easeOut",
                      }}
                    >
                      <Feature
                        title={val.title}
                        content={val.Content1}
                        image={val.image}
                      />
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            )}
            {isMobile && (
              <Container sx={{ width: "22rem" }} maxWidth="lg">
                <Carousel
                  showArrows={false}
                  showStatus={false}
                  showThumbs={false}
                  infiniteLoop={true}
                  autoPlay={true}
                  interval={3000}
                  transitionTime={800}
                  stopOnHover={true}
                >
                  {subFeatures?.map((val, index) => (
                    <Feature
                      key={index}
                      title={val.title}
                      content={val.Content1}
                      image={val.image}
                    />
                  ))}
                </Carousel>
              </Container>
            )}
          </MUI.BoxShowFeature>
          <MUI.BoxFeatureViewMore>
            <MUI.ButtonViewMore
              endIcon={<ArrowRightAltIcon />}
              sx={{
                fontSize: "1rem",
                fontWeight: 500,
                [theme.breakpoints.down("sm")]: {
                  fontSize: "0.8rem",
                  fontWeight: 400,
                },
              }}
            >
              View More
            </MUI.ButtonViewMore>
          </MUI.BoxFeatureViewMore>
        </MUI.BoxFeatureContainer>

        <MUI.FreeTrialContainer ref={ref5}>
          <motion.h2
            variants={mapAnimation}
            initial="hidden"
            animate={inView5 ? "show" : "hidden"}
          >
            Try us 14 days free trial
          </motion.h2>
          <motion.p
            variants={mapAnimation}
            initial="hidden"
            animate={inView5 ? "show" : "hidden"}
            style={{ marginTop: "0.5rem" }}
          >
            Get more space to make your work run more smoothly, premium
          </motion.p>
          <motion.p
            variants={mapAnimation}
            initial="hidden"
            animate={inView5 ? "show" : "hidden"}
          >
            feature make your files transfer more easier and safer
          </motion.p>
          <Button
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            sx={{
              background: "#17766B",
              color: "#ffffff",
              marginTop: "1.125rem",
              fontWeight: "600",
              "&:hover": {
                background: "#ffffff",
                color: "#17766B",
              },
              [theme.breakpoints.down("sm")]: {
                fontSize: "0.8rem",
                fontWeight: 400,
              },
            }}
            component={NavLink}
            to={`${ENV_KEYS.VITE_APP_URL_REDIRECT_CLIENT_PAGE}auth/sign-up`}
          >
            Register
          </Button>
        </MUI.FreeTrialContainer>

        <MUI.BoxFAQ className="faq-container" ref={ref6}>
          <MUI.BoxFAQContainer maxWidth="lg">
            <MUI.BoxFAQHeader>
              <motion.b
                variants={mapAnimation}
                initial="hidden"
                animate={inView6 ? "show" : "hidden"}
              >
                Frequently asked questions
              </motion.b>
              <motion.p
                variants={mapAnimation}
                initial="hidden"
                animate={inView6 ? "show" : "hidden"}
              >
                Have you can find frequently asked questions. We help you to
                find the answer!
              </motion.p>
            </MUI.BoxFAQHeader>
            <br />
            <MUI.BoxFAQAccordion>
              {faq?.map((val, index) => (
                <motion.div
                  variants={mapAnimation}
                  initial="hidden"
                  animate={inView6 ? "show" : "hidden"}
                  key={index}
                >
                  <FAQAccordion
                    question={he.decode(val?.question || "")}
                    answer={he.decode(val?.answer || "")}
                  />
                </motion.div>
              ))}
            </MUI.BoxFAQAccordion>
          </MUI.BoxFAQContainer>
          <img src={backgroundVector} alt="background-vector" />
        </MUI.BoxFAQ>

        <MUI.BoxContactUs ref={ref7}>
          <MUI.ContainerContactUs maxWidth="lg">
            <MUI.BoxContactUsHeader>
              <motion.h1
                variants={mapAnimation}
                initial="hidden"
                animate={inView7 ? "show" : "hidden"}
              >
                Contact Us
              </motion.h1>
              <motion.p
                variants={mapAnimation}
                initial="hidden"
                animate={inView7 ? "show" : "hidden"}
              >
                {"We'd love to hear from you"}
              </motion.p>
            </MUI.BoxContactUsHeader>
            <MUI.BoxShowContactForm onSubmit={handleSubmitContact}>
              <motion.div
                variants={mapAnimation}
                initial="hidden"
                animate={inView7 ? "show" : "hidden"}
              >
                <Grid container spacing={isMobile ? 2 : 6}>
                  <Grid
                    item
                    lg={6}
                    md={6}
                    sm={12}
                    xs={12}
                    sx={{
                      width: "100%",
                      paddingTop: "1rem !important",

                      [theme.breakpoints.down("sm")]: {
                        paddingTop: "0.68rem !important",
                      },
                    }}
                  >
                    <TextField
                      id="outlined-basic"
                      label="Name"
                      variant="outlined"
                      required
                      fullWidth
                      name="name"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      InputLabelProps={{
                        style: {
                          fontSize: "0.8rem",
                        },
                      }}
                    />
                  </Grid>
                  <Grid
                    item
                    lg={6}
                    md={6}
                    sm={12}
                    xs={12}
                    sx={{
                      width: "100%",
                      paddingTop: "1rem !important",

                      [theme.breakpoints.down("sm")]: {
                        paddingTop: "0.68rem !important",
                      },
                    }}
                  >
                    <TextField
                      id="outlined-basic"
                      label="Email"
                      variant="outlined"
                      required
                      fullWidth
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      InputLabelProps={{
                        style: {
                          fontSize: "0.8rem",
                        },
                      }}
                    />
                  </Grid>
                  <Grid
                    item
                    lg={12}
                    md={12}
                    sm={12}
                    xs={12}
                    sx={{
                      width: "100%",
                      paddingTop: "1rem !important",

                      [theme.breakpoints.down("sm")]: {
                        paddingTop: "0.68rem !important",
                      },
                    }}
                  >
                    <TextField
                      id="outlined-basic"
                      label="Message"
                      variant="outlined"
                      required
                      fullWidth
                      multiline
                      rows={4}
                      name="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      InputLabelProps={{
                        style: {
                          fontSize: "0.8rem",
                        },
                      }}
                    />
                  </Grid>
                </Grid>
                <MUI.BoxShowSendMessageBTN>
                  <MUI.ButtonSendMessage
                    startIcon={<TelegramIcon />}
                    variant="contained"
                    size="large"
                    type="submit"
                    sx={{
                      fontSize: "1rem",

                      [theme.breakpoints.down("sm")]: {
                        fontSize: "0.8rem",
                      },
                    }}
                  >
                    Send Message
                  </MUI.ButtonSendMessage>
                </MUI.BoxShowSendMessageBTN>
              </motion.div>
            </MUI.BoxShowContactForm>
          </MUI.ContainerContactUs>
        </MUI.BoxContactUs>
      </ThemeProvider>
    </React.Fragment>
  );
}
export default Home;
