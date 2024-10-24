import { useMutation } from "@apollo/client";
import {
  Alert,
  Box,
  Button,
  Grid,
  ImageListItem,
  InputLabel,
  TextField,
  Typography,
  createTheme,
} from "@mui/material";

import { MUTATION_UPLOAD_VOTE } from "api/graphql/vote.graphql";
import FileUploadMoreIcon from "assets/images/vote/fileImageIcon.svg?react";
import FileImagIcon from "assets/images/vote/imageIcon.svg?react";
import axios from "axios";
import { ENV_KEYS } from "constants/env.constant";
import useAuth from "hooks/useAuth";
import { useFetchVoteFiles, useFetchVoteResult } from "hooks/vote/useFetchVote";
import useFilter from "hooks/vote/useFilter";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { IoClose } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { UAParser } from "ua-parser-js";
import { errorMessage, successMessage } from "utils/alert.util";
import { formatDate } from "utils/date.util";
import { decryptDataLink, encryptDownloadData } from "utils/secure.util";
import { v4 as uuidv4 } from "uuid";
import LinearProgressWithLabel from "./progress";

interface TypeProps {
  handleClose: () => void;
}
export default function UploadVote({ handleClose }: TypeProps) {
  const theme = createTheme();
  const navigate = useNavigate();
  const { user }: any = useAuth();
  const params = new URLSearchParams(location.search);
  const [files, setFiles] = useState<any[]>([]);
  const voteParams = params.get("lc");
  const decryptedData = decryptDataLink(voteParams);
  const [isSumitting, setIsSumitting] = useState(false);
  const [voteUpload] = useMutation(MUTATION_UPLOAD_VOTE);
  const isRunningRef = React.useRef(true);
  const [overallProgress, setOverallProgress] = useState(0);
  const filter = useFilter();
  const { data: dataVote } = useFetchVoteResult({
    id: decryptedData?._id,
    filter: filter,
  });
  const { refetch } = useFetchVoteFiles({
    id: decryptedData?._id,
    filter: filter,
  });
  const isToken = localStorage.getItem("alBBtydfsTtW@wdVV");
  const [isErrorMessage, setIsErrorMessage] = useState(false);
  const LOAD_UPLOAD_URL = ENV_KEYS.VITE_APP_LOAD_UPLOAD_URL;
  const LOAD_GET_IP_URL = ENV_KEYS.VITE_APP_LOAD_GETIP_URL;
  const UA = new UAParser();
  const result = UA.getResult();
  const [optional, setOptional] = useState("");

  const onDrop = useCallback(
    (acceptedFiles: any[]) => {
      const previewFiles = acceptedFiles.map((file) => {
        return Object.assign(file, {
          preview: URL.createObjectURL(file),
        });
      });
      if (!dataVote?.voteData?.allowMultipleUpload) {
        setFiles(previewFiles);
      } else {
        setFiles((prevFiles) => [...prevFiles, ...previewFiles]);
      }
    },
    [files],
  );
  let acceptFileType = "image/*";
  if (dataVote?.voteData?.fileType[0] === "VIDEO") {
    acceptFileType = "video/*";
  } else if (dataVote?.voteData?.fileType[0] === "SOUND") {
    acceptFileType = "audio/*";
  } else {
    acceptFileType = "image/*";
  }

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      [acceptFileType]: [],
    },
    multiple: dataVote?.voteData?.allowMultipleUpload ? true : false,
    onDrop,
  });
  React.useEffect(() => {
    files.forEach((file) => {
      return () => {
        URL.revokeObjectURL(file.preview);
      };
    });
  }, [files]);

  const removeFile = (index: number) => {
    const fileToRemove = files[index];
    if (fileToRemove) {
      URL.revokeObjectURL(fileToRemove.preview);
    }
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleVoteUpload = async () => {
    if (!isToken) {
      return;
    }

    try {
      setIsSumitting(true);
      const responseIp = await axios.get(LOAD_GET_IP_URL);
      const totalSize = files?.reduce((acc, file) => acc + file.size, 0) || 0;
      let uploadedSize = 0;
      let currentUploadPercentage: number | string = 0;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!isRunningRef.current) {
          break;
        }

        let newNameFile = uuidv4();
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
        const blob = new Blob([files[i]], {
          type: newData.type,
        });

        const newFile = new File([blob], file.name, { type: newData.type });
        const { data } = await voteUpload({
          variables: {
            data: {
              checkFile: "main",
              filename: optional ? `${optional}.${extension}` : `${file?.name}`,
              newFilename: String("vote/" + newNameFile),
              fileType: file?.type,
              size: String(file?.size),
              ip: String(responseIp?.data),
            },
            uploadVoteFilesId: decryptedData?._id,
            device: result.os.name || "" + result.os.version || "",
          },
        });

        if (data?.uploadVoteFiles?.code == 200) {
          try {
            const formData = new FormData();
            formData.append("file", newFile);
            const PATH =
              dataVote?.voteData?.createdBy?.newName +
              "-" +
              dataVote?.voteData?.createdBy?._id;

            const headers = {
              createdBy: dataVote?.voteData?.createdBy?._id,
              PATH: PATH,
              FILENAME: `vote/${newNameFile}`,
            };

            const encryptedData = encryptDownloadData(headers);
            await axios.post(LOAD_UPLOAD_URL, formData, {
              headers: {
                "Content-Type": "multipart/form-data",
                encryptedHeaders: encryptedData,
              },
              onUploadProgress: (progressEvent: any) => {
                const fileProgress = progressEvent.loaded;
                uploadedSize += fileProgress;
                currentUploadPercentage = Math.min(
                  (uploadedSize / totalSize) * 100,
                  100,
                ).toFixed(0);
                if (parseInt(currentUploadPercentage) == 100) {
                  setIsSumitting(false);
                }
                setOverallProgress(parseInt(currentUploadPercentage));
              },
            });
            setTimeout(() => {
              setOverallProgress(0);
              setFiles([]);
              setIsSumitting(false);
              refetch();
            }, 2000);
            successMessage("Upload successful!!", 3000);
          } catch (error) {
            errorMessage("Error uploading file. Please try againn later", 3000);
          }
        } else {
          setIsErrorMessage(true);
        }
      }

      setIsSumitting(false);
    } catch (error: any) {
      errorMessage(error || "", 10000);
    }
  };

  return (
    <React.Fragment>
      <Box>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Box
            sx={{
              my: 5,
              width: "100%",
              bgcolor: "white",
            }}
          >
            {files?.length < 1 ? (
              <Box>
                <Box
                  sx={{
                    m: 4,
                    borderRadius: "4px",
                    border: "2px dashed #85b7b1",
                    height: { lg: "280px", xs: "260px" },
                  }}
                >
                  <Box
                    sx={{ mx: 5, display: "flex", justifyContent: "center" }}
                  >
                    <Box
                      sx={{ mt: 10, display: "block", textAlign: "center" }}
                      {...getRootProps()}
                    >
                      <FileImagIcon />
                      <Typography
                        variant="h6"
                        sx={{
                          fontSize: "1.1rem",
                          fontWeight: 500,
                          margin: "0.5rem 0",
                          mb: 2,
                          color: theme.palette.grey[800],
                        }}
                      >
                        Drag & Drop image here
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          fontSize: "0.8rem",
                          fontWeight: 400,
                          margin: "0.5rem 0",
                          mb: 2,
                        }}
                      >
                        Supports: JPG,PNG OR GIF & Other
                      </Typography>
                      <Button
                        sx={{ mt: 5, border: "6px" }}
                        variant="contained"
                        type="button"
                      >
                        Choose file
                        <input
                          type="file"
                          accept="image/*"
                          {...getInputProps()}
                          hidden
                        />
                      </Button>
                    </Box>
                  </Box>
                </Box>
                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", mr: 5 }}
                >
                  <Button
                    variant="contained"
                    type="button"
                    sx={{
                      borderRadius: "6px",
                      border: `1px solid ${theme.palette.grey[400]}`,
                      bgcolor: "white !important",
                      color: theme.palette.grey[600],
                      "&hover": {
                        bgcolor: theme.palette.grey[300],
                      },
                    }}
                    onClick={() => handleClose()}
                  >
                    Close
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box sx={{ mx: 4 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: "1.1rem",
                    fontWeight: 400,
                    margin: "0.5rem 0",
                    mb: 2,
                    color: theme.palette.grey[800],
                  }}
                >
                  Title: {dataVote?.voteData?.topic}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: "1rem",
                    fontWeight: 400,
                    margin: "0.5rem 0",
                    mb: 2,
                    color: theme.palette.grey[800],
                  }}
                >
                  Description: {dataVote?.voteData?.description}
                </Typography>
                <InputLabel sx={{ mt: 5, fontSize: "14px" }}>
                  Optional
                </InputLabel>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Enter optional"
                  InputProps={{
                    sx: {
                      height: "40px",
                    },
                    style: {
                      fontSize: "14px",
                    },
                  }}
                  value={optional}
                  onChange={(e) => setOptional(e.target.value)}
                />
                <InputLabel sx={{ mt: 5, mb: 1, fontSize: "14px" }}>
                  Answer Options
                </InputLabel>
                <Grid container spacing={2}>
                  {files.map((file, index) => {
                    return (
                      <Grid
                        key={index}
                        item
                        xs={6}
                        sm={4}
                        md={4}
                        sx={{ height: "200px" }}
                      >
                        <ImageListItem
                          sx={{
                            border: `1px solid ${theme.palette.grey[400]}`,
                            borderRadius: "6px",
                            position: "relative",
                          }}
                        >
                          <img
                            src={file.preview}
                            alt={file.name}
                            loading="lazy"
                            style={{
                              minHeight: "160px",
                              maxHeight: "160px",
                              objectFit: "contain",
                              borderRadius: "12px",
                              padding: "4px",
                            }}
                          />
                          <Box
                            sx={{
                              bgcolor: "white !important",
                              position: "absolute",
                              top: 10,
                              right: 10,
                              height: "18px",
                              width: "18px",
                              borderRadius: "5px",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              cursor: "pointer",
                            }}
                          >
                            <IoClose
                              size={18}
                              style={{ color: theme.palette.grey[600] }}
                              onClick={() => removeFile(index)}
                            />
                          </Box>
                        </ImageListItem>
                      </Grid>
                    );
                  })}
                  {dataVote?.voteData?.allowMultipleUpload && (
                    <Grid item xs={6} sm={4} md={4} sx={{ height: "200px" }}>
                      <ImageListItem
                        sx={{
                          border: `1px solid ${theme.palette.grey[400]}`,
                          borderRadius: "6px",
                          position: "relative",
                        }}
                        {...getRootProps()}
                      >
                        <Box
                          sx={{
                            bgcolor: "#C4C4C459",
                            minHeight: "150px",
                            maxHeight: "150px",
                            borderRadius: "6px",
                            padding: "4px",
                            m: 1,
                            position: "relative",
                          }}
                        >
                          <input {...getInputProps()} hidden multiple={false} />

                          <Box
                            sx={{
                              position: "absolute",
                              top: "50%",
                              transform: "translate(-50%, -50%)",
                              left: "50%",
                              textAlign: "center",
                              width: "100%",
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              padding: "1rem",
                            }}
                          >
                            <FileUploadMoreIcon />
                            <Typography component="p">
                              Click to upload
                            </Typography>
                          </Box>
                        </Box>
                        <Box
                          sx={{
                            bgcolor: "white !important",
                            position: "absolute",
                            top: 10,
                            right: 10,
                            height: "18px",
                            width: "18px",
                            borderRadius: "5px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            cursor: "pointer",
                          }}
                        >
                          <IoClose
                            size={18}
                            style={{ color: theme.palette.grey[600] }}
                          />
                        </Box>
                      </ImageListItem>
                    </Grid>
                  )}
                </Grid>
                {isErrorMessage && (
                  <Alert severity="error">
                    You have reached the upload limit
                  </Alert>
                )}
                <Typography sx={{ mb: 2, width: "100%" }} component="p">
                  Expired date: {formatDate(dataVote?.voteData?.expiredAt)}
                </Typography>
                {overallProgress > 0 && (
                  <Box sx={{ width: "100%" }}>
                    <LinearProgressWithLabel value={overallProgress} />
                  </Box>
                )}
                <Box
                  sx={{
                    my: 4,
                    width: "100%",
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 5,
                  }}
                >
                  <Button
                    variant="contained"
                    type="button"
                    sx={{
                      borderRadius: "6px",
                      border: `1px solid ${theme.palette.grey[400]}`,
                      bgcolor: "white !important",
                      color: theme.palette.grey[600],
                      "&hover": {
                        bgcolor: theme.palette.grey[300],
                      },
                    }}
                    onClick={() => handleClose()}
                  >
                    Close
                  </Button>
                  {!isToken ? (
                    <Link
                      style={{
                        background: "#17766B",
                        color: "white",
                        padding: "8px 16px",
                        display: "flex",
                        alignItems: "center",
                        borderRadius: "6px",
                        fontWeight: "600",
                      }}
                      to={`${ENV_KEYS.VITE_APP_URL_REDIRECT_LANDING_PAGE}auth/sign-in/${voteParams}`}
                    >
                      Confirm
                    </Link>
                  ) : (
                    <Button
                      disabled={isSumitting ? true : false}
                      type="button"
                      variant="contained"
                      sx={{ borderRadius: "6px" }}
                      onClick={() => {
                        handleVoteUpload();
                      }}
                    >
                      {isSumitting ? "Uploading..." : "Upload"}
                    </Button>
                  )}
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </React.Fragment>
  );
}
