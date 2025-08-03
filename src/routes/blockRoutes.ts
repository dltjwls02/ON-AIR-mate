import express from 'express';
import {
makeBlock,
getBlocks,
deleteBlock
} from '../controllers/blockController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', requireAuth, makeBlock);
router.get('/', requireAuth, getBlocks);
router.delete('/:blockId', requireAuth, deleteBlock);

export default router;