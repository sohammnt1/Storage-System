import { Router, Request, Response, NextFunction } from "express";
import userService from "./admin.service";
import { ResponseHandler } from "../../utility/response";
import { permit } from "../../utility/authorize";
import { ROLES } from "../../utility/db_constants";

const router = Router();

export default router;
