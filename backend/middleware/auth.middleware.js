const admin = require("../config/firebase.config");

const firebaseAuth = async (req, res, next) => {
  try {
    // Check if token is present
    const authHeader = req.headers.authorization;

    // Check if token is present
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: Missing token" });
    }

    // Extract token
    const idToken = authHeader.split(" ")[1];

    // Verify token
    const decoded = await admin.auth().verifyIdToken(idToken);

    // Attach user data
    req.user = {
      uid: decoded.uid,
      email: decoded.email,
    };

    next();
  } catch (error) {
    console.error("Firebase Auth Error:", error);
    res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
  }
};

module.exports = firebaseAuth;
