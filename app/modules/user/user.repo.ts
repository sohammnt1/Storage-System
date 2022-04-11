import { IChanges } from "../admin/admin.types";
import userModel from "./user.schema";
import { IFileData, IUser } from "./user.types";

const create = (user: IUser) => userModel.create(user);

const getAll = () => userModel.find();

const getOne = (email: string) => userModel.findOne({ email: email });

const getByToken = (forgotPasswordToken: string) =>
  userModel.findOne({
    forgotPasswordToken: forgotPasswordToken,
    tokenExpiry: { $gt: Date.now() },
  });

const getbyRole = (role: string) =>
  userModel.find({
    role: role,
  });

const getbyEmail = (email: string) => userModel.findOne({ email: email });

const update = (updated_data: IUser) =>
  userModel.updateOne(
    {
      email: updated_data.email,
    },
    updated_data
  );

const pushFile = (fileData: IFileData) => {
  return userModel.updateOne(
    { email: fileData.email, "storage.folderName": fileData.folderName },
    {
      $push: {
        "storage.$.files": {
          fileName: fileData.fileName,
          fileSize: fileData.fileSize,
          fileUrl: fileData.fileUrl,
        },
      },
    }
  );
};

const deleteFile = (email: string, folderName: string, fileName: string) => {
  return userModel.updateOne(
    {
      email: email,
      "storage.folderName": folderName,
    },
    { $pull: { "storage.$.files": { fileName: fileName } } }
  );
};

const createFolder = (email: string, folderName: string) => {
  return userModel.findOneAndUpdate(
    { email: email },
    {
      $push: {
        storage: { folderName: folderName },
      },
    }
  );
};

const deleteFolder = (folderName: string, email: string) => {
  console.log(folderName, email);

  return userModel.updateOne(
    { email: email },
    {
      $pull: {
        storage: { folderName: folderName },
      },
    }
  );
};

const deleteOne = (email: string) =>
  userModel.updateOne({ email: email }, { deleted: "true" });

const changeConfig = (changes: IChanges) =>
  userModel.updateOne(
    { email: changes.email },
    {
      $set: {
        "config.maxNumberOfFiles": changes.requestedMaxNumberOfFiles,
        "config.maxStorageSize": changes.requestedMaxSizeOfFiles,
      },
    }
  );

const displayById = (email: string) => userModel.find({ email: email });

export default {
  create,
  getAll,
  getOne,
  getByToken,
  getbyRole,
  update,
  pushFile,
  deleteFile,
  createFolder,
  changeConfig,
  deleteFolder,
  getbyEmail,
  deleteOne,
  displayById,
};
