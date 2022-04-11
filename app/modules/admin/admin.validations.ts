import { body, query } from "express-validator";
import validate from "../../utility/validate";

export const ChangeRequestValidator = [
  query("status").isString().withMessage("Enter a status"),
  query("email").isEmail().withMessage("Enter a valid email."),
  query("requestedMaxSizeOfFiles")
    .isNumeric()
    .withMessage("Enter a valid Max Size"),
  query("requestedMaxNumberOfFiles")
    .isNumeric()
    .withMessage("Enter a valid Number of files"),
  validate,
];
