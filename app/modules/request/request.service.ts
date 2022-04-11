import { IChanges } from "../admin/admin.types";
import userService from "../user/user.service";
import requestRepo from "./request.repo";

const createRequest = async (
  requestedMaxNumberOfFiles: number,
  requestedMaxSizeOfFiles: number,
  email: string
) => {
  const userStorageDetails = await userService.getStorageDetails(email);

  const request = {
    requestedMaxNumberOfFiles: requestedMaxNumberOfFiles,
    requestedMaxSizeOfFiles: requestedMaxSizeOfFiles,
    userEmail: email,
    existingMaxNumberOfFiles: userStorageDetails.maxNumberOfFiles,
    existingMaxSizeOfFiles: userStorageDetails.maxStorageSize,
  };

  return requestRepo.createRequest(request);
};

const changeRequestStatus = (changes: IChanges) =>
  requestRepo.changeRequestStatus(changes);

const showRequests = () => requestRepo.showRequests();

const showRequestsByStatus = (status: string) =>
  requestRepo.showRequestsByStatus(status);

export default {
  createRequest,
  showRequests,
  showRequestsByStatus,
  changeRequestStatus,
};
