import companyModel from "../../db/models/Company.model.js";
// HR Auth Middleware: Authenticates HR users by verifying their role and associated company using req.user
const HRauth = async (req, res, next) => {
  const user = req.user;

  if (user.role == "User") {
    return res.status(400).json("you are not allowed to this action");
  }
  const companyData = await companyModel.findOne({ companyHR: user._id });
  if (!companyData) {
    return res.status(400).json({ msg: "you doesn't have any companies" });
  }
  req.company = companyData;
  next();
};
export default HRauth;
