import { RedisConnection } from "./redisConnection";

export class RecordStorage {
   public redisConnection: RedisConnection;

   constructor() {
      this.redisConnection = RedisConnection.getSingletonTrait();
   }

   async set(key: string, value: string, expireSec?: number): Promise<boolean> {
      const client = this.redisConnection.getClient();

      if (expireSec) {
         await client.set(key, value, "EX", expireSec);
      } else {
         await client.set(key, value);
      }

      return true;
   }

   async get(key: string) {
      return await this.redisConnection.getClient().get(key);
   }

   async delete(key: string) {
      return await this.redisConnection.getClient().del(key);
   }
}
