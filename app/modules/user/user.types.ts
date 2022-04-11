export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  forgotPasswordToken: string;
  tokenExpiry: Date;
  storage: [
    {
      folderName: string;
      files: [
        {
          fileName: string;
          fileSize: number;
          fileUrl: string;
        }
      ];
    }
  ];
  config: {
    maxNumberOfFiles: number;
    maxStorageSize: number;
  };
  deleted: boolean;
}

export interface IFileData {
  fileSize: number;
  fileName: string;
  fileUrl: string;
  folderName: string;
  email: string;
}

export interface IFolder {
  folderName: string;
  files: [IFile];
}

export interface IFile {
  fileName: string;
  fileSize: number;
  fileUrl: string;
}
