export interface IPushNotificationRecord {
    deviceId: string
    ownerId: string, 
    state: "active" | "disabled", 
    deviceName: string
    secret: string
}