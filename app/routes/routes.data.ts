import { Route } from "./routes.types";
import UserRouter from "../modules/user/user.routes";
import RoleRouter from "../modules/role/role.routes";

export const routes = [
  new Route("/user", UserRouter),
  new Route("/role", RoleRouter),
];

export const excludedPaths = [
  { method: "POST", route: "/user/login" },
  { method: "POST", route: "/user/register" },
  { method: "POST", route: "/user/change-password" },
  { method: "POST", route: "/user/reset-password" },
];
