import { Schema, model, Types } from "mongoose";

class requestSchema extends Schema {
  constructor() {
    super(
      {
        userEmail: { type: String, required: true, unique: true },
        requestedMaxNumberOfFiles: { type: Number, required: true },
        requestedMaxSizeOfFiles: { type: Number, required: true },
        existingMaxNumberOfFiles: { type: Number, required: true },
        existingMaxSizeOfFiles: { type: Number, required: true },
        status: {
          type: String,
          required: true,
          default: "Pending",
          enum: ["Pending", "Accepted", "Rejected"],
        },
      },
      {
        timestamps: true,
      }
    );
  }
}

const requestModel = model("request", new requestSchema());

export default requestModel;
