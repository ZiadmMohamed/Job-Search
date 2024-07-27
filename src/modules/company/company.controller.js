import appModel from "../../../db/models/app.model.js";
import companyModel from "../../../db/models/Company.model.js";
import jobModel from "../../../db/models/Job.model.js";
import userModel from "../../../db/models/user.model.js";

// Add Company API: Adds a new company using req.body
export const addcompany = async (req, res) => {
  try {
    const {
      companyName,
      description,
      industry,
      address,
      numberOfEmployees,
      companyEmail,
      companyHR,
    } = req.body;
    const HR = await userModel.findOne({ _id: companyHR });
    if (!HR) {
      return res.status(400).json({ msg: "the companyHR is not exist" });
    }
    const company = await companyModel.create({
      companyName,
      description,
      industry,
      address,
      numberOfEmployees,
      companyEmail,
      companyHR,
    });
    return res.status(200).json({ msg: "done", company });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ msg: "error catched in addcompany", err });
  }
};
// Update Company API: Updates company details using req.body and req.company
export const updateCompany = async (req, res) => {
  try {
    const company = req.company;
    const {
      companyName,
      description,
      industry,
      address,
      numberOfEmployees,
      companyEmail,
      companyHR,
    } = req.body;
    const HR = await userModel.findOne({ _id: companyHR });
    if (!HR) {
      return res.status(400).json({ msg: "the companyHR is not exist" });
    }
    const updatedcompany = await companyModel.updateOne(
      { _id: company._id },
      {
        companyName,
        description,
        industry,
        address,
        numberOfEmployees,
        companyEmail,
      }
    );
    return res.status(200).json({ msg: "done", updatedcompany });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ msg: "error catched in addcompany", err });
  }
};
// Delete Company API: Deletes a company and associated jobs and applications using req.company and req.user
export const delCompany = async (req, res) => {
  try {
    const company = req.company;
    const user = req.user;
    const delcompany = await companyModel.deleteOne({ _id: company._id });

    const jobs = await jobModel.findOneAndDelete({ addedBy: user._id });
    const apps = await appModel.deleteOne({ jobId: jobs._id });

    return res.status(200).json({ msg: "done", delcompany });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ msg: "error catched in addcompany", err });
  }
};
// Get Company Data API: Retrieves company data by ID and related jobs using req.params.id
export const companyData = async (req, res) => {
  try {
    const id = req.params.id;
    if (id.length != 24) {
      return res.status(200).json({ msg: "please enter correct id" });
    }

    const company = await companyModel.findOne({ _id: id });
    if (!company) {
      return res
        .status(400)
        .json({ msg: "there is no companies with this id" });
    }
    const relatedJob = company.industry;
    let Jobs = await jobModel.find({ jobTitle: relatedJob });

    return res.status(200).json({
      msg: "done",
      company: company,
      relatedJobs: Jobs.length ? Jobs : "there's no related jobs",
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ msg: "error catched in addcompany", err });
  }
};
// Search Company API: Searches for a company by name using req.query.name
export const searchCompany = async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) {
      return res.status(400).json("please enter companyName");
    }
    const company = await companyModel.findOne({ companyName: name });

    if (!company) {
      return res
        .status(400)
        .json({ msg: "there is no companies with this name" });
    }

    return res.status(200).json({ msg: "done", company });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ msg: "error catched in addcompany", err });
  }
};
// Get Applications API: Retrieves applications for a specific job using req.params.jobId and req.user
export const getApp = async (req, res) => {
  try {
    const owner = req.user;
    const { jobId } = req.params;

    if (jobId.length !== 24) {
      return res.status(400).json({ msg: "please enter valid jobId" });
    }

    const apps = await appModel.find({ jobId }, "-userId");
    const job = await jobModel.findOne({ _id: jobId });

    if (!apps.length || !job) {
      return res.status(400).json({ msg: "apps or jobs undefined" });
    }
    // return res.json({ addedBy: job.addedBy, owner: owner._id });
    if (job.addedBy.toString() !== owner._id.toString()) {
      return res.status(400).json({ msg: "You are not the owner" });
    }

    return res.status(200).json({ msg: "done", apps });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ msg: "error catched in addcompany", err });
  }
};
