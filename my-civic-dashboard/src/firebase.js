import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBcFjYbRfXmF0iLBK0CRb_ZRZuftxeeiqo",
  authDomain: "civic-6e1ba.firebaseapp.com",
  projectId: "civic-6e1ba",
  storageBucket: "civic-6e1ba.appspot.com",
  messagingSenderId: "673434233103",
  appId: "1:673434233103:web:7b258aa73793bdc862b67a",
  measurementId: "G-Y8PDZZPDBS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);
