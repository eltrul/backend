import Redis from "ioredis";
import { config } from "../../app/config";

export class RedisConnection {
   public redisClient: Redis;
   public static instance: RedisConnection;

   constructor() {
      this.redisClient = new Redis(config.redis.uri);
   }

   public static getSingletonTrait() {
      if (!RedisConnection.instance) {
         RedisConnection.instance = new RedisConnection();
      }

      return RedisConnection.instance;
   }

   getClient(): Redis {
      return this.redisClient;
   }
}
