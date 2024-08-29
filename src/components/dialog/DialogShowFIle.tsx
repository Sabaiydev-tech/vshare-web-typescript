import { Delete, Upload } from "@mui/icons-material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DownloadDoneIcon from "@mui/icons-material/DownloadDone";
import EmailIcon from "@mui/icons-material/Email";
import FacebookIcon from "@mui/icons-material/Facebook";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import TelegramIcon from "@mui/icons-material/Telegram";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import Button, { ButtonProps } from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { createTheme } from "@mui/material/styles";
import imageIcon from "assets/images/logo.png";
import axios from "axios";
import * as htmlToImage from "html-to-image";
import { customAlphabet } from "nanoid";
import PropTypes from "prop-types";
import QRCode from "qrcode.react";
import * as React from "react";
import { Fragment, useEffect, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import * as MUI from "styles/presentation/showFileDialog.style";
import { UAParser } from "ua-parser-js";
// react animate component

import { useMutation } from "@apollo/client";
import {
  Box,
  CircularProgress,
  FormControl,
  MenuItem,
  Select,
  styled,
  useMediaQuery,
} from "@mui/material";
import { CREATE_FILE_PUBLIC } from "api/graphql/file.graphql";
import { ENV_KEYS } from "constants/env.constant";
import CopyToClipboard from "react-copy-to-clipboard";
import { FileIcon, defaultStyles } from "react-file-icon";
import { Id } from "types";
import { errorMessage, successMessage } from "utils/alert.util";
import { cutFileName, getFileType } from "utils/file.util";
import { convertBytetoMBandGB } from "utils/storage.util";
import { encryptDownloadData } from "utils/secure.util";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

type BootStrapDialogTitleProps = {
  children: React.ReactNode;
  onClose: (...args: any[]) => any;
};

function BootstrapDialogTitle(props: BootStrapDialogTitleProps) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

type CustomizedDialogProps = {
  open: boolean;
  files: any[];
  dataFile: any[];
  isFileDrop: boolean;
  onDeleteData: (id: Id) => void;
  onRemoveAll: () => void;
  selectMore: ButtonProps;
  openModal: boolean;
  checkSend: (...args: any[]) => void;
  onClose: (...args: any[]) => void;
  dataPasswordLink: any;
  dataSubPasswordLink: any;
  dataUploadPerDay: any;
  dataUploadPerTime: any;
  dataMaxSize: any;
  dataExpire: any;
  dataExpires: any;
};

export default function DialogShowFIle(props: CustomizedDialogProps) {
  const {
    open,
    files,
    onDeleteData,
    selectMore,
    onRemoveAll,
    dataFile,
    openModal,
    checkSend,
    dataPasswordLink,
    dataSubPasswordLink,
    dataUploadPerDay,
    dataUploadPerTime,
    dataMaxSize,
    dataExpire,
    dataExpires,
  } = props;
  const theme = createTheme();
  const [createFilePublic] = useMutation(CREATE_FILE_PUBLIC);
  const [_fileData, setFileData] = useState(files);
  const [primaryLock, setPrimaryLock] = useState(false);
  const [mainPassword, setMainPassword] = useState("");

  const [expired, setExpired] = useState({
    title: "auto",
    action: "3",
    productKey: "AEADEFO",
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isDone, setIsDone] = useState(0);
  const [isDialogQRCodeOpen, setIsDialogQRCodeOpen] = useState(false);
  const [numUploadedFiles, _setNumUploadedFiles] = useState(0);
  const [fileMaxSize, setFileMaxSize] = useState("");
  const [uploadSpeed, setUploadSpeed] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);
  const [checkUpload, setCheckUpload] = useState(false);
  const isRunningRef = React.useRef(true);
  // const [passwordCopied, setPasswordCompied] = useState(false);
  const [hidePasswordLink, setHidePasswordLink] = useState(true);
  const [hideSubPasswordLink, setHideSubPasswordLink] = useState(true);
  const [information, setInformation] = useState<any[]>();
  const [country, setCountry] = useState("");
  const ref = React.useRef<HTMLElement | null>();
  let link = null;
  window.location.protocol === "http:"
    ? (link = ENV_KEYS.VITE_APP_DOWNLOAD_URL_SERVER)
    : (link = ENV_KEYS.VITE_APP_DOWNLOAD_URL_SERVER);
  const LOAD_GET_IP_URL = ENV_KEYS.VITE_APP_LOAD_GETIP_URL;
  const LOAD_UPLOAD_URL = ENV_KEYS.VITE_APP_LOAD_UPLOAD_URL;

  const [value, setValue] = useState<string | null>(link);
  const [copied, setCopied] = useState(false);
  const [uploadStatus, setUploadStatus] = useState({});
  const UA = new UAParser();
  const result = UA.getResult();

  const autoProductKey = "AEADEFO";

  function handleCopy() {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 15000);
  }

  useEffect(() => {
    if (dataExpire) {
      setExpired({
        title: dataExpire?.title,
        action: dataExpire?.action,
        productKey: dataExpire?.productKey,
      });
    }
  }, [dataExpire]);

  useEffect(() => {
    // if (!!dataUploadPerDay) {
    // }
  }, [dataUploadPerDay]);

  useEffect(() => {
    if (dataPasswordLink?.status === "on") {
      setHidePasswordLink(false);
    }
  }, [dataPasswordLink]);

  useEffect(() => {
    const maxSize = convertBytetoMBandGB(dataMaxSize?.action);
    setFileMaxSize(maxSize);
  }, [dataMaxSize]);

  useEffect(() => {
    if (dataSubPasswordLink?.status === "on") {
      setHideSubPasswordLink(false);
    }
  }, [dataSubPasswordLink]);

  useEffect(() => {
    if (openModal === false || openModal === true) {
      setIsUploading(false);
    }
  }, [openModal]);

  useEffect(() => {
    setFileData(files);
  }, [files]);

  useEffect(() => {
    const fetchIPAddress = async () => {
      try {
        setCountry("other");
        // const responseIp = await axios.get(LOAD_GET_IP_URL);
        // const ip = responseIp?.data;
        // if (ip) {
        //   const res = await axios.get(
        //     `https://pro.ip-api.com/json/${ip}?key=x0TWf62F7ukWWpQ`,
        //   );
        //   if (res) {
        //     setCountry(res?.data?.countryCode);
        //   }
        // }
      } catch (error) {
        setCountry("other");
      }
    };
    fetchIPAddress();
  }, []);

  const _functionResetValue = async () => {
    setIsDone(1);
    setFileData([]);
    checkSend([]);
  };

  const filesArray = files?.map((obj: any) => {
    return {
      id: obj.file.id,
      path: obj.file.path,
      lastModified: obj.file.lastModified,
      lastModifiedDate: obj.file.lastModifiedDate,
      name: obj.file.name,
      size: obj.file.sizeFile,
      type: obj.file.type,
      webkitRelativePath: obj.file.webkitRelativePath,
      password: "",
      URLpassword: "",
      expired: "",
    };
  });

  const dataSizeAll = filesArray.reduce((total: number, obj: any) => {
    return total + obj.size;
  }, 0);

  const [childLock, setChildLock] = useState(
    filesArray.reduce((obj: any, item: any) => {
      obj[item.id] = false;
      return obj;
    }, {}),
  );

  const [passwords, setPasswords] = useState<{ [key: string]: any }>({
    d: "",
  });

  const primaryLockHandler = () => {
    if (primaryLock) {
      setPasswords((prevPasswords) => {
        const { ...restPasswords } = prevPasswords;
        return restPasswords;
      });
      setMainPassword("");
    } else {
      if (!passwords["special"]) {
        generateMainPassword("special");
      }
    }
    setPrimaryLock(!primaryLock);
  };

  const childLockHandler = (id: Id) => {
    setChildLock((prevLocks) => ({
      ...prevLocks,
      [id]: !prevLocks[id],
    }));
  };

  // generate password here
  const generateMainPassword = (id: Id) => {
    const length = 8;
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setPasswords((prevPasswords) => ({ ...prevPasswords, [id]: password }));
    setMainPassword(password);
  };

  const generatePassword = (id: number | string) => {
    const length = 8;
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    handlePasswordChange(id, password);
    setPasswords((prevPasswords: any) => {
      const newPasswords = { ...prevPasswords };
      if (newPasswords[id]) {
        delete newPasswords[id];
      }
      newPasswords[id] = password;
      return newPasswords;
    });
  };

  const handleButtonClick = (id: number | string) => {
    const passwordExists = Object.prototype.hasOwnProperty.call(passwords, id);
    if (passwordExists) {
      setPasswords((prevPasswords) => {
        const newPasswords = { ...prevPasswords };
        delete newPasswords[id];
        return newPasswords;
      });
    } else {
      generatePassword(id);
    }
  };

  const handlePasswordChange = (id: Id, password: string) => {
    setPasswords((prevState) => {
      return {
        ...prevState,
        [id]: password,
      };
    });
  };

  // send back the id for delete unneeded file
  const handleGetBackId = (id: Id) => {
    onDeleteData(id);
  };

  const handleCloseModal = () => {
    setIsUploading(true);
    setIsDialogQRCodeOpen(false);
    _functionResetValue();
    onRemoveAll();
  };

  const handlePrepareToUpload = () => {
    const uploadPerTime = dataUploadPerTime?.action || 0;
    if (filesArray?.length > parseInt(uploadPerTime)) {
      errorMessage(`Upload file per time only ${uploadPerTime} files`, 3000);
      return;
    }

    const passwordArr: any[] = [];
    passwordArr.push(passwords);
    const mergedArray = filesArray.map((item: any) => {
      const password =
        passwordArr[0] &&
        Object.prototype.hasOwnProperty.call(passwordArr[0], item.id)
          ? passwordArr[0][item.id]
          : "";
      item.password = password;
      item.URLpassword = mainPassword;
      item.expired = expired;
      return item;
    });
    setInformation(mergedArray);
    setIsUploading(true);
    handleUpload(mergedArray);
    // handleUploadV1(mergedArray);
    setIsDialogQRCodeOpen(true);
  };

  const handleUpload = async (files: any[]) => {
    const totalFile = files?.length;
    const totalSize = dataFile.reduce((acc, file) => acc + file.size, 0);
    let uploadedSize = 0;
    let currentUploadPercentage: number | string = 0;
    let getUrlAllWhenReturn: any = [];

    try {
      const responseIp = await axios.get(LOAD_GET_IP_URL);
      const alphabet =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
      const nanoid = customAlphabet(alphabet, 6);
      const generateID = nanoid();
      const urlAllFile = generateID;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!isRunningRef.current) {
          break;
        }
        let newNameFile: number | string = Math.floor(
          1111111111 + Math.random() * 999999,
        );
        const cutFilename = file?.name?.split(".");
        const extension = cutFilename.pop();
        newNameFile = `${newNameFile}.${extension}`;
        const newData = {
          name: file.name || "",
          lastModified: file.lastModified || "",
          lastModifiedDate: file?.lastModifiedDate || "",
          size: file.size || "",
          type: file.type || "",
          webkitRelativePath: file.webkitRelativePath || "",
        };
        const blob = new Blob([dataFile[i]], {
          type: newData.type,
        });

        const newFile = new File([blob], file.name, { type: newData.type });
        const { data: _createFilePublic } = await createFilePublic({
          variables: {
            data: {
              checkFile: "main",
              fileExpired: [
                {
                  typeDate: expired.title,
                  amount: parseInt(expired.action),
                },
              ],
              filePassword: file?.password,
              fileType: file?.type,
              filename: String(`${file?.name}`),
              ip: String(responseIp?.data),
              newFilename: String(newNameFile),
              passwordUrlAll: file?.URLpassword,
              size: String(file?.size),
              totalUploadFile: totalFile,
              urlAll: String(urlAllFile),
              createdBy: 0,
              device: result.os.name || "" + result.os.version || "",
              country: country,
            },
          },
        });

        getUrlAllWhenReturn = _createFilePublic.createFilesPublic;
        if (_createFilePublic) {
          try {
            const formData = new FormData();
            formData.append("file", newFile);

            let initialUploadSpeedCalculated = false;
            const startTime = new Date().getTime();
            const headers = {
              PATH: "public",
              FILENAME: newNameFile,
              createdBy: "0",
            };

            const encryptedData = encryptDownloadData(headers);
            const response = await axios.post(LOAD_UPLOAD_URL, formData, {
              headers: {
                "Content-Type": "multipart/form-data",
                encryptedHeaders: encryptedData,
              },
              onUploadProgress: (progressEvent: any) => {
                const currentFileUploadedSize =
                  (progressEvent.loaded * dataFile[i].size) /
                    progressEvent.total || 0;
                currentUploadPercentage = (
                  ((uploadedSize + currentFileUploadedSize) / totalSize) *
                  100
                ).toFixed(0);
                setOverallProgress(parseInt(currentUploadPercentage));

                const currentTime = new Date().getTime();
                const elapsedTime = (currentTime - startTime) / 1000;
                if (!initialUploadSpeedCalculated && elapsedTime > 0) {
                  const initialUploadSpeed = (
                    progressEvent.loaded /
                    1024 /
                    elapsedTime
                  ).toFixed(2);
                  setUploadSpeed(parseInt(initialUploadSpeed));
                  initialUploadSpeedCalculated = true;
                }
                if (elapsedTime > 1) {
                  const uploadSpeed = (
                    progressEvent.loaded /
                    1024 /
                    elapsedTime
                  ).toFixed(2);
                  setUploadSpeed(parseInt(uploadSpeed));
                }
              },
            });
            if (response?.status == 200) {
              uploadedSize += dataFile[i].size;
              setUploadStatus((prevStatus) => ({
                ...prevStatus,
                [i]: true,
              }));
            }
          } catch (error) {
            errorMessage("Error uploading file. Please try againn later", 3000);
          }
        } else {
          isRunningRef.current = false;
          break;
        }
      }
      setIsDone(1);
      setValue(`${value}${getUrlAllWhenReturn?.urlAll}`);
      setCheckUpload(true);
      successMessage("Upload successful!!", 3000);
    } catch (error: any) {
      const cutError = error.message?.replace(/(ApolloError: )?Error: /, "");
      const fileUploadSize = dataMaxSize?.action?.split(".")[0];
      if (
        cutError ===
        `This IP address has already saved ${dataUploadPerDay?.action} files today`
      ) {
        errorMessage(
          `You have uploaded more than ${dataUploadPerDay?.action} files per day!`,
          10000,
        );
        handleCloseModal();
      } else if (
        cutError ===
        "THIS_IP_ADDRESS_HAS_ALREADY_SAVED ຈຳນວນໄຟລທີ່ກຳນົດໃນລະບົບ FILES_TODAY"
      ) {
        errorMessage("You have uploaded more than 20 GB per day!", 10000);
        handleCloseModal();
      } else if (
        cutError ===
        `THE_SIZE_OF_THIS_FILE_IS_GREATER_THAN ${fileUploadSize} GB`
      ) {
        errorMessage(`The file size is bigger than ${fileMaxSize}`, 10000);
        handleCloseModal();
      } else {
        const cutDataError = error.message?.replace(
          /(ApolloError: )?Error: /,
          "",
        );
        errorMessage(cutDataError || "", 10000);
        handleCloseModal();
      }
    }
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
    const url = value;
    const subject = "Vshare free file hosting";
    const body = `Link file share is: ${url}`;
    const mailtoUrl = `https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=&su=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl, "_blank");
  };

  const _shareWhatsapp = async () => {
    const url = value;
    const encodedUrl = encodeURIComponent(url as string);
    const whatsappUrl = `https://web.whatsapp.com/send?text=${encodedUrl}`;
    window.open(whatsappUrl, "_blank");
  };

  const _shareFacebook = async () => {
    const url = value;
    const encodedUrl = encodeURIComponent(url as string);
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    window.open(facebookUrl, "_blank");
  };

  const _shareTelegrame = async () => {
    const url = value;
    const encodedUrl = encodeURIComponent(url as string);
    const telegramUrl = `https://t.me/share/url?url=${encodedUrl}`;
    window.open(telegramUrl, "_blank");
  };

  const handleCloseAndDeleteFile = async () => {
    isRunningRef.current = false;
  };

  const downloadPasswordAsImage = () => {
    const element = ref.current;
    const style = `
    font-size: 18px;
    background-color: white;
    color: black;
    padding: 2rem;
    width:255px;
    height:250px
  `;
    if (element) {
      element.style.cssText = style;
      htmlToImage.toPng(element).then((dataUrl) => {
        const link = document.createElement("a");
        link.download = "my-passwords.png";
        link.href = dataUrl;
        link.click();
      });
    }
  };

  const isMobile = useMediaQuery("(max-width: 600px)");

  useEffect(() => {
    if (copied) {
      successMessage("Copied download link", 3000);
    }
  }, [copied]);
  return (
    <Fragment>
      {!isUploading ? (
        <BootstrapDialog
          aria-labelledby="customized-dialog-title"
          open={open}
          sx={{ padding: "0" }}
          maxWidth="xl"
        >
          <BootstrapDialogTitle onClose={handleCloseModal}>
            <MUI.BoxUploadTitle>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "start",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                <Typography>Upload files</Typography>
                <Typography
                  sx={{
                    fontSize: "0.7rem !important",
                    fontWeight: 300,
                  }}
                >
                  Max file size 10GB/file available for unlimited time
                </Typography>
              </Box>
            </MUI.BoxUploadTitle>
          </BootstrapDialogTitle>
          <DialogContent dividers>
            <MUI.BoxLimitTimeAndLock sx={{ padding: "0.8rem" }}>
              <MUI.BoxLimitTime
                sx={{ width: hidePasswordLink ? "50%" : "100%" }}
              >
                <Typography component="span">Auto delete file</Typography>
                <FormControl fullWidth>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    sx={{
                      width: "95%",
                      borderRadius: "20px",
                      fontSize: "0.8rem",
                    }}
                    size="small"
                    value={expired?.productKey}
                    onChange={(e) => {
                      const dataExp = dataExpires?.find(
                        (exp: any) => exp?.productKey === e.target.value,
                      );

                      if (dataExp) {
                        setExpired({
                          title: dataExp.title,
                          productKey: dataExp.productKey,
                          action: dataExp.action,
                        });
                      }
                    }}
                    fullWidth
                    variant="standard"
                  >
                    {dataExpires?.map((data: any, index: number) => {
                      return (
                        <MenuItem key={index} value={data?.productKey}>
                          <Fragment>
                            {data?.productKey === autoProductKey ? (
                              "Auto delete"
                            ) : (
                              <Fragment>
                                {data?.action} {data?.title}
                              </Fragment>
                            )}
                          </Fragment>
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </MUI.BoxLimitTime>

              {/* Gen password link */}
              {hidePasswordLink && (
                <MUI.BoxDownloadLinkPassword>
                  <Typography component="span">
                    <AttachFileIcon
                      sx={{ fontSize: "14px", color: "#17766B" }}
                    />
                    &nbsp;Link password
                  </Typography>
                  <MUI.BoxTextFieldAndLockIcon>
                    <MUI.textFieldViewLink
                      id="special-input"
                      variant="standard"
                      size="small"
                      value={passwords["special"] || ""}
                      InputProps={{
                        sx: {
                          fontSize: "0.8rem",
                        },
                      }}
                    />
                    {primaryLock ? (
                      <LockIcon
                        sx={{
                          color: "#17766B",
                          cursor: "pointer",
                          fontSize: "1.2rem",
                        }}
                        onClick={primaryLockHandler}
                      />
                    ) : (
                      <LockOpenIcon
                        sx={{ cursor: "pointer", fontSize: "1.2rem" }}
                        onClick={primaryLockHandler}
                      />
                    )}
                  </MUI.BoxTextFieldAndLockIcon>
                </MUI.BoxDownloadLinkPassword>
              )}
            </MUI.BoxLimitTimeAndLock>
            <MUI.BoxNumberOfSelectedFile sx={{ padding: "0rem 0.8rem" }}>
              <strong style={{ fontSize: "0.8rem" }}>
                Your {filesArray?.length} files are ready to upload
              </strong>
            </MUI.BoxNumberOfSelectedFile>
            {filesArray?.map((item, index) => (
              <MUI.BoxShowFiles sx={{ padding: "0.3rem 0.7rem" }} key={index}>
                <MUI.BoxShowFileDetail>
                  {!passwords[item.id] ? (
                    !isMobile && (
                      <MUI.BoxShowFileName>
                        <MUI.BoxShowFileIcon>
                          <FileIcon
                            extension={getFileType(item.name)}
                            {...defaultStyles[getFileType(item.name) as any]}
                          />
                        </MUI.BoxShowFileIcon>
                        &nbsp;&nbsp;&nbsp;
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "start",
                            justifyContent: "start",
                            flexDirection: "column",
                            [theme.breakpoints.down("sm")]: {
                              marginLeft: "0",
                              alignItems: "center",
                              justifyContent: "center",
                              flexDirection: "row",
                            },
                          }}
                        >
                          <Typography sx={{ fontSize: "0.8rem !important" }}>
                            {cutFileName(item.name, 10)}
                          </Typography>
                          <Typography sx={{ fontSize: "0.7rem !important" }}>
                            ({convertBytetoMBandGB(item.size)})
                          </Typography>
                        </Box>
                      </MUI.BoxShowFileName>
                    )
                  ) : isMobile ? (
                    <MUI.BoxShowFileName>
                      <MUI.BoxShowFileIcon>
                        <FileIcon
                          extension={getFileType(item.name)}
                          {...defaultStyles[getFileType(item.name) as any]}
                        />
                      </MUI.BoxShowFileIcon>
                      &nbsp;&nbsp;
                      <Typography
                        sx={{
                          fontSize: "0.8rem !important",
                        }}
                      >
                        {cutFileName(item.name, 10)}
                      </Typography>
                      &nbsp;
                      <Typography
                        sx={{
                          fontSize: "0.7rem !important",
                          color: "#17766B",
                        }}
                      >
                        ({convertBytetoMBandGB(item.size)})
                      </Typography>
                    </MUI.BoxShowFileName>
                  ) : (
                    <MUI.BoxShowFileName>
                      <MUI.BoxShowFileIcon>
                        <FileIcon
                          extension={getFileType(item.name)}
                          {...defaultStyles[getFileType(item.name) as any]}
                        />
                      </MUI.BoxShowFileIcon>
                      &nbsp;&nbsp;&nbsp;
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "start",
                          justifyContent: "start",
                          flexDirection: "column",
                          [theme.breakpoints.down("sm")]: {
                            marginLeft: "0",
                            alignItems: "center",
                            justifyContent: "center",
                            // flexDirection: "row",
                          },
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "0.8rem !important",
                          }}
                        >
                          {cutFileName(item.name, 10)}
                        </Typography>
                        <Typography sx={{ fontSize: "0.7rem !important" }}>
                          ({convertBytetoMBandGB(item.size)})
                        </Typography>
                      </Box>
                    </MUI.BoxShowFileName>
                  )}
                </MUI.BoxShowFileDetail>

                <MUI.BoxShowLockFile>
                  {passwords[item.id] ? (
                    <MUI.textFieldLockSingleFile
                      id="standard-basic"
                      variant="standard"
                      size="small"
                      value={passwords[item.id] || ""}
                      InputProps={{
                        sx: {
                          fontSize: "0.8rem",
                        },
                      }}
                      onChange={() =>
                        handlePasswordChange(item.id, passwords[item.id] || "")
                      }
                    />
                  ) : isMobile ? (
                    <MUI.BoxShowFileName
                      style={{
                        width: "80%",
                      }}
                    >
                      <MUI.BoxShowFileIcon>
                        <FileIcon
                          extension={getFileType(item.name)}
                          {...defaultStyles[getFileType(item.name) as any]}
                        />
                      </MUI.BoxShowFileIcon>
                      &nbsp;
                      <Box
                        sx={{
                          [theme.breakpoints.down("sm")]: {
                            display: "flex",
                            alignItems: "start",
                            justifyContent: "start",
                            flexDirection: "column",
                          },
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "0.8rem",
                          }}
                        >
                          {cutFileName(item.name, 10)}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "0.7rem",
                            color: "#17766B",
                          }}
                        >
                          ({convertBytetoMBandGB(item.size)})
                        </Typography>
                      </Box>
                    </MUI.BoxShowFileName>
                  ) : (
                    <div style={{ width: "100px" }}></div>
                  )}
                  {/* Gen key */}
                  {hideSubPasswordLink && (
                    <IconButton
                      onClick={() => {
                        handleButtonClick(item.id);
                        childLockHandler(item.id);
                      }}
                    >
                      {childLock[item.id] ? (
                        <LockIcon
                          sx={{ color: "#17766B", fontSize: "1.2rem" }}
                        />
                      ) : (
                        <LockOpenIcon sx={{ fontSize: "1.2rem" }} />
                      )}
                    </IconButton>
                  )}
                  <IconButton onClick={() => handleGetBackId(item.id - 1)}>
                    <Delete sx={{ fontSize: "1.2rem" }} />
                  </IconButton>
                </MUI.BoxShowLockFile>
              </MUI.BoxShowFiles>
            ))}

            <MUI.BoxUploadAndReset sx={{ padding: "0.2rem 0.8rem" }}>
              <Button
                startIcon={<Upload />}
                autoFocus
                sx={{
                  color: "#17766B",
                  fontSize: "0.75rem",
                }}
                {...selectMore}
                size="small"
              >
                Select More
              </Button>
              &nbsp;&nbsp; &nbsp;&nbsp;
              <Button
                startIcon={<RestartAltIcon />}
                autoFocus
                sx={{
                  fontSize: "0.75rem",
                  color: "#000000",
                }}
                onClick={onRemoveAll}
                size="small"
              >
                Reset
              </Button>
            </MUI.BoxUploadAndReset>
          </DialogContent>
          <DialogActions
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Button
              startIcon={<Upload />}
              autoFocus
              sx={{
                background: "#17766B",
                color: "#ffffff",
                fontSize: "14px",
                padding: "2px 30px",
                borderRadius: "6px",
                border: "1px solid #17766B",
                "&:hover": { border: "1px solid #17766B", color: "#17766B" },
                margin: "1rem 0",
              }}
              onClick={() => {
                handlePrepareToUpload();
                setIsDone(0);
              }}
            >
              Upload
            </Button>
          </DialogActions>
        </BootstrapDialog>
      ) : isDone === 0 ? (
        <>
          <BootstrapDialog
            onClose={() => {}}
            aria-labelledby="customized-dialog-title"
            open={open}
            sx={{ padding: "1rem" }}
          >
            <MUI.BoxProgressHeader>
              <Typography sx={{ fontSize: "1rem" }}>
                Uploading in progress...
              </Typography>
              {checkUpload ? (
                <>
                  <IconButton
                    onClick={() => {
                      setIsDone(1);
                    }}
                  >
                    <CloseIcon sx={{ fontSize: "25px" }} />
                  </IconButton>
                </>
              ) : (
                <>
                  <IconButton onClick={handleCloseAndDeleteFile}>
                    <CloseIcon sx={{ fontSize: "25px" }} />
                  </IconButton>
                </>
              )}
            </MUI.BoxProgressHeader>
            <DialogContent sx={{ paddingBottom: "2rem" }}>
              <MUI.BoxUploadProgress>
                <div style={{ marginLeft: 8, width: 100, height: 100 }}>
                  <CircularProgressbar
                    value={overallProgress}
                    text={`${overallProgress}%`}
                    styles={buildStyles({
                      strokeLinecap: "butt",
                      textSize: "12px",
                      pathTransitionDuration: 0.5,
                      pathColor: "#17766B",
                      textColor: "#0F6C61",
                      trailColor: "#d6d6d6",
                      backgroundColor: "#17766B",
                    })}
                  />
                </div>

                <MUI.BoxUploadProgressDetail>
                  <Typography
                    sx={{ fontSize: "0.9rem !important", fontWeight: 600 }}
                  >
                    Sending {filesArray.length} files in progress,
                    {convertBytetoMBandGB(dataSizeAll)} in total
                  </Typography>
                  <Typography sx={{ fontSize: "0.7rem" }}>
                    {numUploadedFiles}/{filesArray.length} uploaded files
                  </Typography>
                  <Typography sx={{ fontSize: "0.8rem" }}>
                    {convertBytetoMBandGB(uploadSpeed)}/s
                  </Typography>
                </MUI.BoxUploadProgressDetail>
              </MUI.BoxUploadProgress>
              <br />
              <br />
              {filesArray?.map((data, index) => (
                <MUI.BoxUploadFiles key={index}>
                  <MUI.BoxUploadFileDetail>
                    <Box sx={{ width: "25px" }}>
                      <FileIcon
                        extension={getFileType(data.name)}
                        {...defaultStyles[getFileType(data.name) as any]}
                      />
                    </Box>
                    &nbsp;&nbsp;&nbsp;
                    <MUI.BoxFilesName>
                      <Typography sx={{ fontSize: "0.8rem !important" }}>
                        {cutFileName(data?.name, 10)}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "0.7rem !important",
                          color: "#17766B",
                        }}
                      >
                        ({convertBytetoMBandGB(data?.size)})
                      </Typography>
                    </MUI.BoxFilesName>
                  </MUI.BoxUploadFileDetail>
                  <Box sx={{ marginLeft: "1.5rem" }}>
                    {uploadStatus[index] ? (
                      <DownloadDoneIcon fontSize="small" color="success" />
                    ) : (
                      <CircularProgress size={16} color="success" />
                    )}
                  </Box>
                </MUI.BoxUploadFiles>
              ))}
              <br />
            </DialogContent>
          </BootstrapDialog>
        </>
      ) : isDone === 1 ? (
        <>
          {open && isDialogQRCodeOpen && (
            <BootstrapDialog
              onClose={handleCloseModal}
              aria-labelledby="customized-dialog-title"
              open={open}
              sx={{ padding: "1rem 0" }}
            >
              <MUI.BoxProgressHeader>
                <Typography
                  sx={{
                    fontSize: "1rem",
                    [theme.breakpoints.down("sm")]: {
                      marginLeft: "1rem",
                    },
                  }}
                >
                  All done!
                </Typography>
                <IconButton
                  onClick={() => {
                    setIsDone(2);
                    setIsUploading(true);
                    _functionResetValue();
                  }}
                >
                  <CloseIcon sx={{ fontSize: "25px" }} />
                </IconButton>
              </MUI.BoxProgressHeader>
              <DialogContent>
                <MUI.BoxUploadDoneTitle>
                  <Typography variant="h5">
                    <CheckIcon sx={{ color: "#0F6C61" }} />
                    &nbsp;{filesArray.length} files uploaded,{" "}
                    {convertBytetoMBandGB(dataSizeAll)} in total
                  </Typography>
                </MUI.BoxUploadDoneTitle>
                {information?.every((obj) => obj.password == "") &&
                information?.every((obj) => obj.URLpassword == "") ? (
                  ""
                ) : (
                  <MUI.BoxShowAndCopyPassword>
                    <Box ref={ref}>
                      {information?.[0].URLpassword && (
                        <h5>
                          <strong>Download link password:</strong>&nbsp;
                          {information[0].URLpassword}
                        </h5>
                      )}
                      <h5>
                        {!information?.every((obj) => obj.password == "") && (
                          <strong>Files password:</strong>
                        )}
                      </h5>
                      {information?.map((val, index) => (
                        <Box key={index}>
                          {val.password && (
                            <Typography component="p" sx={{ fontSize: "1rem" }}>
                              {index + 1}.&nbsp;&nbsp;{val.name}:{" "}
                              <strong> {val.password}</strong>
                            </Typography>
                          )}
                        </Box>
                      ))}
                    </Box>
                    <MUI.buttonCopyPasswordDetail
                      onClick={downloadPasswordAsImage}
                    >
                      Download
                    </MUI.buttonCopyPasswordDetail>
                  </MUI.BoxShowAndCopyPassword>
                )}

                <MUI.BoxUploadDoneBody>
                  <MUI.BoxUploadDoneContent>
                    <MUI.BoxCopyDownloadLink>
                      <Typography
                        sx={{
                          fontSize: "0.8rem",
                          [theme.breakpoints.down("sm")]: {
                            marginTop: "0.5rem",
                          },
                        }}
                      >
                        Download link:
                      </Typography>
                      <MUI.BoxShowDownloadLink>
                        <input
                          value={value || ""}
                          onChange={(e) => setValue(e.target.value)}
                          style={{
                            border: "none",
                            outline: "none",
                            backgroundColor: "#E9E9E9",
                            width: "40ch",
                            fontSize: "14px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        />
                        {copied ? (
                          <TaskAltIcon sx={{ color: "#17766B" }} />
                        ) : (
                          <CopyToClipboard
                            text={value || ""}
                            onCopy={handleCopy}
                          >
                            <ContentCopyIcon />
                          </CopyToClipboard>
                        )}
                      </MUI.BoxShowDownloadLink>
                    </MUI.BoxCopyDownloadLink>
                    <MUI.BoxShareToSocialMedia>
                      <Typography variant="h5">
                        Share download link to social media:
                      </Typography>
                      <MUI.BoxShowSocialMedia sx={{ width: "90%" }}>
                        <MUI.BoxShowIcon onClick={() => _shareEmail()}>
                          <EmailIcon />
                          <Typography variant="h6">Email</Typography>
                        </MUI.BoxShowIcon>
                        <MUI.BoxShowIcon onClick={() => _shareWhatsapp()}>
                          <WhatsAppIcon />
                          <Typography variant="h6">WhatsApp</Typography>
                        </MUI.BoxShowIcon>
                        <MUI.BoxShowIcon onClick={() => _shareFacebook()}>
                          <FacebookIcon />
                          <Typography variant="h6">Facebook</Typography>
                        </MUI.BoxShowIcon>
                        <MUI.BoxShowIcon onClick={() => _shareTelegrame()}>
                          <TelegramIcon />
                          <Typography variant="h6">Telegram</Typography>
                        </MUI.BoxShowIcon>
                      </MUI.BoxShowSocialMedia>
                    </MUI.BoxShareToSocialMedia>
                  </MUI.BoxUploadDoneContent>
                  <MUI.BoxUploadDoneQR>
                    <div
                      style={{
                        position: "relative",
                        display: "inline-block",
                        textAlign: "center",
                        justifyContent: "center",
                      }}
                    >
                      <QRCode
                        id="qr-code-canvas"
                        value={value || ""}
                        size={200}
                        level="H"
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
                      onClick={() => downloadQR()}
                    >
                      Download
                    </Button>
                  </MUI.BoxUploadDoneQR>
                </MUI.BoxUploadDoneBody>
              </DialogContent>
            </BootstrapDialog>
          )}
        </>
      ) : null}
    </Fragment>
  );
}
