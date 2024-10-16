import { useLazyQuery, useMutation } from "@apollo/client";
import { Box, IconButton, useMediaQuery } from "@mui/material";
import {
  CREATE_DETAIL_ADVERTISEMENT,
  QUERY_ADVERTISEMENT,
} from "api/graphql/ad.graphql";
import { QUERY_SUB_FILEV1 } from "api/graphql/file.graphql";
import { QUERY_SUB_FOLDER_V1 } from "api/graphql/folder.graphql";
import { QUERY_SETTING } from "api/graphql/setting.graphql";
import axios from "axios";
import DialogConfirmPassword from "components/dialog/DialogConfirmPassword";
import DialogPreviewQRcode from "components/dialog/DialogPreviewQRCode";
import BaseDeeplinkDownload from "components/Downloader/BaseDeeplinkDownload";
import BaseGridDownload from "components/Downloader/BaseGridDownload";
import ListFileData from "components/Downloader/ListFileData";
import ListFolderData from "components/Downloader/ListFolderData";
import NotFound from "components/NotFound";
import Advertisement from "components/presentation/GoogleAdsense";
import BoxSocialShare from "components/presentation/BoxSocialShare";
import DialogConfirmQRCode from "components/presentation/DialogConfirmQRCode";
import FileCardContainer from "components/presentation/FileCardContainer";
import FileCardItem from "components/presentation/FileCardItem";
import ViewMoreAction from "components/presentation/ViewMoreAction";
import { ENV_KEYS } from "constants/env.constant";
import CryptoJS from "crypto-js";
import useManageFiles from "hooks/useManageFile";
import useManageSetting from "hooks/useManageSetting";
import { IFolder } from "models/folder.model";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import Helmet from "react-helmet";
import { BiSolidGrid } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import * as selectorAction from "stores/features/selectorSlice";
import { errorMessage, successMessage } from "utils/alert.util";
import { getFileTypeName, removeFileNameOutOfPath } from "utils/file.util";
import { decryptDataLink, encryptDataLink } from "utils/secure.util";
import * as MUI from "../file-uploader/styles/fileUploader.style";
import "../file-uploader/styles/fileUploader.style.css";
import GoogleAdsenseFooter from "components/presentation/GoogleAdsenseFooter";
import { IEncryptDataLink } from "models/encryptDataLink.model";
import { SETTING_KEYS } from "constants/setting.constant";

function ExtendFolder() {
  const location = useLocation();
  const isMobile = useMediaQuery("(max-width: 600px)");
  const [checkConfirmPassword, setConfirmPassword] = useState(false);
  const [getDataRes, setGetDataRes] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [fileQRCodePassword, setFileQRCodePassword] = useState("");
  const [toggle, setToggle] = useState(
    localStorage.getItem("toggle") ? localStorage.getItem("toggle") : "list",
  );

  const [previewOpen, setPreviewOpen] = useState(false);
  const [isVerifyQrCode, setIsVerifyQRCode] = useState(false);
  const [fileUrl, setFileUrl] = useState("");
  const [getActionButton, setGetActionButton] = useState<any>();
  const [getAdvertisemment, setGetAvertisement] = useState<any>([]);

  const [usedAds, setUsedAds] = useState<any[]>([]);
  const [totalClickCount, setTotalClickCount] = useState(0);
  const [adAlive, setAdAlive] = useState(0);
  const [manageLinkId, setManageLinkId] = useState("");

  const [_isLoading, setIsLoading] = useState(false);
  const [isDownloadLoading, setIsDownloadLoading] = useState(false);
  const [dataValue, setDataValue] = useState<any>(null);
  const [platform, setPlatform] = useState("");
  const [_description, setDescription] = useState("");

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

  const [eventClick, setEventClick] = useState("");
  const [multipleIds, setMultipleIds] = useState<any[]>([]);
  const [multipleFolderIds, setMultipleFolderIds] = useState<any[]>([]);

  const [hideDownload, setHideDownload] = useState(true);

  const dataSelector = useSelector(
    selectorAction.checkboxFileAndFolderSelector,
  );
  const dispatch = useDispatch();

  // hooks
  const manageFile = useManageFiles();

  const [getFileLink] = useLazyQuery(QUERY_SUB_FILEV1, {
    fetchPolicy: "cache-and-network",
  });

  const [getFolderLink] = useLazyQuery(QUERY_SUB_FOLDER_V1);

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

  const useDataSetting = useManageSetting();

  let linkClient: IEncryptDataLink = useMemo(
    () => ({ _id: "", type: "", manageLinkId: "" }),
    [],
  );

  try {
    if (urlClient) {
      const decode = handleDecryptFile(urlClient);

      linkClient = {
        _id: decode?._id,
        type: decode?.type,
        manageLinkId: decode?.manageLinkId,
      };
    }
  } catch (error) {
    console.error(error);
  }

  useEffect(() => {
    if (linkClient?.manageLinkId) {
      setManageLinkId(linkClient.manageLinkId);
    }
  }, [linkClient.manageLinkId]);

  function handleDecryptFile(val: string) {
    const decryptedData = decryptDataLink(val);
    return decryptedData;
  }

  function handleClearGridSelection() {
    handleClearSelector();
  }

  function handleClearFolderSelection() {
    handleClearSelector();
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

  function handleViewMoreFolder() {
    setViewFolderMore((prev) => prev + 10);
  }
  function handleViewMoreFile() {
    setViewFileMore((prev) => prev + 10);
  }

  function handleMultipleData(id: string) {
    setEventClick("checkbox");

    const item = dataLinkMemo.find((data) => {
      const checkType = data?.isFile ? "file" : "folder";
      return data._id === id && checkType === "file";
    });

    setDataValue(item);

    if (
      !dataSelector?.selectionFileAndFolderData.find((el) => el.id === item._id)
    ) {
      if (item.filePassword) {
        setFileQRCodePassword(item.filePassword || item.access_password);
        setIsVerifyQRCode(true);
        return;
      }
    }

    handleMultipleDataDone(item);
  }

  function handleMultipleFolderData(id: string) {
    setEventClick("checkbox");

    const item = dataFolderLinkMemo.find((data) => {
      return data._id === id;
    });
    setDataValue(item);

    if (
      !dataSelector?.selectionFileAndFolderData.find(
        (el) => el.id === item!._id,
      )
    ) {
      if (item?.access_password) {
        setFileQRCodePassword(item.access_password);
        setIsVerifyQRCode(true);
        return;
      }
    }

    handleMultipleDataDone(item);
  }

  function handleMultipleDataDone(item: any) {
    const name = item?.isFile ? item?.filename : item?.folder_name;
    const newFilename = !item.isFile ? item?.newFolder_name : item?.newFilename;
    const checkType = item.isFile ? "file" : "folder";

    const value = {
      id: item?._id,
      name,
      newPath: item?.newPath || "",
      newFilename,
      checkType,
      dataPassword: item?.filePassword || item?.access_password,
      shortLink: item?.shortUrl,
      createdBy: {
        _id: item?.createdBy?._id,
        newName: item?.createdBy?.newName,
      },
    };
    setDataValue(null);
    dispatch(
      selectorAction.setFileAndFolderData({
        data: value,
      }),
    );
  }

  // get Download button
  useEffect(() => {
    function getDataSetting() {
      // Show download button
      const downloadData = useDataSetting.data?.find(
        (data) => data?.productKey === SETTING_KEYS.HIDE_DOWNLOAD,
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
              manageLinkId: String(linkClient?.manageLinkId),
              limit: toggle === "list" ? LIMIT_DATA_PAGE : viewFileMore,
              skip:
                toggle === "list"
                  ? LIMIT_DATA_PAGE * (fileCurrentPage - 1)
                  : null,
            },
            onCompleted: (fileData) => {
              const response = fileData?.filesByUIDV1?.data || [];
              const total = fileData?.filesByUIDV1?.total || 0;

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
              manageLinkId: String(linkClient?.manageLinkId),
              limit: toggle === "list" ? LIMIT_DATA_PAGE : viewFolderMore,
              skip:
                toggle === "list"
                  ? LIMIT_DATA_PAGE * (folderCurrentPage - 1)
                  : null,
            },
            onCompleted: (values) => {
              const folderData = values?.foldersByUIDV1?.data || [];
              const total = values?.foldersByUIDV1?.total || 0;
              setTotalFolder(total);
              setDataSubFolder(folderData);
              if (folderData?.[0]?.status === "active") {
                setGetDataRes(folderData || []);
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
  }, [folderCurrentPage, viewFolderMore, toggle]);

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
      handleDownloadAsZip();
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
        if (
          !randomAd.url.match(/^https?:\/\//i) &&
          !randomAd.url.match(/^http?:\/\//i)
        ) {
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
      const fileData: any[] = (await result.data?.filesByUIDV1?.data) || [];
      const fileDataMap =
        fileData
          ?.filter((file) => !file.filePassword)
          .map((file) => ({
            ...file,
            isFile: true,
          })) || [];

      const folderResult = await await getFolderLink({
        variables: {
          where: {
            _id: linkClient?._id,
          },
          noLimit: true,
        },
      });
      const folderData: any[] =
        (await folderResult.data?.foldersByUIDV1?.data) || [];
      const folderDataMap =
        folderData
          ?.filter((file) => !file.filePassword)
          .map((file) => ({
            ...file,
            isFile: true,
          })) || [];

      setIsDownloadLoading(false);
      const mergeData = fileDataMap.concat(folderDataMap);
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
    const modifyPassword = CryptoJS.MD5(password).toString();
    const getPassword = getDataRes[0]?.passwordUrlAll;
    if (modifyPassword === getPassword) {
      setConfirmPassword(true);
      successMessage("Successful!!", 3000);
      handleClose();
    } else {
      errorMessage("Invalid password!!", 3000);
    }
  };

  const handleCheckOpenFolder = (folder) => {
    setEventClick("open-folder");
    setFolderDataSelect(folder);

    if (folder?.access_password) {
      setFileQRCodePassword(folder.access_password);
      handleOpenVerifyQRCode();
    } else {
      handleOpenFolder(folder);
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
    if (eventClick === "qrcode") {
      setTimeout(() => {
        setPreviewOpen(true);
      }, 200);
    }

    if (eventClick === "open-folder") {
      handleOpenFolder(folderDataSelect);
    }

    if (eventClick === "checkbox") {
      handleMultipleDataDone(dataValue);
    }
  }

  function handleCloseVerifyQRCode() {
    setFileQRCodePassword("");
    setIsVerifyQRCode(false);
  }

  const handleQRGeneration = (e: HTMLFormElement, file: any, url: string) => {
    setEventClick("qrcode");
    e.preventDefault();
    setDataValue(file);
    setFileUrl(url);

    if (file?.filePassword || file?.access_password) {
      setFileQRCodePassword(file.filePassword || file?.access_password);
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
  }, [linkClient, dataSubFolder]);

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

  const dataFileTitle = useMemo(() => {
    if (dataLinkMemo?.length || dataFolderLinkMemo?.length) {
      const dataFiles = dataLinkMemo || [];
      const result = dataFiles?.concat(dataFolderLinkMemo || []);
      const title =
        result?.[0]?.filename ||
        result?.[0]?.folder_name ||
        "data on vshare.net";
      return title;
    }

    return [];
  }, [dataLinkMemo, dataFolderLinkMemo]);

  return (
    <React.Fragment>
      <Helmet>
        <meta name="title" content={dataFileTitle} />
        <meta name="description" key={"description"} content={_description} />
        <meta property="og:title" content={dataFileTitle} />
        <meta property="og:description" content={_description} />
        <meta property="og:url" content={window.location.href} />
        <meta property="twitter:title" content={dataFileTitle} />
        <meta property="twitter:description" content={_description} />
      </Helmet>

      {(dataFolderLinkMemo?.length > 0 || dataLinkMemo?.length > 0) && (
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
                  <IconButton onClick={handleToggle}>
                    <BiSolidGrid />
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
                        manageLinkId={manageLinkId}
                        dataLinks={dataFolderLinkMemo}
                        multipleIds={multipleFolderIds}
                        countAction={adAlive}
                        total={totalFolder}
                        pagination={{
                          currentPage: folderCurrentPage,
                          totalPages: Math.ceil(totalFolder / LIMIT_DATA_PAGE),
                          setCurrentPage: setFolderCurrentPage,
                        }}
                        selectionFileAndFolderData={
                          dataSelector?.selectionFileAndFolderData || []
                        }
                        setMultipleIds={setMultipleFolderIds}
                        setToggle={handleToggle}
                        handleQRGeneration={handleQRGeneration}
                        handleClearGridSelection={handleClearFolderSelection}
                        handleDownloadFolderAsZip={handleDownloadAsZip}
                        handleSelection={handleMultipleFolderData}
                        handleDownloadFolder={handleDownloadFolderGetLink}
                        handleDoubleClick={handleCheckOpenFolder}
                        handleDownloadFileGetLink={
                          handleDownloadGridFileAndFolder
                        }
                      />
                    )}

                    {dataLinkMemo && dataLinkMemo.length > 0 && (
                      <ListFileData
                        isFile={true}
                        toggle={toggle}
                        _description={_description}
                        manageLinkId={manageLinkId}
                        dataLinks={dataLinkMemo}
                        selectionFileAndFolderData={
                          dataSelector?.selectionFileAndFolderData || []
                        }
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
                        handleSelection={handleMultipleData}
                        handleClearFileSelection={handleClearGridSelection}
                        handleDownloadAsZip={handleDownloadAsZip}
                        handleDownloadFileGetLink={
                          handleDownloadGridFileAndFolder
                        }
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
                                  selectType="folder"
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
                                  handleSelectData={handleMultipleFolderData}
                                  cardProps={{
                                    onDoubleClick: () => {
                                      handleCheckOpenFolder(item);
                                    },
                                  }}
                                />
                              </Fragment>
                            );
                          })}
                        </FileCardContainer>

                        {totalFolder > viewFolderMore ? (
                          <ViewMoreAction
                            handleViewMore={handleViewMoreFolder}
                          />
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
                                  selectType="file"
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
                                  handleSelectData={handleMultipleData}
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
                            <ViewMoreAction
                              handleViewMore={handleViewMoreFile}
                            />
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
                {(dataFolderLinkMemo?.length > 0 ||
                  dataLinkMemo?.length > 0) && (
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

            <GoogleAdsenseFooter />
          </Box>
        </MUI.ContainerHome>
      )}

      {!dataFolderLinkMemo?.length && !dataLinkMemo?.length && <NotFound />}

      <DialogConfirmPassword
        open={open}
        isMobile={isMobile}
        getFilenames={""}
        getNewFileName={""}
        password={password}
        checkModal={false}
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
