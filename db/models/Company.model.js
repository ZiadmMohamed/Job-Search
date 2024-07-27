import { model, Schema } from "mongoose";

const companySchema = new Schema({
  companyName: {
    type: String,
    unique: true,
  },
  describtion: String,
  industry: String,
  address: String,
  numberOfEmployees: {
    type: Number,
    min: 11,
    max: 20,
  },
  companyEmail: {
    type: String,
    unique: true,
  },
  companyHR: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const companyModel = model("company", companySchema);

export default companyModel;
