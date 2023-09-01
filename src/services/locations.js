import { getDocs, collection } from "firebase/firestore";
import { getFirestoreConn } from "../firebase";

const collectionName = "locations";

export const findAllLocations = async () => {
  const docRefs = await getDocs(collection(getFirestoreConn(), collectionName));
  const res = [];

  docRefs.forEach((location) => {
    res.push({ id: location.id, ...location.data() });
  });

  return res;
};
