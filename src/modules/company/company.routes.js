import { Router } from "express";
import * as CC from "./company.controller.js";
import auth from "../../middleware/auth.js";
import HRauth from "../../middleware/hrAuth.js";

const router = Router();

router.get("/search", auth, CC.searchCompany);
router.get("/getApp/:jobId", auth, HRauth, CC.getApp);
router.get("/:id", auth, HRauth, CC.companyData);

router.post("/", auth, CC.addcompany);

router.patch("/", auth, HRauth, CC.updateCompany);
router.delete("/", auth, HRauth, CC.delCompany);

export default router;
