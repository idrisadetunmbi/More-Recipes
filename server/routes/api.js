import express from 'express';
import swaggerUI from 'swagger-ui-express';

import apiDocs from '../api-docs.json';
import v1Router from './v1';

const router = express.Router();
router.use('/api-docs', swaggerUI.serve, swaggerUI.setup(apiDocs));

router.use('/', v1Router);
router.use('/v1', v1Router);

export default router;
