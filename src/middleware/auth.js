import jwt from "jsonwebtoken";
import userModel from "../../db/models/user.model.js";
// Auth Middleware: Authenticates user using token from req.headers and verifies user status and email confirmation
const auth = async (req, res, next) => {
  const { token } = req.headers;
  if (!token) {
    return res.status(400).json("token not exist");
  }
  const decoded = jwt.verify(token, "token");

  const user = await userModel.findOne({
    email: decoded.email,
    confirmed: true,
    status: "online",
  });
  
  if (!user) {
    return res.status(400).json("not autharized");
  }
  req.user = user;
  if (user.status == "online") {
    next();
  } else {
    return res.status(400).json("please logIn first");
  }
};
export default auth;
