import Job from "../models/Job.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import checkPermissions from "../utils/checkpermissions.js";

const createJob = async (req, res) => {
    const {company, position} = req.body;

    if(!company || !position) {
      throw new BadRequestError('Please provide all values')
    }

    req.body.createdBy = req.user.userId;
    const job = await Job.create(req.body);
    res.status(StatusCodes.CREATED).json({job});
}

const getAllJobs = async (req, res) => {
  const jobs = await Job.find({createdBy: req.user.userId})

  res
  .status(StatusCodes.OK)
  .json({jobs, totalJobs: jobs.length, numOfPages: 1})
};

const updateJob = async (req, res) => {
  const {id: jobId} = req.params
  const {company, position} = req.body

  if(!company || !position){
    throw new BadRequestError('Please provide all values');
  }

  const job = await Job.findOne({_id: jobId})

  if(!job){
    throw new NotFoundError(`No job with id ${jobId}`)
  }

  //check permissions
  //console.log(typeof req.user.userId)
  //console.log(typeof job.createdBy)

  checkPermissions(req.user, job.createdBy)

  const updatedJob = await Job.findOneAndUpdate({_id: jobId}, req.body, {
    new: true,
    runValidators: true
  })

  res.status(StatusCodes.OK).json({
    updatedJob
  })

  // alternative approach

  // job.company = company
  // job.position = position

  // await job.save()
  // res.status(StatusCodes.OK).json({job})
  
}

const deleteJob = async (req, res) => {
  const {id: jobId} = req.params

  const job = await Job.findOne({_id: jobId})

  if(!job){
    throw new NotFoundError(`No job with id ${jobId}`)
  }

  checkPermissions(req.user, job.createdBy)

 await job.deleteOne();


  res.status(StatusCodes.OK).json({msg: 'Success! Job removed'})

};

const showStats = async (req, res) => {
  res.send("show stats");
};

export { createJob, getAllJobs, updateJob, deleteJob, showStats};