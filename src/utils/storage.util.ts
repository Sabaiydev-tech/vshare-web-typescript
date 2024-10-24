export const convertBytetoMBandGB = (size: number, isFixed?: boolean) => {
  const sizeInKB = size / 1024;
  const sizeInMB = size / (1024 * 1024);
  const sizeInGB = size / (1024 * 1024 * 1024);
  const sizeInTB = size / (1024 * 1024 * 1024 * 1024);
  if (size < 1024) {
    const GB = size;
    return GB + " B";
  } else if (size >= 1024 && size < 1024 * 1024) {
    const GB = isFixed ? Math.round(sizeInKB) : sizeInKB.toFixed(2);
    return GB + " KB";
  } else if (size >= 1024 * 1024 && size < 1024 * 1024 * 1024) {
    const GB = isFixed ? Math.round(sizeInMB) : sizeInMB.toFixed(2);
    return GB + " MB";
  } else if (size >= 1024 * 1024 * 1024 * 1024) {
    const TB = isFixed ? Math.round(sizeInTB) : sizeInTB.toFixed(2);
    return TB + " TB";
  } else {
    const GB = isFixed ? Math.round(sizeInGB) : sizeInGB.toFixed(2);
    return GB + " GB";
  }
};
