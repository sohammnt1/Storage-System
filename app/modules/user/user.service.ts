import { hash, compare } from "bcryptjs";
import userRepo from "./user.repo";
import { generateToken } from "../../utility/jwt";
import { IFileData, IUser } from "./user.types";
import sgMail from "@sendgrid/mail";
import * as randomToken from "rand-token";
import path from "path";
import {
  checkIfFolderNotExist,
  createFolderFunction,
  deleteFolderFunction,
  deleteFileFunction,
} from "../../utility/storageFunctions";

const createUser = async (user: IUser) => {
  try {
    const hashedPassword = await hash(user.password, 12);
    const userData = {
      ...user,
      ["password"]: hashedPassword,
    };
    const result = await userRepo.create(userData);
    sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
    const msg = {
      from: "testingformail797@gmail.com",
      to: userData.email,
      subject: "Account Sucessfully Created",
      text: `Dear,${userData.name}. Your Account has been created.\nHere are the login credentials.\n email: ${userData.email} Password:${user.password}`,
    };
    await sgMail.send(msg);
    return result;
  } catch (error) {
    throw error;
  }
};

const authenticateUser = async (email: string, password: string) => {
  try {
    let credentials = {
      email: email,
      password: password,
    };
    const user = await userRepo.getOne(email);
    if (!user) throw new Error("User doesn't exists");
    const doMatch = await compare(password, user.password);
    if (!doMatch) throw new Error("Invalid Password");
    const token = generateToken(user);
    const role = user.role;

    return { token, role };
  } catch (error) {
    throw error;
  }
};

const createChangePasswordRequest = async (email: string) => {
  try {
    const user = await userRepo.getOne(email);
    if (!user) throw new Error("User doesn't exists");
    user.forgotPasswordToken = randomToken.generate(6);
    user.tokenExpiry = Date.now() + 1000 * 60 * 60;
    await user.save();
    sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
    const msg = {
      from: "testingformail797@gmail.com",
      to: user.email,
      subject: "Password Reset Request",
      html:
        '<p>You requested for reset password, kindly use this <a href="http://localhost:80/reset-password">link</a> to reset your password enter the token ' +
        user.forgotPasswordToken +
        "</p>",
    };
    await sgMail.send(msg);
    return user.forgotPasswordToken;
  } catch (error) {
    throw error;
  }
};

const changePassword = async (
  forgotPasswordToken: string,
  newPassword: string
) => {
  try {
    const user = await userRepo.getByToken(forgotPasswordToken);
    user.password = await hash(newPassword, 12);
    await user.save();
    if (!user) throw new Error("Token doesn't match or is expired");
    return "User Password Updated";
  } catch (error) {
    throw error;
  }
};

const createFolder = async (folderName: string, email: string) => {
  try {
    let userDir = path.join(__dirname, "..", "..", "dummyS3", email);

    let createNewDir = path.join(
      __dirname,
      "..",
      "..",
      "dummyS3",
      email,
      folderName
    );

    if (checkIfFolderNotExist(userDir)) {
      createFolderFunction(userDir);
    }

    if (checkIfFolderNotExist(createNewDir)) {
      const result = await userRepo.createFolder(email, folderName);

      createFolderFunction(createNewDir);
    } else {
      return "Folder Already Exists";
    }
    return "Folder Created Sucessfully";
  } catch (error) {
    throw error;
  }
};

const deleteFolder = async (folderName: string, email: string) => {
  try {
    let userDir = path.join(__dirname, "..", "..", "dummyS3", email);

    let deleteDir = path.join(
      __dirname,
      "..",
      "..",
      "dummyS3",
      email,
      folderName
    );

    if (!checkIfFolderNotExist(userDir)) {
      if (!checkIfFolderNotExist(deleteDir)) {
        await userRepo.deleteFolder(folderName, email);
        deleteFolderFunction(deleteDir);
      } else {
        throw "Folder does not exist";
      }
      return "Folder Deleted Sucessfully";
    }
  } catch (error) {
    console.log(error);

    throw error;
  }
};

const showFolders = async (email: string) => {
  let user = await userRepo.getbyEmail(email);
  let folders = [];
  for (let i in user.storage) {
    folders.push(user.storage[i].folderName);
  }
  return folders;
};

const showFiles = async (email: string, folderName: string) => {
  let user = await userRepo.getbyEmail(email);
  let files = [];
  for (let i in user.storage) {
    if (user.storage[i].folderName === folderName) {
      files.push(user.storage[i].files);
    }
  }
  return files;
};

const getStorageDetails = async (email: string) => {
  let result = await userRepo.getbyEmail(email);
  let totalSize = result.storage.reduce(
    (fileSize: number, currentFolder: any) => {
      fileSize += currentFolder.files.reduce(
        (sumFileSize: number, file: any) => {
          sumFileSize += file.fileSize;
          return sumFileSize;
        },
        0
      );
      return fileSize;
    },
    0
  );
  let totalFiles = result.storage.reduce(
    (fileCount: number, currentFolder: any) => {
      fileCount += currentFolder.files.length;
      return fileCount;
    },
    0
  );
  let maxStorageSize = result.config.maxStorageSize;
  let maxNumberOfFiles = result.config.maxNumberOfFiles;
  return { totalFiles, totalSize, maxNumberOfFiles, maxStorageSize };
};

const deleteFile = async (
  email: string,
  folderName: string,
  fileName: string
) => {
  const deleteFromDB = await userRepo.deleteFile(email, folderName, fileName);
  let deleteFile = path.join(
    __dirname,
    "..",
    "..",
    "dummyS3",
    email,
    folderName,
    fileName
  );
  deleteFileFunction(deleteFile);
  return deleteFromDB;
};

const addFile = async (fileData: any) => {
  const user = await userRepo.getOne(fileData.email);
  await userRepo.pushFile(fileData);
  return "File Pushed";
};

const editUser = (updated_data: IUser) => userRepo.update(updated_data);

const deleteUser = (email: string) => userRepo.deleteOne(email);

export default {
  createUser,
  authenticateUser,
  createChangePasswordRequest,
  changePassword,
  createFolder,
  deleteFolder,
  showFolders,
  showFiles,
  getStorageDetails,
  deleteFile,
  addFile,
  editUser,
  deleteUser,
};
