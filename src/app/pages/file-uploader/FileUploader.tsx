import { useLazyQuery, useMutation } from "@apollo/client";
import axios from "axios";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// components
import { Box, IconButton, Skeleton, useMediaQuery } from "@mui/material";
import {
  CREATE_DETAIL_ADVERTISEMENT,
  QUERY_ADVERTISEMENT,
  QUERY_MANAGE_LINK_DETAIL,
} from "api/graphql/ad.graphql";
import {
  QUERY_FILE_GET_LINK,
  QUERY_FILE_PUBLIC,
} from "api/graphql/file.graphql";
import {
  CHECK_GET_LINK,
  GET_ONE_TIME_LINK_DETAIL,
} from "api/graphql/file.new.graphql";
import { QUERY_FOLDER_PUBLIC_LINK } from "api/graphql/folder.graphql";
import { QUERY_SETTING } from "api/graphql/setting.graphql";
import DialogConfirmPassword from "components/dialog/DialogConfirmPassword";
import DialogPreviewQRcode from "components/dialog/DialogPreviewQRCode";
import BaseDeeplinkDownload from "components/Downloader/BaseDeeplinkDownload";
import BaseGridDownload from "components/Downloader/BaseGridDownload";
import ListDataItem from "components/Downloader/ListDataItem";
import NotFound from "components/NotFound";
import Advertisement from "components/presentation/Advertisement";
import BoxSocialShare from "components/presentation/BoxSocialShare";
import DialogConfirmQRCode from "components/presentation/DialogConfirmQRCode";
import FileCardContainer from "components/presentation/FileCardContainer";
import FileCardItem from "components/presentation/FileCardItem";
import { ENV_KEYS } from "constants/env.constant";
import CryptoJS from "crypto-js";
import useManageFiles from "hooks/useManageFile";
import useManageSetting from "hooks/useManageSetting";
import moment from "moment";
import { Helmet } from "react-helmet-async";
import { BiSolidGrid } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import * as selectorAction from "stores/features/selectorSlice";
import { errorMessage, successMessage } from "utils/alert.util";
import { getFileTypeName, removeFileNameOutOfPath } from "utils/file.util";
import { decryptDataLink, encryptDataLink } from "utils/secure.util";
import * as MUI from "./styles/fileUploader.style";
import "./styles/fileUploader.style.css";

const DATA_LIST_SIZE = 10;

function FileUploader() {
  const location = useLocation();
  const isMobile = useMediaQuery("(max-width: 600px)");
  const [checkConfirmPassword, setConfirmPassword] = useState(false);
  const [getDataRes, setGetDataRes] = useState<any>(null);
  const [folderDownload, setFolderDownload] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [filePasswords, setFilePasswords] = useState<any>("");
  const [openInputPasswod, setOpenInputPassword] = useState(false);
  const [linkType, setLinkType] = useState("normal");

  const [linkExpirdAt, setLinkExpirdAt] = useState("");
  const [getNewFileName, setGetNewFileName] = useState("");
  const [fileQRCodePassword, setFileQRCodePassword] = useState("");

  const toggleJson = localStorage.getItem("toggle")
    ? localStorage.getItem("toggle")
    : "list";
  const [toggle, setToggle] = useState(toggleJson);

  const [getFilenames, setGetFilenames] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [checkModal, setCheckModal] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [isVerifyQrCode, setIsVerifyQRCode] = useState(false);
  const [getActionButton, setGetActionButton] = useState<any>();
  const [getAdvertisemment, setGetAvertisement] = useState<any>([]);

  const [usedAds, setUsedAds] = useState<any[]>([]);
  const [totalClickCount, setTotalClickCount] = useState(0);
  const [adAlive, setAdAlive] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [dataValue, setDataValue] = useState<any>(null);
  const [platform, setPlatform] = useState("");
  const [_description, setDescription] = useState("");

  const [multipleType, setMultipleType] = useState("");
  const [fileDataSelect, setFileDataSelect] = useState<any>(null);
  const [folderDataSelect, setFolderDataSelect] = useState<any>(null);
  const [dataMultipleFile, setDataMultipleFile] = useState<any[]>([]);
  const [dataMultipleFolder, setDataMultipleFolder] = useState<any[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [viewMore, setViewMore] = useState(20);
  const [total, setTotal] = useState(0);

  const params = new URLSearchParams(location.search);
  const linkValue = params.get("l");
  const urlClient = params.get("lc");
  const currentURL = window.location.href;
  const navigate = useNavigate();

  const LOAD_GET_IP_URL = ENV_KEYS.VITE_APP_LOAD_GETIP_URL;

  // Deep linking for mobile devices
  const appScheme = ENV_KEYS.VITE_APP_DEEP_LINK + currentURL;

  const [isPassword, setIsPassword] = useState(false);

  // const [qrcodeUser, setQrcodeUser] = useState([]);
  const [hideDownload, setHideDownload] = useState(true);
  const [getData] = useLazyQuery(QUERY_FILE_PUBLIC, {
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

  const [getManageLinkDetail] = useLazyQuery(QUERY_MANAGE_LINK_DETAIL, {
    fetchPolicy: "no-cache",
  });

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

  const [getFilePassword] = useLazyQuery(CHECK_GET_LINK);
  // const [getManageLinkDetails] = useLazyQuery(GET_MANAGE_LINK_DETAIL);
  const [getOneTimeLinkDetails] = useLazyQuery(GET_ONE_TIME_LINK_DETAIL, {
    fetchPolicy: "no-cache",
  });

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

  function handleMultipleListData(id: string) {
    const item = dataFileConcat.find((data) => data._id === id);
    const name = !item?.isFile ? item?.folder_name : item?.filename;
    const newFilename = !item.isFile ? item?.newFolder_name : item?.newFilename;
    const checkType = !item.isFile ? "folder" : "file";

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

    dispatch(
      selectorAction.setFileAndFolderData({
        data: value,
      }),
    );
  }

  function handleToggle() {
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
        if (downloadData?.status === "on") {
          setHideDownload(false);
        }
      }
    }

    getDataSetting();
  }, [useDataSetting.data]);

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

  const handleViewMore = () => {
    setViewMore((prev) => prev + 10);
  };

  const handleInputPassword = async (inputPassword: string) => {
    if (inputPassword && password) {
      await handleListFiles();
    } else {
      errorMessage("Input your password", 3000);
    }
  };

  const handleInputPasswordClose = () => {
    setIsPassword(false);
    setOpenInputPassword(false);
  };

  const handleListFiles = async (link?: string) => {
    const type = link ?? linkType;

    if (!type) {
      errorMessage("Omg! something went wrong.", 3000);
      return;
    }

    setIsLoading(true);

    if (type === "one_time_link") {
      await handleOneTimeLinkDetails();
    }
    if (type === "normal") {
      await handleManageLinkDetails();
    }

    setIsLoading(false);
  };

  const handleManageLinkDetails = async () => {
    const os = navigator.userAgent;

    try {
      if (linkClient?._id)
        if (linkClient?.type === "multiple") {
          setIsLoading(true);

          await getManageLinkDetail({
            variables: {
              where: {
                _id: linkClient?._id,
                ...(password && { password }),
              },
              limit: toggle === "list" ? DATA_LIST_SIZE : viewMore,
              skip:
                toggle === "list" ? DATA_LIST_SIZE * (currentPage - 1) : null,
            },
            onCompleted: async (values) => {
              const totalData = values?.getManageLinkDetails?.total || 0;
              const mainData = values?.getManageLinkDetails?.data || [];
              setTotal(totalData);
              setOpenInputPassword(false);

              if (mainData?.length > 0) {
                if (os.match(/iPhone|iPad|iPod/i)) {
                  setPlatform("ios");
                }

                if (os.match(/Android/i)) {
                  setPlatform("android");
                }

                const fileData = mainData?.filter(
                  (file) => file.type === "file",
                );

                const folderData = mainData?.filter(
                  (folder) => folder.type === "folder",
                );

                if (folderData?.length > 0) {
                  const folderItems = folderData?.map((folder, index) => {
                    return {
                      ...folder?.folderData,
                      _id: folder?.folderId,
                      index,
                    };
                  });

                  if (folderItems.length > 0) {
                    const title = folderItems?.[0]?.folder_name || "";
                    document.title = title + " | VSHARE";
                    setDescription(`${title} on vshare.net`);
                  }
                  setDataMultipleFolder(folderItems);
                }

                if (fileData?.length > 0) {
                  const fileItems = fileData?.map((file, index) => {
                    return {
                      ...file?.fileData,
                      _id: file?.fileId,
                      index,
                    };
                  });

                  if (fileItems.length > 0) {
                    const title = fileItems?.[0]?.filename || "";
                    document.title = title + " | VSHARE";
                    setDescription(`${title} on vshare.net`);
                  }
                  setDataMultipleFile(fileItems);
                }
              }

              setIsLoading(false);
            },
            onError: (error) => {
              setIsPassword(false);
              setIsLoading(false);
              errorMessage(error?.message, 3000);
            },
          });
        }
    } catch (error) {
      document.title = "No documents found" + " | VSHARE";
      setDescription("No documents found on vshare.net");
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOneTimeLinkDetails = async () => {
    const os = navigator.userAgent;

    try {
      if (linkClient?._id) {
        if (linkClient?.type === "multiple") {
          setIsLoading(true);
          await getOneTimeLinkDetails({
            variables: {
              where: {
                _id: linkClient?._id,
                ...(password && { password }),
              },
              orderBy: "desc",
              limit: toggle === "list" ? DATA_LIST_SIZE : viewMore,
              skip:
                toggle === "list" ? DATA_LIST_SIZE * (currentPage - 1) : null,
            },
            onCompleted: async (values) => {
              const totalData = values?.getOneTimeLinkDetails?.total || 0;
              const mainData = values?.getOneTimeLinkDetails?.data || [];
              const dataError = values?.getOneTimeLinkDetails?.message;
              const codeError = values?.getOneTimeLinkDetails?.code;

              if (dataError && codeError === "500") {
                setIsLoading(false);
                errorMessage(dataError, 3000);
                return;
              }

              setTotal(totalData);

              if (mainData?.length > 0) {
                if (os.match(/iPhone|iPad|iPod/i)) {
                  setPlatform("ios");
                }

                if (os.match(/Android/i)) {
                  setPlatform("android");
                }

                const fileData = mainData?.filter(
                  (file) => file.type === "file",
                );

                const folderData = mainData?.filter(
                  (folder) => folder.type === "folder",
                );

                if (folderData?.length > 0) {
                  const folderItems = folderData?.map((folder, index) => {
                    return {
                      ...folder?.folderData,
                      _id: folder?.folderId,
                      index,
                    };
                  });

                  if (folderItems.length > 0) {
                    const title = folderItems?.[0]?.folder_name || "";
                    document.title = title + " | VSHARE";
                    setDescription(`${title} on vshare.net`);
                  }
                  setDataMultipleFolder(folderItems);
                }

                if (fileData?.length > 0) {
                  const fileItems = fileData?.map((file, index) => {
                    return {
                      ...file?.fileData,
                      _id: file?.fileId,
                      index,
                    };
                  });

                  if (fileItems.length > 0) {
                    const title = fileItems?.[0]?.filename || "" + " | VSHARE";
                    document.title = title;
                    setDescription(`${title} on vshare.net`);
                  }
                  setDataMultipleFile(fileItems);
                }
              }

              setIsLoading(false);
              setOpenInputPassword(false);
            },
            onError: (error) => {
              setIsPassword(false);
              setIsLoading(false);
              errorMessage(error?.message || "Not found data!", 3000);
            },
          });
        }
      }
    } catch (error: any) {
      document.title = "No documents found" + " | VSHARE";
      setDescription("No documents found on vshare.net");
      errorMessage(error);
      setIsLoading(false);
    }
  };

  const getManageLinkPassword = async (id: string | number) => {
    setIsLoading(true);
    await getFilePassword({
      variables: {
        where: {
          _id: id,
          status: "active",
        },
      },
      onCompleted: async (response) => {
        setIsLoading(false);
        if (
          response &&
          // response?.getManageLinks?.data && ////ຖ້າ ເຫັນເປັນສໍາເລັດ ແຕ່ ດາຕ່າ ອາເລເປັນ ຫວ່າງເປົ່າແມ່ນໃຫ້ອ້າຍຍິງໄປເອົາດາຕາຂອງ getManagelinkdetails ເລີຍເພາະໂຕນີ້ຈະເປັນ link original ຂອງໄຟ ແລ້ວຈຶ່ງໄປເອົາດາຕາ ຢູ່ getManageLinks ເປັນຫວ່າງເປົ່າ
          response?.getManageLinks?.code === "200"
        ) {
          const result = response?.getManageLinks?.data[0];

          if (result?.type) {
            setLinkType(result?.type);
          }

          if (result?.expiredAt || result?.expired) {
            setLinkExpirdAt(
              moment(result?.expiredAt || result?.expired).format(
                "DD/MM/YYYY HH:MM A",
              ),
            );
          }

          if (result?.password) {
            setOpenInputPassword(true);
          } else {
            await handleListFiles(result?.type);
          }
        }
      },
      onError: (error) => {
        errorMessage(error?.message || "Can not burn this secret Url.", 3000);
        setOpenInputPassword(false);
        setIsPassword(false);
      },
    });
  };

  const getFolders = async () => {
    try {
      setIsLoading(true);
      await getFolderLink({
        variables: {
          where: {
            _id: linkClient?._id,
          },
        },
        onCompleted: (data) => {
          const folderData = data?.queryfoldersGetLinks?.data || [];
          if (folderData?.[0]?.status === "active") {
            setGetDataRes(folderData || []);
            setFolderDownload(folderData || []);

            document.title =
              folderData?.[0]?.folder_name || "vshare download folder";
            if (folderData && folderData?.[0]?.folder_type) {
              if (folderData[0]?.folder_name) {
                setDescription(folderData[0]?.folder_name + " on vshare.net");
              }
            }
          }
        },
      });
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    } catch (error: any) {
      setIsLoading(false);
      errorMessage(error);
    }
  };

  const getFiles = async () => {
    try {
      setIsLoading(true);

      await getFileLink({
        variables: {
          where: {
            _id: linkClient?._id,
          },
        },
        // onCompleted: () => {},
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
              " on vshare.net",
          );
        }
        setGetDataRes(dataFileLink?.queryFileGetLinks?.data || []);
      }
    } catch (error: any) {
      setIsLoading(false);
      errorMessage(error);
    }
  };

  const getPublicLink = async () => {
    try {
      setIsLoading(true);
      getData({
        variables: {
          where: {
            urlAll: linkValue ? String(linkValue) : null,
          },
        },
        onCompleted: (resData) => {
          const fileData = resData?.filesPublic?.data?.[0];
          document.title = fileData?.filename;
          setDescription(`${fileData?.filename} on vshare.net`);
          setGetDataRes(resData?.filesPublic?.data || []);
        },
      });

      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    } catch (error: any) {
      setIsLoading(false);
      errorMessage(error);
    }
  };

  useEffect(() => {
    const getLinkData = async () => {
      if (linkClient?._id) {
        if (linkClient?.type === "file") {
          await getFiles();
        }

        if (linkClient?.type === "folder") {
          await getFolders();
        }

        if (linkClient?.type === "multiple") {
          await getManageLinkPassword(linkClient?._id);
        }
      } else {
        await getPublicLink();
      }
    };

    getLinkData();

    // if (urlClient && linkClient && linkClient?._id) {
    //   getManageLinkPassword(linkClient?._id);
    // }
  }, [linkValue, linkType]);

  // useEffect(() => {
  //   const getMultipleFileAndFolder = async () => {
  //     const os = navigator.userAgent;

  //     try {
  //       if (linkClient?._id)
  //         if (linkClient?.type === "multiple") {
  //           setIsLoading(true);

  //           await getManageLinkDetail({
  //             variables: {
  //               where: { _id: linkClient?._id },
  //               limit: toggle === "list" ? DATA_LIST_SIZE : viewMore,
  //               skip:
  //                 toggle === "list" ? DATA_LIST_SIZE * (currentPage - 1) : null,
  //             },
  //             onCompleted: async (values) => {
  //               const totalData = values?.getManageLinkDetails?.total || 0;
  //               const mainData = values?.getManageLinkDetails?.data || [];
  //               setTotal(totalData);

  //               if (mainData?.length > 0) {
  //                 if (os.match(/iPhone|iPad|iPod/i)) {
  //                   setPlatform("ios");
  //                 }

  //                 if (os.match(/Android/i)) {
  //                   setPlatform("android");
  //                 }

  //                 const fileData = mainData?.filter(
  //                   (file) => file.type === "file",
  //                 );

  //                 const folderData = mainData?.filter(
  //                   (folder) => folder.type === "folder",
  //                 );

  //                 if (folderData?.length > 0) {
  //                   const folderItems = folderData?.map((folder, index) => {
  //                     return {
  //                       ...folder?.folderData,
  //                       _id: folder?.folderId,
  //                       index,
  //                     };
  //                   });

  //                   if (folderItems.length > 0) {
  //                     const title = folderItems?.[0]?.folder_name || "";
  //                     document.title = title;
  //                     setDescription(`${title} on vshare.net`);
  //                   }
  //                   setDataMultipleFolder(folderItems);
  //                 }

  //                 if (fileData?.length > 0) {
  //                   const fileItems = fileData?.map((file, index) => {
  //                     return {
  //                       ...file?.fileData,
  //                       _id: file?.fileId,
  //                       index,
  //                     };
  //                   });

  //                   if (fileItems.length > 0) {
  //                     const title = fileItems?.[0]?.filename || "";
  //                     document.title = title;
  //                     setDescription(`${title} on vshare.net`);
  //                   }
  //                   setDataMultipleFile(fileItems);
  //                 }
  //               }

  //               setIsLoading(false);
  //             },
  //           });
  //         }
  //     } catch (error) {
  //       document.title = "No documents found";
  //       setDescription("No documents found on vshare.net");
  //       setIsLoading(false);
  //     }
  //   };
  //   getMultipleFileAndFolder();
  // }, [currentPage, viewMore]);

  useEffect(() => {
    if (dataMultipleFile.length > 0 && dataMultipleFolder.length > 0) {
      const title = dataMultipleFolder?.[0]?.folder_name || "";
      document.title = title;
      setDescription(`${title} on vshare.net`);
    }
  }, [dataMultipleFile, dataMultipleFolder]);

  useEffect(() => {
    function handleDetectPlatform() {
      const os = navigator.userAgent;
      if (
        dataFileLink?.queryFileGetLinks?.data?.length ||
        dataFolderLink?.queryfoldersGetLinks?.data?.length
      ) {
        if (os.match(/iPhone|iPad|iPod/i)) {
          setPlatform("ios");
        } else if (os.match(/Android/i)) {
          setPlatform("android");
        }
      }

      if (getDataRes?.[0]?._id) {
        if (os.match(/iPhone|iPad|iPod/i)) {
          setPlatform("ios");
        } else if (os.match(/Android/i)) {
          setPlatform("android");
        }
      }
    }

    handleDetectPlatform();
  }, [dataFileLink, dataFolderLink, getDataRes]);

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
    handleDownloadGridFileAndFolder();
  };

  const handleDownloadGridFileAndFolder = async () => {
    if (dataSelector?.selectionFileAndFolderData?.length > 0) {
      const newModelData = dataSelector?.selectionFileAndFolderData || [];
      const multipleData = newModelData.map((file: any) => {
        const newPath = file.newPath || "";

        return {
          name: file.name,
          newFilename: file.newFilename,
          checkType: file?.checkType || "file",
          newPath,
          createdBy: file.createdBy,
          isPublic: file.createdBy?._id === "0" ? true : false,
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

  const handleDownloadAsZip = async () => {
    const groupData: any[] = dataLinkMemo.concat(dataFolderLinkMemo);

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
        isFile: true,
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

  const dataFileConcat = useMemo(() => {
    const result = dataLinkMemo?.concat(dataFolderLinkMemo || []);

    return result || [];
  }, [dataLinkMemo, dataFolderLinkMemo]);

  return (
    <React.Fragment>
      <Helmet>
        <meta name="description" content={_description} />
      </Helmet>
      <MUI.ContainerHome maxWidth="xl">
        <Box sx={{ backgroundColor: "#F8F7FA", padding: "1rem" }}>
          {/* {!dataFileConcat.length && ( */}
          {(isLoading || isPassword || openInputPasswod) && (
            <Box>
              <Box sx={{ pt: 0.5 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 5,
                  }}
                >
                  <Skeleton variant="rectangular" width={"100%"} height={118} />
                  <Skeleton variant="rectangular" width={"100%"} height={118} />
                  <Skeleton variant="rectangular" width={"100%"} height={118} />
                </Box>
                <Skeleton height={50} />
                <Skeleton />
                <Skeleton height={40} />
                <Skeleton variant="rectangular" width={"100%"} height={60} />
              </Box>
              {!isMobile && (
                <Box sx={{ pt: 0.5, mt: 5 }}>
                  <Skeleton variant="rectangular" width={"100%"} height={60} />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 5,
                      py: 3,
                    }}
                  >
                    <Skeleton
                      variant="rectangular"
                      width={"100%"}
                      height={80}
                    />
                    <Skeleton
                      variant="rectangular"
                      width={"100%"}
                      height={80}
                    />
                    <Skeleton
                      variant="rectangular"
                      width={"100%"}
                      height={80}
                    />
                  </Box>
                  <Skeleton />
                  <Skeleton height={40} />
                </Box>
              )}
            </Box>
          )}

          <Advertisement />

          {((dataFolderLinkMemo && dataFolderLinkMemo.length > 0) ||
            (dataLinkMemo && dataLinkMemo.length > 0) ||
            dataFileConcat.length > 0) &&
          isLoading === false ? (
            <>
              {dataFileConcat?.length > 0 && (
                <MUI.FileBoxToggle>
                  {toggle === "grid" ? (
                    <>
                      {" "}
                      <BaseGridDownload
                        dataFiles={dataSelector?.selectionFileAndFolderData}
                        adAlive={adAlive}
                        handleClearSelector={handleClearSelector}
                        handleToggle={handleToggle}
                        handleDownloadGridFileAndFolder={
                          handleDownloadGridFileAndFolder
                        }
                      />
                    </>
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
                      {dataFileConcat.length > 0 && (
                        <ListDataItem
                          toggle={toggle}
                          _description={_description}
                          dataLinks={dataFileConcat}
                          linkExpired={linkExpirdAt}
                          handleSelection={handleMultipleListData}
                          selectionFileAndFolderData={
                            dataSelector.selectionFileAndFolderData || []
                          }
                          countAction={adAlive}
                          setToggle={handleToggle}
                          handleQRGeneration={handleQRGeneration}
                          handleClearFileSelection={handleClearSelector}
                          handleDownloadAsZip={handleDownloadGridFileAndFolder}
                          handleDoubleClick={handleOpenFolder}
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
                                  fileType={getFileTypeName(item?.folder_type)}
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
                      )}
                    </Fragment>
                  )}
                </Box>

                {(dataFolderLinkMemo?.length > 0 ||
                  dataLinkMemo?.length > 0) && (
                  <BoxSocialShare
                    isFile={false}
                    _description={_description}
                    countAction={adAlive}
                    isHide={hideDownload}
                    handleDownloadFolderAsZip={handleDownloadAsZip}
                  />
                )}
              </MUI.FileListContainer>
            </>
          ) : (
            <NotFound />
          )}
          {/* <FeedCard /> */}
        </Box>
      </MUI.ContainerHome>

      <BaseDeeplinkDownload
        selectionData={
          dataSelector?.selectionFileAndFolderData?.length > 0 && true
        }
        platform={platform}
        adAlive={adAlive}
        onClickOpenApplication={handleOpenApplication}
        onClickDownloadData={handleMobileDownloadData}
      />

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

      {/* one time link or manage lin new  */}
      <DialogConfirmPassword
        open={openInputPasswod}
        isMobile={isMobile}
        getFilenames={getFilenames}
        getNewFileName={getNewFileName}
        password={password}
        checkModal={checkModal}
        setPassword={setPassword}
        handleClose={handleInputPasswordClose}
        _confirmPasword={handleInputPassword}
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

export default FileUploader;
