import { Router } from "express";
import * as JC from "./job.controller.js";
import auth from "../../middleware/auth.js";
import HRauth from "../../middleware/hrAuth.js";

const router = Router();

router.get("/", auth, JC.getJobs);
router.get("/jobFilter", auth, JC.jobFilter);
router.get("/:companyName", auth, JC.getCompmanysJobs);

router.post("/apply", auth, JC.apply);
router.post("/", auth, HRauth, JC.addjob);

router.patch("/:jobId", auth, HRauth, JC.updatejob);
router.delete("/:jobId", auth, HRauth, JC.deljob);

export default router;
