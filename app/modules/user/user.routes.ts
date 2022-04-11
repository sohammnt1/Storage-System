import { Router, Request, Response, NextFunction } from "express";
import {
  AddChangeRequestValidator,
  ChangePasswordTokenValidator,
  ChangePasswordValidator,
  CreateUserValidator,
  FileNameValidator,
  FolderNameValidator,
  LoginUserValidator,
} from "./user.validations";
import userService from "./user.service";
import { ResponseHandler } from "../../utility/response";
import { permit } from "../../utility/authorize";
import { ROLES } from "../../utility/db_constants";
import { IFileData } from "./user.types";
import formidable from "formidable";
import path from "path";
import fs from "fs";

const router = Router();

router.post(
  "/register",
  CreateUserValidator,

  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.body;

      const result = await userService.createUser(user);

      res.send(new ResponseHandler(result));
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/login",
  LoginUserValidator,

  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let { email, password } = req.body;

      const result = await userService.authenticateUser(email, password);

      res.send(new ResponseHandler(result));
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/change-password",
  ChangePasswordValidator,

  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;

      const result = await userService.createChangePasswordRequest(email);

      res.send(new ResponseHandler(result));
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/reset-password",
  ChangePasswordTokenValidator,

  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const forgotPasswordToken = req.body.forgotPasswordToken as string;
      const newPassword = req.body.newPassword as string;

      const result = await userService.changePassword(
        forgotPasswordToken,
        newPassword
      );

      res.send(new ResponseHandler(result));
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/create-folder",
  FolderNameValidator,
  permit([ROLES.User, ROLES.Admin]),

  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { folderName } = req.body;
      const email = res.locals.user.email;

      const result = await userService.createFolder(folderName, email);

      res.send(new ResponseHandler(result));
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/delete-folder",
  FolderNameValidator,
  permit([ROLES.User, ROLES.Admin]),

  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const folderName = req.body.folderName as string;
      const email = res.locals.user.email;

      const result = await userService.deleteFolder(folderName, email);

      res.send(new ResponseHandler(result));
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/add-file",
  permit([ROLES.User, ROLES.Admin]),

  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const form: any = new formidable.IncomingForm();

      const email = res.locals.user.email;
      const fileData: IFileData = {
        fileSize: 0,
        fileName: "",
        fileUrl: "",
        folderName: "",
        email: "",
      };
      const userStorageDetails = await userService.getStorageDetails(email);
      form.parse(req, async (err: any, fields: any, files: any) => {
        const uploadFolder = path.join(
          __dirname,
          "..",
          "..",
          "dummyS3",
          email,
          fields.folderName.toString(),
          files.file.originalFilename
        );

        fileData.fileSize = files.file.size / 1000;
        fileData.fileName = files.file.originalFilename;
        fileData.email = email;
        let fileUrl = path
          .join(
            "app",
            "dummyS3",
            email,
            fields.folderName.toString(),
            files.file.originalFilename
          )
          .split("\\")
          .join("/");
        fileData.fileUrl = fileUrl;
        fileData.folderName = fields.folderName.toString();

        try {
          if (
            userStorageDetails.totalFiles + 1 <=
              userStorageDetails.maxNumberOfFiles &&
            userStorageDetails.maxStorageSize >= fileData.fileSize
          ) {
            const oldPath = files.file.filepath;

            var rawData = fs.readFileSync(oldPath);
            await userService.addFile(fileData);
            fs.writeFile(uploadFolder, rawData, function (err) {
              if (err) console.log(err);
              return res.send("Successfully uploaded");
            });
          } else {
            throw "Your Max storage limit is reached.";
          }
        } catch (error) {
          next(error);
        }
      });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/show-folders",
  permit([ROLES.User, ROLES.Admin]),

  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const email = res.locals.user.email;

      const result = await userService.showFolders(email);

      res.send(new ResponseHandler(result));
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/show-details",
  permit([ROLES.User, ROLES.Admin]),

  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const email = res.locals.user.email;

      const result = await userService.getStorageDetails(email);

      res.send(new ResponseHandler(result));
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/show-files",
  permit([ROLES.User, ROLES.Admin]),

  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const email = res.locals.user.email;
      const folderName = req.query.folderName as string;

      const result = await userService.showFiles(email, folderName);

      res.send(new ResponseHandler(result));
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/delete-file",
  FileNameValidator,
  permit([ROLES.User, ROLES.Admin]),

  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const email = res.locals.user.email;
      const folderName = req.body.folderName as string;
      const fileName = req.body.fileName as string;

      const result = await userService.deleteFile(email, folderName, fileName);

      res.send(new ResponseHandler(result));
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/create-request",
  AddChangeRequestValidator,
  permit([ROLES.User, ROLES.Admin]),

  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { requestedMaxNumberOfFiles, requestedMaxSizeOfFiles } = req.body;
      const email = res.locals.user.email;

      const result = await userService.createRequest(
        requestedMaxNumberOfFiles,
        requestedMaxSizeOfFiles,
        email
      );

      res.send(new ResponseHandler(result));
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/download",
  permit([ROLES.User, ROLES.Admin]),

  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const fileUrl = req.query.fileUrl as string;
      let newPath = path.join(__dirname, "..", "..", "..", fileUrl);

      res.setHeader("Content-Disposition", "Attachment");
      res.download(newPath);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
