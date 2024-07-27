import { model, Schema } from "mongoose";
import { type } from "os";

const jobSchema = new Schema({
  jobTitle: String,
  jobLocation: {
    type: String,
    enum: ["onsite", "remotely", "hybrid"],
  },
  workingTime: {
    type: String,
    enum: ["part-time", "full-time"],
  },
  seniorityLevel: {
    type: String,
    enum: ["Junior", " Mid-Level", "Senior", "Team-Lead", "CTO"],
  },
  jobDescription: String,
  technicalSkills: [String],
  softSkills: [String],
  addedBy: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
});

const jobModel = model("job", jobSchema);

export default jobModel;
