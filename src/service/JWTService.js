import db from "../models/index";
import ms from "ms";
import jwt from "jsonwebtoken";
import { createJWT } from "../middleware/JWTAction";
require("dotenv").config();

//test web châm điểm đề tài sáng kiến
const createTopic = async (req, res) => {
  try {
    // let data = await userApiService.handleBulkUser(req.body);

    console.log("check data request: ", req.body);

    return res.status(200).json({
      EM: "error from server",
      EC: "-1",
      DT: "",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      EM: "error from server",
      EC: "-1",
      DT: "",
    });
  }
};

const getGroupWithRoles = async (user) => {
  //lấy name của group và các role của group đó

  let rolesGroup = await db.GROUP.findOne({
    where: { id: user.GROUP_ID },
    attributes: ["id", "NAME_VI", "NAME_EN", "DESCRIPTION"],

    include: [
      {
        model: db.PERMISSION,
        attributes: ["id", "URL"],
        through: { attributes: [] },
      },
    ],

    // raw: true,
    // nest: true,
  });

  let roles = {};
  if (rolesGroup) {
    roles = { rolesGroup };
  }
  return roles ? roles : null;
};

const createRefreshToken = (payload) => {
  let key = process.env.JWT_REFRESH_SECRET;
  let token = null;
  try {
    token = jwt.sign(payload, key, {
      expiresIn: ms(process.env.JWT_REFRESH_EXPIRE_IN) / 1000,
    });
  } catch (err) {
    console.log(err);
  }
  return token;
};

// decoded token -> payload
const verifyRefreshToken = (token) => {
  let key = process.env.JWT_REFRESH_SECRET;
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
    req &&
    req.headers &&
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    return req.headers.authorization.split(" ")[1];
  }
  return null;
};

//api refreshToken
const reFreshToken = (req, res) => {
  try {
    const tokenFromHeader = extractToken(req);
    // lấy cookies từ client
    let cookies = req.cookies ? req.cookies : "";

    if ((cookies && cookies.refresh_token) || tokenFromHeader) {
      let token =
        cookies && cookies.refresh_token
          ? cookies.refresh_token
          : tokenFromHeader;

      let decoded = verifyRefreshToken(token);
      if (decoded) {
        //xoá 2 phần tử iat và exp để tạo ra api_token mới
        const { iat, exp, ...newDecoded } = decoded;

        let api_token = createJWT(newDecoded);

        return res.status(200).json({
          EC: 0,
          DT: api_token,
          EM: "reFresh Token successfully!",
        });
      } else {
        return res.status(400).json({
          EC: -1,
          DT: "",
          EM: "Not found refresh_token",
        });
      }
    }
    // end
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      EM: "error from server, liên hệ PCLNCPT",
      EC: "-1",
      DT: "",
    });
  }
};

module.exports = {
  getGroupWithRoles,
  createRefreshToken,
  reFreshToken,
  createTopic,
};
