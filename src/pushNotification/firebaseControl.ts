import admin from "firebase-admin";
import type { App } from "firebase-admin/app";
import { resolve } from "path";

export class FirebaseControl {
  private static instance: FirebaseControl;
  public app: App;

  private constructor() {
    const serviceAccountPath = resolve(__dirname, "../../app/firebase.json");

    this.app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccountPath),
    });
  }

  public getMessagingControl() {
    return admin.messaging()
  }

  public static getInstance(): FirebaseControl {
    if (!FirebaseControl.instance) {
      FirebaseControl.instance = new FirebaseControl();
    }
    return FirebaseControl.instance;
  }
}
