export interface IHumidityRecord {
   date: number;
   value: number;
}

export interface IDeviceConstructor {
   deviceId: string;
   ownerId: string;
   deviceName: string;
   configurationObjectId: string;
   humidityHistory: IHumidityRecord[];
   latestRecord: number;
   latestRecordSendDate: number;
   latestSprayDate: number;
}
