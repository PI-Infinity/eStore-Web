import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyALtwiBrqBWiDFV_xieLRALN7bo9NgFMUk",
  authDomain: "e-store-d2232.firebaseapp.com",
  projectId: "e-store-d2232",
  storageBucket: "e-store-d2232.appspot.com",
  messagingSenderId: "211246211778",
  appId: "1:211246211778:web:fbb6b3618c172884ad515b",
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
