import { ENV_KEYS } from "constants/env.constant";
import { removeFileNameOutOfPath } from "utils/file.util";
import { encryptDownloadData } from "utils/secure.util";

const useManageFiles = () => {
  const startDownload = ({ baseUrl }) => {
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";

    iframe.onload = () => {
      document.body.removeChild(iframe);
    };

    iframe.src = baseUrl;
    document.body.appendChild(iframe);
  };

  const handleDownloadFile = async (
    { multipleData },
    { onSuccess, onFailed },
  ) => {
    try {
      const newMoldelData = multipleData.map((file) => {
        let real_path = "";
        if (file.newPath) {
          real_path = removeFileNameOutOfPath(file.newPath);
        }

        const isPublic = `public/${file.newFilename}`;
        const isPrivate = `${file?.createdBy?.newName}-${file?.createdBy?._id}/${real_path}/${file.newFilename}`;
        const path = file?.isPublic ? isPublic : isPrivate;

        return {
          path,
          isFolder: file.checkType === "folder" ? true : false,
          _id: file.id,
          createdBy: file.createdBy?._id,
        };
      });

      const headers = {
        accept: "*/*",
        lists: newMoldelData,
        createdBy: multipleData?.[0].createdBy?._id,
      };

      const encryptedData = encryptDownloadData(headers);
      const baseUrl = `${ENV_KEYS.VITE_APP_LOAD_URL}downloader/file/download-multifolders-and-files?download=${encryptedData}`;
      startDownload({ baseUrl });
      onSuccess?.();
    } catch (error) {
      onFailed?.(error);
    }
  };

  const handleDownloadPublicFile = async (
    { multipleData },
    { onSuccess, onFailed },
  ) => {
    try {
      const newMoldelData = multipleData.map((file) => {
        return {
          isFolder: false,
          path: `public/${file?.newFilename}`,
          _id: file.id,
          createdBy: "0",
        };
      });

      const headers = {
        accept: "*/*",
        lists: newMoldelData,
        createdBy: "0",
      };

      const encryptedData = encryptDownloadData(headers);

      const baseUrl = `${ENV_KEYS.VITE_APP_LOAD_URL}downloader/file/download-multifolders-and-files?download=${encryptedData}`;
      startDownload({ baseUrl });
      onSuccess?.();
    } catch (error) {
      onFailed?.(error);
    }
  };

  const handleDownloadFolder = async (
    { multipleData },
    { onSuccess, onFailed },
  ) => {
    try {
      const newMoldelData = multipleData.map((folder) => {
        let real_path = "";
        if (folder.newPath) {
          real_path = removeFileNameOutOfPath(folder.newPath);
        }

        const path = `${folder?.createdBy?.newName}-${folder?.createdBy?._id}/${real_path}`;
        return {
          isFolder: true,
          path: `${path}/${folder.newFilename}`,
          _id: folder.id,
          createdBy: folder.createdBy?._id || "0",
        };
      });

      const headers = {
        accept: "*/*",
        lists: newMoldelData,
        createdBy: multipleData?.[0].createdBy?._id,
      };

      const encryptedData = encryptDownloadData(headers);

      const baseUrl = `${ENV_KEYS.VITE_APP_LOAD_URL}downloader/file/download-multifolders-and-files?download=${encryptedData}`;
      startDownload({ baseUrl });
      onSuccess?.();
    } catch (error) {
      console.log({ error });
      onFailed?.(error);
    }
  };

  return {
    handleDownloadFile,
    handleDownloadFolder,
    handleDownloadPublicFile,
  };
};

export default useManageFiles;
