// testRedis.ts
import redis from './socket/redis';

(async () => {
  try {
    // 연결 확인 (PING)
    const pong = await redis.ping();
    console.log('Redis PING response:', pong); // 기대값: "PONG"

    // 테스트용 키 저장
    await redis.set('testKey', 'Hello Redis');
    const value = await redis.get('testKey');
    console.log('✅ Redis GET result:', value); // "Hello Redis"

    process.exit(0);
  } catch (error) {
    console.error('❌ Redis 연결 실패:', error);
    process.exit(1);
  }
})();
