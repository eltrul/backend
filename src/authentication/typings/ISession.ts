export interface ISession {
   sessionId: string;
   sessionOwnerId: string;
   createDate: number;
   isClosed: boolean;
   IPAddress: string;
   geoLocation: string;
}
