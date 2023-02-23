import jwt from "jsonwebtoken";

function generateAuthToken(payload: any) {
  const token = jwt.sign(payload, process.env.JWT_SECRET || "token", {
    expiresIn: "7 days",
  });
  return token;
}

export default generateAuthToken;
