import { Request, Response, NextFunction } from 'express';
import { sendSuccess } from '../utils/response.js';
import AppError from '../middleware/errors/AppError.js';
import {
    newBlock,
    getBlockList,
    unBlock
} from '../services/blockServices.js';

export const makeBlock = async (req: Request, res: Response, next: NextFunction) => {
   try {
     const userId = req.user?.userId; 
     const { targetUserId, reasons, additionalReason } = req.body;

    if (!userId) {
       throw new AppError('AUTH_007');
    }

    if (!targetUserId || !Array.isArray(reasons) || reasons.length === 0) {
      throw new AppError('GENERAL_001', '잘못된 요청입니다.');
    }

    // reasons 배열 중 첫 번째 이유만 저장 (단일 enum 필드라서)
    const reportReason = reasons[0];

    await newBlock({
      blockerUserId:userId,
      blockedUserId: targetUserId,
      reportReason,
      customReason: additionalReason,
    });
 
    sendSuccess(res, {message: "사용자가 차단되었습니다."});
   } catch (error) {
     console.error('사용자 차단 오류:', error);
     next(error);
   }
};

export const getBlocks = async (req: Request, res: Response, next: NextFunction) => {
   try {
     const userId = req.user?.userId; // JWT에서 유저 ID 추출
     if (!userId) {
       throw new AppError('AUTH_007');
     }
 
     const result = await getBlockList(userId);
     sendSuccess(res, {data: result});
   } catch (error) {
     console.error('차단한 사용자 목록 조회 오류:', error);
     next(error);
   }
};

export const deleteBlock = async (req: Request, res: Response, next: NextFunction) => {
   try {
     const userId = req.user?.userId; // JWT에서 유저 ID 추출
     if (!userId) {
       throw new AppError('AUTH_007');
     }
     const blockIdStr = req.params.blockId;
    if (!blockIdStr) {
      throw new AppError('GENERAL_001', 'blockId가 필요합니다.');
    }
    const blockId = Number(blockIdStr);
 
     await unBlock(blockId);
    sendSuccess(res, {message: "차단이 해제되었습니다."});
   } catch (error) {
     console.error('차단 해제 오류:', error);
     next(error);
   }
};