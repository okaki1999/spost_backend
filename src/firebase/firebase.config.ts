import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseConfigService implements OnModuleInit {
  onModuleInit() {
    // Firebase Admin SDKの初期化
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
    });
  }

  // Firebase Admin SDKのインスタンスを取得
  getAuth() {
    return admin.auth();
  }
}
