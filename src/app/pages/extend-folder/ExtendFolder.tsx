import { useLazyQuery, useMutation } from "@apollo/client";
import axios from "axios";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ListIcon from "@mui/icons-material/FormatListBulletedOutlined";
import { Box, IconButton, useMediaQuery } from "@mui/material";
import {
  CREATE_DETAIL_ADVERTISEMENT,
  QUERY_ADVERTISEMENT,
} from "api/graphql/ad.graphql";
import { QUERY_SUB_FILE } from "api/graphql/file.graphql";
import { QUERY_SUB_FOLDER } from "api/graphql/folder.graphql";
import { QUERY_SETTING } from "api/graphql/setting.graphql";
import DialogConfirmPassword from "components/dialog/DialogConfirmPassword";
import DialogPreviewQRcode from "components/dialog/DialogPreviewQRCode";
import BoxSocialShare from "components/presentation/BoxSocialShare";
import DialogConfirmQRCode from "components/presentation/DialogConfirmQRCode";
import FileCardContainer from "components/presentation/FileCardContainer";
import FileCardItem from "components/presentation/FileCardItem";
import ListFileData from "components/Downloader/ListFileData";
import { ENV_KEYS } from "constants/env.constant";
import CryptoJS from "crypto-js";
import useManageFiles from "hooks/useManageFile";
import useManageSetting from "hooks/useManageSetting";
import Helmet from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import * as selectorAction from "stores/features/selectorSlice";
import { errorMessage, successMessage } from "utils/alert.util";
import { getFileTypeName, removeFileNameOutOfPath } from "utils/file.util";
import { decryptDataLink, encryptDataLink } from "utils/secure.util";
import * as MUI from "../file-uploader/styles/fileUploader.style";
import "../file-uploader/styles/fileUploader.style.css";
import ListFolderData from "components/Downloader/ListFolderData";
import ViewMoreAction from "components/presentation/ViewMoreAction";
import Advertisement from "components/presentation/Advertisement";
import BaseDeeplinkDownload from "components/Downloader/BaseDeeplinkDownload";
import BaseGridDownload from "components/Downloader/BaseGridDownload";
import { IFolder } from "models/folder.model";

function ExtendFolder() {
  const location = useLocation();
  const isMobile = useMediaQuery("(max-width: 600px)");
  const isMobileGrid = useMediaQuery("(max-width: 997px)");
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
  const [totalClickCount, setTotalClickCount] = useState(0);
  const [adAlive, setAdAlive] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [isDownloadLoading, setIsDownloadLoading] = useState(false);
  const [dataValue, setDataValue] = useState<any>(null);
  const [platform, setPlatform] = useState("");
  const [_description, setDescription] = useState("");

  const [multipleType, setMultipleType] = useState("");
  const [fileDataSelect, setFileDataSelect] = useState<any>(null);
  const [folderDataSelect, setFolderDataSelect] = useState<any>(null);

  const [dataSubGetLink, setDataSubGetLink] = useState<any[]>([]);
  const [dataSubFolder, setDataSubFolder] = useState<any[]>([]);

  const LIMIT_DATA_PAGE = 10;

  const [totalFile, setTotalFile] = useState(0);
  const [fileCurrentPage, setFileCurrentPage] = useState(1);

  const [folderCurrentPage, setFolderCurrentPage] = useState(1);
  const [totalFolder, setTotalFolder] = useState(0);

  const [viewFileMore, setViewFileMore] = useState(10);
  const [viewFolderMore, setViewFolderMore] = useState(10);

  const params = new URLSearchParams(location.search);
  const linkValue = params.get("l");
  const urlClient = params.get("lc");
  const currentURL = window.location.href;
  const navigate = useNavigate();

  const LOAD_GET_IP_URL = ENV_KEYS.VITE_APP_LOAD_GETIP_URL;

  // Deep linking for mobile devices
  const appScheme = ENV_KEYS.VITE_APP_DEEP_LINK + currentURL;

  const [multipleIds, setMultipleIds] = useState<any[]>([]);
  const [multipleFolderIds, setMultipleFolderIds] = useState<any[]>([]);

  const [hideDownload, setHideDownload] = useState(true);

  const dataSelector = useSelector(
    selectorAction.checkboxFileAndFolderSelector,
  );
  const dispatch = useDispatch();

  // hooks
  const manageFile = useManageFiles();

  const [getFileLink] = useLazyQuery(QUERY_SUB_FILE, {
    fetchPolicy: "cache-and-network",
  });

  const [getFolderLink] = useLazyQuery(QUERY_SUB_FOLDER);

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

  function handleClearGridSelection() {
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
    handleClearSelector();
    if (toggle === "list") {
      setToggle("grid");
      localStorage.setItem("toggle", "grid");
    } else {
      setToggle("list");
      localStorage.setItem("toggle", "list");
    }
  }

  function handleViewMoreFolder() {
    setViewFolderMore((prev) => prev + 10);
  }
  function handleViewMoreFile() {
    setViewFileMore((prev) => prev + 10);
  }

  // get Download button
  useEffect(() => {
    function getDataSetting() {
      // Show download button
      const downloadData = useDataSetting.data?.find(
        (data) => data?.productKey === settingKeys.downloadKey,
      );
      if (downloadData) {
        if (downloadData?.status === "on") {
          setHideDownload(false);
        }
      }
    }

    getDataSetting();
  }, [useDataSetting.data]);

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
    const getFileLinkData = async () => {
      try {
        if (linkClient?._id) {
          setIsLoading(true);

          await getFileLink({
            variables: {
              where: {
                folder_id: linkClient?._id,
              },
              limit: toggle === "list" ? LIMIT_DATA_PAGE : viewFileMore,
              skip:
                toggle === "list"
                  ? LIMIT_DATA_PAGE * (fileCurrentPage - 1)
                  : null,
            },
            onCompleted: (fileData) => {
              const response = fileData?.filesByUID?.data || [];
              const total = fileData?.filesByUID?.total || 0;

              setTotalFile(total);
              setDataSubGetLink(response);
            },
          });

          setTimeout(() => {
            setIsLoading(false);
          }, 500);
        }
      } catch (error: any) {
        setIsLoading(false);
        errorMessage(error);
      }
    };

    getFileLinkData();
  }, [linkValue, urlClient, fileCurrentPage, viewFileMore]);

  useEffect(() => {
    const getFolderLinkData = async () => {
      try {
        if (linkClient?._id) {
          setIsLoading(true);

          await getFolderLink({
            variables: {
              where: {
                _id: linkClient?._id,
              },
              limit: toggle === "list" ? LIMIT_DATA_PAGE : viewFolderMore,
              skip:
                toggle === "list"
                  ? LIMIT_DATA_PAGE * (folderCurrentPage - 1)
                  : null,
            },
            onCompleted: (values) => {
              const folderData = values?.foldersByUID?.data || [];
              const total = values?.foldersByUID?.total || 0;
              setTotalFolder(total);
              setDataSubFolder(folderData);
              if (folderData?.[0]?.status === "active") {
                setGetDataRes(folderData || []);
                setFolderDownload(folderData || []);
              }
            },
          });

          setTimeout(() => {
            setIsLoading(false);
          }, 500);
        }
      } catch (error: any) {
        setIsLoading(false);
        errorMessage(error);
      }
    };

    getFolderLinkData();
  }, [urlClient, folderCurrentPage, viewFolderMore, toggle]);

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

  useEffect(() => {
    function handleDetectPlatform() {
      const os = navigator.userAgent;
      try {
        if (dataSubGetLink?.length > 0 || dataSubFolder?.length > 0) {
          if (os.match(/iPhone|iPad|iPod/i)) {
            setPlatform("ios");
          }

          if (os.match(/Android/i)) {
            setPlatform("android");
          }
        }
      } catch (error) {
        console.error(error);
      }
    }

    handleDetectPlatform();
  }, [dataSubFolder, dataSubGetLink]);

  const handleOpenApplication = () => {
    const timeout = setTimeout(() => {
      if (platform === "android") {
        window.location.href = ENV_KEYS.VITE_APP_PLAY_STORE;
      }

      if (platform === "ios") {
        window.location.href = ENV_KEYS.VITE_APP_APPLE_STORE;
      }
    }, 1500);

    window.location.href = appScheme;

    window.onblur = () => {
      clearTimeout(timeout);
    };
  };

  const getAllData = async () => {
    setIsDownloadLoading(true);

    try {
      const result = await getFileLink({
        variables: {
          where: {
            folder_id: linkClient._id,
          },
          noLimit: true,
        },
      });
      const fileData: any[] = (await result.data?.filesByUID?.data) || [];
      const fileDataMap = fileData.map((file) => ({
        ...file,
        isFile: true,
      }));

      const folderResult = await await getFolderLink({
        variables: {
          where: {
            _id: linkClient?._id,
          },
          noLimit: true,
        },
      });
      const folderData: any[] =
        (await folderResult.data?.foldersByUID?.data) || [];

      setIsDownloadLoading(false);
      const mergeData = fileDataMap.concat(folderData);
      return mergeData;
    } catch (error: any) {
      console.log(error.message);
      setIsDownloadLoading(false);
    } finally {
      setIsDownloadLoading(false);
    }
  };

  const handleDownloadAsZip = async () => {
    setTotalClickCount((prevCount) => prevCount + 1);

    if (totalClickCount >= getActionButton) {
      setTotalClickCount(0);
      // const groupData: any[] = (await getAllData()) || [];
      const groupDataV1: any[] = dataLinkMemo.concat(dataFolderLinkMemo)

      const multipleData = groupDataV1.map((item: any) => {
        const newPath = item?.newPath || "";
        const newFilename = item?.newFilename || item?.newFolder_name;

        return {
          newPath,
          id: item._id,
          newFilename: newFilename || "",
          name: item?.filename || item?.folder_name,
          checkType: item?.isFile ? "file" : "folder",
          createdBy: item?.createdBy,
          isPublic: linkClient?._id ? false : true,
        };
      });

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
        const groupData: any[] = (await getAllData()) || [];

        const multipleData = groupData.map((item: any) => {
          const newPath = item?.newPath || "";
          const newFilename = item?.newFilename || item?.newFolder_name;

          return {
            newPath,
            id: item._id,
            newFilename: newFilename || "",
            name: item?.filename || item?.folder_name,
            checkType: item?.isFile ? "file" : "folder",
            createdBy: item?.createdBy,
            isPublic: linkClient?._id ? false : true,
          };
        });

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

        handleClose();
        if (linkClient?._id) {
          if (linkClient?.type === "multiple") {
            if (multipleType === "folder") {
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
                  onSuccess: () => {},
                  onFailed: (error) => {
                    errorMessage(error);
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
                  onSuccess: () => {},
                  onFailed: (error) => {
                    errorMessage(error);
                  },
                },
              );
            }
          } else {
            if (linkClient?.type === "folder") {
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
                  onSuccess: () => {},
                  onFailed: (error) => {
                    errorMessage(error);
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
                  onSuccess: () => {},
                  onFailed: (error) => {
                    errorMessage(error);
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
              onSuccess: () => {},
              onFailed: (error) => {
                errorMessage(error);
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
      const fileData = dataSubGetLink?.map((file, index) => ({
        ...file,
        isFile: true,
        index,
      }));

      return fileData || [];
    }

    return [];
  }, [linkClient]);

  const dataFolderLinkMemo = useMemo<IFolder[]>(() => {
    if (linkClient?._id) {
      const folderData = dataSubFolder?.map((folder, index) => {
        return {
          ...folder,
          isFile: false,
          index,
        };
      });

      return folderData || [];
    }

    return [];
  }, [linkClient]);

  useEffect(() => {
    if (dataFolderLinkMemo.length > 0) {
      const title = dataFolderLinkMemo[0].folder_name || "";
      document.title = title;
      setDescription(`${title} on vshare.net`);
    }

    if (dataLinkMemo.length > 0) {
      const title = dataLinkMemo[0].filename || "";
      document.title = dataLinkMemo[0].filename || "";
      setDescription(`${title} on vshare.net`);
    }

    if (dataFolderLinkMemo.length > 0 && dataLinkMemo.length > 0) {
      const title = dataFolderLinkMemo[0].folder_name || "";
      document.title = title;
      setDescription(`${title} on vshare.net`);
    }
  }, [dataLinkMemo, dataFolderLinkMemo]);

  return (
    <React.Fragment>
      <Helmet>
        <meta name="description" key={"description"} content={_description} />
      </Helmet>

      <MUI.ContainerHome maxWidth="xl">
        <Box sx={{ backgroundColor: "#ECF4F3", padding: "3rem 1rem" }}>
          <Advertisement />

          {(dataFolderLinkMemo?.length > 0 || dataLinkMemo?.length > 0) && (
            <MUI.FileBoxToggle>
              {toggle === "grid" ? (
                <BaseGridDownload
                  dataFiles={dataSelector?.selectionFileAndFolderData}
                  adAlive={adAlive}
                  handleClearSelector={handleClearSelector}
                  handleToggle={handleToggle}
                  handleDownloadGridFileAndFolder={
                    handleDownloadGridFileAndFolder
                  }
                />
              ) : (
                <IconButton size="small" onClick={handleToggle}>
                  <ListIcon />
                </IconButton>
              )}
            </MUI.FileBoxToggle>
          )}

          <MUI.FileListContainer>
            <Box>
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
                      total={totalFolder}
                      pagination={{
                        currentPage: folderCurrentPage,
                        totalPages: Math.ceil(totalFolder / LIMIT_DATA_PAGE),
                        setCurrentPage: setFolderCurrentPage,
                      }}
                      setMultipleIds={setMultipleFolderIds}
                      setToggle={handleToggle}
                      handleQRGeneration={handleQRGeneration}
                      handleClearGridSelection={handleClearFolderSelection}
                      handleDownloadFolderAsZip={handleDownloadAsZip}
                      handleDownloadFolder={handleDownloadFolderGetLink}
                      handleDoubleClick={handleOpenFolder}
                    />
                  )}

                  {dataLinkMemo && dataLinkMemo.length > 0 && (
                    <ListFileData
                      isFile={true}
                      toggle={toggle}
                      _description={_description}
                      dataLinks={dataLinkMemo}
                      multipleIds={multipleIds}
                      countAction={adAlive}
                      total={totalFile}
                      pagination={{
                        currentPage: fileCurrentPage,
                        totalPages: Math.ceil(totalFile / LIMIT_DATA_PAGE),
                        setCurrentPage: setFileCurrentPage,
                      }}
                      setMultipleIds={setMultipleIds}
                      setToggle={handleToggle}
                      handleQRGeneration={handleQRGeneration}
                      handleClearFileSelection={handleClearGridSelection}
                      handleDownloadAsZip={handleDownloadAsZip}
                      handleDownloadFileGetLink={handleDownloadFileGetLink}
                    />
                  )}
                </Fragment>
              )}

              {toggle === "grid" && (
                <Fragment>
                  {dataFolderLinkMemo && dataFolderLinkMemo.length > 0 && (
                    <Fragment>
                      <FileCardContainer style={{ marginBottom: "1.5rem" }}>
                        {dataFolderLinkMemo.map((item, index) => {
                          return (
                            <Fragment key={index}>
                              <FileCardItem
                                id={item._id}
                                item={item}
                                isContainFiles={
                                  item?.total_size > 0 ? true : false
                                }
                                user={item?.createdBy}
                                path={item?.path}
                                isCheckbox={true}
                                filePassword={item?.access_password}
                                fileType={getFileTypeName(item.folder_type)}
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

                      {totalFolder > viewFolderMore ? (
                        <ViewMoreAction handleViewMore={handleViewMoreFolder} />
                      ) : (
                        <Fragment></Fragment>
                      )}
                    </Fragment>
                  )}

                  {dataLinkMemo && dataLinkMemo.length > 0 && (
                    <Fragment>
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
                                fileType={getFileTypeName(item?.fileType)}
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

                      {totalFile > viewFileMore ? (
                        <Box sx={{ mt: 5 }}>
                          <ViewMoreAction handleViewMore={handleViewMoreFile} />
                        </Box>
                      ) : (
                        <Fragment></Fragment>
                      )}
                    </Fragment>
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
                  isHide={hideDownload}
                  loading={isDownloadLoading}
                  handleDownloadFolderAsZip={handleDownloadAsZip}
                />
              )}
            </Box>
          </MUI.FileListContainer>
        </Box>
      </MUI.ContainerHome>

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

      <BaseDeeplinkDownload
        selectionData={
          (multipleIds?.length > 0 && true) ||
          (multipleFolderIds?.length > 0 && true) ||
          (dataSelector?.selectionFileAndFolderData?.length > 0 && true)
        }
        platform={platform}
        onClickOpenApplication={handleOpenApplication}
        onClickDownloadData={handleMobileDownloadData}
      />

      <DialogPreviewQRcode
        data={fileUrl}
        isOpen={previewOpen}
        onClose={previewHandleClose}
      />

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

export default ExtendFolder;
