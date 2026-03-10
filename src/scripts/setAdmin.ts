import { auth } from "../config/firebaseConfig";

const uid = "PuLkHtpukoNGXTu53t9Ub6g80N82";

async function setAdmin() {
  await auth.setCustomUserClaims(uid, { role: "admin" });
  console.log("Admin role set");
}

setAdmin();