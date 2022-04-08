import { Schema, model, Types } from "mongoose";

class userSchema extends Schema {
  constructor() {
    super(
      {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: {
          type: Types.ObjectId,
          required: true,
          ref: "role",
          default: "624d5658556832b92eeb5ee4",
        },
        forgotPasswordToken: { type: String, required: false },
        tokenExpiry: { type: Number, required: false },
        storage: [
          {
            folderName: { type: String, required: false },
            files: [
              {
                fileName: { type: String, required: false },
                fileSize: { type: Number, required: false },
                fileUrl: { type: String, required: false },
              },
            ],
          },
        ],
        config: {
          maxNumberOfFiles: { type: Number, required: false, default: 5 },
          maxStorageSize: { type: Number, required: false, default: 2000 },
        },
        deleted: { type: Boolean, required: true, default: false },
      },
      {
        timestamps: true,
      }
    );
  }
}

const userModel = model("user", new userSchema());

export default userModel;
