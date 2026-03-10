import { initializeApp, cert, getApps, ServiceAccount } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import { getAuth, Auth } from "firebase-admin/auth";
import serviceAccountJson from "./serviceAccountKey.json";

const serviceAccount = serviceAccountJson as ServiceAccount;

if (!getApps().length) {
    initializeApp({
        credential: cert(serviceAccount),
    });
}

const db: Firestore = getFirestore();
const auth: Auth = getAuth();

export { db, auth };