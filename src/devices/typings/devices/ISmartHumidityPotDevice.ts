export type ISmartHumidityPotDeviceSprayMode = "timeBased" | "humidityBased";

export interface ISmartHumidityPotDevice {
    recordHistory: {
        date: number;
        value: number;
    }[];
    currentHumidityValue: number; 
    latestSprayTime: number; 
    sprayMode: ISmartHumidityPotDeviceSprayMode; 
    wateringThreshold: number; 
}