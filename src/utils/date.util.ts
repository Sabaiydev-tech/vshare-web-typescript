import moment from "moment";

export function calculateTime(time) {
  const seconds = time / 1000;
  if (seconds < 60) {
    return `${seconds} s`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} mn${minutes !== 1 ? "s" : ""}`;
  } else {
    const hours = Math.floor(seconds / 3600);
    const remainingMinutes = Math.floor((seconds % 3600) / 60);
    return `${hours} h${hours !== 1 ? "s" : ""} and ${remainingMinutes} mn${
      remainingMinutes !== 1 ? "s" : ""
    }`;
  }
}

export function formatDate(date: string): string {
  const dateString = moment(date).format("DD-MM-YYYY");
  return dateString;
}

export const FormatTime = (time: number) => {
  if (time < 1000) {
    return `${time} mi`; 
  } else if (time < 60000) {
    const seconds = Math.floor(time / 1000);
    return `${seconds} s`; 
  } else if (time < 3600000) {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    return `${minutes} m ${seconds} s`;
  } else {
    const hours = Math.floor(time / 3600000);
    const minutes = Math.floor((time % 3600000) / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    return `${hours} h ${minutes} m ${seconds} s`;
  }
};
export function formatDateTime(date: string) {
  const dateTime = moment(date).format("DD/MM/YYYY HH:MM A") || "";
  return dateTime;
}
