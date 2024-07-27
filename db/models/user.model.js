import { model, Schema } from "mongoose";

const userSchema = new Schema({
  firstName: String,
  lastName: String,
  username: {
    type: String,
    default: function (params) {
      return this.firstName + this.lastName;
    },
  },
  email: {
    type: String,
    unique: true,
  },
  password: String,
  recoveryEmail: String,
  DOB: {
    type: Date,
    validate: {
      validator: function (v) {
        return /^\d{4}-\d{2}-\d{2}$/.test(v.toISOString().split("T")[0]);
      },
      message: (props) =>
        `${props.value} is not a valid date format! It must be YYYY-MM-DD.`,
    },
  },
  mobileNumber: {
    type: Number,
    unique: true,
  },

  role: {
    type: String,
    enum: ["User", "Company_HR"],
  },

  status: {
    type: String,
    enum: ["online", "offline"],
    default: "offline",
  },
  confirmed: {
    type: Boolean,
    default: false,
  },
});

const userModel = model("user", userSchema);

export default userModel;
