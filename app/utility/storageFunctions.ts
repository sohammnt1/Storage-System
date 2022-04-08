import fs from "fs";

export const checkIfFolderNotExist = (dirName: string) =>
  !fs.existsSync(dirName);

export const createFolderFunction = (dirName: string) =>
  fs.mkdir(dirName, (error: any) => {
    if (error) {
      throw error;
    }
  });

export const deleteFolderFunction = (dirName: string) =>
  fs.rmSync(dirName, { recursive: true, force: true });

export const deleteFileFunction = (filePath: string) => fs.unlinkSync(filePath);
