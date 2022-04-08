import requestStatusModel from "./requestStatus.schema";

const getAll = () => requestStatusModel.find();

export default {
  getAll,
};
