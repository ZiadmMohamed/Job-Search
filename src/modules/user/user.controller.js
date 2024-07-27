import userModel from "../../../db/models/user.model.js";
import sendEmail from "../../services/senEmail.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { ObjectId } from "mongodb";
import companyModel from "../../../db/models/Company.model.js";
import jobModel from "../../../db/models/Job.model.js";
import appModel from "../../../db/models/app.model.js";
let OTP;

// Sign Up API: Creates a new user and sends a verification email
export const signUp = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      recoveryEmail,
      mobileNumber,
      role,
      status,
      email,
      password,
      DOB,
    } = req.body;

    const token = jwt.sign({ email }, "email");
    const hashed = bcrypt.hashSync(password, 8);

    const Link = `http://localhost:3000/user/confirm/${token}`;
    await sendEmail(
      email,
      "Hello",
      `<a href='${Link}'>Verify your account</a>`
    );

    const user = await userModel.create({
      firstName,
      lastName,
      recoveryEmail,
      mobileNumber,
      role,
      status,
      email,
      password: hashed,
      DOB,
    });

    return res.status(201).json({ msg: "verify your account ", user });
  } catch (error) {
    console.error("Error in signUp :", error);
    return res.status(400).json({ msg: "catch error in signUp", error });
  }
};
// Confirm Email API: Confirms user's email based on token
export const confirmeEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, "email");

    if (!decoded.email) {
      return res.status(400).json({ msg: "Invalid token" });
    }

    const user = await userModel.updateOne(
      { email: decoded.email, confirmed: false },
      { confirmed: true }
    );

    return res.status(200).json({ msg: "Confirmation successful", user });
  } catch (error) {
    return res
      .status(400)
      .json({ msg: "An error occurred", error: error.message });
  }
};
// Sign In API: Authenticates user and sets status to online
export const signIn = async (req, res) => {
  try {
    const { email, recoveryEmail, mobileNumber, password } = req.body;

    let userQuery = {};

    if (email) userQuery.email = email;
    if (recoveryEmail) userQuery.recoveryEmail = recoveryEmail;
    if (mobileNumber) userQuery.mobileNumber = mobileNumber;
    userQuery.confirmed = true;

    const user = await userModel.findOne(userQuery);

    if (!user) {
      return res.status(400).json("Email doesn't exist");
    }

    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(400).json("Password isn't correct");
    }

    await userModel.updateOne({ _id: user._id }, { status: "online" });

    const token = jwt.sign({ name: user.name, email: user.email }, "token");

    return res.status(200).json({ msg: "done", user, token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Internal server error", err });
  }
};
// Update User API: Updates user details
export const updateUser = async (req, res) => {
  try {
    const user = req.user;
    const { firstName, lastName, email, mobileNumber, role } = req.body;
    const data = await userModel.updateOne(
      { email: user.email },
      { firstName, lastName, email, mobileNumber, role }
    );
    return res.status(200).json({ msg: "done", data });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ msg: "catch error in update", err });
  }
};
// Delete Account API: Deletes user account and associated data
export const delAcount = async (req, res) => {
  try {
    const user = req.user;
    const data = await userModel.deleteOne({ email: user.email });

    const company = await companyModel.deleteOne({ companyHR: user._id });
    const jobs = await jobModel.findOneAndDelete({ addedBy: user._id });
    const apps = await appModel.deleteOne({ jobId: jobs._id });

    return res.status(200).json({ msg: "done", data });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ msg: "catch error in delete", err });
  }
};
// Get Account Data API: Retrieves account data of logged-in user
export const acountData = async (req, res) => {
  try {
    const user = req.user;

    return res.status(200).json({ msg: "done", user });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ msg: "catch error in delete", err });
  }
};
// Get Profile Data API: Retrieves profile data by ID
export const profileData = async (req, res) => {
  try {
    const id = req.params;
    const newId = new ObjectId(id);
    const user = await userModel.findById(
      { _id: newId },
      "-password -recoveryEmail"
    );
    if (user == null) {
      return res.status(400).json("no profiles with this id");
    }
    return res.status(200).json({ msg: "done", user });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ msg: "catch error in delete", err });
  }
};
// Update Password API: Updates user's password
export const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = req.user;
    if (!oldPassword || !newPassword) {
      return res.status(400).json("enter your passwords 😒");
    }

    if (!bcrypt.compareSync(oldPassword, user.password)) {
      return res.status(400).json("your old passwoed is't correct");
    }

    const hashed = await bcrypt.hash(newPassword, 8);

    const updatedData = await userModel.updateOne(
      { email: user.email },
      { password: hashed }
    );
    return res
      .status(200)
      .json({ msg: "password updated successfuly", updatedData });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ msg: "catch error in update password" });
  }
};
// Forget Password API: Sends OTP for password reset
export const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json("enter your email 😒");
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json("email is't exist");
    }
    OTP = crypto.randomInt(100000, 999999).toString();
    sendEmail(email, "Password Reset OTP", `Your OTP is ${OTP}`);
    const token = jwt.sign({ email }, "email");

    return res.status(200).json({
      resetLinke: `http://localhost:3000/user/reser-password/${token}`,
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ msg: "catch error in forget password" });
  }
};
// Reset Password API: Resets user's password using OTP and newPassword
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;

    const { newPassword, userOTP } = req.body;
    if (!userOTP || !(userOTP == OTP)) {
      return res.status(400).json({ msg: "please enter valid otb" });
    }
    if (!newPassword) {
      return res.status(400).json({ msg: "please enter the new password" });
    }
    if (!token) {
      return res.status(400).json({ msg: "token not exist" });
    }

    const decoded = jwt.verify(token, "email");
    const hashed = bcrypt.hashSync(newPassword, 8);
    const user = await userModel.updateOne(
      { email: decoded.email },
      { password: hashed }
    );

    if (user.nModified === 0) {
      return res
        .status(400)
        .json({ msg: "User not found or password is the same" });
    }
    return res.status(200).json({ msg: "password updated successfuly", user });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ msg: "catch error in update password" });
  }
};
// Associated Accounts API: Retrieves accounts associated with recovery email
export const associatedaccounts = async (req, res) => {
  try {
    const { recoveryEmail } = req.body;
    if (!recoveryEmail) {
      return res.status(400).json({ msg: "please enter the recoveryEmail" });
    }
    const accounts = await userModel.find({ recoveryEmail });
    if (!accounts.length) {
      return res.status(400).json("there is no associated accounts ");
    }
    return res.status(200).json(accounts);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ msg: "catch error in update password" });
  }
};
