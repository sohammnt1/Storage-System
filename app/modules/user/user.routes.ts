import { Router, Request, Response, NextFunction } from "express";
import { CreateUserValidator, LoginUserValidator } from "./user.validations";
import userService from "./user.service";
import { ResponseHandler } from "../../utility/response";
import { permit } from "../../utility/authorize";
import { ROLES } from "../../utility/db_constants";
import { IFileData } from "./user.types";
import formidable from "formidable";
import path from "path";
import fs from "fs";
import Downloader from "nodejs-file-downloader";

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
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const form: any = new formidable.IncomingForm();

      const email = res.locals.user.email;
      const fileData: any = {};
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

      // const result = await userService.addFile(fileData);
      //res.send(new ResponseHandler(result));
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/show-folders",
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

router.get(
  "/download",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const fileUrl = req.query.fileUrl as string;
      let newPath = path.join(__dirname, "..", "..", "..", fileUrl);
      newPath = "/app/dummyS3/sohammunot2@gmail.com/Pune/FEEDBACK L & D.txt";
      res.setHeader("Content-Disposition", "Attachment");
      res.download(newPath);
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  "/adminDashboard",
  CreateUserValidator,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updated_data = req.body;
      const result = await userService.editUser(updated_data);
      res.send(new ResponseHandler(result));
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/adminDashboard/:employeeId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const employeeId = req.params.employeeId;
      const result = await userService.deleteUser(employeeId);
      res.send(new ResponseHandler(result));
    } catch (error) {
      next(error);
    }
  }
);

export default router;
