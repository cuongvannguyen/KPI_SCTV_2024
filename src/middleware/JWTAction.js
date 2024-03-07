import jwt from "jsonwebtoken";
import ms from "ms";
require("dotenv").config();

const nonSecurePaths = [
  "/login",
  "/register",
  "/logout",
  "/refresh-token",
  "/check-token",
  "/menuDisplay",
  "/cInfor",
  "/cPass",
];

const createJWT = (payload) => {
  let key = process.env.JWT_SECRET;

  let token = null;
  try {
    token = jwt.sign(payload, key, {
      expiresIn: ms(process.env.JWT_EXPIRES_IN) / 1000,
    });
  } catch (err) {
    console.log(err);
  }
  return token;
};

const verifyToken = (token) => {
  let key = process.env.JWT_SECRET;
  let decoded = null;
  try {
    decoded = jwt.verify(token, key);
  } catch (err) {
    console.log(err);
  }
  return decoded;
};

const extractToken = (req) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    return req.headers.authorization.split(" ")[1];
  }
  return null;
};

const checkUserJWT = (req, res, next) => {
  if (nonSecurePaths.includes(req.path)) return next();

  const tokenFromHeader = extractToken(req); //lấy từ Bear Header
  if (tokenFromHeader) {
    let api_token = tokenFromHeader;

    //từ access token lấy infor
    let decoded = verifyToken(api_token);
    if (decoded) {
      //next data: {user vs api_token} qua request
      req.user = decoded; //sẽ là payload của jwt
      req.api_token = api_token;
      //end
      next(); //sẽ truyền user và api_token được decode qua request next
    } else {
      return res.status(401).json({
        EC: -1,
        DT: "",
        EM: "api_token can't decode!",
      });
    }
  } else {
    return res.status(401).json({
      EC: -1,
      DT: "",
      EM: "Not get param api_token",
    });
  }
};

const checkUserPerMission = (req, res, next) => {
  if (
    nonSecurePaths.includes(req.path) ||
    req.path === "/account" ||
    req.path === "/check-token"
  )
    // các api không cần phải kiểm tra quyền user
    return next();
  //end nonSecureRoute
  if (req.user) {
    //do something again
    let rolesPermissionGroup = req.user.rolesPermissionGroup;
    // console.log("check roles: ", roles);
    let currentUrl = req.path;
    // console.log("check path: ", currentUrl);

    if (!rolesPermissionGroup || rolesPermissionGroup.length === 0) {
      return res.status(403).json({
        EC: -1,
        DT: "",
        EM: `You don't have any permission to access this resource`,
      });
    }

    let canAccess = rolesPermissionGroup.some(
      (item) => item.URL === currentUrl || currentUrl.includes(item.URL)
    );

    if (canAccess) {
      next(); // authen vs pass
    } else {
      return res.status(403).json({
        EC: -1,
        DT: "",
        EM: `You don't have permission to access this resource`,
      });
    }
  } else {
    return res.status(401).json({
      EC: -1,
      DT: "",
      EM: "Not authenticated the user",
    });
  }
};

module.exports = {
  createJWT,
  verifyToken,
  checkUserJWT,
  checkUserPerMission,
};
