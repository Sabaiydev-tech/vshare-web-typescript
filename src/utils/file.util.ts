export function getFileType(name: string) {
  if (!name) {
    return null;
  }
  const fileName = name;
  const fileType = fileName?.split(".").pop();

  return fileType;
}

export function getFileTypeName(path: string): string {
  if (!path) {
    return "";
  }

  const str = path;
  const parts = str.split("/");
  const firstPart = parts[0];
  return firstPart;
}

// function cut file name out Test(1)/Folder/sss.jpg => Test(1)/Folder/
export function truncateName(path: string): string {
  const folder_name = path ? path.match(/^(.+)\//)?.[1] || path : "";
  return folder_name + "/";
}

export function cutFileName(fileName: string, maxLength = 10) {
  const extension = fileName.split(".").pop();
  const nameWithoutExtension = fileName.replace(`.${extension}`, "");
  if (nameWithoutExtension.length <= maxLength) return fileName;
  return `${nameWithoutExtension.slice(0, maxLength)}...${extension}`;
}

export function getFileNameExtension(filename: string) {
  const dotIndex = filename?.lastIndexOf(".");
  if (dotIndex !== -1) {
    const fileExtension = filename?.slice?.(dotIndex);
    return fileExtension;
  } else {
    return "";
  }
}

export function combineOldAndNewFileNames(
  filename: string,
  newFileName: string,
) {
  if (!newFileName) {
    return filename;
  }
  if (filename && newFileName) {
    const newName = filename.replace(newFileName, "");
    return newName;
  }
}

export function removeFileNameOutOfPath(path: string) {
  return path.substring(0, path.lastIndexOf("/") + 1);
}

export function startDownloadExtension(baseUrl: string) {
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";

  iframe.onload = () => {
    document.body.removeChild(iframe);
  };

  iframe.src = baseUrl;
  document.body.appendChild(iframe);
}
