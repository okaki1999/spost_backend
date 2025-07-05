// node get-token.js
const { initializeApp } = require('firebase/app');
const { getAuth, signInAnonymously } = require('firebase/auth');

const firebaseConfig = {
  apiKey: "AIzaSyCeLWEdccYccZaKbBOqe0G_uWIRS64-WbM",
  authDomain: "spost-attestation.firebaseapp.com",
  projectId: "spost-attestation",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

signInAnonymously(auth).then(async (userCredential) => {
  const token = await userCredential.user.getIdToken();
  console.log(token);
  process.exit(0);
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
