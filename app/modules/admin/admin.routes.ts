import { Router, Request, Response, NextFunction } from "express";
import userService from "./admin.service";
import { ResponseHandler } from "../../utility/response";
import { permit } from "../../utility/authorize";
import { ROLES } from "../../utility/db_constants";
import { IChanges, IFilter } from "./admin.types";
import { ChangeRequestValidator } from "./admin.validations";

const router = Router();

router.get(
  "/show-requests",
  permit([ROLES.Admin]),

  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const status = req.query.status as string;
      const result = await userService.showRequests(status);
      res.send(new ResponseHandler(result));
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  "/change-request-status",
  permit([ROLES.Admin]),
  ChangeRequestValidator,

  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const changes = req.query as unknown as IChanges;
      const result = await userService.changeRequestStatus(changes);
      res.send(new ResponseHandler(result));
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/user-details",
  permit([ROLES.Admin]),

  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filter = req.query as unknown as IFilter;
      const result = await userService.showUserDetails(filter);
      res.send(new ResponseHandler(result));
    } catch (error) {
      next(error);
    }
  }
);

export default router;
