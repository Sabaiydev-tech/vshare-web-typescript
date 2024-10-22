import { IUsersTypes } from "./userType";

export interface IVoteResultType {
  filesData: IVoteResultFilesDataType;
  voteData: IVoteDataType;
}

export interface IVoteResultFilesDataType {
  total: number;
  data: IVoteWithFile[];
}

export interface IVoteWithFile {
  _id: string;
  createdBy: IUsersTypes;
  fileType: string;
  filename: string;
  newFilename: string;
  newPath: string;
  size: string;
  isSelected: boolean;
}
export interface IVoteResultDataType {
  _id: string;
  filename: string;
  newFilename: string;
  fileType: string;
  size: string;
  totalDownloadFaild: number;
  totalDownload: number;
}

export interface IVoteDataType {
  _id: string;
  topic: string;
  description: string;
  voteOption: {
    name: string;
    value: [number];
  };
  isVshareUser: boolean;
  isActive: boolean;
  voteSecurity: string;
  blockVPN: boolean;
  reCaptcha: boolean;
  startVoteAt: Date;
  expiredAt: Date;
  hideSharebtn: boolean;
  hideResultbtn: boolean;
  fileType: [string];
  allowMultipleUpload: boolean;
  voteLink: string;
  uploadLink: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: IUsersTypes;
  totalVoteParticipant: number;
  totalVote: number;
}
