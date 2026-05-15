import Elysia, { t } from "elysia";
import { httpSessionVerificationMiddleware } from "src/helpers/httpSesisonVerificationMiddleware/httpSesisonVerificationMiddleware";
import { PushNotification } from "../pushNotification";

export const pushNotificationRoute = new Elysia()
   .use(httpSessionVerificationMiddleware())
   .post("/register", async ctx => {
        let { session } = ctx
        let { deviceName, secret } = ctx.body
        
        await PushNotification.getSingletonTrait().createNewRecord(session.tokenData.sessionOwnerId, deviceName, secret)

        await PushNotification.getSingletonTrait().broadcastMessage(session.tokenData.sessionOwnerId, "Thành công", "Một thiết bị mới đã được đăng ký thông báo với tài khoản của bạn")
        
        return {
            data: [{
                message: "registered"
            }]
        }
   }, {
    body: t.Object({
        deviceName: t.String(), 
        secret: t.String()
    })
})