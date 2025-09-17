import express from 'express';
import { createJob, getAllJobs, updateJob, deleteJob, showStats } from '../controllers/jobsController.js';

const router = express.Router();

router.post('/', createJob);
router.get('/', getAllJobs);
router.get("/stats", showStats);
router.patch('/:id', updateJob);
router.delete('/:id', deleteJob);

export default router;