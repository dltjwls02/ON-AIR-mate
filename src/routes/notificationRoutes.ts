import express from 'express';
import {
  getRecentNotifications,
  getUnReadNotificationNum,
  setReadNotification,
} from '../controllers/notificationController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', requireAuth, getRecentNotifications);
router.get('/unread-count', requireAuth, getUnReadNotificationNum);
router.put('/read', requireAuth, setReadNotification);

export default router;
