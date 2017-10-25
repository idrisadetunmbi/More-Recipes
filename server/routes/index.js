import express from 'express';

const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.status(200).send({
    message: 'index - MoreRecipes',
  });
});

export default router;
