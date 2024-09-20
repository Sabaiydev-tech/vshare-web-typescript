import { IUser } from "./user.model";

export interface IFolder {
  _id?: string | number;
  folder_type: string;
  folder_name: string;
  newFolder_name?: string;
  total_size: number;
  newPath?: string;
  is_public?: string;
  checkFolder?: string;
  access_password?: string;
  status?: string;
  path?: string;
  url?: string;
  shortUrl?: string;
  longUrl?: string;
  createdBy?: IUser;
}
