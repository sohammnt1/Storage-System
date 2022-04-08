import { Schema, model, Types } from "mongoose";

class requestStatusSchema extends Schema {
  constructor() {
    super(
      {
        name: { type: String, required: true },
      },
      {
        timestamps: true,
      }
    );
  }
}

const requestStatusModel = model("requestStatus", new requestStatusSchema());

export default requestStatusModel;
