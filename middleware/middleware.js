import jwt from "jsonwebtoken";
const authenticationMidlleware = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    res.status(401).json({ msg: "Unauthorized access token is required", status: 401 })
  }
  try {
    const decodetoken = jwt.verify(token, process.env.Access_Token)
    req.user = decodetoken;
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized: Invalid access token.' });

  }
}

export default authenticationMidlleware