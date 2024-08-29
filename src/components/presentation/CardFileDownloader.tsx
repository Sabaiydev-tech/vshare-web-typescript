import {
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { Fragment } from "react";
import { FileIcon, defaultStyles } from "react-file-icon";

import DownloadIcon from "@mui/icons-material/Download";
import FileDownloadDoneIcon from "@mui/icons-material/FileDownloadDone";
import FileDownloadOffIcon from "@mui/icons-material/FileDownloadOff";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import { FaTimes } from "react-icons/fa";
import { DivDownloadFileBox } from "styles/presentation/presentation.style";
import {
  combineOldAndNewFileNames,
  cutFileName,
  getFileType,
} from "utils/file.util";
import { convertBytetoMBandGB } from "utils/storage.util";

function CardFileDownloader(props) {
  const {
    isPublic,
    dataFiles,
    isSuccess,
    isDownloadAll,
    isHide,
    isProcessing,
    isMobile,
    fileTotal,
    hasFileWithoutPassword,
    hideDownload,
    downloadFiles,
    setIndex,
    setPassword,
    setGetFilenames,
    setGetNewFileName,
    setCheckModal,
    handleQRGeneration,
    downloadFilesAll,
  } = props;

  const currentURL = window.location.href;

  return (
    <Fragment>
      {dataFiles?.map((dataFile, index) => (
        <DivDownloadFileBox key={index}>
          <Box>
            <Typography variant="h6" sx={{ display: "flex" }}>
              <div
                style={{
                  width: isMobile ? "15px" : "20px",
                  marginTop: "-6px",
                }}
              >
                <FileIcon
                  extension={getFileType(dataFile.filename)}
                  {...defaultStyles[getFileType(dataFile.filename) as string]}
                  size={10}
                />
              </div>
              &nbsp;{" "}
              {cutFileName(
                combineOldAndNewFileNames(
                  dataFile?.filename,
                  dataFile?.newFilename,
                ) as string,
                10,
              )}
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6">
              {convertBytetoMBandGB(dataFile?.size)}
            </Typography>
          </Box>
          {dataFile?.status === "active" ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Fragment>
                {isSuccess[index] ? (
                  <FileDownloadDoneIcon sx={{ color: "#17766B" }} />
                ) : isHide[index] ? (
                  <CircularProgress
                    color="success"
                    sx={{ color: "#17766B" }}
                    size={isMobile ? "18px" : "22px"}
                  />
                ) : !dataFile?.filePassword ? (
                  <IconButton
                    onClick={() => {
                      downloadFiles(
                        index,
                        dataFile?._id,
                        dataFile?.newFilename,
                        dataFile?.filename,
                        dataFile?.filePassword,
                        dataFile?.newPath || "",
                        dataFile?.createdBy,
                        dataFile,
                      );
                      setIndex(index);
                      setPassword("");
                      setGetFilenames(dataFile?.filename);
                      setGetNewFileName(dataFile?.newFilename);
                      setCheckModal(true);
                    }}
                  >
                    <DownloadIcon
                      sx={{
                        color: "#17766B",
                        fontSize: isMobile ? "17px" : "22px",
                      }}
                    />
                  </IconButton>
                ) : (
                  <IconButton
                    onClick={() => {
                      downloadFiles(
                        index,
                        dataFile?._id,
                        dataFile?.newFilename,
                        dataFile?.filename,
                        dataFile?.filePassword,
                        dataFile?.newPath || "",
                        dataFile?.createdBy,
                        dataFile,
                      );
                      setIndex(index);
                      setPassword("");
                      setGetFilenames(dataFile?.filename);
                      setGetNewFileName(dataFile?.newFilename);
                      setCheckModal(true);
                    }}
                  >
                    <FileDownloadOffIcon
                      sx={{
                        fontSize: isMobile ? "17px" : "22px",
                      }}
                    />
                  </IconButton>
                )}
              </Fragment>

              {isPublic && (
                <Fragment>
                  {!dataFile?.filePassword ? (
                    <IconButton>
                      <LockOpenIcon
                        sx={{
                          color: "#17766B",
                          fontSize: isMobile ? "17px" : "22px",
                        }}
                      />
                    </IconButton>
                  ) : (
                    <IconButton
                      onClick={() => {
                        setIndex(index);
                        downloadFiles(
                          index,
                          dataFile?._id,
                          dataFile?.newFilename,
                          dataFile?.filename,
                          dataFile?.filePassword,
                          dataFile?.newPath || "",
                          dataFile?.createdBy,
                          dataFile,
                        );
                        setPassword("");
                        setGetFilenames(dataFile?.filename);
                        setGetNewFileName(dataFile?.newFilename);
                        setCheckModal(true);
                      }}
                    >
                      <LockIcon
                        sx={{
                          fontSize: isMobile ? "16px" : "22px",
                        }}
                      />
                    </IconButton>
                  )}
                </Fragment>
              )}

              <Tooltip title="Generate QR code" placement="top">
                <IconButton
                  onClick={(e) => handleQRGeneration(e, dataFile, currentURL)}
                >
                  <QrCode2Icon
                    sx={{
                      color: "#17766B",
                      fontSize: isMobile ? "16px" : "22px",
                    }}
                  />
                </IconButton>
              </Tooltip>
            </Box>
          ) : (
            <Fragment>
              <Chip
                label="File removed"
                icon={<FaTimes fontSize={16} />}
                sx={{ fontWeight: "bold" }}
                color="error"
              />
            </Fragment>
          )}
        </DivDownloadFileBox>
      ))}

      {hasFileWithoutPassword && fileTotal > 1 ? (
        <Box
          sx={{
            textAlign: "end",
            background: "none",
          }}
        >
          {isDownloadAll ? (
            <Tooltip title="Only download files without password">
              <Button variant="outlined" style={{ width: "140px" }}>
                <FileDownloadDoneIcon sx={{ color: "#17766B" }} />
                Success
              </Button>
            </Tooltip>
          ) : (
            <Fragment>
              {hideDownload ? (
                <Tooltip title="Only download files without password">
                  <Button
                    variant="outlined"
                    style={{ width: "140px" }}
                    onClick={() => downloadFilesAll(dataFiles)}
                  >
                    {isProcessing ? (
                      <CircularProgress
                        color="success"
                        sx={{ color: "#17766B" }}
                        size={isMobile ? "18px" : "22px"}
                      />
                    ) : (
                      <DownloadIcon
                        sx={{
                          color: "#17766B",
                          fontSize: isMobile ? "16px" : "22px",
                        }}
                      />
                    )}
                    &nbsp;Download all{" "}
                  </Button>
                </Tooltip>
              ) : null}
            </Fragment>
          )}
        </Box>
      ) : null}
    </Fragment>
  );
}

export default CardFileDownloader;
