import { useLazyQuery, useMutation } from "@apollo/client";
import axios from "axios";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

// components
import * as MUI from "./styles/fileUploader.style";
import "./styles/fileUploader.style.css";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import {
  CREATE_DETAIL_ADVERTISEMENT,
  QUERY_ADVERTISEMENT,
  QUERY_MANAGE_LINK_DETAIL,
} from "api/graphql/ad.graphql";
import {
  QUERY_FILE_PUBLIC,
  QUERY_FILE_GET_LINK,
  QUERY_FILE_PUBLICV2,
} from "api/graphql/file.graphql";
import {
  QUERY_FOLDER_PUBLIC_LINK,
  QUERY_FOLDER_PUBLICV1,
} from "api/graphql/folder.graphql";
import { QUERY_SETTING } from "api/graphql/setting.graphql";
import { QUERY_USER } from "api/graphql/user.graphql";
import DialogPreviewQRcode from "components/dialog/DialogPreviewQRCode";
import DeepLink from "components/presentation/DeepLink";
import DialogConfirmQRCode from "components/presentation/DialogConfirmQRCode";
import { ENV_KEYS } from "constants/env.constant";
import CryptoJS from "crypto-js";
import useManageSetting from "hooks/useManageSetting";
import { errorMessage, successMessage } from "utils/alert.util";
import Helmet from "react-helmet";
import { combineOldAndNewFileNames, cutFileName } from "utils/file.util";
import { decryptDataLink } from "utils/secure.util";
import useManageFiles from "hooks/useManageFile";
import GridFileData from "components/presentation/GridFileData";

function FileUploader() {
  const location = useLocation();
  const [checkConfirmPassword, setConfirmPassword] = useState(false);
  const [getDataRes, setGetDataRes] = useState<any>(null);
  const [folderDownload, setFolderDownload] = useState<any>(null);
  const [folderSize, setFolderSize] = useState(0);
  const [folderType, setFolderType] = useState("");
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [filePasswords, setFilePasswords] = useState<any>("");
  const [getNewFileName, setGetNewFileName] = useState("");
  const [fileQRCodePassword, setFileQRCodePassword] = useState("");
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
  const [isProcessAll, setIsProcessAll] = useState(false);
  const [isDownloadAll, setIsDownloadAll] = useState(false);

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

  const [totalMultipleFolder, setTotalMultipleFolder] = useState(0);
  const [totalMultipleFile, setTotalMultipleFile] = useState(0);
  const [dataMultipleFile, setDataMultipleFile] = useState<any[]>([]);
  const [dataMultipleFolder, setDataMultipleFolder] = useState<any[]>([]);

  const params = new URLSearchParams(location.search);
  const linkValue = params.get("l");
  const urlClient = params.get("lc");
  const userqrcode = params.get("qr");
  const currentURL = window.location.href;

  const LOAD_GET_IP_URL = ENV_KEYS.VITE_APP_LOAD_GETIP_URL;

  // Deep linking for mobile devices
  const appScheme = "vshare.app://download?url=" + currentURL;

  const [multipleIds, setMultipleIds] = useState<any[]>([]);

  // const [qrcodeUser, setQrcodeUser] = useState([]);
  const [index, setIndex] = useState<any>(null);
  const [hideDownload, seHideDownload] = useState(true);
  const [getData, { data: resPonData }] = useLazyQuery(QUERY_FILE_PUBLIC, {
    fetchPolicy: "cache-and-network",
  });

  // const [messageData, setMessageData] = useState<any[]>([]);

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

  let linkClient: any = { _id: "", type: "" };

  // let userData: any = { userId: zard@gmail.com"", newName: "" };

  try {
    if (urlClient) {
      const decode = handleDecryptFile(urlClient);
      // userData = {
      //   userId: decode?.userId,
      //   newName: decode?.newName,
      // };
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
                dataFileLink?.queryFileGetLinks?.data?.[0]?.filename ??
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

              if (folderData && folderData?.[0]?.folder_type) {
                document.title =
                  folderData?.[0]?.folder_name || "Vshare download folder";
                if (folderData[0]?.folder_name) {
                  setDescription(folderData[0]?.folder_name + " Vshare.net");
                }
                setFolderType(folderData[0]?.folder_type);
                setFolderSize(folderData[0]?.total_size);
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
                        // where: {
                        //   _id: folder?.folderId,
                        //   status: "active",
                        // },
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

                const folderMapSize = dataFoldersFlat.map((file) =>
                  parseInt(file.total_size || 0),
                );
                const totalFolders = folderMapSize.reduce(
                  (prev, current) => prev + current,
                );
                setTotalMultipleFolder(totalFolders);
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
                const filesMapSize = dataFilesFlat.map((file) =>
                  parseInt(file.size),
                );
                const totalFiles = filesMapSize.reduce(
                  (prev, current) => prev + current,
                );
                setTotalMultipleFile(totalFiles);
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

  // download folder
  const handleDownloadFolder = async ({ createdBy }) => {
    setTotalClickCount((prevCount) => prevCount + 1);
    if (totalClickCount >= getActionButton) {
      setTotalClickCount(0);

      const folder_name = `${folderDownload[0]?.folder_name}.zip`;

      try {
        if (folderDownload[0]?.access_password) {
          handleClickOpen();
        } else {
          setIsHide((prev) => ({
            ...prev,
            [1]: true,
          }));

          const multipleData = [
            {
              id: folderDownload?.[0]?._id,
              name: folder_name,
              newFilename: folderDownload?.[0].newFolder_name,
              checkType: "folder",
              newPath: folderDownload?.[0].newPath || "",
              createdBy,
            },
          ];

          await manageFile.handleDownloadFolder(
            { multipleData },
            {
              onSuccess: () => {
                setIsHide((prev) => ({
                  ...prev,
                  [1]: false,
                }));
                setIsSuccess((prev) => ({
                  ...prev,
                  [1]: true,
                }));
              },
              onFailed: (error) => {
                errorMessage(error, 3000);
                setIsHide((prev) => ({
                  ...prev,
                  [1]: false,
                }));
                setIsSuccess((prev) => ({
                  ...prev,
                  [1]: false,
                }));
              },
            },
          );
        }
      } catch (error) {
        errorMessage("Something wrong try again later!", 2000);
      }
    } else {
      if (getAdvertisemment?.length) {
        const availableAds = getAdvertisemment.filter(
          (ad) => !usedAds.includes(ad._id),
        );
        if (availableAds?.length === 0) {
          setUsedAds([]);
          return;
        }
        const randomIndex = Math.floor(Math.random() * availableAds?.length);
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
          if (
            _createDetailAdvertisement?.data?.createDetailadvertisements?._id
          ) {
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
        } catch (error) {
          errorMessage("Something wrong try again later!", 2000);
        }
      } else {
        const folder_name = `${folderDownload[0]?.folder_name}.zip`;

        try {
          if (folderDownload[0]?.access_password) {
            handleClickOpen();
          } else {
            setIsHide((prev) => ({
              ...prev,
              [1]: true,
            }));

            const multipleData = [
              {
                id: folderDownload?.[0]?._id,
                name: folder_name,
                newFilename: folderDownload?.[0].newFolder_name,
                checkType: "folder",
                newPath: folderDownload?.[0].newPath || "",
                createdBy,
              },
            ];

            await manageFile.handleDownloadFolder(
              { multipleData },
              {
                onSuccess: () => {
                  successMessage("Successfully downloaded", 3000);
                  setIsHide((prev) => ({
                    ...prev,
                    [1]: false,
                  }));
                  setIsSuccess((prev) => ({
                    ...prev,
                    [1]: true,
                  }));
                },
                onFailed: (error) => {
                  errorMessage(error, 3000);
                  setIsHide((prev) => ({
                    ...prev,
                    [1]: false,
                  }));
                  setIsSuccess((prev) => ({
                    ...prev,
                    [1]: false,
                  }));
                },
              },
            );
          }
        } catch (error: any) {
          errorMessage(error, 2000);
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

  // download multiple folder
  const handleMultipleDownloadFolder = async ({ folder, index }) => {
    setFolderDataSelect(folder);
    setMultipleType("folder");

    setTotalClickCount((prevCount) => prevCount + 1);
    if (totalClickCount >= getActionButton) {
      setTotalClickCount(0);

      try {
        if (folder?.access_password) {
          handleClickOpen();
        } else {
          handleDoneFolderDownload({
            folder,
            index,
          });
        }
      } catch (error) {
        errorMessage("Something wrong try again later!", 2000);
      }
    } else {
      if (getAdvertisemment.length) {
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
          if (
            _createDetailAdvertisement?.data?.createDetailadvertisements?._id
          ) {
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
        } catch (error) {
          errorMessage("Something wrong try again later!", 2000);
        }
      } else {
        try {
          if (folder?.access_password) {
            handleClickOpen();
          } else {
            handleDoneFolderDownload({
              folder,
              index,
            });
          }
        } catch (error: any) {
          errorMessage(error, 2000);
        }
      }
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

  // Done
  const handleDoneFolderDownload = async ({ folder, index }) => {
    try {
      setIsMultipleHide((prev) => ({
        ...prev,
        [index]: true,
      }));
      setIsMultipleSuccess((prev) => ({ ...prev, [index]: false }));

      const path = folder?.newPath || "";
      const folder_name = `${folder?.folder_name}.zip`;

      const multipleData = [
        {
          id: folder._id,
          name: folder_name,
          newFilename: folder?.newFolder_name,
          checkType: "folder",
          newPath: path,
          createdBy: folder?.createdBy,
        },
      ];

      await manageFile.handleDownloadFolder(
        { multipleData },
        {
          onFailed: (error) => {
            setIsMultipleHide((prev) => ({
              ...prev,
              [index]: false,
            }));
            setIsMultipleSuccess((prev) => ({ ...prev, [index]: false }));
            errorMessage(error, 3000);
          },
          onSuccess: () => {
            successMessage("Successfully downloaded", 3000);
            setIsMultipleHide((prev) => ({
              ...prev,
              [index]: false,
            }));
            setIsMultipleSuccess((prev) => ({ ...prev, [index]: true }));
          },
        },
      );
    } catch (error: any) {
      setIsMultipleHide((prev) => ({
        ...prev,
        [index]: false,
      }));
      setIsMultipleSuccess((prev) => ({ ...prev, [index]: false }));
      errorMessage(error, 3000);
    }
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
          if (
            _createDetailAdvertisement?.data?.createDetailadvertisements?._id
          ) {
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

      console.log({ multipleData });

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

  const _downloadFilesAll = async (getData: any[]) => {
    const noPasswordData = getData.filter((item) => !item.filePassword);
    if (noPasswordData.length <= 0) {
      errorMessage("Download failed!", 3000);
      return;
    }

    setIsProcessAll(true);
    setIsDownloadAll(false);

    try {
      if (linkClient?._id) {
        const multipleData = getData.map((file: any) => {
          return {
            id: file._id,
            newPath: file.newPath || "",
            newFilename: file.newFilename,
          };
        });

        await manageFile.handleDownloadPublicFile(
          { multipleData },
          {
            onSuccess: () => {
              successMessage("Download files successful", 3000);
              setIsProcessAll(false);
              setIsDownloadAll(true);
            },
            onFailed: (error) => {
              errorMessage(error, 3000);
              setIsProcessAll(false);
              setIsDownloadAll(false);
            },
          },
        );
      } else {
        const multipleData = getData.map((file: any) => {
          return {
            id: file._id,
            newPath: "",
            newFilename: file.newFilename,
          };
        });

        await manageFile.handleDownloadPublicFile(
          { multipleData },
          {
            onSuccess: () => {
              setIsProcessAll(false);
              setIsDownloadAll(true);
            },
            onFailed: (error) => {
              errorMessage(error, 3000);
              setIsProcessAll(false);
              setIsDownloadAll(false);
            },
          },
        );
      }
    } catch (error) {
      errorMessage("Something wrong try again later!", 2000);
    }

    successMessage("Download successful", 3000);
    setIsHide(false);
    setIsSuccess(true);
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

  useEffect(() => {
    // async function fetchData() {
    //   const response = await axios.get<{ messages: any[] }>(
    //     "http://192.168.100.129:3000/api/Read/Reply/Message",
    //   );
    //   const values = await response.data;
    //   setMessageData(values.messages);
    // }
    // fetchData();
  }, []);

  const dataLinkMemo = useMemo<any[]>(() => {
    if (linkClient?._id) {
      if (linkClient?.type === "multiple") {
        const fileData = dataMultipleFile?.map((file, index) => ({
          ...file,
          index,
        }));

        return fileData || [];
      } else {
        const fileData = dataFileLink?.queryFileGetLinks?.data?.map(
          (file, index) => ({
            ...file,
            index,
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
  }, [linkClient, dataFileLink, dataFileAndFolderLink, getDataRes]);

  const isMobile = useMediaQuery("(max-width: 600px)");

  return (
    <React.Fragment>
      <Helmet>
        <meta name="title" content={"seoTitle"} />
        <meta name="description" content={_description} />
      </Helmet>

      <MUI.ContainerHome maxWidth="xl">
        <Dialog open={open}>
          <DialogTitle
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              sx={{
                fontSize: isMobile ? "0.9rem" : "1.2rem",
              }}
            >
              Confirm password
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                padding: "20px 30px !important",
                maxWidth: "600px",
              }}
            >
              {checkModal ? (
                <Typography
                  sx={{
                    fontSize: isMobile ? "0.8rem" : "0.9rem",
                    textAlign: "center",
                  }}
                >
                  Please enter your password for:
                  <br />
                  <span style={{ color: "#17766B" }}>
                    {cutFileName(
                      combineOldAndNewFileNames(
                        getFilenames,
                        getNewFileName,
                      ) as string,
                      10,
                    )}
                  </span>
                </Typography>
              ) : (
                <Typography variant="h6" sx={{ padding: "0", margin: "0" }}>
                  Please enter your link password
                </Typography>
              )}
            </Box>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Password"
              type="password"
              fullWidth
              variant="standard"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            {checkModal ? (
              <>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleClose()}
                  sx={{ background: "#EA5455" }}
                  size="small"
                >
                  Cancel
                </Button>
              </>
            ) : null}
            <Button
              variant="contained"
              color="success"
              onClick={() => _confirmPasword(password)}
              sx={{ background: "#17766B" }}
              size="small"
            >
              Verify
            </Button>
          </DialogActions>
        </Dialog>

        <Box sx={{ backgroundColor: "#ECF4F3", padding: "3rem 1rem" }}>
          <MUI.AdsContainer>
            <MUI.AdsContent>
              <MUI.AdsCard>
                <Typography variant="h4" component={"h4"}>
                  Mltidiscriplinary, Monthly
                </Typography>
                <Typography component={"p"}>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Error, molestias.
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center !important",
                  }}
                >
                  <Typography component={"div"} sx={{ opacity: 0.7 }}>
                    TIJER Research Journal
                  </Typography>
                  <Button variant="contained">Open</Button>
                </Box>
              </MUI.AdsCard>
            </MUI.AdsContent>
          </MUI.AdsContainer>

          {/* Box downloader */}
          <Fragment>
            {dataLinkMemo && dataLinkMemo.length > 0 && (
              <GridFileData
                _description={_description}
                dataLinks={dataLinkMemo}
                multipleIds={multipleIds}
                countAction={adAlive}
                setMultipleIds={setMultipleIds}
                handleQRGeneration={handleQRGeneration}
                handleClearGridSelection={handleClearGridSelection}
                handleDownloadAsZip={handleDownloadAsZip}
                handleDownloadFileGetLink={handleDownloadFileGetLink}
              />
            )}
          </Fragment>
        </Box>
      </MUI.ContainerHome>

      <MUI.FilBoxBottomContainer>
        <Button
          fullWidth={true}
          variant="contained"
          size="small"
          onClick={handleDownloadFileGetLink}
        >
          Download
        </Button>
        <Button
          onClick={handleOpenApplication}
          fullWidth={true}
          variant="contained"
          size="small"
        >
          Open app
        </Button>
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
        f
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
