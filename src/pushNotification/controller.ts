import type { HydratedDocument } from "mongoose";
import type { IPushNotificationRecord } from "./typings/IPushNotificationRecord";
import type { PushNotification } from "./pushNotification";
import { FirebaseControl } from "./firebaseControl";
import type { Messaging } from "firebase-admin/messaging";

export class Controller {
    public instance: HydratedDocument<IPushNotificationRecord>
    public main: PushNotification
    public firebase: Messaging

    constructor(instance: HydratedDocument<IPushNotificationRecord>, main: PushNotification) {
        this.instance = instance 
        this.main = main
        this.firebase = FirebaseControl.getInstance().getMessagingControl()
    }

    getState() {
        return this.instance.state
    }

    async sendNotification(title: string, body: string) {
        if (this.instance.state == "disabled") return 
        
        await this.firebase.send({
            token: this.instance.secret, 
            notification: {
                title,
                body
            }
        })
    }
}