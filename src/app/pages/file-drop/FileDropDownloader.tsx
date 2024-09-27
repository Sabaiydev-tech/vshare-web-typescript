import { useLazyQuery, useMutation } from "@apollo/client";
import { styled } from "@mui/material/styles";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

// components and function
import axios from "axios";
import { NavLink } from "react-router-dom";
import * as Mui from "./styles/fileDropDownloader.style";

// material ui
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Typography,
  createTheme,
  useMediaQuery,
} from "@mui/material";
import {
  CREATE_DETAIL_ADVERTISEMENT,
  QUERY_ADVERTISEMENT,
} from "api/graphql/ad.graphql";
import { UPDATE_FILE_PUBLIC } from "api/graphql/file.graphql";
import {
  QUERY_FILE_DROP_PUBLIC,
  QUERY_FILE_DROP_PUBLIC_URL,
} from "api/graphql/fileDrop.graphql";
import { QUERY_SETTING } from "api/graphql/setting.graphql";
import DialogShowFiledrop from "components/dialog/DialogShowFiledrop";
import { ENV_KEYS } from "constants/env.constant";
import useManageGraphqlError from "hooks/useManageGraphqlError";
import moment from "moment";
import { errorMessage, successMessage } from "utils/alert.util";

import useManageFiles from "hooks/useManageFile";
import DialogPreviewQRcode from "components/dialog/DialogPreviewQRCode";
import DropGridData from "./DropGridData";
import DeepLink from "components/presentation/DeepLink";

const FiledropContainer = styled(Container)({
  // marginTop: "5rem",
  textAlign: "center",
  // padding: "4rem 0",
});

const UploadArea = styled(Box)(({ theme }) => ({
  padding: "2rem",
  borderRadius: "6px",
  background: "#ECF4F3",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  b: {
    color: "#4B465C",
    fontSize: "1.2rem",
    fontWeight: "600",
    padding: "0 !important",
  },
  p: {
    color: "#4B465C",
    fontSize: "0.8rem",
    fontWeight: "600",
    marginBottom: "1.5rem",
    width: "50%",
  },
  [theme.breakpoints.down("sm")]: {
    padding: "2rem 0",
    p: {
      fontSize: "0.8rem",
    },
  },
}));

const ExpiredArea = styled(Box)(({ theme }) => ({
  marginTop: "5rem",
  padding: "10rem 0",
  textAlign: "center",
  h1: { margin: 0, color: "#5D596C" },
  h4: { margin: "0.5rem 0", color: "#6F6B7D" },
  [theme.breakpoints.down("sm")]: {
    padding: "5rem 1rem",
    h1: {
      fontSize: "18px",
    },
  },
}));

////display files zone
const FileListContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  flex: 1,
  gap: 6,
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
  },
}));

function FileDropDownloader() {
  const theme = createTheme();
  const manageGraphqlError = useManageGraphqlError();
  const [clickUpload, setClickUpload] = useState(false);
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<any[]>([]);
  const [queryFile, setQueryFile] = useState<any[]>([]);
  const [userId, setUserId] = useState(0);
  const [newName, setNewName] = useState("");
  const [folderId, setFolderId] = useState(null);
  const [dataIp, setDataIP] = useState("");
  const [path, setPath] = useState("");
  const [newPath, setNewPath] = useState("");
  const [folderNewName, setFolderNewName] = useState("");
  const [status, setStatus] = useState("");
  const [getActionButton, setGetActionButton] = useState<any>();
  const [getAdvertisemment, setGetAvertisement] = useState<any>([]);
  const [usedAds, setUsedAds] = useState<any[]>([]);
  const [lastClickedButton, setLastClickedButton] = useState<any[]>([]);
  const [totalClickCount, setTotalClickCount] = useState(0);
  const [isHide, setIsHide] = useState<any>(false);
  const [isSuccess, setIsSuccess] = useState<any>(false);
  const isMobile = useMediaQuery("(max-width: 600px)");
  const [dataFromUrl, setDataFromUrl] = useState<any>({});
  const manageFile = useManageFiles();
  const [showQrCode, setShowQrCode] = useState(false);
  const [dataForEvent, setDataForEvent] = useState<any>({
    data: {},
    action: "",
  });

  const currentURL = window.location.href;
  const appSchema = ENV_KEYS.VITE_APP_DEEP_LINK + currentURL;
  const [showDeepLink, setShowDeepLink] = useState(false);

  const [timeLeft, setTimeLeft] = useState("");
  const [multiId, setMultiId] = useState<any>([]);
  const [platform, setPlatform] = useState("");
  const [isUploadMultiples, setIsUploadMultiples] = useState(false);
  // const [selectedRow, setSelectedRow] = React.useState([]);
  const [getDataButtonDownload, { data: getDataButtonDL }] = useLazyQuery(
    QUERY_SETTING,
    {
      fetchPolicy: "cache-and-network",
    },
  );

  const [createDetailAdvertisement] = useMutation(CREATE_DETAIL_ADVERTISEMENT);

  const [getAdvertisement, { data: getDataAdvertisement }] = useLazyQuery(
    QUERY_ADVERTISEMENT,
    {
      fetchPolicy: "cache-and-network",
    },
  );

  const [getFileDrop] = useLazyQuery(QUERY_FILE_DROP_PUBLIC, {
    fetchPolicy: "no-cache",
  });

  const [getUserByDropUrl, { data: dropData }] = useLazyQuery(
    QUERY_FILE_DROP_PUBLIC_URL,
    {
      fetchPolicy: "cache-and-network",
    },
  );

  const [currentUrl, setCurrentUrl] = useState("");
  const [updateFileStatus] = useMutation(UPDATE_FILE_PUBLIC);
  const data: any = [];
  const LOAD_GET_IP_URL = ENV_KEYS.VITE_APP_LOAD_GETIP_URL;

  useEffect(() => {
    const currentUrl = window.location.href;
    const fbclidIndex = currentUrl.indexOf("&fbclid");

    if (fbclidIndex !== -1) {
      const newUrl = currentUrl.slice(0, fbclidIndex);
      window.history.replaceState(null, "", newUrl);

      setCurrentUrl(newUrl);
    } else {
      setCurrentUrl(currentUrl);
    }
  }, []);

  useEffect(() => {
    getDataButtonDownload({
      variables: {
        where: {
          groupName: "file_seeting_landing_page",
          productKey: "ASALPAS",
        },
      },
    });
    getAdvertisement({
      variables: {
        where: {
          status: "active",
        },
      },
    });
    if (getDataButtonDL?.general_settings?.data[0]) {
      setGetActionButton(getDataButtonDL?.general_settings?.data[0]?.action);
    }
    if (getDataAdvertisement?.getAdvertisement?.data[0]) {
      setGetAvertisement(getDataAdvertisement?.getAdvertisement?.data);
    }
  }, [getDataButtonDL, getDataAdvertisement]);

  const handleDownloadFile = async (e, index, dataFile) => {
    if (lastClickedButton?.includes(`${dataFile?._id}`)) {
      e.preventDefault();

      try {
        setIsHide((prev) => ({
          ...prev,
          [index]: true,
        }));

        const multipleData = [
          {
            id: dataFile?._id,
            newFilename: dataFile?.newFilename,
            createdBy: dataFile?.createdBy,
          },
        ];

        manageFile.handleDownloadFile(
          { multipleData },
          {
            onSuccess: () => {
              handleUpdateFileStatus(dataFile?._id);
              successMessage("Download successful", 3000);
              setIsHide((prev) => ({
                ...prev,
                [index]: false,
              }));
              setIsSuccess((prev) => ({
                ...prev,
                [index]: true,
              }));
            },
            onFailed: () => {
              setIsHide((prev) => ({
                ...prev,
                [index]: false,
              }));
              setIsSuccess((prev) => ({
                ...prev,
                [index]: false,
              }));
              errorMessage("Something wrong try again!!", 2500);
            },
          },
        );
      } catch (error) {
        errorMessage("Something wrong try again!!", 2500);
      }
    } else {
      setTotalClickCount((prevCount) => prevCount + 1);
      if (totalClickCount >= getActionButton) {
        setLastClickedButton([...lastClickedButton, dataFile?._id]);
        setTotalClickCount(0);
        e.preventDefault();

        try {
          setIsHide((prev) => ({
            ...prev,
            [index]: true,
          }));

          const multipleData = [
            {
              id: dataFile?._id,
              newFilename: dataFile?.newFilename,
            },
          ];

          manageFile.handleDownloadPublicFile(
            { multipleData },
            {
              onSuccess: () => {
                handleUpdateFileStatus(dataFile?._id);
                successMessage("Download successful", 3000);
                setIsHide((prev) => ({
                  ...prev,
                  [index]: false,
                }));
                setIsSuccess((prev) => ({
                  ...prev,
                  [index]: true,
                }));
              },
              onFailed: () => {
                setIsHide((prev) => ({
                  ...prev,
                  [index]: false,
                }));
                setIsSuccess((prev) => ({
                  ...prev,
                  [index]: false,
                }));
                errorMessage("Something wrong try again!!", 2500);
              },
            },
          );
        } catch (error) {
          errorMessage("Something wrong try again!!", 2500);
        }
      } else {
        if (getAdvertisemment.length) {
          handleAdvertisementPopup();
        } else {
          e.preventDefault();
          try {
            setIsHide((prev) => ({
              ...prev,
              [index]: true,
            }));

            const multipleData = [
              {
                id: dataFile?._id,
                newFilename: dataFile?.newFilename,
              },
            ];

            manageFile.handleDownloadPublicFile(
              { multipleData },
              {
                onSuccess: () => {
                  handleUpdateFileStatus(dataFile?._id);
                  successMessage("Download successful", 3000);
                  setIsHide((prev) => ({
                    ...prev,
                    [index]: false,
                  }));
                  setIsSuccess((prev) => ({
                    ...prev,
                    [index]: true,
                  }));
                },
                onFailed: () => {
                  setIsHide((prev) => ({
                    ...prev,
                    [index]: false,
                  }));
                  setIsSuccess((prev) => ({
                    ...prev,
                    [index]: false,
                  }));
                  errorMessage("Something wrong try again!!", 2500);
                },
              },
            );
          } catch (error) {
            errorMessage("Something wrong try again!!", 2500);
          }
        }
      }
    }
  };

  async function getDataIP() {
    const result = await axios.get(LOAD_GET_IP_URL);

    const resData = await result.data;
    setDataIP(resData);
  }

  function handleClosePreviewQR() {
    setDataForEvent({
      action: "",
      data: {},
    });
    setShowQrCode(false);
  }

  function menuOnClick(action: string) {
    switch (action) {
      case "preview-qr":
        setShowQrCode(true);
        return;

      default:
        break;
    }
  }

  useEffect(() => {
    if (dataForEvent.action) {
      menuOnClick(dataForEvent.action);
    }
  }, [dataForEvent.action]);

  useEffect(() => {
    getDataIP();
  }, []);

  const onDrop = useCallback(
    (acceptedFiles) => {
      setFiles([...files, ...acceptedFiles]);
      setOpen(true);
    },
    [files],
  );

  React.useEffect(() => {
    if (!currentUrl) {
      return;
    }

    getUserByDropUrl({
      variables: {
        where: {
          url: currentUrl,
        },
      },
      onError: (err) => {
        setStatus("expired");
        const cutErr = err?.message?.replace(/(ApolloError: )?Error: /, "");

        if (err?.message === "Url not allow to upload") {
          setStatus("locked");
        }

        errorMessage(
          manageGraphqlError.handleErrorMessage(
            cutErr || err?.message || "Something went wrong, Please try again",
          ) as string,
          2000,
        );
      },
      onCompleted: (data) => {
        const item = data?.getPublicFileDropUrl?.data[0];

        setStatus(item?.status || "expired");

        if (item?.createdBy?._id > 0 || item?.createdBy?._id) {
          setDataFromUrl(item);
          setUserId(item?.createdBy?._id);
          setNewName(item?.createdBy?.newName);
          setFolderId(item?.folderId?._id);
          setPath(item?.folderId?.path);
          setNewPath(item?.folderId?.newPath);
          setFolderNewName(item?.folderId?.newFolder_name);
        }

        ///check permission allow to upload/upload multi
        // if (!item?.allowUpload) {
        //   setStatus("locked");
        // }

        if (item?.allowMultiples) {
          setIsUploadMultiples(item?.allowMultiples);
        }
      },
    });
  }, [currentUrl, dropData]);

  React.useEffect(() => {
    queryGetFileDropUrl();
  }, [currentUrl, dataIp]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleRemoveAll = () => {
    setFiles([]);
    handleClose();
    // refetch();
    queryGetFileDropUrl();
  };

  const queryGetFileDropUrl = async () => {
    try {
      getFileDrop({
        variables: {
          where: {
            dropUrl: currentUrl,
            // ip: dataIp,
            status: "active",
          },
        },
        onCompleted: (data) => {
          if (data?.getFileDrop?.total == null) {
            setQueryFile([]);
          } else {
            const datas = data?.getFileDrop?.data?.map((value, index) => ({
              ...value,
              no: index + 1,
            }));

            setQueryFile(datas || []);
          }
        },
      });
    } catch (error) {
      //
    }
  };

  const handleDelete = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleUpdateFileStatus = async (_id) => {
    try {
      await updateFileStatus({
        variables: {
          data: {
            dropStatus: "closed",
          },
          where: {
            _id: _id,
          },
        },
      });
    } catch (error) {
      errorMessage("Something wrong. Try again later!", 2000);
    }
  };

  const handleAdvertisementPopup = async () => {
    const availableAds = getAdvertisemment.filter(
      (ad) => !usedAds.includes(ad._id),
    );
    if (availableAds.length === 0) {
      setUsedAds([]);
      return;
    }

    const randomIndex = Math.floor(Math.random() * availableAds.length);
    const randomAd = availableAds[randomIndex];
    setUsedAds([...usedAds, randomAd._id]);
    try {
      const responseIp = await axios.get(LOAD_GET_IP_URL);
      const _createDetailAdvertisement = await createDetailAdvertisement({
        variables: {
          data: {
            ip: String(responseIp?.data),
            advertisementsID: randomAd?._id,
          },
        },
      });
      if (_createDetailAdvertisement?.data?.createDetailadvertisements?._id) {
        let httpData = "";
        if (!randomAd.url.match(/^https?:\/\//i || /^http?:\/\//i)) {
          httpData = "http://" + randomAd.url;
        } else {
          httpData = randomAd.url;
        }

        const newWindow = window.open(httpData, "_blank");
        if (
          !newWindow ||
          newWindow.closed ||
          typeof newWindow.closed == "undefined"
        ) {
          history.pushState(null, "", window.location.href);
          window.location.href = httpData;
        }
      }
    } catch (error: any) {
      errorMessage(error, 3000);
    }
  };

  const handleMultipleDownloadFiles = () => {
    const newModelData = multiId.map((index) => {
      const options = queryFile.find((file) => file._id === index);

      if (options) {
        return options;
      }

      return {};
    });
    const multipleData = newModelData?.map((file) => {
      return {
        id: file?._id,
        name: file?.filename,
        newFilename: file?.newFilename,
        checkType: "file",
        newPath: file?.newPath,
        createdBy: file?.createdBy,
        isPublic: userId > 0 && folderId! > 0 ? false : true,
      };
    });

    setTotalClickCount((prevCount) => prevCount + 1);
    if (totalClickCount >= getActionButton) {
      setTotalClickCount(0);
      manageFile.handleDownloadFile(
        { multipleData },
        {
          onSuccess: () => {},
          onFailed: () => {},
        },
      );
    } else {
      if (getAdvertisemment?.length) {
        handleAdvertisementPopup();
      } else {
        manageFile.handleDownloadFile(
          { multipleData },
          {
            onSuccess: () => {},
            onFailed: () => {},
          },
        );
      }
    }
  };

  const handleClearSelectDataGrid = () => {
    setMultiId([]);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: isUploadMultiples,
    noClick: dataFromUrl?.allowUpload === false
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = moment();
      const expirationTime = moment(dataFromUrl?.expiredAt);
      const duration = moment.duration(expirationTime.diff(now));

      if (duration.asSeconds() <= 0) {
        setTimeLeft("This link has expired");
        return;
      }

      const formattedDate = expirationTime.format("DD/MM/YYYY");
      const formattedTime = `${Math.floor(
        duration.asHours(),
      )}h ${duration.minutes()}m ${duration.seconds()}s`;
      setTimeLeft(`${formattedDate} ${formattedTime}`);
    };

    const intervalId = setInterval(updateCountdown, 1000);

    if (dataFromUrl.expiredAt) {
      updateCountdown();
    }

    return () => clearInterval(intervalId);
  }, [dataFromUrl?.expiredAt]);

  useEffect(() => {
    if (dataFromUrl) {
      const operation = navigator.userAgent;

      if (operation.match(/iPhone|iPad|iPod/i)) {
        setPlatform("ios");
        setTimeout(() => {
          setShowDeepLink(true);
        }, 1000);
      }

      if (operation.match(/Android/i)) {
        setPlatform("android");
        setTimeout(() => {
          setShowDeepLink(true);
        }, 1000);
      }
    }
  }, [dataFromUrl]);

  return (
    <React.Fragment>
      {
        status == "expired" 
        || status === "locked" ? (
        <ExpiredArea>
          <Box
            sx={{
              textAlign: "center",
              fontSize: "1.2rem",
              fontWeight: 700,
              [theme.breakpoints.down("sm")]: {
                fontSize: "1rem",
              },
            }}
          >
            <Typography variant="h3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 300 150"
                width="300"
                height="100"
              >
                <text
                  x="80"
                  y="110"
                  fill="#17766b"
                  fontSize="50px"
                  fontFamily="Arial"
                  fontWeight="bold"
                >
                  OMG!
                </text>
              </svg>
            </Typography>
            {`Unfortunately, the link was ${
              status === "locked" ? status + " by the owner" : status
            }.`}
          </Box>
          <Box
            sx={{
              textAlign: "center",
              fontSize: "0.9rem",
              margin: "0.5rem 0",
              fontWeight: 500,
            }}
          >
            You do not have permission to view this page using the credentials
            that you have provided while login.
          </Box>
          <Box
            sx={{ textAlign: "center", fontSize: "0.9rem", fontWeight: 500 }}
          >
            Please contact your site administrator.
          </Box>
          <Button
            variant="contained"
            component={NavLink}
            to="/filedrops"
            sx={{ mt: 7 }}
          >
            Get new link
          </Button>
          <br />
        </ExpiredArea>
      ) : (
        <Box sx={{ backgroundColor: "#ECF4F3", padding: "3rem 1rem" }}>
          <FiledropContainer
            sx={{
              [theme.breakpoints.down("sm")]: {
                padding: "0 1rem",
              },
            }}
          >
            <UploadArea>
              <Typography component="b">
                {dataFromUrl?.title ? dataFromUrl?.title : ""}
              </Typography>
              <Typography component="p">
                {dataFromUrl?.description ? dataFromUrl?.description : ""}
              </Typography>
              <Mui.BoxShowUploadDetail {...getRootProps()}>
                <Box
                  sx={{
                    padding: "0.3rem",
                    borderRadius: "6px",
                    background: "#DFE6E7"
                  }}
                >
                  <FileUploadOutlinedIcon
                    sx={{ fontSize: "30px", color: "#5D596C" }}
                  />
                </Box>

                <Box className="box-drag" sx={{ m: 3}}>
                  <Typography component="span">
                    
                    {
                      dataFromUrl?.allowUpload 
                      ? 'Drag and drop your files here to upload'
                      : <Typography component={'span'} sx={{color: '#e31f09 !important', fontWeight: '300 !important'}}>Admin has not enable to upload file</Typography>
                    }
                  </Typography>
                </Box>
                <Mui.ButtonUpload
                  variant="contained"
                  onClick={() => {
                    setOpen(true);
                    setClickUpload(!clickUpload);
                  }}
                  startIcon={
                    <FileUploadOutlinedIcon
                      sx={{ color: "#fff", verticalAlign: "middle" }}
                    />
                  }
                >
                  Select files
                  <input {...getInputProps()} hidden={true} />
                </Mui.ButtonUpload>
              </Mui.BoxShowUploadDetail>
              <br />
              <Typography component="p" sx={{ color: "#e31f09 !important" }}>
                {dataFromUrl?.expiredAt ? (
                  <>
                    <span style={{ color: "#000" }}>
                      This link will expire in:{" "}
                    </span>
                    <span
                      style={{
                        color: "#e31f09",
                        fontWeight: "700",
                        marginLeft: "1rem",
                      }}
                    >
                      {timeLeft.replace(/h|m|s/g, (match) => `${match}`)}
                    </span>
                  </>
                ) : (
                  ""
                )}
              </Typography>
              {files.map((file, index) => {
                const newFile: any = new File([file.data], file.name, {
                  type: file.type,
                });
                newFile.id = (index + 1).toString();
                newFile.path = file.path;
                newFile.sizeFile = file.size;
                const updatedFile = { file: newFile };
                data.push(updatedFile);
                return <Fragment key={index}></Fragment>;
              })}
              {data.length > 0 && dataFromUrl?.allowUpload ? (
                <DialogShowFiledrop
                  open={open}
                  files={data}
                  onClose={handleClose}
                  onDeleteData={handleDelete}
                  selectMore={{ ...getRootProps() }}
                  onRemoveAll={handleRemoveAll}
                  dataFile={files}
                  openModal={clickUpload}
                  checkSend={() => setFiles([])}
                  userId={userId}
                  newName={newName}
                  folderId={folderId}
                  folderNewname={folderNewName}
                  path={path}
                  newPath={newPath}
                />
              ) : (
                ""
              )}
            </UploadArea>
            {dataFromUrl?.folderId?._id
              ? ""
              : queryFile.length > 0 && (
                  <FileListContainer>
                    <Box
                      sx={{
                        width: { xs: "100%", md: "100%" },
                        boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
                        overflow: "hidden",
                      }}
                    >
                      <Card>
                        <Typography
                          variant="h4"
                          sx={{ textAlign: "start", padding: "1rem .5rem" }}
                        >
                          {dataFromUrl?.title
                            ? dataFromUrl?.title
                            : "File List"}
                        </Typography>
                        <CardContent
                          sx={{
                            paddingLeft: "0 !important",
                            paddingRight: "0 !important",
                          }}
                        >
                          <DropGridData
                            queryFile={queryFile}
                            dataFromUrl={dataFromUrl}
                            multipleIds={multiId}
                            isHide={isHide}
                            isSuccess={isSuccess}
                            isMobile={isMobile}
                            setMultiId={setMultiId}
                            handleDownloadFile={handleDownloadFile}
                            handleMultipleDownloadFiles={
                              handleMultipleDownloadFiles
                            }
                            handleClearSelection={handleClearSelectDataGrid}
                            handleQrCode={(data, action) => {
                              setDataForEvent({
                                data,
                                action,
                              });
                            }}
                          />
                        </CardContent>
                      </Card>
                    </Box>
                  </FileListContainer>
                )}
          </FiledropContainer>
        </Box>
      )}

      {showQrCode && (
        <DialogPreviewQRcode
          isOpen={showQrCode}
          data={dataForEvent.data?.longUrl || ""}
          onClose={handleClosePreviewQR}
        />
      )}

      <DeepLink
        platform={platform}
        showBottom={showDeepLink}
        scriptScheme={appSchema}
        onClose={() => {
          setShowDeepLink(false);
        }}
      />
    </React.Fragment>
  );
}

export default FileDropDownloader;
