import requestStatusRepo from "./requestStatus.repo";

const displayRequestStatus = () => requestStatusRepo.getAll();

export default {
  displayRequestStatus,
};
