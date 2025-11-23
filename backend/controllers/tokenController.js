const { AccessToken } = require("livekit-server-sdk");

// Function to generate room name from email
const generateRoomNameFromEmail = (email) => {
  // Extract username part before @ and sanitize
  const username = email.split("@")[0];
  // Remove special characters and convert to lowercase
  const sanitized = username.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
  // Add timestamp to ensure uniqueness
  const timestamp = Date.now();
  return `${sanitized}_${timestamp}`;
};

// Function to generate participant name from email
const generateParticipantName = (email) => {
  // Extract username part before @ and capitalize first letter
  const username = email.split("@")[0];
  return username.charAt(0).toUpperCase() + username.slice(1);
};

// Create LiveKit Access Token
const createAccessToken = async (roomName, participantName, userEmail) => {
  try {
    const accesstoken = new AccessToken(
      process.env.LIVEKIT_API_KEY,
      process.env.LIVEKIT_API_SECRET,
      {
        identity: participantName,
        metadata: JSON.stringify({ email: userEmail }),
        ttl: 600, // 10 minutes
      }
    );

    accesstoken.addGrant({ roomJoin: true, room: roomName });

    const token = await accesstoken.toJwt();
    return token;
  } catch (error) {
    throw new Error(`Failed to create access token: ${error.message}`);
  }
};

// Get LiveKit token for authenticated user
exports.getToken = async (req, res) => {
  try {
    // Extract user email from middleware
    const userEmail = req.user?.email;

    if (!userEmail) {
      return res.status(400).json({
        success: false,
        message: "User email not found in request",
      });
    }

    // Generate room name and participant name from email
    const roomName = generateRoomNameFromEmail(userEmail);
    const participantName = generateParticipantName(userEmail);

    // Create LiveKit access token
    const token = await createAccessToken(roomName, participantName, userEmail);

    res.status(200).json({
      success: true,
      message: "Token generated successfully",
      data: {
        token,
        roomName,
        participantName,
        email: userEmail,
      },
    });
  } catch (error) {
    console.error("Token generation error:", error);
    res.status(500).json({
      success: false,
      message: "Error generating token",
      error: error.message,
    });
  }
};