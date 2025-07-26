const rooms: Record<string, Set<string>> = {};

export const joinRoom = (roomId: string, socketId: string) => {
  if (!rooms[roomId]) rooms[roomId] = new Set();
  rooms[roomId].add(socketId);
};

export const leaveRoom = (roomId: string, socketId: string) => {
  rooms[roomId]?.delete(socketId);
  if (rooms[roomId]?.size === 0) delete rooms[roomId];
};

export const getRoomSize = (roomId: string): number => {
  return rooms[roomId]?.size || 0;
};
