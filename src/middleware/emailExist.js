import userModel from "../../db/models/user.model.js";

export const emailExist = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await userModel.findOne({ email });
    if (user) {
      return res.status(400).json("email is already exist");
    }

    next();
  } catch (error) {
    console.error("Error in emailExist middleware:", error);
    return res.status(201).json({ msg: "catch error", error });
  }
};
