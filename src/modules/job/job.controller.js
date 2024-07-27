import appModel from "../../../db/models/app.model.js";
import companyModel from "../../../db/models/Company.model.js";
import jobModel from "../../../db/models/Job.model.js";
import userModel from "../../../db/models/user.model.js";

// Add Job API: Adds a new job using req.body
export const addjob = async (req, res) => {
  try {
    const {
      jobTitle,
      jobLocation,
      workingTime,
      seniorityLevel,
      jobDescription,
      technicalSkills,
      softSkills,
      addedBy,
    } = req.body;
    const user = await userModel.findOne({ _id: addedBy });
    if (!user) {
      return res.status(400).json({ msg: "invalid HR id" });
    }
    const job = await jobModel.create({
      jobTitle,
      jobLocation,
      workingTime,
      seniorityLevel,
      jobDescription,
      technicalSkills,
      softSkills,
      addedBy,
    });
    return res.status(200).json({ msg: "dones", job });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ msg: "error catched in addjob", err });
  }
};
// Update Job API: Updates job details using req.body and req.params.jobId
export const updatejob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const {
      jobTitle,
      jobLocation,
      workingTime,
      seniorityLevel,
      jobDescription,
      technicalSkills,
      softSkills,
      addedBy,
    } = req.body;

    if (jobId.length !== 24) {
      return res.status(400).json(" invalid id");
    }

    const user = await userModel.findOne({ _id: addedBy });
    if (!user) {
      return res.status(400).json({ msg: "invalid HR id" });
    }

    const updatedjob = await jobModel.updateOne(
      { _id: jobId },
      {
        jobTitle,
        jobLocation,
        workingTime,
        seniorityLevel,
        jobDescription,
        technicalSkills,
        softSkills,
      }
    );
    return res.status(200).json({ msg: "done", updatedjob });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ msg: "error catched in addjob", err });
  }
};
// Delete Job API: Deletes a job and associated applications using req.params.jobId and req.user
export const deljob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const user = req.user;

    const job = await jobModel.findOneAndDelete({
      _id: jobId,
      addedBy: user._id,
    });

    const apps = await appModel.deleteMany({ jobId: job._id });

    return res.status(200).json({ msg: "done", job });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ msg: "error catched in delete job", err });
  }
};
// Get Jobs API: Retrieves all jobs with company information
export const getJobs = async (req, res) => {
  try {
    const jobs = await jobModel.find().populate("addedBy", "username");

    if (!jobs.length) {
      return res.status(400).json({ msg: "there is no jobs" });
    }

    const jobsWithCompanyInfo = await Promise.all(
      jobs.map(async (job) => {
        const company = await companyModel.findOne({ companyHR: job.addedBy });
        return {
          job,
          company: company,
        };
      })
    );

    return res.status(200).json({ msg: "done", jobsWithCompanyInfo });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ msg: "error catched in getJobs", err });
  }
};
// Get Company's Jobs API: Retrieves jobs for a specific company using req.params.companyName
export const getCompmanysJobs = async (req, res) => {
  try {
    const { companyName } = req.params;

    const company = await companyModel.findOne({ companyName });

    if (!company) {
      return res
        .status(400)
        .json({ msg: "There are no companies with this name" });
    }

    const jobs = await jobModel.find({ addedBy: company.companyHR });

    if (jobs.length === 0) {
      return res.status(200).json({
        msg: "No jobs found for this company",
        jobsWithCompanyInfo: [],
      });
    }

    const jobsWithCompanyInfo = jobs.map((job) => ({
      company,
      jobs: job,
    }));

    return res.status(200).json({ msg: "done", jobsWithCompanyInfo });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ msg: "error catched in getJobs", err });
  }
};

// Job Filter API: Filters jobs based on criteria using req.body
export const jobFilter = async (req, res) => {
  try {
    const {
      workingTime,
      jobLocation,
      seniorityLevel,
      jobTitle,
      technicalSkills,
    } = req.body;
    if (
      !workingTime &&
      !jobLocation &&
      !seniorityLevel &&
      !jobTitle &&
      !technicalSkills
    ) {
      return res.status(400).json("no data entered");
    }

    let jobQuery = {};

    if (workingTime) jobQuery.workingTime = workingTime;
    if (jobLocation) jobQuery.jobLocation = jobLocation;
    if (seniorityLevel) jobQuery.seniorityLevel = seniorityLevel;
    if (jobTitle) jobQuery.jobTitle = jobTitle;
    if (technicalSkills) jobQuery.technicalSkills = technicalSkills;

    const jobs = await jobModel.find(jobQuery);

    if (jobs.length === 0) {
      return res
        .status(400)
        .json({ msg: "there is no jobs with these requirments" });
    }

    return res.status(200).json({ msg: "done", jobs });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ msg: "error catched in addjob", err });
  }
};
// Apply for Job API: Applies for a job using req.body and req.user
export const apply = async (req, res) => {
  try {
    const { jobId, userTechSkills, userSoftSkills } = req.body;
    const user = req.user;

    if (user.role !== "User") {
      return res
        .status(400)
        .json({ msg: "sorry only the users appled to do this action" });
    }

    if (!jobId || !userTechSkills || !userSoftSkills) {
      return res.status(400).json({ msg: "please full-fill all requirments" });
    }
    const checkJobId = jobModel.findById({ _id: jobId });
    if (!checkJobId) {
      return res.status(400).json({ msg: "invalid jobId" });
    }
    const app = await appModel.create({
      jobId,
      userId: user._id,
      userTechSkills,
      userSoftSkills,
    });

    return res.status(200).json({ msg: "done", app });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ msg: "error catched in addjob", err });
  }
};
