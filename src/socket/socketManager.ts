import redis from './redis';

export const ROOM_PARTICIPANTS_KEY = (roomId: number) => `room:${roomId}:participants`;

export const ROOM_PARTICIPANTS_COUNT_KEY = (roomId: number) => `room:${roomId}:participantsCount`;

export const USER_SOCKET_KEY = (userId: number) => `user:${userId}:socketId`;

export const SOCKET_USER_KEY = (socketId: string) => `socket:${socketId}:userId`;

export const USER_ROOMS_KEY = (userId: number) => `user:${userId}:rooms`;

export const joinRoom = async (roomId: number, userId: number, socketId: string) => {
  await redis.sadd(ROOM_PARTICIPANTS_KEY(roomId), socketId);
  await redis.incr(ROOM_PARTICIPANTS_COUNT_KEY(roomId));
  await redis.set(USER_SOCKET_KEY(userId), socketId);
  await redis.set(SOCKET_USER_KEY(socketId), userId.toString());
  await redis.sadd(USER_ROOMS_KEY(userId), roomId.toString());
};

export const leaveRoom = async (roomId: number, userId: number, socketId: string) => {
  await redis.srem(ROOM_PARTICIPANTS_KEY(roomId), socketId);
  await redis.decr(ROOM_PARTICIPANTS_COUNT_KEY(roomId));
  await redis.srem(USER_ROOMS_KEY(userId), roomId.toString());
  await redis.del(USER_SOCKET_KEY(userId));
  await redis.del(SOCKET_USER_KEY(socketId));
};

export const getRoomSize = async (roomId: number): Promise<number> => {
  const count = await redis.get(ROOM_PARTICIPANTS_COUNT_KEY(roomId));
  return count ? parseInt(count, 10) : 0;
};

export const getUserIdFromSocket = async (socket: string): Promise<number> => {
  const userId = await redis.get(SOCKET_USER_KEY(socket));
  return userId ? parseInt(userId, 10) : 0;
};
