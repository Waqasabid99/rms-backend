const admin = require("firebase-admin");

// Load service account key (downloaded from Firebase Console)
const serviceAccount = require("../serviceAccountKey.json");

// Initialize Admin SDK only once
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert( process.env.NODE_ENV !== 'production' ? serviceAccount : {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  });
}

module.exports = admin;