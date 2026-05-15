import Elysia, { t } from "elysia";
import { httpSessionVerificationMiddleware } from "../../../helpers/httpSesisonVerificationMiddleware/httpSesisonVerificationMiddleware";
import { What } from "../../what";
import { BaseConfigurationSchema } from "../../../configuration/baseConfigurationSchema";
import { getUnixTimeAtSecond } from "../../../utils/timingUtils";
import { PushNotification } from "src/pushNotification/pushNotification";

const getVerifiedDevice = async (
   deviceId: string,
   sessionOwnerId: string,
   set: any,
) => {
   const deviceModel = What.getSingletonTrait();
   const device = await deviceModel.getDeviceBy("deviceId", deviceId);

   if (!device) {
      set.status = 404;
      return { error: { data: [{ message: "Device not found" }] } };
   }

   if (device.instance.ownerId !== sessionOwnerId && !device.instance.isTestingDevice) {
      set.status = 403;
      return { error: { data: [{ message: "Forbidden" }] } };
   }

   return { device };
};

export const humidityController = new Elysia()
   .use(httpSessionVerificationMiddleware())
   .get(
   "/list",
   async ({ set, session }) => {
      const deviceModel = What.getSingletonTrait();
      const devices = await deviceModel.model.find({
         $or: [{
            ownerId: session.tokenData.sessionOwnerId
         }, {
            isTestingDevice: true
         }]
      })

      if (!devices) {
         set.status = 404;
         return { data: [{ message: "No devices found" }] };
      }

      return {
         data: [
            {
               message: "success",
               data: devices.map((device) => ({
                  deviceId: device.deviceId,
                  deviceName: device.deviceName,
                  latestRecord: device.latestRecord,
                  latestRecordSendDate: device.latestRecordSendDate,
                  testingDevice: device.isTestingDevice
               })),
            },
         ],
      };
   },
)
   .get(
      "/:deviceId/metadata",
      async ({ params: { deviceId }, set, session }) => {
         const { device, error } = await getVerifiedDevice(
            deviceId,
            session.tokenData.sessionOwnerId,
            set,
         );
         if (error) return error;
         return device.instance.toObject();
      },
      {
         params: t.Object({
            deviceId: t.String(),
         }),
      },
   )
   .post(
      "/:deviceId/records",
      async ({ params: { deviceId }, body, set, session }) => {
         const { device, error } = await getVerifiedDevice(
            deviceId,
            session.tokenData.sessionOwnerId,
            set,
         );
         if (error) return error;

         if (getUnixTimeAtSecond() - device.instance.latestRecordSendDate > 60 * 5) {
            await PushNotification.getSingletonTrait().broadcastMessage(session.tokenData.sessionOwnerId, "Đang hoạt đông", "Thiết bị '" + device.instance.deviceName + "' đã hoạt động trở lại và đo được mức độ ẩm là " + body.value + "%")
         }
         return device.addHumidityRecord({date: getUnixTimeAtSecond(), value: body.value});
      },
      {
         params: t.Object({
            deviceId: t.String(),
         }),
         body: t.Object({
            value: t.Number(),
         }),
      },
   )
    .post(
      "/:deviceId/updateLatestSprayDate",
      async ({ params: { deviceId }, body, set, session }) => {
         const { device, error } = await getVerifiedDevice(
            deviceId,
            session.tokenData.sessionOwnerId,
            set,
         );
         if (error) return error;
         return await device.updateLatestSprayDate();
      },
      {
         params: t.Object({
            deviceId: t.String(),
         })
      },
   )
    .get(
      "/:deviceId/getConfigurationSecretKey",
      async ({ params: { deviceId }, body, set, session }) => {
         const { device, error } = await getVerifiedDevice(
            deviceId,
            session.tokenData.sessionOwnerId,
            set,
         );

         if (!device) {
            return {
               errors: [
                  {
                     message: "failed"
                  }
               ]
            }
         }
          let configureObject =
         BaseConfigurationSchema.getSpecificSingletonTrait("humidityPotSettings");
         if (!configureObject) {
            set.status = 500;
            return {
               errors: [
                  {
                     message: "unexcepted error.",
                  },
               ],
            };
         }


         let objectData = await configureObject.getObject(device?.instance.configurationObjectId || "n/a");

         return {
            data: [
               {
                  message: "ok",
                  data: { accessKey: objectData?.accessKey },
               },
            ],
         };
         if (error) return error;
         return device.addHumidityRecord(body);
      },
      {
         params: t.Object({
            deviceId: t.String(),
         }),
         body: t.Object({
            date: t.Number(),
            value: t.Number(),
         }),
      },
   )
   .post(
      "/new",
      async ({ body, set, session }) => {
         const deviceModel = What.getSingletonTrait();
         const device = await deviceModel.createDevice({
            ownerId: session.tokenData.sessionOwnerId,
            deviceName: body.deviceName || "hello",
         });
         console.log(device)
         if (!device) {
            set.status = 500;
            return { data: [{ message: "Failed to create device" }] };
         }

         return {
            data: [
               {
                  message: "success",
                  data: {
                     deviceId: device.instance.deviceId,
                     deviceName: device.getDeviceName(),
                  },
               },
            ],
         };
      },
      {
         body: t.Object({
            deviceName: t.Optional(t.String()),
         }),
      },
   );