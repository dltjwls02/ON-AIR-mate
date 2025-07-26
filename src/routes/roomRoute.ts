import express from 'express';

import {
  createRoom,
  joinRoom,
  getRoomMessages,
  getRoomParticipants,
  postRoomMessage,
  leaveRoom,
} from '../controllers/roomController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();
/**
 * @swagger
 * /api/rooms:
 *   post:
 *     summary: 방 생성
 *     description: 새로운 방을 생성합니다.
 *     tags:
 *       - Room
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - roomName
 *             properties:
 *               roomName:
 *                 type: string
 *                 example: 즐거운 방
 *               isPublic:
 *                 type: boolean
 *                 example: true
 *               maxParticipants:
 *                 type: integer
 *                 example: 6
 *               videoId:
 *                 type: string
 *                 example: 1
 *     responses:
 *       201:
 *         description: 방 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 roomId:
 *                   type: integer
 *                   example: 10
 *                 message:
 *                   type: string
 *                   example: 방이 생성되었습니다.
 *       400:
 *         description: 요청 데이터 오류 (roomName 누락 등)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: roomName이 없습니다.
 *       409:
 *         description: 권한 오류 (hostId 누락)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: unauthorized
 *       500:
 *         description: 서버 에러
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 방 생성에 오류가 발생했습니다
 */
router.post('/', requireAuth, createRoom);
// 소켓 통신으로
router.post('/:roomId/join', requireAuth, joinRoom);
router.post('/:roomId/leave', requireAuth, leaveRoom);

/**
 * @swagger
 * /api/rooms/{roomId}/participants:
 *   get:
 *     summary: 특정 채팅방 참여자 목록 조회
 *     tags:
 *       - Room
 *     security:
 *       - token: []
 *     parameters:
 *       - name: roomId
 *         in: path
 *         required: true
 *         description: 채팅방 ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 참여자 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 */
router.get('/:roomId/participants', requireAuth, getRoomParticipants);

/**
 * @swagger
 * /api/rooms/{roomId}/messages:
 *   post:
 *     summary: Room 채팅방 메시지 전송
 *     tags:
 *       - Room
 *     security:
 *       - accessToken: []
 *     parameters:
 *       - name: roomId
 *         in: path
 *         required: true
 *         description: 채팅방 ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - messageType
 *             properties:
 *               content:
 *                 type: string
 *                 description: 메시지 내용
 *               messageType:
 *                 type: string
 *                 enum: [text, image, file]
 *                 description: 메시지 타입
 *     responses:
 *       201:
 *         description: 메시지 전송 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Message'
 */
router.post('/:roomId/messages', requireAuth, postRoomMessage);

/**
 * @swagger
 * /api/rooms/{roomId}/messages:
 *   get:
 *     summary: 채팅방 메시지 목록 조회
 *     tags:
 *       - Room
 *     security:
 *       - accessToken: []
 *     parameters:
 *       - name: roomId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: 채팅방 ID
 *       - name: limit
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *         description: '조회할 메시지 수 (기본값: 50)'
 *       - name: before
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           format: date-time
 *         description: 특정 시점 이전 메시지 조회
 *     responses:
 *       200:
 *         description: 메시지 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Message'
 */
router.get('/:roomId/messages', requireAuth, getRoomMessages);

export default router;
