const CUTTING_EXPRESSION = /\s+[^\s]*$/;

export const createShortcut = (text: string, limit: number) => {
  if (text.length > limit) {
    const part = text.slice(0, limit);
    if (part.match(CUTTING_EXPRESSION)) {
      return part.replace(CUTTING_EXPRESSION, "...");
    }
    return part + "...";
  }
  return text;
};

export const cutStringWithEllipsis = (
  inputString,
  maxLength,
  cutSpecificLength = 0,
) => {
  if (inputString) {
    const givenLength = cutSpecificLength || maxLength;

    const subString = inputString.substring(0, givenLength);

    return subString.length === inputString.length
      ? inputString
      : subString + "...";
  }
  return;
};

export function limitContent(fileName: string, maxLength: number) {
  let truncatedText = "";
  if (fileName.length > maxLength) {
    truncatedText = fileName.substring(0, maxLength) + "...";
  } else {
    truncatedText = fileName.substring(0, maxLength);
  }
  return truncatedText;
}

export const generateRandomString = () => {
  // define the pool of characters to choose from
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  let result = "";
  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    const randomCharacter = characters.charAt(randomIndex);
    result += randomCharacter;
    characters =
      characters.slice(0, randomIndex) + characters.slice(randomIndex + 1);
  }
  const now = new Date();
  const timestamp = `${now.getFullYear()}${now.getMonth()}${now.getDate()}${now.getHours()}${now.getMinutes()}${now.getSeconds()}`;
  const encryptedTimestamp = btoa(timestamp).substring(0, 7);
  result += encryptedTimestamp;

  return result;
};

// const extension = fileName.split(".").pop();
// const nameWithoutExtension = fileName.replace(`.${extension}`, "");
// if (nameWithoutExtension.length <= maxLength) return fileName;
// return `${nameWithoutExtension.slice(0, maxLength)}...${extension}`;
