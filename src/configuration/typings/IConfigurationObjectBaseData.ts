import type { IObjectType } from "./IObjectTypes";

export interface IConfigurationObjectBaseData<T> {
   objectId: string;
   objectType: IObjectType;
   accessKey?: string;
   data?: Record<keyof T, any>;
}
