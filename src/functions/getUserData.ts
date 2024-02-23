import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { toast } from "react-toastify";

function getAuthUserData() {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const data = await getDoc(doc(db, "users", currentUser.uid))
          .then((doc) => {
            if (!doc.exists()) {
              reject(new Error("not exists"));
            }
            return doc.data();
          })
          .then((data) => {
            resolve(data);
          });
        return data;
      } else {
        reject(new Error("user is not authenticated"));
      
      }
      unsubscribe();
    });
  });
}
export default getAuthUserData;
