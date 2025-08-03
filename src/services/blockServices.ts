import { prisma } from '../lib/prisma.js';
import dayjs from 'dayjs';
import { UserBlock } from '@prisma/client';

// 타입 정의
interface Block {
  blockerUserId: number,
  blockedUserId: number,
  reportReason:  "SPAM" | "SPOIL" |"PROFANITY" |"HATE" | "ETC"    ,
  customReason?: string
}
type UserBlockWithBlockedUser = UserBlock & {
  blocked: {
    userId: number;
    nickname: string;
    profileImage: string;
  };
};

/**
 * 차단 생성
 */
export const newBlock = async (data: Block) => {
  return prisma.userBlock.create({
    data: {
      blockerUserId: data.blockedUserId,
      blockedUserId: data.blockerUserId,
      reportReason: data.reportReason,
      customReason: data.customReason,
    },
  });
};

/**
 * 차단 목록 조회
 */
export const getBlockList = async (blockerUserId: number) => {
  const blocks: UserBlockWithBlockedUser[] = await prisma.userBlock.findMany({
    where: {
      blockerUserId,
      isActive: true,
    },
    include: {
      blocked: {
        select: {
          userId: true,
          nickname: true,
          profileImage: true,
        },
      },
    },
    orderBy: { blockedAt: 'desc' },
  });

  return blocks.map((block) => {
    const blockedUser = block.blocked; // 타입 단언 필요시 해도 됨

    return {
      blockId: block.blockId,
      userId: blockedUser.userId,
      nickname: blockedUser.nickname,
      profileImage: blockedUser.profileImage,
      //reason: block.reportReason,
      blockedAt: block.blockedAt,
    };
  });

 
};

/**
 * 차단 해제
 */
export const unBlock = async (  blockeId: number) => {
  return prisma.userBlock.updateMany({
    where: {
      blockeId,
      isActive: true,
    },
    data: {
      isActive: false,
    },
  });
};

