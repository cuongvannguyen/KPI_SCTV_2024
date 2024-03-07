//test api
import loginRegisterService from "../service/loginRegisterService";
import ms from "ms";
require("dotenv").config();

const handleRegister = async (req, res) => {
  try {
    if (!req.body.email || !req.body.phone || !req.body.password) {
      return res.status(200).json({
        EM: "Missing required parameters",
        EC: "1",
        DT: "",
      });
    }
    if (req.body.password && req.body.password.length < 4) {
      return res.status(200).json({
        EM: "You password must have more than 3 letters",
        EC: "2",
        DT: "",
      });
    }

    let data = await loginRegisterService.registerNewUser(req.body);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: "",
    });
  } catch (e) {
    return res.status(200).json({
      EM: "Error from server",
      EC: "-1",
      DT: "",
    });
  }
};

// Handel User Login CMS hotel
const handleLogin = async (req, res) => {
  try {
    const path = req.path;
    // console.log(`Đã gọi đường dẫn URL: ${path}`);

    const parseIp = (req) => {
      req.headers["x-forwarded-for"]?.split(",").shift() ||
        req.socket?.remoteAddress;
    };

    // console.log(parseIp(req));
    // => 127.0.0.1

    let data = await loginRegisterService.handleUserLogin(
      req.body,
      parseIp(req)
    );

    //set cookie và assignment refresh_token
    if (data && data.refresh_token) {
      // console.log("check refresh cookie", data.refresh_token);

      const cookieSize = Buffer.from(JSON.stringify(data.refresh_token)).length;

      console.log("Kích thước cookie:", cookieSize, "bytes");

      //off test hệ thống
      res.cookie("refresh_token", data.refresh_token, {
        // httpOnly: true,
        maxAge: ms(process.env.JWT_REFRESH_EXPIRE_IN),
      });

      console.log("bạn đã login: ", data);
    } else {
      console.log("bạn đã login: ", data);
    }

    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      EM: "error from server, liên hệ P CLNCPT",
      EC: "-1",
      DT: "",
    });
  }
};

const handleLogout = (req, res) => {
  try {
    res.clearCookie("refresh_token");
    return res.status(200).json({
      EM: "clear cookie done!",
      EC: 0,
      DT: "",
    });
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      EM: "error from server, lien he PCLNCPT",
      EC: "-1",
      DT: "",
    });
  }
};

const handleChangeInfor = async (req, res) => {
  try {
    let data = await loginRegisterService.handleChangeInfor(req.body);

    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      EM: "error from server, liên hệ P CLNCPT",
      EC: "-1",
      DT: "",
    });
  }
};

const handleChangePassword = async (req, res) => {
  try {
    let data = await loginRegisterService.handleChangePassword(req.body);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      EM: "error from server, liên hệ P CLNCPT",
      EC: "-1",
      DT: "",
    });
  }
};

module.exports = {
  handleRegister,
  handleLogin,
  handleLogout,
  handleChangeInfor,
  handleChangePassword,
};
