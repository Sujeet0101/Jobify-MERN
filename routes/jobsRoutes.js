import express from 'express';
import { createJob, getAllJobs, updateJob, deleteJob, showStats } from '../controllers/jobsController.js';
import testUser from "../middleware/testUser.js";

const router = express.Router();

router.post('/', testUser, createJob);
router.get('/', getAllJobs);
router.get("/stats", showStats);
router.patch('/:id', testUser, updateJob);
router.delete('/:id', testUser, deleteJob);

export default router;