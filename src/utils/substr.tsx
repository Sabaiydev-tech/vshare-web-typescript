export const SubstringFilename = (filename: string) => {
  if (!filename) {
    return;
  }
  
const nameWithoutExtension = filename.includes(".")
? filename.substring(0, filename.lastIndexOf("."))
: filename;

return nameWithoutExtension.length > 10
? `${nameWithoutExtension.substring(0, 16)}...`
: nameWithoutExtension;
};


export const SubstringFilenameCard = (filename: string) => {
  if (!filename) {
    return;
  }
  
const nameWithoutExtension = filename.includes(".")
? filename.substring(0, filename.lastIndexOf("."))
: filename;

return nameWithoutExtension.length > 20
? `${nameWithoutExtension.substring(0, 20)}...`
: nameWithoutExtension;
};
