import db from "../models/index";
require("dotenv").config();
import mysql from "mysql2/promise";
import bluebird from "bluebird";
const fs = require("fs");

const handleCreateSideBar = async (data, file) => {
  try {
    if (!data) {
      return {
        EM: "missing paramesters!",
        EC: 1,
        DT: [],
      };
    } else {
      //handle create a new user with avartar
      let linkIcon = process.env.LINK_AVATAR;
      if (file) {
        const connection = await mysql.createConnection({
          user: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_DATABASE_NAME,
          host: process.env.DB_HOST,
          port: process.env.DB_PORT,
          Promise: bluebird,
        });
        const [sidebarOrder, fields] = await connection.execute(
          `SELECT MAX(SORT_ORDER) AS "ORDER" FROM CONTENT_SIDEBAR`
        );

        await db.CONTENT_SIDEBAR.create({
          NAME_VI: data.NAME_VI,
          NAME_EN: data.NAME_EN,
          SIDEBAR_ICON_LINK: `${linkIcon}/${file.filename}`,
          SIDEBAR_ICON_PATH: `${file.destination}/${file.filename}`,
          SORT_ORDER: sidebarOrder[0]?.ORDER ? sidebarOrder[0].ORDER + 1 : 1,
          STATUS: 1,
        });
      } else {
        const connection = await mysql.createConnection({
          user: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_DATABASE_NAME,
          host: process.env.DB_HOST,
          port: process.env.DB_PORT,
          Promise: bluebird,
        });
        const [sidebarOrder, fields] = await connection.execute(
          `SELECT MAX(SORT_ORDER) AS "ORDER" FROM CONTENT_SIDEBAR`
        );
        console.log("check data order", sidebarOrder);
        await db.CONTENT_SIDEBAR.create({
          NAME_VI: data.NAME_VI,
          NAME_EN: data.NAME_EN,
          SORT_ORDER: sidebarOrder[0]?.ORDER ? sidebarOrder[0].ORDER + 1 : 1,
          STATUS: 1,
        });
      }

      return {
        EM: "Create new a sidebar success!",
        EC: 0,
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

const handleDeleteSideBar = async (id) => {
  try {
    let content_sidebar = await db.CONTENT_SIDEBAR.findOne({
      where: { id: id },
      raw: true,
    });

    if (content_sidebar && content_sidebar.STATUS === 0) {
      await db.CONTENT_SIDEBAR.destroy({ where: { id: content_sidebar.id } });
      return {
        EM: "Delete sideBar App success!",
        EC: 0,
        DT: "",
      };
    }

    let sidebarAll = await db.CONTENT_SIDEBAR.findAll({
      raw: true,
      order: [["SORT_ORDER", "ASC"]],
    });

    const targetIndex = sidebarAll.findIndex(
      (item) => item.id === content_sidebar.id
    );
    // Tạo mảng trước và sau phần tử tìm thấy
    const arrayAfterTarget = sidebarAll.slice(targetIndex + 1);

    if (arrayAfterTarget && arrayAfterTarget.length > 0) {
      for (let i = 0; i < arrayAfterTarget.length; i++) {
        await db.CONTENT_SIDEBAR.update(
          { SORT_ORDER: arrayAfterTarget[i].SORT_ORDER - 1 },
          { where: { id: arrayAfterTarget[i].id } }
        );
      }
    }

    if (content_sidebar) {
      await db.CONTENT_SIDEBAR.destroy({ where: { id: content_sidebar.id } });

      if (content_sidebar.SIDEBAR_ICON_PATH) {
        let channelDelete = content_sidebar.SIDEBAR_ICON_PATH;

        if (fs.existsSync(channelDelete)) {
          fs.unlink(channelDelete, (err) => {
            if (err) throw err; //handle your error the way you want to;
            console.log("File was deleted: ", channelDelete); //or else the file will be deleted
          });
        } else {
          console.log("File is not found: ", channelDelete);
        }
      }
      return {
        EM: "Delete content_sidebar success!",
        EC: 0,
        DT: [],
      };
    } else {
      return {
        EM: "Content_sidebar not exist!",
        EC: 1,
        DT: [],
      };
    }
  } catch (e) {
    return {
      EM: "something wrongs with services",
      EC: 1,
      DT: [],
    };
  }
};

const getAllSideBar = async () => {
  try {
    let sibars = await db.CONTENT_SIDEBAR.findAll({
      attributes: [
        "id",
        "NAME_VI",
        "NAME_EN",
        "CONTENT_ICON_LINK",
        "CONTENT_ICON_IMG",
        "SORT_ORDER",
        "URL_SIDEBAR",
        "STATUS",
        "NOTE",
      ],
      order: [["SORT_ORDER", "ASC"]],
    });
    if (sibars) {
      return {
        EM: "get all sidebar success!",
        EC: 0,
        DT: groups,
      };
    } else {
      return {
        EM: "get all sidebar Fail",
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

const getSideBarWithPagination = async (page, limit) => {
  try {
    let offset = (page - 1) * limit;
    const { count, rows } = await db.CONTENT_SIDEBAR.findAndCountAll({
      offset: offset,
      limit: limit,
      attributes: [
        "id",
        "NAME_VI",
        "NAME_EN",
        "SIDEBAR_ICON_LINK",
        "SIDEBAR_CLASS",
        "SORT_ORDER",
        "URL_SIDEBAR",
        "STATUS",
        "NOTE",
      ],
      order: [["SORT_ORDER", "ASC"]],
    });
    let totalPages = Math.ceil(count / limit);
    let data = {
      meta: {
        current: page,
        pageSize: limit,
        pages: totalPages,
        total: count,
      },
      sidebar: rows,
    };
    return {
      EM: "pagination sidebar success",
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

const handleBulkGroup = async (groups) => {
  try {
    let currentGroup = await db.GROUP.findAll({
      attributes: ["NAME_VI", "NAME_EN", "DESCRIPTION"],
      raw: true,
    });
    const persists = groups.filter(
      ({ NAME_EN: NAME_EN1 }) =>
        !currentGroup.some(({ NAME_EN: NAME_EN2 }) => NAME_EN1 === NAME_EN2)
    );

    if (persists.length === 0) {
      return {
        EM: "Nothing Group to create....",
        EC: 0,
        DT: [],
      };
    }

    await db.GROUP.bulkCreate(persists);
    return {
      EM: `Create New succeeds ${persists.length} Group....`,
      EC: 0,
      DT: [],
    };
  } catch (error) {
    console.log(error);
    return {
      EM: "something wrongs with services",
      EC: 1,
      DT: [],
    };
  }
};

const handleUpdateSideBar = async (data, file) => {
  try {
    if (!data) {
      return {
        EM: "missing paramesters!",
        EC: 1,
        DT: [],
      };
    } else {
      let sidebar = await db.CONTENT_SIDEBAR.findOne({
        where: { id: data.id },
        raw: true,
      });
      let sidebarAll = await db.CONTENT_SIDEBAR.findAll({
        raw: true,
        order: [["SORT_ORDER", "ASC"]],
      });

      if (+data.SORT_ORDER > sidebar.SORT_ORDER) {
        // Ex: data : stt = 3 vs order old = 2
        if (sidebar) {
          const targetIndex = sidebarAll.findIndex(
            (item) => item.id === sidebar.id
          );
          // Tạo mảng trước và sau phần tử tìm thấy
          if (+data.SORT_ORDER > sidebarAll[sidebarAll.length - 1].SORT_ORDER) {
            return {
              EM: "Update sidebar app Fail!, số thứ tự được chọn lớn hơn phần tử lớn nhất ",
              EC: 1,
              DT: "",
            };
          }

          let endIndex = data.SORT_ORDER - sidebar.SORT_ORDER;
          const arrayAfterTarget = sidebarAll.slice(
            targetIndex + 1,
            targetIndex + endIndex + 1
          );
          if (arrayAfterTarget && arrayAfterTarget.length > 0) {
            for (let i = 0; i < arrayAfterTarget.length; i++) {
              await db.CONTENT_SIDEBAR.update(
                { SORT_ORDER: arrayAfterTarget[i].SORT_ORDER - 1 },
                { where: { id: arrayAfterTarget[i].id } }
              );
            }
          }
        }
      } else if (+data.SORT_ORDER < sidebar.SORT_ORDER) {
        // Ex: data : stt = 2 vs order old = 3
        let sidebarOrderNew = await db.CONTENT_SIDEBAR.findOne({
          where: { SORT_ORDER: +data.SORT_ORDER },
          raw: true,
        });
        let endIndex = sidebar.SORT_ORDER - sidebarOrderNew.SORT_ORDER;
        if (sidebarOrderNew) {
          const targetIndex = sidebarAll.findIndex(
            (item) => item.id === sidebarOrderNew.id
          );

          const arrayAfterTarget = sidebarAll.slice(
            targetIndex,
            targetIndex + endIndex
          );

          if (arrayAfterTarget && arrayAfterTarget.length > 0) {
            for (let i = 0; i < arrayAfterTarget.length; i++) {
              await db.CONTENT_SIDEBAR.update(
                { SORT_ORDER: arrayAfterTarget[i].SORT_ORDER + 1 },
                { where: { id: arrayAfterTarget[i].id } }
              );
            }
          }
        }
      }

      let linkIcon = process.env.LINK_ICON;
      if (sidebar) {
        if (file) {
          let ICON = sidebar.SIDEBAR_ICON_PATH;
          if (fs.existsSync(ICON)) {
            fs.unlink(ICON, (err) => {
              if (err) throw err; //handle your error the way you want to;
              console.log("File was deleted: ", ICON); //or else the file will be deleted
            });
          } else {
            console.log("File is not found: ", ICON);
          }

          await db.CONTENT_SIDEBAR.update(
            {
              NAME_VI: data.NAME_VI,
              NAME_EN: data.NAME_EN,
              SORT_ORDER: +data.SORT_ORDER,
              SIDEBAR_ICON_LINK: `${linkIcon}/${file.filename}`,
              SIDEBAR_ICON_PATH: `${file.destination}/${file.filename}`,
            },
            { where: { id: +data.id } }
          );
        } else {
          await db.CONTENT_SIDEBAR.update(
            {
              NAME_VI: data.NAME_VI,
              NAME_EN: data.NAME_EN,
              SORT_ORDER: +data.SORT_ORDER,
            },
            { where: { id: +data.id } }
          );
        }

        return {
          EM: "Update sidebar app success!",
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
          EM: "Sidebar not found!",
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

const handleUpdateStatusSideBar = async (data) => {
  try {
    if (!data) {
      return {
        EM: "missing paramesters!",
        EC: 1,
        DT: [],
      };
    } else {
      let sidebar = await db.CONTENT_SIDEBAR.findOne({
        where: { id: data.id },
        raw: true,
      });

      if (sidebar) {
        if (data.status) {
          await db.CONTENT_SIDEBAR.update(
            {
              STATUS: 1,
            },
            { where: { id: +data.id } }
          );
        } else {
          await db.CONTENT_SIDEBAR.update(
            {
              STATUS: 0,
            },
            { where: { id: +data.id } }
          );
        }

        return {
          EM: "Update sidebar app success!",
          EC: 0,
          DT: "",
        };
      } else {
        return {
          EM: "Update sidebar app fail, sidebar is not found!",
          EC: 0,
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

module.exports = {
  handleCreateSideBar,
  handleDeleteSideBar,
  getAllSideBar,
  getSideBarWithPagination,
  handleBulkGroup,
  handleUpdateSideBar,
  handleUpdateStatusSideBar,
};
