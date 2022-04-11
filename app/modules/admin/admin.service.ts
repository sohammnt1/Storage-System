import { ROLES } from "../../utility/db_constants";
import requestService from "../request/request.service";
import userService from "../user/user.service";
import { IFolder } from "../user/user.types";
import { IChanges, IFilter } from "./admin.types";

const showRequests = async (status: string) => {
  let result;

  if (!status) {
    result = requestService.showRequests();
  } else {
    result = requestService.showRequestsByStatus(status);
  }

  return result;
};

const changeRequestStatus = async (changes: IChanges) => {
  await requestService.changeRequestStatus(changes);

  if (changes.status === "Accepted") {
    await userService.changeConfig(changes);
  }

  return "Request Updated";
};

const showUserDetails = async (filter: IFilter) => {
  let showAllUsers = await userService.showAllUsers();

  showAllUsers = showAllUsers.filter((user) => user.role == ROLES.User);

  let userDetails = [];

  for (let i in showAllUsers) {
    let totalFiles = showAllUsers[i].storage.reduce(
      (fileCount: number, currentFolder: IFolder) => {
        fileCount += currentFolder.files.length;
        return fileCount;
      },
      0
    );

    userDetails.push({
      name: showAllUsers[i].name,
      email: showAllUsers[i].email,
      totalFiles: totalFiles,
    });
  }
  if (filter.totalFiles) {
    const filteredUserDetails = userDetails.filter(
      (user) => user.totalFiles >= filter.totalFiles
    );

    return filteredUserDetails;
  }
  return userDetails;
};

export default { showRequests, changeRequestStatus, showUserDetails };
