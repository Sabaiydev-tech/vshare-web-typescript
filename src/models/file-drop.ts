import { IUser } from "./user.model";

export interface IFileDrop {
  _id?: string;
  status?: string;
  createdBy?: IUser;
  folderId?: {
    _id: string;
    newFolder_name: string;
    path: string;
    newPath: string;
  };
  title?: string;
  description?: string;
  expiredAt?: string;
  allowDownload?: boolean;
  allowUpload?: boolean;
  allowMultiples?: boolean;
}
