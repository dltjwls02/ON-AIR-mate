import { prisma } from '../lib/prisma.js';
import dayjs from 'dayjs';
import { NotificationStatus } from '@prisma/client';

// 타입 정의
interface Notification {
  id: number;
  fromUserId: number | null;
  toUserId: number;
  title: string | null;
  type: 'roomInvite' | 'collectionShare' | 'friendRequest' | 'popularityUp';
  status: 'unread' | 'read';
}

/**
 * 알림 생성
 */
export const createNotification = async (data: Notification) => {
  return await prisma.notification.create({
    data: {
      fromUserId: data.fromUserId ?? null,
      toUserId: data.toUserId,
      type: data.type,
      title: data.title ?? null,
      status: 'unread',
    },
  });
};

/**
 * 알림 조회
 */
export const getNotification = async (userId: number) => {
  return await prisma.notification.findMany({
    where: { toUserId: userId },
    orderBy: { createdAt: 'desc' },
  });
};

/**
 * 7일 이내 알림 목록 조회
 */
export const getRecentNotis = async (userId: number) => {
  const now = dayjs();
  const todayStart = now.startOf('day').toDate();
  const yesterdayStart = now.subtract(1, 'day').startOf('day').toDate();
  const sevenDaysAgo = now.subtract(7, 'day').startOf('day').toDate();

  // 7일 이내 알림 모두 가져오기
  const notifications = await prisma.notification.findMany({
    where: {
      toUserId: userId,
      createdAt: {
        gte: sevenDaysAgo,
      },
    },
    orderBy: { createdAt: 'desc' },
    include: {
      fromUser: {
        select: { userId: true, nickname: true },
      },
    },
  });

  // 분류
  const today: any[] = [];
  const yesterday: any[] = [];
  const recent7Days: any[] = [];

  for (const noti of notifications) {
    const createdAt = new Date(noti.createdAt);
    const base = {
      notificationId: noti.notificationId,
      type: noti.type,
      message: noti.title,
      isRead: noti.status === 'read',
      createdAt: noti.createdAt,
    };

    const fromUserData = noti.fromUser
      ? {
          fromUserId: noti.fromUser.userId,
          fromUserNickname: noti.fromUser.nickname,
        }
      : {};

    const fullData = {
      ...base,
      ...fromUserData,
    };

    if (dayjs(createdAt).isAfter(todayStart)) {
      today.push(fullData);
    } else if (dayjs(createdAt).isAfter(yesterdayStart)) {
      yesterday.push(fullData);
    } else {
      recent7Days.push(fullData);
    }
  }

  return { today, yesterday, recent7Days };
};

/**
 * 유저의 모든 알림 읽음 처리
 */
export const markNotificationAsRead = async (userId: number) => {
  return await prisma.notification.updateMany({
    where: {
      toUserId: userId,
      status: NotificationStatus.unread, // enum 처리
    },
    data: {
      status: NotificationStatus.read,
    },
  });
};

/**
 * 읽지 않은 알림 수
 */
export const countUnreadNotifications = async (userId: number) => {
  const now = dayjs();
  const sevenDaysAgo = now.subtract(7, 'day').startOf('day').toDate();

  return prisma.notification.count({
    where: {
      toUserId: userId,
      createdAt: {
        gte: sevenDaysAgo,
      },
      status: 'unread',
    },
  });
};
