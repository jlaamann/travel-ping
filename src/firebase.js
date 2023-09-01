import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";

let firestore = false;

const firebaseConfig = {
  apiKey: process.env.REACT_APP_ApiKey,
  authDomain: process.env.REACT_APP_AuthDomain,
  projectId: process.env.REACT_APP_ProjectId,
  storageBucket: process.env.REACT_APP_StorageBucket,
  messagingSenderId: process.env.REACT_APP_MessagingSenderId,
  appId: process.env.REACT_APP_AppId,
};

export const getFirestoreConn = () => {
  if (!firestore) {
    const app = initializeApp(firebaseConfig);
    firestore = getFirestore(app);
    console.log(firebaseConfig);
  }

  return firestore;
};
