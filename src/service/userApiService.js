import db from "../models/index";
require("dotenv").config();
const fs = require("fs");
import {
  checkEmailPassword,
  checkPhoneExist,
  hashUserPassword,
  checkPassword,
  checkEmailExist,
} from "./loginRegisterService";
import { verifyToken } from "../middleware/JWTAction";

const { Op } = require("sequelize");
//change password
const handleChangePassword = async (data) => {
  try {
    let isUser = await checkEmailPassword(data.email);

    if (!isUser) {
      return {
        EM: "The email is not exist!",
        EC: 1,
        DT: data.email,
      };
    } else {
      let isCheckPassword = await checkPassword(data.oldpass, isUser.PASSWORD);
      if (isCheckPassword) {
        let passWordNewHash = await hashUserPassword(data.newpass);
        // let user = await db.USER.findOne({
        //   where: { EMAIL: data.email },
        // });
        if (isUser) {
          await isUser.update({
            PASSWORD: passWordNewHash,
          });
          return {
            EM: "update Password Success!",
            EC: 0,
            DT: "",
          };
        } else {
          return {
            EM: "Update Fail!",
            EC: 1,
            DT: "",
          };
        }
      } else {
        return {
          EM: "Mật khẩu cũ không chính xác",
          EC: 1,
          DT: "",
        };
      }
    }
  } catch (e) {
    console.log(e);
    return {
      EM: "something wrongs with services",
      EC: 1,
      DT: [],
    };
  }
};

const getUserWithPagination = async (current, pageSize) => {
  try {
    let offset = (current - 1) * pageSize;
    const { count, rows } = await db.USER.findAndCountAll({
      offset: offset,
      limit: pageSize,
      attributes: [
        "_id",
        "EMAIL",
        "USER_LASTNAME",
        "USER_FIRSTNAME",
        "USER_STATUS",
        "USER_GENDER",
        "USER_PHONE",
        "AVATAR_LINK",
        "createdAt",
        "LAST_LOGIN_DATE",
      ],
      include: [
        {
          model: db.GROUP,
          attributes: ["id", "NAME_VI", "NAME_EN", "DESCRIPTION"],
        },
        {
          model: db.POSITION,
          attributes: ["NAME_VI", "NAME_EN", "DESCRIPTION"],
        },
      ],
      order: [["_id", "DESC"]],
    });
    let totalPages = Math.ceil(count / pageSize);
    let data = {
      meta: {
        current: current,
        pageSize: pageSize,
        pages: totalPages,
        total: count,
      },
      users: rows,
    };
    return {
      EM: "pagination success",
      EC: 0,
      DT: data,
    };
  } catch (e) {
    console.log(e);
    return {
      EM: "something wrongs with services",
      EC: 1,
      DT: [],
    };
  }
};

const getAllUser = async () => {
  try {
    let users = await db.USER.findAll({
      attributes: [
        "_id",
        "EMAIL",
        "USER_LASTNAME",
        "USER_FIRSTNAME",
        "USER_STATUS",
        "USER_GENDER",
        "USER_PHONE",
        "AVATAR_LINK",
      ],
      include: [
        {
          model: db.GROUP,
          attributes: ["id", "NAME_VI", "NAME_EN", "DESCRIPTION"],
        },
        {
          model: db.POSITION,
          attributes: ["NAME_VI", "NAME_EN", "DESCRIPTION"],
        },
      ],
      order: [["_id", "DESC"]],
    });
    if (users) {
      return {
        EM: "get All User Success!",
        EC: 0,
        DT: users,
      };
    } else {
      return {
        EM: "get All User Fail",
        EC: 1,
        DT: [],
      };
    }
  } catch (e) {
    console.log(e);
    return {
      EM: "something wrongs with services",
      EC: 1,
      DT: [],
    };
  }
};

const getInforUser = async (userId) => {
  try {
    let user = await db.USER.findOne({
      attributes: [
        "_id",
        "EMAIL",
        "USER_LASTNAME",
        "USER_FIRSTNAME",
        "USER_STATUS",
        "USER_GENDER",
        "USER_PHONE",
        "AVATAR_LINK",
        "LAST_LOGIN_DATE",
      ],
      include: [
        {
          model: db.GROUP,
          attributes: ["id", "NAME_VI", "NAME_EN", "DESCRIPTION"],
        },
        {
          model: db.POSITION,
          attributes: ["NAME_VI", "NAME_EN", "DESCRIPTION"],
        },
      ],
      where: { _id: userId },
    });
    if (user) {
      return {
        EM: "get infor User Success!",
        EC: 0,
        DT: user,
      };
    } else {
      return {
        EM: "get infor User Fail",
        EC: 1,
        DT: [],
      };
    }
  } catch (e) {
    console.log(e);
    return {
      EM: "something wrongs with services",
      EC: 1,
      DT: [],
    };
  }
};

const handleCreateUser = async (data, file) => {
  try {
    if (!data) {
      return {
        EM: "missing paramesters!",
        EC: 1,
        DT: "",
      };
    } else {
      //handle create a new user with avartar

      let isEmailExist = await checkEmailExist(data.email);
      if (isEmailExist) {
        return {
          EM: "The email is already exist",
          EC: 1,
          DT: "email",
        };
      }
      let isPhoneExist = await checkPhoneExist(data.phone);
      if (isPhoneExist) {
        return {
          EM: "The phone number is already exist",
          EC: 1,
          DT: "phone",
        };
      }
      let hashPassword = hashUserPassword(data.password);

      let linkAvatar = process.env.LINK_AVATAR;
      if (file) {
        await db.USER.create({
          EMAIL: data.email,
          PASSWORD: hashPassword,
          USER_LASTNAME: data.userLastName,
          USER_FIRSTNAME: data.userFirstName,
          USER_STATUS: 1,
          GROUP_ID: +data.groupId,
          POSITION_ID: +data.positionId,
          USER_GENDER: data.gender,
          AVATAR_LINK: `${linkAvatar}/${file.filename}`,
          AVATAR_PATH: `${file.destination}/${file.filename}`,
          USER_PHONE: data.phone,
        });
      } else {
        await db.USER.create({
          EMAIL: data.email,
          PASSWORD: hashPassword,
          USER_LASTNAME: data.userLastName,
          USER_FIRSTNAME: data.userFirstName,
          USER_STATUS: 1,
          GROUP_ID: +data.groupId,
          POSITION_ID: +data.positionId,
          USER_GENDER: data.gender,
          USER_PHONE: data.phone,
        });
      }

      return {
        EM: "Create New A User success!",
        EC: 0,
        DT: "",
      };
    }
  } catch (e) {
    console.log(e);
    return {
      EM: "something wrongs with services",
      EC: 1,
      DT: "",
    };
  }
};

const deleteUser = async (id) => {
  try {
    let user = await db.USER.findOne({
      where: { _id: id },
    });
    if (user) {
      let AVATAR_PATH = user.AVATAR_PATH;

      if (fs.existsSync(AVATAR_PATH)) {
        fs.unlink(AVATAR_PATH, (err) => {
          if (err) throw err; //handle your error the way you want to;
          console.log("File was deleted: ", AVATAR_PATH); //or else the file will be deleted
        });
      } else {
        console.log("Avatar is not found: ", AVATAR_PATH);
      }

      await user.destroy();

      let findUserRole = await db.USER_ROLE.findOne({
        where: { USER_ID: id },
        raw: true,
      });

      if (findUserRole) {
        await db.USER_ROLE.destroy({
          where: { USER_ID: id },
        });
      }

      return {
        EM: "Delete user success!",
        EC: 0,
        DT: "",
      };
    } else {
      return {
        EM: "User not exist!",
        EC: 1,
        DT: "",
      };
    }
  } catch (e) {
    return {
      EM: "something wrongs with services",
      EC: 1,
      DT: "",
    };
  }
};

const updateUser = async (data, file) => {
  try {
    if (!data || !data.groupId) {
      return {
        EM: "missing paramesters!",
        EC: 1,
        DT: [],
      };
    } else {
      let user = await db.USER.findOne({
        where: { _id: data.userId },
      });
      let linkAvatar = process.env.LINK_AVATAR;
      if (user) {
        if (file) {
          let AVATAR = user.AVATAR_PATH;

          if (fs.existsSync(AVATAR)) {
            fs.unlink(AVATAR, (err) => {
              if (err) throw err; //handle your error the way you want to;
              console.log("File was deleted: ", AVATAR); //or else the file will be deleted
            });
          } else {
            console.log("File is not found: ", AVATAR);
          }

          await user.update({
            USER_LASTNAME: data.lastName ? data.lastName : user.USER_LASTNAME,
            USER_FIRSTNAME: data.firstName
              ? data.firstName
              : user.USER_FIRSTNAME,
            USER_STATUS: +data.status ? +data.status : user.USER_STATUS,
            GROUP_ID: data.groupId ? data.groupId : user.GROUP_ID,
            POSITION_ID: data.positionId ? data.positionId : user.POSITION_ID,
            USER_PHONE: data.phone ? data.phone : user.USER_PHONE,
            USER_GENDER: data.gender ? data.gender : user.USER_GENDER,
            AVATAR_LINK: `${linkAvatar}/${file.filename}`,
            AVATAR_PATH: `${file.destination}/${file.filename}`,
          });
        } else {
          await user.update({
            USER_LASTNAME: data.lastName ? data.lastName : user.USER_LASTNAME,
            USER_FIRSTNAME: data.firstName
              ? data.firstName
              : user.USER_FIRSTNAME,
            USER_STATUS: data.status ? data.status : user.USER_STATUS,
            GROUP_ID: data.groupId ? data.groupId : user.GROUP_ID,
            POSITION_ID: data.positionId ? data.positionId : user.POSITION_ID,
            USER_GENDER: data.gender ? data.gender : user.USER_GENDER,
            USER_PHONE: data.phone ? data.phone : user.USER_PHONE,
          });
        }

        return {
          EM: "Update user success!",
          EC: 0,
          DT: "",
        };
      } else {
        if (file) {
          let AVATAR = file ? `${file.destination}/${file.filename}` : "";

          if (fs.existsSync(AVATAR)) {
            fs.unlink(AVATAR, (err) => {
              if (err) throw err; //handle your error the way you want to;
              console.log("File was deleted: ", AVATAR); //or else the file will be deleted
            });
          } else {
            console.log("File is not found: ", AVATAR);
          }
        }
        return {
          EM: "User not found!",
          EC: 1,
          DT: "",
        };
      }
    }
  } catch (e) {
    console.log(e);
    return {
      EM: "something wrongs this service",
      EC: 2,
      DT: [],
    };
  }
};

const handleBulkUser = async (users) => {
  try {
    let newUsers = users.map((user) => {
      let cloneUser = {
        ...user,
      };
      cloneUser.PASSWORD = hashUserPassword(user.PASSWORD);
      return cloneUser;
    });

    let currentUsers = await db.USER.findAll({
      attributes: ["EMAIL", "USER_PHONE"],
      raw: true,
    });
    const persists = newUsers.filter(
      ({ EMAIL: email1 }) =>
        !currentUsers.some(({ EMAIL: email2 }) => email1 === email2)
    );

    if (persists.length === 0) {
      return {
        EM: "Nothing User to create....",
        EC: 0,
        DT: "",
      };
    }

    await db.USER.bulkCreate(persists);
    return {
      EM: `Create New succeeds ${persists.length} user....`,
      EC: 0,
      DT: "",
    };
  } catch (error) {
    console.log(error);
    return {
      EM: "something wrongs with services",
      EC: 1,
      DT: "",
    };
  }
};

const checkToken = async (token) => {
  let decode = verifyToken(token);
  if (decode) {
    return {
      EM: "Veryfi token Successfully!",
      EC: 0,
      DT: {
        id: decode.id,
        email: decode.email,
        first_name: decode.first_name,
        last_name: decode.last_name,
        avatar: decode.avatar,
        api_token: token,
        groupId: decode.groupId,
      },
    };
  } else {
    return {
      EM: "Veryfi token Fails!",
      EC: 1,
      DT: {},
    };
  }
};

const handleSearchName = async (data) => {
  try {
    if (!data || !data.userName) {
      return {
        EM: "missing paramesters!",
        EC: 1,
        DT: "",
      };
    } else {
      let user = await db.USER.findAll({
        where: {
          USER_FIRSTNAME: {
            [Op.like]: `%${data.userName}%`,
          },
        },
        attributes: [
          "_id",
          "EMAIL",
          "USER_LASTNAME",
          "USER_FIRSTNAME",
          "USER_STATUS",
          "USER_GENDER",
          "USER_PHONE",
          "AVATAR_LINK",
        ],
        include: [
          {
            model: db.GROUP,
            attributes: ["NAME_VI", "NAME_EN", "DESCRIPTION"],
          },
          {
            model: db.POSITION,
            attributes: ["NAME_VI", "NAME_EN", "DESCRIPTION"],
          },
        ],
        order: [["_id", "DESC"]],
      });
      if (user) {
        return {
          EM: "Filter User Success!",
          EC: 0,
          DT: user,
        };
      } else {
        return {
          EM: "Filter User Fail!",
          EC: 1,
          DT: "",
        };
      }
    }
  } catch (e) {
    console.log(e);
    return {
      EM: "something wrongs this service",
      EC: 2,
      DT: "",
    };
  }
};

module.exports = {
  getAllUser,
  getInforUser,
  updateUser,
  deleteUser,
  getUserWithPagination,
  handleCreateUser,
  handleBulkUser,
  handleChangePassword,
  checkToken,
  handleSearchName,
};
