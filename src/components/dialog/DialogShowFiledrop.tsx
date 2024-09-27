import axios from "axios";
import { customAlphabet } from "nanoid";
import PropTypes from "prop-types";
import * as React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import * as MUI from "styles/dialog/dialogFiledrop.style";

// material ui components
import { Delete, Upload } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import DownloadDoneIcon from "@mui/icons-material/DownloadDone";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
// react animate component

import { useLazyQuery, useMutation } from "@apollo/client";
import { Box, CircularProgress, useMediaQuery, useTheme } from "@mui/material";
import { CREATE_FILE_DROP_PUBLIC } from "api/graphql/fileDrop.graphql";
import { ENV_KEYS } from "constants/env.constant";
import { useState } from "react";
import { FileIcon, defaultStyles } from "react-file-icon";
import { UAParser } from "ua-parser-js";
import { errorMessage, successMessage } from "utils/alert.util";
import { calculateTime } from "utils/date.util";
import {
  cutFileName,
  getFileNameExtension,
  getFileType,
} from "utils/file.util";
import { encryptData, encryptDownloadData } from "utils/secure.util";
import { convertBytetoMBandGB } from "utils/storage.util";
import { QUERY_SETTING } from "api/graphql/setting.graphql";
import { IGeneralSetting } from "models/general-setting.model";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const BootstrapDialogTitle: React.FC<any> = (props) => {
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
};

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export default function CustomizedDialogs(props) {
  const {
    open,
    files,
    onDeleteData,
    selectMore,
    onRemoveAll,
    dataFile,
    openModal,
    checkSend,
    userId,
    newName,
    folderId,
    path,
    newPath,
    // folderNewname,
  } = props;
  const theme = useTheme();
  const UA = new UAParser();
  const result = UA.getResult();
  const [createFilePublic] = useMutation(CREATE_FILE_DROP_PUBLIC);
  const [file, setFile] = useState(files);
  const [isUploading, setIsUploading] = useState<any>(false);
  const [isDone, setIsDone] = useState<any>(-1);
  const [numUploadedFiles, setNumUploadedFiles] = useState<any>(0);
  const [uploadSpeed, setUploadSpeed] = useState<any>(0);
  const [overallProgress, setOverallProgress] = useState<any>(0);
  const [country, setCountry] = useState<any>("");
  const [currentURL, setCurrentURL] = useState<any>(null);

  // presign v2
  const [fileStates, setFileStates] = useState<Record<number, any>>({});
  const [startUpload, setStartUpload] = useState(false);
  const [presignUploadSuccess, setPresignUploadSuccess] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const chunkSize = 100 * 1024 * 1024; // 250 mb

  const [generalData, setGeneralData] = useState<IGeneralSetting>({});

  const [getMaxFileSize] = useLazyQuery(QUERY_SETTING, {
    fetchPolicy: "cache-and-network",
  });

  const isRunningRef = React.useRef(true);
  let link: any = null;
  window.location.protocol === "http:"
    ? (link = ENV_KEYS.VITE_APP_DOWNLOAD_URL_SERVER)
    : (link = ENV_KEYS.VITE_APP_DOWNLOAD_URL_SERVER);

  const LOAD_GET_IP_URL = ENV_KEYS.VITE_APP_LOAD_GETIP_URL;
  const LOAD_UPLOAD_URL = ENV_KEYS.VITE_APP_LOAD_UPLOAD_URL;
  const [value, setValue] = useState(link);

  React.useEffect(() => {
    if (openModal === false || openModal === true) {
      setIsUploading(false);
    }
  }, [openModal]);

  React.useEffect(() => {
    setFile(files);
  }, [files]);

  React.useEffect(() => {
    getMaxFileSize({
      variables: {
        where: {
          productKey: "MXULDFE",
        },
      },
      onCompleted: (data) => {
        const res = data.general_settings?.data || [];
        setGeneralData(res?.[0]);
      },
    });
  }, []);

  React.useEffect(() => {
    const fetchIPAddress = async () => {
      try {
        setCountry("other");
        // const responseIp = await axios.get(LOAD_GET_IP_URL);
        // const ip = responseIp?.data;
        // if (ip) {
        //   const res = await axios.get(
        //     `https://pro.ip-api.com/json/${ip}?key=x0TWf62F7ukWWpQ`,
        //   );
        //   setCountry(res?.data?.countryCode);
        // }
      } catch (error) {
        setCountry("other");
      }
    };
    fetchIPAddress();
  }, []);

  React.useEffect(() => {
    setCurrentURL(window.location.href);
  }, [window.location.href]);

  const _functionResetValue = async () => {
    setIsDone(1);
    setFile([]);
    checkSend([]);
  };

  const filesArray = file?.map((obj) => {
    return {
      id: obj.file.id,
      path: obj.file.path,
      lastModified: obj.file.lastModified,
      name: obj.file.name,
      size: obj.file.sizeFile,
      type: obj.file.type,
      webkitRelativePath: obj.file.webkitRelativePath,
      password: "",
      URLpassword: "",
    };
  });

  const dataSizeAll = filesArray.reduce((total, obj) => {
    return total + obj.size;
  }, 0);

  const handleGetBackId = (id) => {
    onDeleteData(id);
  };

  const handleCloseModal = () => {
    onRemoveAll();
    _functionResetValue();
    handleCloseAndDeleteFile();
  };

  const handlePrepareToUpload = () => {
    const mergedArray = filesArray.map((item) => {
      item.password = "";
      item.URLpassword = "";
      return item;
    });
    setIsUploading(true);

    handleUpload(mergedArray);
    // if (userId > 0 && folderId > 0) {
    //   handleUploadPresign(mergedArray);
    // } else {
    //   handleUpload(mergedArray);
    // }
  };

  const handleUpload = async (files) => {
    let numbercout = 0;
    const totalSize = dataFile.reduce((acc, file) => acc + file.size, 0);
    let uploadedSize = 0;
    let getUrlAllWhenReturn: any = [];
    const publicUser = "public";
    const privateUser = `${newName}-${userId}/${newPath}`;

    try {
      const responseIp = await axios.get(LOAD_GET_IP_URL);
      const alphabet =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
      const nanoid = customAlphabet(alphabet, 6);
      const generateID = nanoid();
      const urlAllFile = generateID;
      let i = 0;
      for (const file of files) {
        if (!isRunningRef.current) {
          break;
        }
        const randomName = Math.floor(1111111111 + Math.random() * 99999999);
        const { data: _createFilePublic } = await createFilePublic({
          variables: {
            data: {
              fileExpired: [
                {
                  typeDate: "days",
                  amount: 1,
                },
              ],
              fileType: file?.type,
              filename: String(`${file?.name}`),
              ip: String(responseIp.data),
              newFilename: randomName + getFileNameExtension(file?.name),
              size: String(file?.size),
              urlAll: String(urlAllFile),
              dropUrl: currentURL,
              path: folderId > 0 ? String(`${path}/${file?.name}`) : "",
              newPath:
                folderId > 0
                  ? String(
                      `${newPath}/${
                        randomName + getFileNameExtension(file?.name)
                      }`,
                    )
                  : "",
              country: country,
              device: result.os.name || "" + result.os.version || "",
              ...(folderId > 0 ? { folder_id: folderId } : {}),
            },
          },
        });

        getUrlAllWhenReturn = _createFilePublic.createFilesPublic;
        if (_createFilePublic) {
          let initialUploadSpeedCalculated = false;

          const startTime = new Date().getTime();
          const headers = {
            PATH:
              userId > 0 && folderId > 0 ? `${privateUser}` : `${publicUser}`,
            FILENAME: randomName + `${getFileNameExtension(file?.name)}`,
            createdBy: userId > 0 && folderId > 0 ? String(userId) : "0",
          };

          const encryptedData = encryptDownloadData(headers);
          const blob = new Blob([dataFile[i]], {
            type: dataFile[i].type,
          });
          const newFile = new File([blob], dataFile[i].name, {
            type: dataFile[i].type,
          });
          const formData = new FormData();
          formData.append("file", newFile);

          const response = await axios.post(LOAD_UPLOAD_URL, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              encryptedHeaders: encryptedData,
            },
            onUploadProgress: (progressEvent: any) => {
              const currentFileUploadedSize =
                (progressEvent.loaded * dataFile[i].size) / progressEvent.total;
              const currentUploadPercentage = (
                ((uploadedSize + currentFileUploadedSize) / totalSize) *
                100
              ).toFixed(0);
              setOverallProgress(currentUploadPercentage);
              const currentTime = new Date().getTime();
              const elapsedTime = (currentTime - startTime) / 1000;
              if (!initialUploadSpeedCalculated && elapsedTime > 0) {
                const initialUploadSpeed = (
                  progressEvent.loaded /
                  1024 /
                  elapsedTime
                ).toFixed(2);
                setUploadSpeed(initialUploadSpeed);
                initialUploadSpeedCalculated = true;
              }
              if (elapsedTime > 1) {
                const uploadSpeed = (
                  progressEvent.loaded /
                  1024 /
                  elapsedTime
                ).toFixed(2);
                setUploadSpeed(uploadSpeed);
              }
            },
          });
          if (response.status == 200) {
            setNumUploadedFiles(++numbercout);
            uploadedSize += dataFile[i].size;
          }
          i++;
        } else {
          isRunningRef.current = false;
          break;
        }
      }
      setIsDone(1);
      setValue(`${value}${getUrlAllWhenReturn?.urlAll}`);
      successMessage("Upload Successful!!", 3000);
      setTimeout(() => {
        onRemoveAll();
      }, 1000);
    } catch (error: any) {
      const cutError = error.message.replace(/(ApolloError: )?Error: /, "");
      const str = getFileType(cutError);
      const indexRemote = str?.indexOf("IS_NOT_ALLOWED");
      const finalResult = str?.substring(0, indexRemote);
      if (error?.message?.includes("Can not upload more than")) {
        const maxSize = convertBytetoMBandGB(
          parseInt(generalData.action!) || 0,
        );
        errorMessage(`The maximum upload size is ${maxSize}`, 3000);
      } else if (cutError == "FILE_NAME_CONTAINS_A_SINGLE_QUOTE(')") {
        errorMessage("Sorry We Don't Allow File Name Include (')", 3000);
      } else if (cutError == "UPLOAD_LIMITED") {
        errorMessage("Upload Is Limited! Pleaes Try Again Tomorrow!", 3000);
      } else if (cutError == "NONE_URL") {
        errorMessage("Your Upload Link Is Incorrect!", 3000);
      } else if (finalResult) {
        errorMessage(`File ${finalResult} is not allowed`, 3000);
      } else {
        errorMessage(cutError, 3000);
      }
    } finally {
      setUploadSpeed(0);
      setOverallProgress(0);
      setIsUploading(false);
    }
  };

  const handleUploadPresign = async (files: File[]) => {
    let getUrlAllWhenReturn: any = [];

    try {
      const responseIp = await axios.get(LOAD_GET_IP_URL);
      const alphabet =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
      const nanoid = customAlphabet(alphabet, 6);
      const generateID = nanoid();
      const urlAllFile = generateID;

      const fileStateEntries = await Promise.all(
        files.map(async (file, index) => {
          if (!isRunningRef.current) {
            return;
          }
          const randomName = Math.floor(1111111111 + Math.random() * 99999999);
          const newFilename = randomName + getFileNameExtension(file?.name);
          const newFilePath = String(
            `${newPath}/${randomName + getFileNameExtension(file?.name)}`,
          );
          const { data: _createFilePublic } = await createFilePublic({
            variables: {
              data: {
                fileExpired: [
                  {
                    typeDate: "days",
                    amount: 1,
                  },
                ],
                fileType: file?.type,
                filename: String(`${file?.name}`),
                ip: String(responseIp.data),
                newFilename,
                size: String(file?.size),
                urlAll: String(urlAllFile),
                dropUrl: currentURL,
                path: String(`${path}/${file?.name}`) || "",
                newPath: newFilePath || "",
                country: country,
                device: result.os.name || "" + result.os.version || "",
                folder_id: folderId,
              },
            },
          });
          getUrlAllWhenReturn = _createFilePublic.createFilesPublic;

          const dataFile = file as any;
          dataFile.createdBy = String(userId);
          dataFile.newFilename = newFilename;
          dataFile.path = newFilePath;
          if (_createFilePublic) {
            const initialUpload = await initiateUpload(index, dataFile);
            return initialUpload || {};
          }
        }),
      );

      const newFileStates = fileStateEntries.reduce(
        (acc, fileState) => ({
          ...acc,
          ...fileState,
        }),
        {},
      ) as any;
      setFileStates(newFileStates);
      setStartUpload(true);
      setValue(`${value}${getUrlAllWhenReturn?.urlAll}`);
    } catch (error: any) {
      const cutError = error.message.replace(/(ApolloError: )?Error: /, "");
      const str = getFileType(cutError);
      const indexRemote = str?.indexOf("IS_NOT_ALLOWED");
      const finalResult = str?.substring(0, indexRemote);
      if (cutError == "FILE_NAME_CONTAINS_A_SINGLE_QUOTE(')") {
        setUploadSpeed(0);
        setOverallProgress(0);
        setIsUploading(false);
        errorMessage("Sorry We Don't Allow File Name Include (')", 3000);
      } else if (cutError == "UPLOAD_LIMITED") {
        setUploadSpeed(0);
        setOverallProgress(0);
        setIsUploading(false);
        errorMessage("Upload Is Limited! Pleaes Try Again Tomorrow!", 3000);
      } else if (cutError == "NONE_URL") {
        setUploadSpeed(0);
        setOverallProgress(0);
        setIsUploading(false);
        errorMessage("Your Upload Link Is Incorrect!", 3000);
      } else if (finalResult) {
        setUploadSpeed(0);
        setOverallProgress(0);
        setIsUploading(false);
        errorMessage(`File ${finalResult} is not allowed`, 3000);
      } else {
        setUploadSpeed(0);
        setOverallProgress(0);
        setIsUploading(false);
        errorMessage("Something Wrong Please Try Again Later!", 3000);
      }
    }
  };

  const initiateUpload = async (fileIndex: number, file: File | any) => {
    try {
      const headers = {
        createdBy: file.createdBy,
        FILENAME: file.newFilename,
        PATH: file.path,
      };

      const _encryptHeader = await encryptData(headers);
      const initiateResponse = await axios.post<{ uploadId: string }>(
        `${ENV_KEYS.VITE_APP_LOAD_URL}initiate-multipart-upload`,
        {},
        {
          headers: {
            encryptedheaders: _encryptHeader!,
          },
        },
      );

      const data = await initiateResponse.data;
      const uploadId = data.uploadId;

      return {
        [fileIndex]: {
          file,
          uploadId,
          parts: [],
          retryParts: [],
          uploadFinished: false,
          progress: 0,
          startTime: Date.now(),
          timeElapsed: "",
          duration: "",
          isHide: true,
          uploadSpeed: "",

          cancel: false,
        },
      };
    } catch (error: any) {
      console.error("Error initiating upload:", error);
    }
  };

  const uploadFileParts = async (fileIndex: number, file: File) => {
    const numParts = Math.ceil(file.size / chunkSize);

    for (let partNumber = 1; partNumber <= numParts; partNumber++) {
      const start = (partNumber - 1) * chunkSize;
      const end = Math.min(start + chunkSize, file.size);
      const blob = file.slice(start, end);

      try {
        await uploadPart(fileIndex, partNumber, blob);
      } catch (error) {
        console.error(`Error uploading part ${partNumber}:`, error);
        setFileStates((prev) => ({
          ...prev,
          [fileIndex]: {
            ...prev[fileIndex],
            retryParts: [
              ...prev[fileIndex].retryParts,
              { partNumber, start, end },
            ],
          },
        }));
      }
    }

    setFileStates((prev) => ({
      ...prev,
      [fileIndex]: { ...prev[fileIndex], uploadFinished: true },
    }));
  };

  const uploadPart = async (
    fileIndex: number,
    partNumber: number,
    blob: Blob,
  ) => {
    const { uploadId, file } = fileStates[fileIndex];
    const numParts = Math.ceil(file.size / chunkSize);

    try {
      const formData = new FormData();
      formData.append("partNumber", partNumber.toString());
      formData.append("uploadId", uploadId);

      const headers = {
        createdBy: userId,
        PATH: file.path,
        FILENAME: file.newFilename,
      };

      const _encryptHeader = await encryptData(headers);
      const presignedResponse = await axios.post<{ url: string }>(
        `${ENV_KEYS.VITE_APP_LOAD_URL}generate-presigned-url`,
        formData,
        {
          headers: {
            encryptedheaders: _encryptHeader!,
          },
        },
      );

      const { url } = await presignedResponse.data;
      setPresignUploadSuccess(true);

      return new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", url, true);
        xhr.setRequestHeader("Content-Type", blob.type);

        setFileStates((prev) => ({
          ...prev,
          [fileIndex]: {
            ...prev[fileIndex],
            xhr,
          },
        }));

        xhr.onload = () => {
          const endTime = Date.now();
          const timeTaken = (endTime - fileStates[fileIndex].startTime) / 1000;
          const uploadSpeed = convertBytetoMBandGB(blob.size / timeTaken);

          if (xhr.status >= 200 && xhr.status < 300) {
            const endDurationTime = Date.now();
            const duration = calculateTime(
              endDurationTime - fileStates[fileIndex].startTime,
            );

            setFileStates((prev) => ({
              ...prev,
              [fileIndex]: {
                ...prev[fileIndex],
                duration,
                uploadSpeed,
                parts: [
                  ...prev[fileIndex].parts,
                  {
                    ETag: xhr.getResponseHeader("ETag"),
                    PartNumber: partNumber,
                  },
                ],
              },
            }));

            const percentComplete = Math.round((partNumber * 100) / numParts);
            setFileStates((prev) => ({
              ...prev,
              [fileIndex]: { ...prev[fileIndex], progress: percentComplete },
            }));

            if (percentComplete >= 100) {
              const endTime = Date.now();
              const timeTaken =
                (endTime - fileStates[fileIndex].startTime) / 1000; // time in seconds

              setFileStates((prev) => ({
                ...prev,
                [fileIndex]: {
                  ...prev[fileIndex],
                  timeElapsed: `${(timeTaken / 60).toFixed(2)} minutes`,
                },
              }));
            }
            setUploadComplete(true);
            resolve();
          } else {
            reject(
              new Error(
                `Error uploading part ${partNumber}: ${xhr.statusText}`,
              ),
            );
          }
        };

        xhr.onerror = () =>
          reject(
            new Error(`Error uploading part ${partNumber}: ${xhr.statusText}`),
          );

        xhr.send(blob);
      });
    } catch (error) {
      if (axios.isCancel(error)) {
        successMessage("Upload cancelled", 2000);
      } else {
        errorMessage("Upload failed", 3000);
      }
    }
  };

  const tryCompleteMultipartUpload = async (
    fileIndex: number,
    parts: any,
    uploadId: string,
    file: File | any,
  ) => {
    // if (fileStates[fileIndex]?.cancel) return;

    setUploadComplete(false);

    const formData = new FormData();
    formData.append("parts", JSON.stringify(parts));
    formData.append("uploadId", uploadId);

    const headers = {
      createdBy: file.createdBy,
      FILENAME: file.newFilename,
      PATH: file.path,
    };

    const _encryptHeader = encryptData(headers);

    try {
      await axios.post(
        `${ENV_KEYS.VITE_APP_LOAD_URL}complete-multipart-upload`,
        formData,
        {
          headers: {
            encryptedheaders: _encryptHeader!,
          },
        },
      );

      const endTime = Date.now();
      const timeTaken = (endTime - fileStates[fileIndex].startTime) / 1000; // time in seconds
      setFileStates((prev) => ({
        ...prev,
        [fileIndex]: {
          ...prev[fileIndex],
          parts: [],
          uploadFinished: true,
          timeElapsed: `${(timeTaken / 60).toFixed(2)}`,
        },
      }));

      // mvc
    } catch (error: any) {
      console.error("Error completing multipart upload:", error);
      // alert(`Error completing multipart upload: ${error.message}`);
    }
  };

  const retryFailedParts = async () => {
    if (!navigator.onLine) return;
    const promises = Object.keys(fileStates).map(async (fileIndex) => {
      const { retryParts, file } = fileStates[parseInt(fileIndex)];

      setFileStates((prev) => ({
        ...prev,
        [fileIndex]: { ...prev[parseInt(fileIndex)], retryParts: [] },
      }));

      for (const { partNumber, start, end } of retryParts) {
        const blob = file.slice(start, end);
        try {
          await uploadPart(parseInt(fileIndex), partNumber, blob);
        } catch (error) {
          console.error(`Error retrying part ${partNumber}: `, error);
          setFileStates((prev) => ({
            ...prev,
            [fileIndex]: {
              ...prev[parseInt(fileIndex)],
              retryParts: [
                ...prev[parseInt(fileIndex)].retryParts,
                { partNumber, start, end },
              ],
            },
          }));
        }
      }
    });

    await Promise.all(promises);
  };

  const handleCloseAndDeleteFile = async () => {
    isRunningRef.current = false;
  };
  const isMobile = useMediaQuery("(max-width: 600px)");

  React.useEffect(() => {
    const startUploads = async () => {
      for (const fileIndex of Object.keys(fileStates)) {
        if (
          !fileStates[parseInt(fileIndex)]?.uploadFinished &&
          !fileStates[fileIndex]?.cancel
        ) {
          uploadFileParts(
            parseInt(fileIndex),
            fileStates[parseInt(fileIndex)]?.file,
          );
        }
      }
    };
    if (startUpload) {
      startUploads();
    }
  }, [startUpload]);

  React.useEffect(() => {
    const completeFunction = async () => {
      if (Object.values(fileStates).length === files.length) {
        Object.values(fileStates).map(async (fileState, fileIndex) => {
          if (
            fileState?.progress >= 100 &&
            fileState?.retryParts?.length <= 0 &&
            fileState?.parts?.length > 0 &&
            !fileState?.cancel &&
            uploadComplete
          ) {
            // console.log("start complete:: ", fileIndex, { fileState });
            await tryCompleteMultipartUpload(
              fileIndex,
              [...(fileState?.parts || [])],
              fileState?.uploadId,
              files[fileIndex],
            );
          }
        });
      }
    };

    completeFunction();
  }, [fileStates, uploadComplete]);

  React.useEffect(
    () => {
      // const newFileStates = Object.values(fileStates);
      // const cancelState = newFileStates.map((file) => file?.cancel);
      // const cancellAll = cancelState.filter(Boolean).length;
      // if (cancellAll === filesArray?.length && presignUploadSuccess) {
      // }
    },
    // fileStates, data, presignUploadSuccess
    [fileStates, filesArray, presignUploadSuccess],
  );

  React.useEffect(() => {
    window.addEventListener("online", retryFailedParts);
    window.addEventListener("offline", () =>
      console.error("Network connection lost"),
    );

    return () => {
      window.removeEventListener("online", retryFailedParts);
      window.removeEventListener("offline", () =>
        console.error("Network connection lost"),
      );
    };
  }, [fileStates]);

  return (
    <React.Fragment>
      {!isUploading ? (
        <BootstrapDialog aria-labelledby="customized-dialog-title" open={open}>
          <BootstrapDialogTitle
            onClose={handleCloseModal}
            sx={{ border: "1px solid #ffffff" }}
          >
            <MUI.BoxUploadTitle>
              <Typography
                sx={{
                  marginTop: isMobile ? "0.5rem" : "",
                  fontSize: "1rem",
                }}
              >
                Upload files
              </Typography>
            </MUI.BoxUploadTitle>
          </BootstrapDialogTitle>
          <DialogContent
            dividers
            sx={{
              width: isMobile ? "auto" : "600px",
              padding: "0 1.5rem !important",
            }}
          >
            <MUI.BoxNumberOfSelectedFile>
              <strong>
                Your {filesArray?.length} files are ready to upload
              </strong>
            </MUI.BoxNumberOfSelectedFile>
            {filesArray?.map((item, index) => (
              <MUI.BoxShowFiles key={index}>
                <MUI.BoxShowFileDetail>
                  {!isMobile && (
                    <MUI.BoxShowFileIcon>
                      <FileIcon
                        extension={getFileType(item.name)}
                        {...defaultStyles[getFileType(item.name) as string]}
                      />
                    </MUI.BoxShowFileIcon>
                  )}
                  {!isMobile && (
                    <MUI.BoxShowFileName>
                      <Typography sx={{ fontSize: "0.8rem" }}>
                        {cutFileName(item.name, 10)}
                      </Typography>
                      <Typography sx={{ fontSize: "0.7rem", color: "#17766B" }}>
                        ({convertBytetoMBandGB(item.size)})
                      </Typography>
                    </MUI.BoxShowFileName>
                  )}
                </MUI.BoxShowFileDetail>
                <MUI.BoxShowLockFile
                  sx={{ justifyContent: "space-between !important" }}
                >
                  {isMobile ? (
                    <MUI.BoxShowFileName>
                      <MUI.BoxShowFileIcon>
                        <FileIcon
                          extension={getFileType(item.name)}
                          {...defaultStyles[getFileType(item.name) as string]}
                        />
                      </MUI.BoxShowFileIcon>
                      &nbsp;&nbsp;
                      <Typography sx={{ fontSize: "0.8rem" }}>
                        {cutFileName(item.name, 10)}
                      </Typography>
                      <Typography sx={{ fontSize: "0.7rem", color: "#17766B" }}>
                        ({convertBytetoMBandGB(item.size)})
                      </Typography>
                    </MUI.BoxShowFileName>
                  ) : (
                    <div style={{ width: "100px" }}></div>
                  )}
                  <IconButton onClick={() => handleGetBackId(item.id - 1)}>
                    <Delete
                      sx={{
                        fontSize: "1.2rem",
                        [theme.breakpoints.down("sm")]: {
                          marginLeft: "1rem",
                        },
                      }}
                    />
                  </IconButton>
                </MUI.BoxShowLockFile>
              </MUI.BoxShowFiles>
            ))}
            <MUI.BoxUploadAndReset>
              <Button
                startIcon={<Upload />}
                autoFocus
                sx={{
                  color: "#17766B",
                  fontSize: "0.8rem",
                }}
                {...selectMore}
                size="small"
              >
                Select More
              </Button>
              <Button
                startIcon={<RestartAltIcon />}
                autoFocus
                sx={{
                  fontSize: "0.8rem",
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
              startIcon={<Upload sx={{}} />}
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
        <BootstrapDialog aria-labelledby="customized-dialog-title" open={open}>
          <BootstrapDialogTitle onClose={handleCloseModal}>
            <MUI.BoxProgressHeader>
              <Typography sx={{ fontSize: "1rem" }}>
                Uploading in progress...
              </Typography>
            </MUI.BoxProgressHeader>
          </BootstrapDialogTitle>
          <DialogContent
            sx={{
              paddingBottom: "2rem",
              width: isMobile ? "auto" : "600px",
            }}
          >
            <MUI.BoxUploadProgress>
              <Box
                sx={{
                  width: 100,
                  height: 100,
                  [theme.breakpoints.down("sm")]: {
                    margin: "1rem 0 ",
                  },
                }}
              >
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
              </Box>

              <MUI.BoxUploadProgressDetail>
                <Typography sx={{ fontSize: "0.9rem" }}>
                  Sending {filesArray.length} files in progress,
                  {convertBytetoMBandGB(dataSizeAll)} in total
                </Typography>
                <Typography sx={{ fontSize: "0.8rem" }}>
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
                      {...defaultStyles[getFileType(data.name) as string]}
                    />
                  </Box>
                  &nbsp;&nbsp;&nbsp;
                  <MUI.BoxFilesName>
                    <Typography sx={{ fontSize: "0.8rem !important" }}>
                      {data?.name}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "0.7rem !important",
                        color: "#17766B",
                      }}
                    >
                      {convertBytetoMBandGB(data?.size)}
                    </Typography>
                  </MUI.BoxFilesName>
                </MUI.BoxUploadFileDetail>
                <Box>
                  {index + 1 <= numUploadedFiles ? (
                    <>
                      <DownloadDoneIcon fontSize="small" color="success" />
                    </>
                  ) : (
                    <>
                      <CircularProgress size={20} color="success" />
                    </>
                  )}
                </Box>
              </MUI.BoxUploadFiles>
            ))}
            <br />
          </DialogContent>
        </BootstrapDialog>
      ) : null}
    </React.Fragment>
  );
}
