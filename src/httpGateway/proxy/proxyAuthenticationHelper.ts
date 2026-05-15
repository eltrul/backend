import { RecordStorage } from "@starfield/redis";
import { randomUUIDv7 } from "bun";
import { HttpGatewayHelper } from "../../helpers/httpGateway/httpGatewayHelper";

export class ProxyAuthenticationHelper {
   protected recordStorage: RecordStorage;

   constructor() {
      this.recordStorage = new RecordStorage();
   }

   async createNewRequest() {
      let requestId = randomUUIDv7();
      let sign = await HttpGatewayHelper.sign(requestId);

      return { requestId, sign };
   }

   async verifyRequestId(requestId: string, sign: string) {
      return await HttpGatewayHelper.verify(requestId, sign);
   }
}
