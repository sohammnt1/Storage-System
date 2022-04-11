import { IChanges } from "../admin/admin.types";
import requestModel from "./request.schema";
import { IRequest } from "./request.types";

const createRequest = (request: IRequest) => requestModel.create(request);

const showRequests = () => requestModel.find();

const showRequestsByStatus = (status: string) =>
  requestModel.find({ status: status });

const changeRequestStatus = (changes: IChanges) =>
  requestModel.updateOne(
    {
      userEmail: changes.email,
    },
    {
      $set: { status: changes.status },
    }
  );

export default {
  showRequests,
  createRequest,
  changeRequestStatus,
  showRequestsByStatus,
};
