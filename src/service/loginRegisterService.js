import db from "../models";
require("dotenv").config();
import bcrypt from "bcryptjs";
import { Op } from "sequelize";
//create a new JWT and store localtorage
import { getGroupWithRoles } from "./JWTService";
import { createJWT } from "../middleware/JWTAction";
import { createRefreshToken } from "./JWTService";

// import processLineByLine from "../service/manageLog/readLineFromFile";
const salt = bcrypt.genSaltSync(10);

//hash password create user
const hashUserPassword = (userPassword) => {
  let hashPassword = bcrypt.hashSync(userPassword, salt);
  return hashPassword;
};

const checkPassword = (inputPassword, hashPassword) => {
  return bcrypt.compareSync(inputPassword, hashPassword);
};

const checkEmailPassword = async (userEmail) => {
  let user = await db.USER.findOne({
    where: { EMAIL: userEmail },
  });
  if (user) {
    return user;
  }
  return "";
};

//check email when create user
const checkEmailExist = async (userEmail) => {
  let user = await db.USER.findOne({
    where: { EMAIL: userEmail },
  });
  if (user) {
    return true;
  }
  return false;
};

//check phone number where create user
const checkPhoneExist = async (userPhone) => {
  let user = await db.USER.findOne({
    where: { USER_PHONE: userPhone },
  });
  if (user) {
    return true;
  }
  return false;
};

const registerNewUser = async (rawUserDate) => {
  try {
    let isEmailExist = await checkEmailExist(rawUserDate.email);
    if (isEmailExist) {
      return {
        EM: "The email is already exist",
        EC: 1,
      };
    }

    let isPhoneExist = await checkPhoneExist(rawUserDate.phone);
    if (isPhoneExist) {
      return {
        EM: "The phone is already exist",
        EC: 1,
      };
    }

    let hashPassword = hashUserPassword(rawUserDate.password);
    await db.USER.create({
      email: rawUserDate.email,
      username: rawUserDate.Username,
      password: hashPassword,
      phone: rawUserDate.phone,
      groupId: 4,
    });

    return {
      EM: "A user is create successfullly",
      EC: "0",
    };
  } catch (e) {
    console.log(e);
    return {
      EM: "something wrongs is service...",
      EC: -2,
    };
  }
};

const handleUserLogin = async (rawData, parseIp) => {
  try {
    if (!rawData || !rawData.valueLogin || !rawData.password) {
      return {
        EM: "!Paramester is not null",
        EC: -1,
        DT: "",
      };
    } else {
      let user = await db.USER.findOne({
        where: {
          [Op.or]: [
            { EMAIL: rawData.valueLogin },
            { USER_PHONE: rawData.valueLogin },
          ],
        },
        // raw: true,
      });

      if (user && user.USER_STATUS === 1) {
        let isCorrectPassword = checkPassword(rawData.password, user.PASSWORD);

        if (isCorrectPassword) {
          let rolesPermission = await getGroupWithRoles(user);

          //create payload for token
          if (rolesPermission) {
            let payload = {
              id: user._id,
              email: user.EMAIL,
              first_name: user.USER_FIRSTNAME,
              last_name: user.USER_LASTNAME,
              avatar: user.AVATAR_LINK,
              groupId: rolesPermission.rolesGroup.id,
              rolesPermissionGroup: rolesPermission.rolesGroup.PERMISSIONs,
            };

            let api_token = createJWT(payload);
            let refresh_token = createRefreshToken(payload);

            let now = new Date();

            // now.format("dd/MM/yyyy hh:mm TT");

            await user.update({
              LAST_LOGIN_DATE: now,
              LAST_LOGIN_IP: parseIp,
            });

            return {
              EM: "Login Successfully!",
              EC: 0,
              DT: {
                id: user._id,
                email: user.EMAIL,
                first_name: user.USER_FIRSTNAME,
                last_name: user.USER_LASTNAME,
                avatar: user.AVATAR_LINK,
                api_token: api_token,
                groupId: rolesPermission.rolesGroup.id,
              },
              refresh_token: refresh_token,
            };
          } else {
            let payload = {
              id: user._id,
              email: user.EMAIL,
              first_name: user.USER_FIRSTNAME,
              last_name: user.USER_LASTNAME,
              avatar: user.AVATAR_LINK,
            };
            let api_token = createJWT(payload);
            let refresh_token = createRefreshToken(payload);
            return {
              EM: "Login Successfully ok!",
              EC: 0,
              DT: {
                id: user._id,
                email: user.EMAIL,
                first_name: user.USER_FIRSTNAME,
                last_name: user.USER_LASTNAME,
                avatar: user.AVATAR_LINK,
                api_token: api_token,
              },
              refresh_token: refresh_token,
            };
          }
        }
      } else if (user && user.USER_STATUS === 0) {
        return {
          EM: "Account is inactive!",
          EC: 1,
          DT: "",
        };
      }

      return {
        EM: "Your email or phone is incorrect",
        EC: 1,
        DT: "",
      };
    }
  } catch (e) {
    console.log(e);
    return {
      EM: "Something wrongs is service...",
      EC: -2,
    };
  }
};

const handleChangeInfor = async (data) => {
  try {
    let user = await db.USER.findOne({
      where: {
        _id: data.userId,
      },
      raw: true,
    });
    if (user) {
      let isCorrectPassword = checkPassword(
        data.confirmPassword,
        user.PASSWORD
      );
      if (isCorrectPassword) {
        await db.USER.update(
          { EMAIL: data.newEmail },
          { where: { _id: data.userId } }
        );
        return {
          EM: "Your email is change success!",
          EC: 0,
          DT: "",
        };
      } else {
        return {
          EM: "Password is incorrect",
          EC: 1,
          DT: "",
        };
      }
    } else {
      return {
        EM: "user is incorrect",
        EC: 1,
        DT: "",
      };
    }
  } catch (e) {
    console.log(e);
    return {
      EM: "Something wrongs is service...",
      EC: -2,
    };
  }
};

const handleChangePassword = async (data) => {
  try {
    let user = await db.USER.findOne({
      where: {
        _id: data.userId,
      },
      raw: true,
    });
    if (user) {
      let isCorrectPassword = checkPassword(
        data.currentPassword,
        user.PASSWORD
      );
      if (isCorrectPassword) {
        let hashPassword = hashUserPassword(data.newPassword);
        await db.USER.update(
          { PASSWORD: hashPassword },
          { where: { _id: data.userId } }
        );
        return {
          EM: "Your password is change success!",
          EC: 0,
          DT: "",
        };
      } else {
        return {
          EM: "Password is incorrect",
          EC: 1,
          DT: "",
        };
      }
    } else {
      return {
        EM: "user is incorrect",
        EC: 1,
        DT: "",
      };
    }
  } catch (e) {
    console.log(e);
    return {
      EM: "Something wrongs is service...",
      EC: -2,
    };
  }
};

module.exports = {
  registerNewUser,
  handleUserLogin,
  hashUserPassword,
  checkEmailExist,
  checkPhoneExist,
  checkEmailPassword,
  checkPassword,
  handleChangeInfor,
  handleChangePassword,
};
