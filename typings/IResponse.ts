export interface IResponse<T = Record<any, any>> {
   errors?: {
      message: string;
   }[];
   data?: {
      message: string;
      data?: T;
   }[];
}
