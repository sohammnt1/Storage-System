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
