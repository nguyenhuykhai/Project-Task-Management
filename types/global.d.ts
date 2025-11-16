import { FirebaseApp, initializeApp } from 'firebase/app';
import { Firestore, getFirestore } from 'firebase/firestore';
import { Auth, getAuth } from 'firebase/auth';

declare global {
  interface Window {
    firebase: {
      firestore: () => Firestore;
      auth: () => Auth;
      app: FirebaseApp;
    };
  }
}
