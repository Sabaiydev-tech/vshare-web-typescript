export const SubstringFilename = (filename: string) => {
  if (!filename) {
    return;
  }
  if (filename.includes(".")) {
    return filename.substring(0, filename.lastIndexOf("."));
  } else {
    return filename;
  }
};
