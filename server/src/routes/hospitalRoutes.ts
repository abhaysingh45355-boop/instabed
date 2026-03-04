import { Router } from 'express';
import { getAllHospitals, getHospitalById, searchHospitals } from '../controllers/hospitalController';

const router = Router();

router.get('/', getAllHospitals);
router.get('/search', searchHospitals);
router.get('/:id', getHospitalById);

export default router;
