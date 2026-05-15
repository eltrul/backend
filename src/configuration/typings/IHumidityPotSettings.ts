export type ISprayMode = "humidity" | "timer";
export const sprayMode = ["humidity", "timer"];

export interface IHumidityPotSettings {
   sprayMode: ISprayMode;
   sprayInterval: number;
   sprayThresehold: number;
}
