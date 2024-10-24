export interface IFile {
  _id: string;
  filename: string;
  isFile?: boolean;
  newFilename: string;
  filePassword: string;
  fileType: string;
  size: string;
  expired: string;
  status: string;
  isPublic: string;
  path: string;
  newPath: string;
  urlAll: string;
  url: string;
  createdBy: {
    _id: string;
    newName: string;
  };
  getLinkBy: string;
  shortUrl: string;
  longUrl: string;
}
