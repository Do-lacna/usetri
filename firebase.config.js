import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

export const firebaseConfig = {
  apiKey: "AIzaSyD-bsRkMTX6GYvp7CNEiqkcWEJsIhtdiec",
  authDomain: "dolacna-388d4.firebaseapp.com",
  projectId: "dolacna-388d4",
  storageBucket: "dolacna-388d4.appspot.com",
  messagingSenderId: "504961053140",
  appId: "1:504961053140:android:a31a3f46a792c807fbe641",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export default app;
