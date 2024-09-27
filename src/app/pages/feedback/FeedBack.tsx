import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import * as MUI from "styles/presentation/feedback.style";

// components
import { useMutation } from "@apollo/client";

// material ui
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  Switch,
  SwitchProps,
  TextField,
  Typography,
  styled,
  // InputBase,
  useMediaQuery,
  createTheme,
} from "@mui/material";
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import Rating from "@mui/material/Rating";
import { alpha } from "@mui/system";
import { Editor } from "@tinymce/tinymce-react";
import { MUTATION_FEEDBACK } from "api/graphql/support.graphql";
import RatingComponent from "components/presentation/Rating";
import { ENV_KEYS } from "constants/env.constant";
import { rateData } from "constants/rate.constant";
import { Formik } from "formik";
import { errorMessage, successMessage } from "utils/alert.util";
import * as yup from "yup";

// InputBase
const BootstrapInput = styled(TextField)(({ theme }) => ({
  "label + &": {
    marginTop: theme.spacing(3),
  },
  "& .MuiInputBase-input": {
    borderRadius: 4,
    position: "relative",
    backgroundColor: theme.palette.mode === "light" ? "#F3F6F9" : "#1A2027",
    border: "1px solid",
    borderColor: theme.palette.mode === "light" ? "#E0E3E7" : "#2D3843",
    fontSize: 14,
    padding: "10px 12px",
    transition: theme.transitions.create([
      "border-color",
      "background-color",
      "box-shadow",
    ]),
    "&:focus": {
      boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
      borderColor: theme.palette.primary.main,
    },
  },
}));

const IOSSwitch = styled((props: SwitchProps) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: theme.palette.mode === "dark" ? "#2ECA45" : "#65C466",
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color:
        theme.palette.mode === "light"
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 22,
    height: 22,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));

function Feedback() {
  const navigate = useNavigate();
  const [designComment, setDesignComment] = React.useState("");
  const [performanceComment, setPerformanceComment] = React.useState("");
  const [serviceComment, setServiceComment] = React.useState("");
  const [isAnonymous, setIsAnonymous] = React.useState(false);
  const [isChecked, setIsChecked] = React.useState(false);
  const [rating, setRating] = React.useState<number | null>(0);
  const [designRating, setDesignRating] = React.useState(0);
  const [serviceRating, setServiceRating] = React.useState(0);
  const [performanceRating, setPerformanceRating] = React.useState(0);

  const theme = createTheme();

  const editorRef = useRef<any>(null);
  const isMobile = useMediaQuery("(max-width:600px)");
  const [switchStatus, setSwitchStatus] = React.useState(false);
  const [feedbackCreation] = useMutation(MUTATION_FEEDBACK);

  const validateSchema = yup.object().shape({
    firstname: !isAnonymous
      ? yup.string().required("First name is required")
      : yup.mixed().nullable().oneOf([null]),
    lastname: !isAnonymous
      ? yup.string().required("Last name is required")
      : yup.mixed().nullable().oneOf([null]),
    email: !isAnonymous
      ? yup.string().email("The email is invalid").required("Email is required")
      : yup.mixed().nullable().oneOf([null]),
  });

  const handleSwitchChange = () => {
    setSwitchStatus(!switchStatus);
    setIsAnonymous(!isAnonymous);
  };

  const handleGobackToPrevious = () => {
    navigate(-1);
  };

  const handleGetRating = (value, index) => {
    switch (index) {
      case 0:
        setPerformanceRating(value);
        break;
      case 1:
        setDesignRating(value);
        break;
      case 2:
        setServiceRating(value);
        break;
      default:
        break;
    }
  };

  const handleGetComment = (value, index) => {
    switch (index) {
      case 0:
        setPerformanceComment(value);
        break;
      case 1:
        setDesignComment(value);
        break;
      case 2:
        setServiceComment(value);
        break;
      default:
        break;
    }
  };

  const handleSubmitFeedback = async (values, { resetForm }) => {
    if (!isChecked) {
      errorMessage("Please I am happy to share my email for...", 2000);
    } else {
      try {
        const createFeedback = await feedbackCreation({
          variables: {
            input: {
              email: isAnonymous ? "" : values.email,
              firstName: isAnonymous ? "" : values.firstname,
              lastName: isAnonymous ? "" : values.lastname,
              comment: editorRef.current.getContent(),
              rating: rating?.toString() || "",
              designComment: designComment,
              designRating: designRating.toString(),
              performanceComment: performanceComment,
              performanceRating: performanceRating.toString(),
              serviceComment: serviceComment,
              serviceRating: serviceRating.toString(),
              source: "Feedback",
              score: 100,
              isAnonymous: isAnonymous ? 1 : 0,
            },
          },
        });
        if (createFeedback?.data?.createFeedback?._id) {
          editorRef.current.value = "";
          resetForm();
          successMessage("Submit success! Thank you so much!", 3000);
        }
      } catch (err) {
        errorMessage("Something went wrong, please try again" + err, 2000);
      }
    }
  };

  return (
    <MUI.FeedbackContainer sx={{ padding: "1.5rem 0", marginTop: "5rem" }}>
      <Formik
        initialValues={{
          firstname: "",
          lastname: "",
          email: "",
        }}
        validationSchema={validateSchema}
        onSubmit={handleSubmitFeedback}
      >
        {({ errors, touched, values, handleChange, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Card sx={{ padding: isMobile ? "0.5rem" : "1rem 1.5rem" }}>
              {!switchStatus ? (
                <>
                  <MUI.NotificationDiv>
                    <Typography
                      variant="h2"
                      sx={{
                        fontWeight: 500,
                        color: "#167268",
                        fontSize: "1rem",
                      }}
                    >
                      Submit your fullname and email to get up 100 points
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 500,
                        color: "#167268",
                        fontSize: "0.8rem",
                      }}
                    >
                      Your account will be created automatically. Please check
                      your password in your email
                    </Typography>
                  </MUI.NotificationDiv>

                  <Grid container spacing={4}>
                    <Grid item xs={12} md={6} lg={6}>
                      <Grid container spacing={2}>
                        {/* first name */}
                        <Grid item xs={12} md={6} lg={6}>
                          <label
                            htmlFor="bootstrap-input"
                            style={{
                              fontSize: isMobile ? "12px" : "14px",
                              color: "#5D596C",
                            }}
                          >
                            Firstname
                          </label>
                          <FormControl variant="standard" fullWidth>
                            <BootstrapInput
                              id="bootstrap-input"
                              name="firstname"
                              placeholder="Enter your firstname"
                              sx={{
                                "&::placeholder": {
                                  fontSize: "12px",
                                  color: "red",
                                },
                              }}
                              fullWidth={true}
                              error={Boolean(
                                touched.firstname && errors.firstname,
                              )}
                              helperText={touched.firstname && errors.firstname}
                              value={values.firstname}
                              onChange={handleChange}
                              // value={firstName}
                              // onChange={(e) => setFirstName(e.target.value)}
                            />
                          </FormControl>
                        </Grid>

                        {/* last name */}
                        <Grid item xs={12} md={6} lg={6}>
                          <label
                            htmlFor="bootstrap-input"
                            style={{
                              fontSize: isMobile ? "12px" : "14px",
                              color: "#5D596C",
                            }}
                          >
                            Lastname
                          </label>
                          <FormControl variant="standard" fullWidth>
                            <BootstrapInput
                              id="bootstrap-input"
                              name="lastname"
                              placeholder="Enter your lastname"
                              sx={{
                                ".placeholder": {
                                  fontSize: "10px !important",
                                  color: "red !important",
                                },
                              }}
                              fullWidth={true}
                              error={Boolean(
                                touched.lastname && errors.lastname,
                              )}
                              helperText={touched.lastname && errors.lastname}
                              value={values.lastname}
                              onChange={handleChange}
                              // value={lastName}
                              // onChange={(e) => setlastName(e.target.value)}
                            />
                          </FormControl>
                        </Grid>
                      </Grid>
                    </Grid>

                    {/* email */}
                    <Grid item xs={12} md={6} lg={6}>
                      <label
                        htmlFor="bootstrap-input"
                        style={{
                          fontSize: isMobile ? "12px" : "14px",
                          color: "#5D596C",
                        }}
                      >
                        Email
                      </label>
                      <FormControl variant="standard" fullWidth>
                        <BootstrapInput
                          id="bootstrap-input"
                          name="email"
                          placeholder="Enter your email address..."
                          fullWidth={true}
                          error={Boolean(touched.email && errors.email)}
                          helperText={touched.email && errors.email}
                          value={values.email}
                          onChange={handleChange}
                          // value={email}
                          // onChange={(e) => setEmail(e.target.value)}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </>
              ) : (
                ""
              )}
              <FormControlLabel
                control={
                  <IOSSwitch
                    sx={{ m: 1 }}
                    checked={switchStatus}
                    onChange={handleSwitchChange}
                  />
                }
                label="Leave your review anonymously"
                sx={{ margin: "1rem 0.5rem" }}
              />
            </Card>
            <Card
              sx={{
                margin: "1rem 0",
                padding: isMobile ? "0.5rem" : "1rem 1.5rem",
              }}
            >
              <Box sx={{ textAlign: "center", margin: "1.5rem 0" }}>
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: "1.1rem",
                    fontWeight: 500,
                    padding: "0.5rem 0",
                    textAlign: "left",

                    [theme.breakpoints.down("sm")]: {
                      fontSize: "0.9rem",
                      textAlign: "center",
                    },
                  }}
                >
                  How do you rate your experience with Vshare?
                </Typography>
                <br />
                <Rating
                  name="half-rating"
                  defaultValue={0}
                  precision={0.5}
                  sx={{ color: "#17766B", fontSize: "35px" }}
                  value={rating}
                  onChange={(_e, value) => {
                    setRating(value);
                  }}
                />
              </Box>
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <Editor
                    // ref={editorRef}
                    apiKey={ENV_KEYS.VITE_APP_TINYMCE}
                    onInit={(_evt, editor) => {
                      editorRef.current = editor;
                    }}
                    init={{
                      height: isMobile ? 200 : 500,
                      menubar: false,
                      plugins: [
                        "advlist",
                        "autolink",
                        "lists",
                        "link",
                        "image",
                        "charmap",
                        "preview",
                        "anchor",
                        "searchreplace",
                        "visualblocks",
                        "autoresize",
                      ],
                      toolbar:
                        "insertfile undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent image",
                      content_style:
                        "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                      image_uploadtab: true,
                      file_picker_callback: function (callback) {
                        const input = document.createElement("input");
                        input.type = "file";
                        input.accept = "image/*";
                        input.onchange = function () {
                          if (input.files && input.files.length > 0) {
                            const file = input.files[0];
                            const reader = new FileReader();
                            reader.onload = function () {
                              if (typeof reader.result === "string") {
                                callback(reader.result, { title: file.name });
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        };
                        input.click();
                      },
                    }}
                  />
                </Grid>
              </Grid>
              <Box sx={{ margin: "2rem 0" }}>
                {rateData?.map((val, index) => (
                  <RatingComponent
                    handleGetRating={(data) => handleGetRating(data, index)}
                    handleGetComment={(data) => handleGetComment(data, index)}
                    question={val?.question}
                    key={index}
                  />
                ))}
              </Box>
              <MUI.AgreeDiv>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={isChecked}
                        onChange={(e) => setIsChecked(e.target.checked)}
                      />
                    }
                    sx={{ color: "#6F6B7D" }}
                    label="I am happy to share my email for future communication related to my feedback"
                  />
                </FormGroup>
              </MUI.AgreeDiv>
              <MUI.ActionDiv>
                <Button
                  variant="contained"
                  type="submit"
                  // onClick={handleSubmitFeedback}
                >
                  Submit feedback
                </Button>
                <Button
                  variant="contained"
                  type="button"
                  sx={{
                    background: "#F6F6F7",
                    color: "#C6C8CA",
                    marginLeft: "2rem",
                    "&:hover": {
                      background: "#F6F6F7",
                      color: "#C6C8CA",
                    },
                  }}
                  onClick={handleGobackToPrevious}
                >
                  Cancel
                </Button>
              </MUI.ActionDiv>
            </Card>
          </form>
        )}
      </Formik>
    </MUI.FeedbackContainer>
  );
}

export default Feedback;
