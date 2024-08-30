import { useLazyQuery, useMutation } from "@apollo/client";
import axios from "axios";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// components
import GridIcon from "@mui/icons-material/AppsOutlined";
import ListIcon from "@mui/icons-material/FormatListBulletedOutlined";
import {
  Box,
  Button,
  Card,
  Grid,
  IconButton,
  Typography,
  useMediaQuery,
} from "@mui/material";
import {
  CREATE_DETAIL_ADVERTISEMENT,
  QUERY_ADVERTISEMENT,
  QUERY_MANAGE_LINK_DETAIL,
} from "api/graphql/ad.graphql";
import {
  QUERY_FILE_GET_LINK,
  QUERY_FILE_PUBLIC,
  QUERY_FILE_PUBLICV2,
} from "api/graphql/file.graphql";
import {
  QUERY_FOLDER_PUBLIC_LINK,
  QUERY_FOLDER_PUBLICV1,
} from "api/graphql/folder.graphql";
import { QUERY_SETTING } from "api/graphql/setting.graphql";
import { QUERY_USER } from "api/graphql/user.graphql";
import DialogConfirmPassword from "components/dialog/DialogConfirmPassword";
import DialogPreviewQRcode from "components/dialog/DialogPreviewQRCode";
// import Advertisement from "components/presentation/Advertisement";
import BoxSocialShare from "components/presentation/BoxSocialShare";
import DialogConfirmQRCode from "components/presentation/DialogConfirmQRCode";
import FileCardContainer from "components/presentation/FileCardContainer";
import FileCardItem from "components/presentation/FileCardItem";
import ListFileData from "components/presentation/ListFileData";
import { ENV_KEYS } from "constants/env.constant";
import CryptoJS from "crypto-js";
import useManageFiles from "hooks/useManageFile";
import useManageSetting from "hooks/useManageSetting";
import Helmet from "react-helmet";
import { FaTrash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import * as selectorAction from "stores/features/selectorSlice";
import { errorMessage, successMessage } from "utils/alert.util";
import {
  combineOldAndNewFileNames,
  cutFileName,
  removeFileNameOutOfPath,
} from "utils/file.util";
import { decryptDataLink, encryptDataLink } from "utils/secure.util";
import * as MUI from "./styles/fileUploader.style";
import "./styles/fileUploader.style.css";
import ListFolderData from "components/presentation/ListFolderData";
import BaseNormalButton from "components/BaseNormalButton";
import VideoCardComponent from "components/VideoComponent";

function FileUploader() {
  const location = useLocation();
  const isMobile = useMediaQuery("(max-width: 600px)");
  const [checkConfirmPassword, setConfirmPassword] = useState(false);
  const [getDataRes, setGetDataRes] = useState<any>(null);
  const [folderDownload, setFolderDownload] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [filePasswords, setFilePasswords] = useState<any>("");
  const [getNewFileName, setGetNewFileName] = useState("");
  const [fileQRCodePassword, setFileQRCodePassword] = useState("");
  const [toggle, setToggle] = useState(
    localStorage.getItem("toggle") ? localStorage.getItem("toggle") : "list",
  );

  const [checkModal, setCheckModal] = useState(false);
  const [getFilenames, setGetFilenames] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [isVerifyQrCode, setIsVerifyQRCode] = useState(false);
  const [fileUrl, setFileUrl] = useState("");
  const [getActionButton, setGetActionButton] = useState<any>();
  const [getAdvertisemment, setGetAvertisement] = useState<any>([]);

  const [usedAds, setUsedAds] = useState<any[]>([]);
  const [lastClickedButton, setLastClickedButton] = useState<any>([]);
  const [totalClickCount, setTotalClickCount] = useState(0);
  const [adAlive, setAdAlive] = useState(0);

  const [isHide, setIsHide] = useState<any>(false);
  const [isSuccess, setIsSuccess] = useState<any>(false);

  const [isMultipleHide, setIsMultipleHide] = useState<any>(false);
  const [isMultipleSuccess, setIsMultipleSuccess] = useState<any>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dataValue, setDataValue] = useState<any>(null);
  const [platform, setPlatform] = useState("");
  const [showBottomDeep, setShowBottomDeep] = useState(false);
  const [_description, setDescription] = useState("No description");

  const [multipleType, setMultipleType] = useState("");
  const [fileDataSelect, setFileDataSelect] = useState<any>(null);
  const [folderDataSelect, setFolderDataSelect] = useState<any>(null);
  const [dataMultipleFile, setDataMultipleFile] = useState<any[]>([]);
  const [dataMultipleFolder, setDataMultipleFolder] = useState<any[]>([]);

  const params = new URLSearchParams(location.search);
  const linkValue = params.get("l");
  const urlClient = params.get("lc");
  const userqrcode = params.get("qr");
  const currentURL = window.location.href;
  const navigate = useNavigate();

  const LOAD_GET_IP_URL = ENV_KEYS.VITE_APP_LOAD_GETIP_URL;

  // Deep linking for mobile devices
  const appScheme = "vshare.app://download?url=" + currentURL;

  const [multipleIds, setMultipleIds] = useState<any[]>([]);
  const [multipleFolderIds, setMultipleFolderIds] = useState<any[]>([]);

  // const [qrcodeUser, setQrcodeUser] = useState([]);
  const [index, setIndex] = useState<any>(null);
  const [hideDownload, seHideDownload] = useState(true);
  const [getData, { data: resPonData }] = useLazyQuery(QUERY_FILE_PUBLIC, {
    fetchPolicy: "cache-and-network",
  });

  const dataSelector = useSelector(
    selectorAction.checkboxFileAndFolderSelector,
  );
  const dispatch = useDispatch();

  // hooks
  const manageFile = useManageFiles();

  const [getFileLink, { data: dataFileLink }] = useLazyQuery(
    QUERY_FILE_GET_LINK,
    {
      fetchPolicy: "cache-and-network",
    },
  );

  const [getMultipleFile] = useLazyQuery(QUERY_FILE_PUBLICV2, {
    fetchPolicy: "cache-and-network",
  });

  const [getMultipleFolder] = useLazyQuery(QUERY_FOLDER_PUBLICV1, {
    fetchPolicy: "cache-and-network",
  });

  const [getManageLinkDetail, { data: dataFileAndFolderLink }] = useLazyQuery(
    QUERY_MANAGE_LINK_DETAIL,
    {
      fetchPolicy: "cache-and-network",
    },
  );

  const [getFolderLink, { data: dataFolderLink }] = useLazyQuery(
    QUERY_FOLDER_PUBLIC_LINK,
  );

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
  const settingKeys = {
    downloadKey: "HDLABTO",
  };
  const useDataSetting = useManageSetting();
  const [getUser] = useLazyQuery(QUERY_USER, {
    fetchPolicy: "no-cache",
  });

  let linkClient = useMemo(() => ({ _id: "", type: "" }), []);

  try {
    if (urlClient) {
      const decode = handleDecryptFile(urlClient);
      linkClient = {
        _id: decode?._id,
        type: decode?.type,
      };
    }
  } catch (error) {
    console.error(error);
  }

  function handleDecryptFile(val) {
    const decryptedData = decryptDataLink(val);
    return decryptedData;
  }

  function handleClearFileSelection() {
    setMultipleIds([]);
  }

  function handleClearFolderSelection() {
    setMultipleFolderIds([]);
  }

  const handleEscKey = (event: KeyboardEvent): void => {
    if (event.key === "Escape") {
      handleClearSelector();
    }
  };

  const handleKeyDown = (event: Event) =>
    handleEscKey(event as unknown as KeyboardEvent);

  function handleClearSelector() {
    dispatch(selectorAction.setRemoveFileAndFolderData());
  }

  function handleToggle() {
    setMultipleIds([]);
    setMultipleFolderIds([]);
    handleClearSelector();
    if (toggle === "list") {
      setToggle("grid");
      localStorage.setItem("toggle", "grid");
    } else {
      setToggle("list");
      localStorage.setItem("toggle", "list");
    }
  }

  // get Download button
  useEffect(() => {
    function getDataSetting() {
      // Show download button
      const downloadData = useDataSetting.data?.find(
        (data) => data?.productKey === settingKeys.downloadKey,
      );
      if (downloadData) {
        if (downloadData?.status === "on") seHideDownload(false);
      }
    }

    getDataSetting();
  }, [useDataSetting.data]);

  // get User
  useEffect(() => {
    getUser({
      variables: {
        where: {
          newName: userqrcode,
        },
      },
    });
  }, []);

  useEffect(() => {
    handleClearSelector();
  }, [navigate, dispatch]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (getActionButton) {
      const actionButton = getActionButton - totalClickCount;
      if (totalClickCount >= getActionButton) {
        setAdAlive(0);
      } else {
        setAdAlive(actionButton);
      }
    }
  }, [totalClickCount, getActionButton]);

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
      const countAction =
        getDataButtonDL?.general_settings?.data[0]?.action || 0;
      setGetActionButton(parseInt(`${countAction}`));
    }

    if (getDataAdvertisement?.getAdvertisement?.data[0]) {
      setGetAvertisement(getDataAdvertisement?.getAdvertisement?.data);
    }
  }, [getDataButtonDL, getDataAdvertisement]);

  useEffect(() => {
    const getLinkData = async () => {
      try {
        if (linkClient?._id) {
          if (linkClient?.type === "file") {
            setIsLoading(true);

            await getFileLink({
              variables: {
                where: {
                  _id: linkClient?._id,
                },
              },
            });

            setTimeout(() => {
              setIsLoading(false);
            }, 500);

            if (dataFileLink?.queryFileGetLinks?.data) {
              document.title =
                dataFileLink?.queryFileGetLinks?.data?.[0]?.filename ||
                "Vshare download file";

              if (dataFileLink?.queryFileGetLinks?.data?.[0]) {
                setDescription(
                  dataFileLink?.queryFileGetLinks?.data?.[0]?.filename +
                    " Vshare.net",
                );
              }
              setGetDataRes(dataFileLink?.queryFileGetLinks?.data || []);
            }
          }

          if (linkClient?.type === "folder") {
            setIsLoading(true);
            await getFolderLink({
              variables: {
                where: {
                  _id: linkClient?._id,
                },
              },
            });
            setTimeout(() => {
              setIsLoading(false);
            }, 500);

            const folderData = dataFolderLink?.queryfoldersGetLinks?.data || [];

            if (folderData?.[0]?.status === "active") {
              setGetDataRes(folderData || []);
              setFolderDownload(folderData || []);

              document.title =
                folderData?.[0]?.folder_name || "Vshare download folder";
              if (folderData && folderData?.[0]?.folder_type) {
                if (folderData[0]?.folder_name) {
                  setDescription(folderData[0]?.folder_name + " Vshare.net");
                }
              }
            }
          }
        } else {
          setIsLoading(true);
          getData({
            variables: {
              where: {
                urlAll: linkValue ? String(linkValue) : null,
              },
            },
          });

          setTimeout(() => {
            setIsLoading(false);
          }, 500);
          if (resPonData) {
            const fileData = resPonData?.filesPublic?.data?.[0];
            const title = cutFileName(
              combineOldAndNewFileNames(
                fileData?.filename,
                fileData?.newFilename,
              ) as string,
              10,
            );
            setDescription(`${title} Vshare.net`);
            document.title = title;
            setGetDataRes(resPonData?.filesPublic?.data);
          }
        }
      } catch (error: any) {
        setIsLoading(false);
        errorMessage(error);
      }
    };

    getLinkData();

    // return () => {
    //   document.title = "Download folder and file"; // Reset the title when the component unmounts
    // };
  }, [linkValue, urlClient, dataFileLink, dataFolderLink, resPonData]);

  useEffect(() => {
    const getMultipleFileAndFolder = async () => {
      const os = navigator.userAgent;

      try {
        if (linkClient?._id)
          if (linkClient?.type === "multiple") {
            setIsLoading(true);

            await getManageLinkDetail({
              variables: {
                where: { _id: linkClient?._id },
              },
            });

            const mainData =
              dataFileAndFolderLink?.getManageLinkDetails?.data || [];

            if (mainData?.length > 0) {
              if (os.match(/iPhone|iPad|iPod/i)) {
                setPlatform("ios");
                setTimeout(() => {
                  setShowBottomDeep(true);
                }, 1000);
              } else if (os.match(/Android/i)) {
                setPlatform("android");
                setTimeout(() => {
                  setShowBottomDeep(true);
                }, 1000);
              }
              const fileData = mainData?.filter((file) => file.type === "file");
              const folderData = mainData?.filter(
                (folder) => folder.type === "folder",
              );

              if (folderData?.length > 0) {
                const resultFolders = await Promise.all(
                  folderData.map(async (folder) => {
                    const resFolder = await getMultipleFolder({
                      variables: {
                        id: folder?.folderId,
                      },
                    });
                    const resData = resFolder.data?.folderPublic?.data || [];
                    if (resData?.length) {
                      return resData;
                    }
                    return [];
                  }),
                );

                const dataFoldersFlat = resultFolders.flat();
                setDataMultipleFolder(dataFoldersFlat);
              }

              if (fileData?.length > 0) {
                const resultFiles = await Promise.all(
                  await fileData.map(async (file) => {
                    const result = await getMultipleFile({
                      variables: {
                        id: [file?.fileId],
                      },
                    });

                    const resData = result.data?.filePublic?.data || [];

                    if (resData?.length) {
                      return resData;
                    }
                    return [];
                  }),
                );

                const dataFilesFlat = resultFiles.flat();
                setDataMultipleFile(dataFilesFlat);
              }
            }

            setIsLoading(false);
            document.title = "Multiple File and folder";
            setDescription("Multiple File and folder on vshare.net");
          }
      } catch (error) {
        document.title = "No documents found";
        setDescription("No documents found on vshare.net");
        setIsLoading(false);
      }
    };
    getMultipleFileAndFolder();
  }, [dataFileAndFolderLink]);

  useEffect(() => {
    function handleDetectPlatform() {
      const os = navigator.userAgent;
      try {
        if (
          dataFileLink?.queryFileGetLinks?.data?.length ||
          dataFolderLink?.queryfoldersGetLinks?.data?.length
        ) {
          if (os.match(/iPhone|iPad|iPod/i)) {
            setPlatform("ios");
            setTimeout(() => {
              setShowBottomDeep(true);
            }, 1000);
          } else if (os.match(/Android/i)) {
            setPlatform("android");
            ``;
            setTimeout(() => {
              setShowBottomDeep(true);
            }, 1000);
          }
        }
      } catch (error) {
        console.error(error);
      }
    }

    handleDetectPlatform();
  }, [dataFileLink, dataFolderLink]);

  useEffect(() => {
    if (getDataRes) {
      if (getDataRes[0]?.passwordUrlAll && !checkConfirmPassword) {
        handleClickOpen();
      }
    }
  }, [getDataRes]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleMobileDownloadData = () => {
    if (toggle === "list") {
      if (dataLinkMemo?.length > 0) {
        handleDownloadFileGetLink();
      }

      if (dataFolderLinkMemo?.length > 0) {
        handleDownloadFolderGetLink();
      }
    }

    if (toggle === "grid") {
      handleDownloadGridFileAndFolder();
    }
  };

  const handleDownloadGridFileAndFolder = async () => {
    if (dataSelector?.selectionFileAndFolderData?.length > 0) {
      const newModelData = dataSelector?.selectionFileAndFolderData || [];
      const multipleData = newModelData.map((file: any) => {
        const newPath = file.newPath || "";

        return {
          id: file.id,
          name: file.name,
          newFilename: file.newFilename,
          checkType: file?.checkType || "file",
          newPath,
          createdBy: file.createdBy,
        };
      });

      setTotalClickCount((prevCount) => prevCount + 1);

      if (totalClickCount >= getActionButton) {
        setTotalClickCount(0);
        manageFile.handleDownloadFile(
          {
            multipleData,
          },
          {
            onFailed: () => {},
            onSuccess: () => {},
          },
        );
      } else {
        if (getAdvertisemment.length) {
          handleAdvertisementPopup();
        } else {
          manageFile.handleDownloadFile(
            {
              multipleData,
            },
            {
              onFailed: () => {},
              onSuccess: () => {},
            },
          );
        }
      }
    }
  };

  const handleDownloadFileGetLink = async () => {
    if (multipleIds?.length > 0) {
      const newModelData = multipleIds.map((value) => {
        const newVal = dataLinkMemo?.find((file) => file._id === value);

        if (newVal) {
          return newVal;
        }

        return "";
      });

      const multipleData = newModelData.map((file) => {
        const newPath = file.newPath || "";

        return {
          id: file._id,
          name: file.filename,
          newFilename: file.newFilename,
          checkType: "file",
          newPath,
          createdBy: file.createdBy,
          isPublic: linkClient?._id ? false : true,
        };
      });

      setTotalClickCount((prevCount) => prevCount + 1);

      if (totalClickCount >= getActionButton) {
        setTotalClickCount(0);
        manageFile.handleDownloadFile(
          {
            multipleData,
          },
          {
            onFailed: () => {},
            onSuccess: () => {},
          },
        );
      } else {
        if (getAdvertisemment.length) {
          handleAdvertisementPopup();
        } else {
          manageFile.handleDownloadFile(
            {
              multipleData,
            },
            {
              onFailed: () => {},
              onSuccess: () => {},
            },
          );
        }
      }
    }

    if (dataSelector?.selectionFileAndFolderData?.length > 0) {
      const newModelData = dataSelector?.selectionFileAndFolderData || [];

      const multipleData = newModelData.map((file) => {
        const newPath = file.newPath || "";

        return {
          id: file.id,
          name: file.name,
          newFilename: file.newFilename,
          checkType: "file",
          newPath,
          createdBy: file.createdBy,
          isPublic: linkClient?._id ? false : true,
        };
      });

      setTotalClickCount((prevCount) => prevCount + 1);

      if (totalClickCount >= getActionButton) {
        setTotalClickCount(0);
        manageFile.handleDownloadFile(
          {
            multipleData,
          },
          {
            onFailed: () => {},
            onSuccess: () => {},
          },
        );
      } else {
        if (getAdvertisemment.length) {
          handleAdvertisementPopup();
        } else {
          manageFile.handleDownloadFile(
            {
              multipleData,
            },
            {
              onFailed: () => {},
              onSuccess: () => {},
            },
          );
        }
      }
    }
  };

  const handleDownloadFolderGetLink = async () => {
    if (multipleFolderIds?.length > 0) {
      const newModelData = multipleFolderIds.map((value: any) => {
        const newVal = dataFolderLinkMemo?.find(
          (file: any) => file?._id === value,
        );

        if (newVal) {
          return newVal;
        }

        return "";
      });

      const multipleData = newModelData.map((file: any) => {
        const newPath = file.newPath || "";

        return {
          id: file._id,
          name: file.folder_name,
          newFilename: file.newFolder_name,
          checkType: "folder",
          newPath,
          createdBy: file.createdBy,
        };
      });

      setTotalClickCount((prevCount) => prevCount + 1);
      setMultipleType("file");

      if (totalClickCount >= getActionButton) {
        setTotalClickCount(0);
        manageFile.handleDownloadFolder(
          {
            multipleData,
          },
          {
            onFailed: () => {},
            onSuccess: () => {},
          },
        );
      } else {
        if (getAdvertisemment.length) {
          handleAdvertisementPopup();
        } else {
          manageFile.handleDownloadFolder(
            {
              multipleData,
            },
            {
              onFailed: () => {},
              onSuccess: () => {},
            },
          );
        }
      }
    }
    if (dataSelector?.selectionFileAndFolderData?.length > 0) {
      const newModelData = dataSelector?.selectionFileAndFolderData || [];

      const multipleData = newModelData.map((file: any) => {
        const newPath = file.newPath || "";

        return {
          id: file.id,
          name: file.name,
          newFilename: file.newFilename,
          checkType: "folder",
          newPath,
          createdBy: file.createdBy,
        };
      });

      setTotalClickCount((prevCount) => prevCount + 1);
      setMultipleType("folder");

      if (totalClickCount >= getActionButton) {
        setTotalClickCount(0);
        manageFile.handleDownloadFolder(
          {
            multipleData,
          },
          {
            onFailed: () => {},
            onSuccess: () => {},
          },
        );
      } else {
        if (getAdvertisemment.length) {
          handleAdvertisementPopup();
        } else {
          manageFile.handleDownloadFolder(
            {
              multipleData,
            },
            {
              onFailed: () => {},
              onSuccess: () => {},
            },
          );
        }
      }
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
          window.location.href = httpData;
        }
      }
    } catch (error: any) {
      errorMessage(error, 3000);
    }
  };

  const handleOpenApplication = () => {
    const timeout = setTimeout(() => {
      if (platform === "android") {
        window.location.href =
          "https://play.google.com/store/apps/details?id=com.vshare.app.client";
      }

      if (platform === "ios") {
        window.location.href =
          "https://apps.apple.com/la/app/vshare-file-transfer-app/id6476536606";
      }
    }, 1500);

    window.location.href = appScheme;

    window.onblur = () => {
      clearTimeout(timeout);
    };
  };

  const handleDownloadAsZip = async () => {
    if (dataLinkMemo?.length > 0) {
      const multipleData = dataLinkMemo.map((file) => {
        const newPath = file.newPath || "";

        return {
          id: file._id,
          name: file.filename,
          newFilename: file.newFilename,
          checkType: "file",
          newPath,
          createdBy: file.createdBy,
          isPublic: linkClient?._id ? false : true,
        };
      });

      setTotalClickCount((prevCount) => prevCount + 1);
      setMultipleType("file");

      if (totalClickCount >= getActionButton) {
        setTotalClickCount(0);
        manageFile.handleDownloadFile(
          {
            multipleData,
          },
          {
            onFailed: () => {},
            onSuccess: () => {},
          },
        );
      } else {
        if (getAdvertisemment.length) {
          handleAdvertisementPopup();
        } else {
          manageFile.handleDownloadFile(
            {
              multipleData,
            },
            {
              onFailed: () => {},
              onSuccess: () => {},
            },
          );
        }
      }
    }

    if (dataFolderLinkMemo?.length > 0) {
      const multipleData = dataFolderLinkMemo.map((file: any) => {
        const newPath = file.newPath || "";

        return {
          id: file._id,
          name: file.folder_name,
          newFilename: file.newFolder_name,
          checkType: "folder",
          newPath,
          createdBy: file.createdBy,
        };
      });

      setTotalClickCount((prevCount) => prevCount + 1);
      setMultipleType("folder");

      if (totalClickCount >= getActionButton) {
        setTotalClickCount(0);

        manageFile.handleDownloadFolder(
          {
            multipleData,
          },
          {
            onFailed: () => {},
            onSuccess: () => {},
          },
        );
      } else {
        if (getAdvertisemment.length) {
          handleAdvertisementPopup();
        } else {
          manageFile.handleDownloadFolder(
            {
              multipleData,
            },
            {
              onFailed: () => {},
              onSuccess: () => {},
            },
          );
        }
      }
    }
  };

  const _downloadFiles = async (
    index,
    fileId,
    newFilename,
    filename,
    filePassword,
    newPath,
    createdBy,
    dataFile,
  ) => {
    setTotalClickCount((prevCount) => prevCount + 1);
    setFileDataSelect({ ...dataFile, newPath, createdBy });
    setMultipleType("file");

    if (totalClickCount >= getActionButton) {
      setLastClickedButton([...lastClickedButton, fileId]);
      setTotalClickCount(0);
      const changeFilename = combineOldAndNewFileNames(filename, newFilename);

      try {
        setFilePasswords(filePassword);
        setGetNewFileName(newFilename);
        if (linkClient?._id) {
          if (filePassword) {
            handleClickOpen();
          } else {
            handleDoneDownloadFiles({
              index,
              filename,
              newFilename,
              createdBy,
              dataFile,
            });
          }
        } else {
          if (filePassword) {
            handleClickOpen();
          } else {
            handleDoneDownloadFilesOnPublic({
              index,
              changeFilename,
              newFilename: dataFile?.newFilename,
              dataFile,
            });
          }
        }
      } catch (error: any) {
        errorMessage(error, 2000);
      }
    } else {
      if (getAdvertisemment.length) {
        handleAdvertisementPopup();
      } else {
        const changeFilename = combineOldAndNewFileNames(filename, newFilename);

        try {
          setFilePasswords(filePassword);
          setGetNewFileName(newFilename);

          if (filePassword) {
            handleClickOpen();
          } else {
            if (linkClient?._id) {
              handleDoneDownloadFiles({
                index,
                filename,
                newFilename,
                createdBy,
                dataFile,
              });
            } else {
              handleDoneDownloadFilesOnPublic({
                index,
                changeFilename,
                newFilename,
                dataFile,
              });
            }
          }
        } catch (error) {
          errorMessage("Something wrong try again later!", 2000);
        }
      }
    }
  };

  const handleDoneDownloadFiles = async ({
    index,
    filename,
    newFilename,
    createdBy,
    dataFile,
  }) => {
    try {
      setIsHide((prev) => ({
        ...prev,
        [index]: true,
      }));
      setIsSuccess((prev) => ({
        ...prev,
        [index]: false,
      }));

      const multipleData = [
        {
          id: dataFile._id,
          name: filename,
          newFilename: newFilename,
          checkType: "file",
          newPath: dataFile.newPath || "",
          createdBy: createdBy,
        },
      ];

      await manageFile.handleDownloadFile(
        { multipleData },
        {
          onSuccess: () => {
            setIsHide((prev) => ({
              ...prev,
              [index]: false,
            }));
            setIsSuccess((prev) => ({
              ...prev,
              [index]: true,
            }));
          },
          onFailed: (error) => {
            errorMessage(error, 3000);
            setIsHide((prev) => ({
              ...prev,
              [index]: false,
            }));
            setIsSuccess((prev) => ({
              ...prev,
              [index]: false,
            }));
          },
        },
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleDoneDownloadFilesOnPublic = async ({
    index,
    newFilename,
    changeFilename,
    dataFile,
  }) => {
    try {
      setIsHide((prev) => ({
        ...prev,
        [index]: true,
      }));
      setIsSuccess((prev) => ({
        ...prev,
        [index]: false,
      }));

      const multipleData = [
        {
          id: dataFile._id,
          name: changeFilename,
          newFilename: newFilename,
          checkType: "file",
          newPath: "",
        },
      ];

      await manageFile.handleDownloadPublicFile(
        { multipleData },
        {
          onSuccess: () => {
            setIsHide((prev) => ({
              ...prev,
              [index]: false,
            }));
            setIsSuccess((prev) => ({
              ...prev,
              [index]: true,
            }));
          },
          onFailed: (error) => {
            errorMessage(error, 3000);
            setIsHide((prev) => ({
              ...prev,
              [index]: false,
            }));
            setIsSuccess((prev) => ({
              ...prev,
              [index]: false,
            }));
          },
        },
      );
    } catch (error) {
      console.error(error);
    }
  };

  const _confirmPasword = async (password) => {
    if (!filePasswords) {
      const modifyPassword = CryptoJS.MD5(password).toString();
      const getPassword = getDataRes[0]?.passwordUrlAll;
      if (modifyPassword === getPassword) {
        setConfirmPassword(true);
        successMessage("Successful!!", 3000);
        handleClose();
      } else {
        errorMessage("Invalid password!!", 3000);
      }
    } else {
      const modifyPassword = CryptoJS.MD5(password).toString();
      const getPassword = filePasswords;

      if (modifyPassword === getPassword) {
        setConfirmPassword(true);
        setIsHide((prev) => ({
          ...prev,
          [index]: true,
        }));
        setIsSuccess((prev) => ({
          ...prev,
          [index]: false,
        }));

        handleClose();
        if (linkClient?._id) {
          if (linkClient?.type === "multiple") {
            if (multipleType === "folder") {
              setIsMultipleHide((prev) => ({
                ...prev,
                [index]: true,
              }));
              setIsMultipleSuccess((prev) => ({
                ...prev,
                [index]: false,
              }));

              const path = folderDataSelect?.[0]?.newPath
                ? folderDataSelect?.[0]?.newPath
                : "";
              const multipleData = [
                {
                  id: folderDataSelect?.[0]._id,
                  newPath: path,
                  newFilename: folderDataSelect?.[0].newFolder_name,
                  createdBy: folderDataSelect?.[0]?.createdBy,
                },
              ];

              await manageFile.handleDownloadFolder(
                { multipleData },
                {
                  onSuccess: () => {
                    setIsMultipleHide((prev) => ({
                      ...prev,
                      [index]: false,
                    }));
                    setIsMultipleSuccess((prev) => ({
                      ...prev,
                      [index]: true,
                    }));
                  },
                  onFailed: (error) => {
                    errorMessage(error);
                    setIsMultipleHide((prev) => ({
                      ...prev,
                      [index]: false,
                    }));
                    setIsMultipleSuccess((prev) => ({
                      ...prev,
                      [index]: false,
                    }));
                  },
                },
              );
            } else {
              const multipleData = [
                {
                  id: fileDataSelect._id,
                  newPath: fileDataSelect.newPath || "",
                  newFilename: fileDataSelect.newFilename,
                  createdBy: fileDataSelect.createdBy,
                },
              ];

              await manageFile.handleDownloadFile(
                { multipleData },
                {
                  onSuccess: () => {
                    setIsHide((prev) => ({
                      ...prev,
                      [index]: false,
                    }));
                    setIsSuccess((prev) => ({
                      ...prev,
                      [index]: true,
                    }));
                  },
                  onFailed: (error) => {
                    errorMessage(error);
                    setIsHide((prev) => ({
                      ...prev,
                      [index]: false,
                    }));
                    setIsSuccess((prev) => ({
                      ...prev,
                      [index]: false,
                    }));
                  },
                },
              );
            }
          } else {
            if (linkClient?.type === "folder") {
              setIsHide((prev) => ({
                ...prev,
                [index]: true,
              }));
              setIsSuccess((prev) => ({
                ...prev,
                [index]: false,
              }));

              const path = folderDownload[0]?.newPath
                ? folderDownload[0]?.newPath
                : "";
              const multipleData = [
                {
                  id: folderDownload?.[0]._id,
                  newPath: path,
                  newFilename: folderDownload?.[0].newFolder_name,
                  createdBy: folderDownload?.[0]?.createdBy,
                },
              ];

              await manageFile.handleDownloadFolder(
                { multipleData },
                {
                  onSuccess: () => {
                    setIsHide((prev) => ({
                      ...prev,
                      [index]: false,
                    }));
                    setIsSuccess((prev) => ({
                      ...prev,
                      [index]: true,
                    }));
                  },
                  onFailed: (error) => {
                    errorMessage(error);
                    setIsHide((prev) => ({
                      ...prev,
                      [index]: false,
                    }));
                    setIsSuccess((prev) => ({
                      ...prev,
                      [index]: false,
                    }));
                  },
                },
              );
            } else {
              const multipleData = [
                {
                  id: fileDataSelect._id,
                  newPath: fileDataSelect.newPath || "",
                  newFilename: fileDataSelect.newFilename,
                  createdBy: fileDataSelect.createdBy,
                },
              ];

              await manageFile.handleDownloadPublicFile(
                { multipleData },
                {
                  onSuccess: () => {
                    setIsHide((prev) => ({
                      ...prev,
                      [index]: false,
                    }));
                    setIsSuccess((prev) => ({
                      ...prev,
                      [index]: true,
                    }));
                  },
                  onFailed: (error) => {
                    errorMessage(error);
                    setIsHide((prev) => ({
                      ...prev,
                      [index]: false,
                    }));
                    setIsSuccess((prev) => ({
                      ...prev,
                      [index]: false,
                    }));
                  },
                },
              );
            }
          }
        } else {
          const multipleData = [
            {
              id: fileDataSelect._id,
            },
          ];

          await manageFile.handleDownloadPublicFile(
            { multipleData },
            {
              onSuccess: () => {
                setIsHide((prev) => ({
                  ...prev,
                  [index]: false,
                }));
                setIsSuccess((prev) => ({
                  ...prev,
                  [index]: true,
                }));
              },
              onFailed: (error) => {
                errorMessage(error);
                setIsHide((prev) => ({
                  ...prev,
                  [index]: false,
                }));
                setIsSuccess((prev) => ({
                  ...prev,
                  [index]: false,
                }));
              },
            },
          );
        }
      }
    }
  };

  const handleOpenFolder = (folder) => {
    const baseUrl = {
      _id: folder._id,
      type: "folder",
    };

    const encodeUrl = encryptDataLink(baseUrl);
    navigate(`/df/extend?lc=${encodeUrl}`);
  };

  const previewHandleClose = () => {
    setPreviewOpen(false);
  };

  function handleOpenVerifyQRCode() {
    setIsVerifyQRCode(true);
  }

  function handleSuccessQRCode() {
    setTimeout(() => {
      setPreviewOpen(true);
    }, 200);
  }

  function handleCloseVerifyQRCode() {
    setFileQRCodePassword("");
    setIsVerifyQRCode(false);
  }

  const handleQRGeneration = (e: HTMLFormElement, file: any, url: string) => {
    e.preventDefault();
    setDataValue(file);
    setFileUrl(url);
    if (file?.filePassword) {
      setFileQRCodePassword(file.filePassword);
      handleOpenVerifyQRCode();
    } else {
      setPreviewOpen(true);
    }
  };

  const dataLinkMemo = useMemo<any[]>(() => {
    if (linkClient?._id) {
      if (linkClient?.type === "multiple") {
        const fileData = dataMultipleFile?.map((file, index) => ({
          ...file,
          isFile: true,
          index,
        }));

        return fileData || [];
      } else {
        const fileData = dataFileLink?.queryFileGetLinks?.data?.map(
          (file, index) => ({
            ...file,
            index,
            isFile: true,
          }),
        );

        return fileData || [];
      }
    } else {
      const fileData = getDataRes?.map((file, index) => ({
        ...file,
        index,
      }));

      return fileData || [];
    }
  }, [linkClient, dataFileLink, getDataRes]);

  const dataFolderLinkMemo = useMemo(() => {
    if (linkClient?._id) {
      let folderData: any = [];
      if (linkClient?.type === "multiple") {
        folderData = dataMultipleFolder?.map((file, index) => ({
          index,
          isFile: false,
          ...file,
        }));
        return folderData || [];
      }

      if (linkClient?.type === "folder") {
        folderData = getDataRes?.map((file, index) => ({
          index,
          isFile: false,
          ...file,
        }));
        return folderData;
      }
      return folderData;
    }

    return [];
  }, [linkClient, getDataRes, dataMultipleFolder]);

  return (
    <React.Fragment>
      <Helmet>
        <meta name="title" content={"seoTitle"} />
        <meta name="description" content={_description} />
      </Helmet>
      <MUI.ContainerHome maxWidth="xl">
        <DialogConfirmPassword
          open={open}
          isMobile={isMobile}
          getFilenames={getFilenames}
          getNewFileName={getNewFileName}
          password={password}
          checkModal={checkModal}
          setPassword={setPassword}
          handleClose={handleClose}
          _confirmPasword={_confirmPasword}
        />

        <Box sx={{ backgroundColor: "#ECF4F3", padding: "3rem 1rem" }}>
          {/* <Advertisement /> */}

          <MUI.FileListContainer>
            <Box>
              {(dataFolderLinkMemo?.length > 0 || dataLinkMemo?.length > 0) && (
                <MUI.FileBoxToggle>
                  {toggle === "grid" && (
                    <Fragment>
                      <BaseNormalButton
                        title="Download"
                        disabled={
                          dataSelector?.selectionFileAndFolderData?.length > 0
                            ? false
                            : true
                        }
                        handleClick={() => {
                          if (dataLinkMemo?.length > 0) {
                            handleDownloadFileGetLink();
                          }

                          if (dataFolderLinkMemo?.length > 0) {
                            handleDownloadFolderGetLink();
                          }
                        }}
                      />
                      <BaseNormalButton
                        handleClick={handleClearSelector}
                        title=""
                      >
                        <FaTrash fontSize={12} />
                      </BaseNormalButton>
                    </Fragment>
                  )}

                  <IconButton size="small" onClick={handleToggle}>
                    {toggle === "list" ? <ListIcon /> : <GridIcon />}
                  </IconButton>
                </MUI.FileBoxToggle>
              )}

              {toggle === "list" && (
                <Fragment>
                  {dataFolderLinkMemo && dataFolderLinkMemo.length > 0 && (
                    <ListFolderData
                      isFile={false}
                      toggle={toggle}
                      _description={_description}
                      dataLinks={dataFolderLinkMemo}
                      multipleIds={multipleFolderIds}
                      countAction={adAlive}
                      setMultipleIds={setMultipleFolderIds}
                      setToggle={handleToggle}
                      handleQRGeneration={handleQRGeneration}
                      handleClearGridSelection={handleClearFolderSelection}
                      handleDownloadFolderAsZip={handleDownloadAsZip}
                      handleDownloadFolder={handleDownloadFolderGetLink}
                      handleDoubleClick={handleOpenFolder}
                    />
                  )}

                  <br />

                  {dataLinkMemo && dataLinkMemo.length > 0 && (
                    <ListFileData
                      isFile={true}
                      toggle={toggle}
                      _description={_description}
                      dataLinks={dataLinkMemo}
                      multipleIds={multipleIds}
                      countAction={adAlive}
                      setMultipleIds={setMultipleIds}
                      setToggle={handleToggle}
                      handleQRGeneration={handleQRGeneration}
                      handleClearFileSelection={handleClearFileSelection}
                      handleDownloadAsZip={handleDownloadAsZip}
                      handleDownloadFileGetLink={handleDownloadFileGetLink}
                    />
                  )}
                </Fragment>
              )}

              {toggle === "grid" && (
                <Fragment>
                  {dataFolderLinkMemo && dataFolderLinkMemo.length > 0 && (
                    <FileCardContainer style={{ marginBottom: "1rem" }}>
                      {dataFolderLinkMemo.map((item, index) => {
                        return (
                          <Fragment key={index}>
                            <FileCardItem
                              id={item._id}
                              item={item}
                              isContainFiles={
                                item?.total_size > 0 ? true : false
                              }
                              imagePath={
                                item?.createdBy?.newName +
                                "-" +
                                item?.createdBy?._id +
                                "/" +
                                (item.newPath
                                  ? removeFileNameOutOfPath(item.newPath)
                                  : "") +
                                item.newFilename
                              }
                              user={item?.createdBy}
                              path={item?.path}
                              isCheckbox={true}
                              filePassword={item?.access_password}
                              fileType={"folder"}
                              name={item?.folder_name}
                              newName={item?.newFolder_name}
                              cardProps={{
                                onDoubleClick: () => {
                                  handleOpenFolder(item);
                                },
                              }}
                            />
                          </Fragment>
                        );
                      })}
                    </FileCardContainer>
                  )}

                  {dataLinkMemo && dataLinkMemo.length > 0 && (
                    <FileCardContainer>
                      {dataLinkMemo.map((item, index) => {
                        return (
                          <Fragment key={index}>
                            <FileCardItem
                              id={item._id}
                              item={item}
                              imagePath={
                                item?.createdBy?.newName +
                                "-" +
                                item?.createdBy?._id +
                                "/" +
                                (item.newPath
                                  ? removeFileNameOutOfPath(item.newPath)
                                  : "") +
                                item.newFilename
                              }
                              user={item?.createdBy}
                              path={item?.path}
                              isCheckbox={true}
                              filePassword={item?.filePassword}
                              fileType={"image"}
                              isPublic={
                                item?.createdBy?._id === "0" ? true : false
                              }
                              name={item?.filename}
                              newName={item?.newFilename}
                              cardProps={{
                                onDoubleClick: () => {
                                  // console.log("first");
                                },
                              }}
                            />
                          </Fragment>
                        );
                      })}
                    </FileCardContainer>
                  )}
                </Fragment>
              )}
            </Box>
            <Box>
              {(dataFolderLinkMemo?.length > 0 || dataLinkMemo?.length > 0) && (
                <BoxSocialShare
                  isFile={false}
                  _description={_description}
                  countAction={adAlive}
                  handleDownloadFolderAsZip={handleDownloadAsZip}
                />
              )}
            </Box>
          </MUI.FileListContainer>
        </Box>
        {/* Feed Admin  */}
        <Card>
          <Typography variant="h4" sx={{ mt: 4 }}>
            Popular
          </Typography>
          <Grid container sx={{ mt: 4 }}>
            {[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1].map(
              (_, indx) =>
                indx < 4 && (
                  <Grid item key={indx} xs={12} sm={6} md={4} lg={3}>
                    <Box sx={{ width: "100%" }}>
                      <VideoCardComponent
                        title="Lorem ipsum dolor sit amet."
                        description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod ipsa facilis recusandae vero doloremque cumque."
                        control={true}
                        autoPlay={false}
                        muted={true}
                        url="https://static.vecteezy.com/system/resources/previews/043/199/391/mp4/a-vibrant-city-street-illuminated-by-the-lights-of-the-night-video.mp4"
                        onView={() => navigate("/video_view")}
                      />
                    </Box>
                  </Grid>
                ),
            )}
          </Grid>
        </Card>
      </MUI.ContainerHome>
      <MUI.FilBoxBottomContainer>
        <Button
          sx={{ padding: "0.6rem", borderRadius: "30px" }}
          fullWidth={true}
          variant="contained"
          disabled={
            multipleIds.length > 0 ||
            dataSelector?.selectionFileAndFolderData?.length > 0
              ? false
              : true
          }
          onClick={handleMobileDownloadData}
        >
          Download
        </Button>
        {(platform === "android" || platform === "ios") && (
          <Button
            sx={{ padding: "0.6rem", borderRadius: "30px" }}
            onClick={handleOpenApplication}
            fullWidth={true}
            variant="contained"
          >
            Open app
          </Button>
        )}
      </MUI.FilBoxBottomContainer>

      <DialogPreviewQRcode
        data={fileUrl}
        isOpen={previewOpen}
        onClose={previewHandleClose}
      />

      {/* <DeepLink
        showBottom={showBottomDeep}
        platform={platform}
        scriptScheme={appScheme}
        onClose={() => setShowBottomDeep(false)}
      /> */}

      <DialogConfirmQRCode
        isOpen={isVerifyQrCode}
        dataValue={dataValue}
        filename={dataValue?.filename}
        newFilename={dataValue?.newFilename}
        dataPassword={fileQRCodePassword}
        onConfirm={handleSuccessQRCode}
        onClose={handleCloseVerifyQRCode}
      />
    </React.Fragment>
  );
}

export default FileUploader;
