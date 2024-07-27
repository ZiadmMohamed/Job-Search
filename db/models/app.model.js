import { model, Schema } from "mongoose";

const appSchema = new Schema({
  jobId: {
    type: Schema.Types.ObjectId,
    ref: "job",
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  userTechSkills: [String],
  userSoftSkills: [String],
});

const appModel = model("app", appSchema);


export default appModel;
