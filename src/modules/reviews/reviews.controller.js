import { Router } from 'express';
import { reviewModel } from '../../database/model/reviews.model.js';
const router = Router();



// i want just to make the database model lesa hakaml 3aleh 

router.get('/get-all-reviews', async (req, res) => {
    let data = await reviewModel.find();
    res.json(data)
})

export default router