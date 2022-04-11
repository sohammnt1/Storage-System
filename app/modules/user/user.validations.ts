import { body } from "express-validator";
import validate from "../../utility/validate";

export const CreateUserValidator = [
  body("name").isString().withMessage("Enter a name"),
  body("email").isEmail().withMessage("Enter a valid email."),
  body("password").isString().withMessage("Enter a valid password"),
  validate,
];

export const LoginUserValidator = [
  body("email").isEmail().withMessage("Enter a valid email id."),
  body("password").isString().notEmpty().withMessage("Enter a vaid password."),
  validate,
];

export const ChangePasswordValidator = [
  body("email").isEmail().withMessage("Enter a valid email id."),
  validate,
];

export const ChangePasswordTokenValidator = [
  body("forgotPasswordToken").isString().withMessage("Enter a valid token."),
  body("newPassword").isString().withMessage("Enter a valid Password."),
  validate,
];

export const FolderNameValidator = [
  body("folderName").isString().withMessage("Enter a valid Folder Name."),
  validate,
];

export const FileNameValidator = [
  body("folderName").isString().withMessage("Enter a valid Folder Name."),
  body("fileName").isString().withMessage("Enter a valid file Name."),
  validate,
];

export const AddChangeRequestValidator = [
  body("requestedMaxNumberOfFiles")
    .isFloat({ min: 1 })
    .withMessage("Enter a valid number of Files."),
  body("requestedMaxSizeOfFiles")
    .isFloat({ min: 1 })
    .withMessage("Enter a valid maximum file size."),
  validate,
];
