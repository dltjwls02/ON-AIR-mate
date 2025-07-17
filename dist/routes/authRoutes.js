import express from 'express';
import { login, register } from '../controllers/authController.js';
const router = express.Router();
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: 사용자 로그인
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               loginId:
 *                 type: string
 *                 example: user1
 *               password:
 *                 type: string
 *                 example: secret123
 *     responses:
 *       200:
 *         description: 로그인 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR...
 *                 error:
 *                   type: object
 *                   nullable: true
 *       401:
 *         description: 인증 실패
 */
router.post('/login', login);
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: 사용자 회원가입
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               loginId:
 *                 type: string
 *                 example: user1
 *               password:
 *                 type: string
 *                 example: secret123
 *               nickname:
 *                 type: string
 *                 example: coolUser
 *               profileImage:
 *                 type: string
 *                 example: https://example.com/image.png
 *     responses:
 *       201:
 *         description: 회원가입 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 1234abcd
 *                 error:
 *                   type: object
 *                   nullable: true
 *       400:
 *         description: 회원가입 실패 (중복 등)
 */
router.post('/register', register);
export default router;
