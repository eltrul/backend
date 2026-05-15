import type { ISmartHumidityPotDevice } from "./ISmartHumidityPotDevice";

export type IDeviceTypes = "smartHumidityPot"; 
export const deviceTypes = ["smartHumidityPot"]; 

export interface IDeviceMap {
    smartHumidityPot: ISmartHumidityPotDevice
}

export type IBaseDevice<T extends IDeviceTypes> = {
    deviceId: string;
    deviceName: string; 
    deviceType: T; 
    deviceSecret: string; 
    deviceIpAddress: string; 
} & IDeviceMap[T]
