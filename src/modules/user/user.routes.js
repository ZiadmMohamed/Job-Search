import { Router } from "express";
import * as UC from "./user.controller.js";
import { emailExist } from "../../middleware/emailExist.js";
import auth from "../../middleware/auth.js";

const router = Router();

router.post("/logUp", emailExist, UC.signUp);
router.post("/logIn", UC.signIn);

router.get("/confirm/:token", UC.confirmeEmail);
router.get("/", auth, UC.acountData);
router.get("/forgetPassword", UC.forgetPassword);
router.get("/reser-password/:token", UC.resetPassword);
router.get("/associatedaccounts", UC.associatedaccounts);
router.get("/:id", auth, UC.profileData);

router.put("/", auth, UC.updateUser);
router.patch("/", auth, UC.updatePassword);
router.delete("/", auth, UC.delAcount);

export default router;
