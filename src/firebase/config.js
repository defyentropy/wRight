import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA7s1lDgL9ayvqnQgcZZ3OwBM15yzhf6tY",
  authDomain: "aurora-f2e8d.firebaseapp.com",
  projectId: "aurora-f2e8d",
  storageBucket: "aurora-f2e8d.appspot.com",
  messagingSenderId: "424396168535",
  appId: "1:424396168535:web:3dd194e9ac58f3fa94b212",
};

initializeApp(firebaseConfig);

const auth = getAuth();
const db = getFirestore();
// enableIndexedDbPersistence(db).catch((err) => {
//   if (err.code === "failed-precondition") {
//     console.log(
//       "Please have only one wRight tab opened at once for offline caching to work."
//     );
//   } else if (err.code === "unimplemented") {
//     console.log(
//       "Looks like your browser doesn't support offline caching. You'll only be able to use wRight with an internet connection."
//     );
//   }
// });

export { auth, db };
