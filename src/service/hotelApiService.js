import db from "../models/index";
require("dotenv").config();
import { Op } from "sequelize";
// import fs from ('fs');
import mysql from "mysql2/promise";
import bluebird from "bluebird";
const fs = require("fs");

const handleCreateAHotelBK = async (data, files) => {
  try {
    if (!data || !files) {
      return {
        EM: "missing paramesters!",
        EC: 1,
        DT: [],
      };
    } else {
      //handle create a new hotel with logo

      if (files) {
        let linkAvatar = process.env.LINK_AVATAR;
        let logoHorizontal = files.logoHorizontal[0]
          ? `${linkAvatar}/${files.logoHorizontal[0].filename}`
          : "";
        let logoVertical = files.logoVertical[0]
          ? `${linkAvatar}/${files.logoVertical[0].filename}`
          : "";
        let logoMin = files.logoMin[0]
          ? `${linkAvatar}/${files.logoMin[0].filename}`
          : "";

        let logoHorizontalPath = files.logoHorizontal[0]
          ? `${files.logoHorizontal[0].destination}/${files.logoHorizontal[0].filename}`
          : "";
        let logoVerticalPath = files.logoVertical[0]
          ? `${files.logoVertical[0].destination}/${files.logoVertical[0].filename}`
          : "";
        let logoMinPath = files.logoMin[0]
          ? `${files.logoMin[0].destination}/${files.logoMin[0].filename}`
          : "";
        await db.HOTEL.create({
          HOTEL_NAME: data.hotelName,
          ADDRESS: data.address,
          HOTLINE: data.hotline,
          HOTEL_START: data.hotelStart,
          LATITUDE: data.latitude,
          LONGGITUDE: data.longgitude,
          DEVICE_COUNT: +data.deviceCount,
          SLOGAN_VI: data.sloganVi,
          SLOGAN_EN: data.sloganEn,
          LOGO_HORIZONTAL_LINK: logoHorizontal,
          LOGO_VERTICAL_LINK: logoVertical,
          LOGO_MIN_LINK: logoMin,
          LOGO_HORIZONTAL_PATH: logoHorizontalPath,
          LOGO_VERTICAL_PATH: logoVerticalPath,
          LOGO_MIN_PATH: logoMinPath,
        });
      }

      return {
        EM: "Create Hotel success!",
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
const handleCreateAHotel = async (data, file) => {
  try {
    if (!data) {
      return {
        EM: "missing paramesters!",
        EC: 1,
        DT: [],
      };
    } else {
      //handle create a new hotel with logo

      if (file) {
        let linkAvatar = process.env.LINK_AVATAR;
        await db.HOTEL.create({
          HOTEL_NAME: data.HOTEL_NAME,
          ADDRESS: data.ADDRESS,
          HOTLINE: data.HOTLINE,
          LOGO_HORIZONTAL_PATH: `${file.destination}/${file.filename}`,
          LOGO_HORIZONTAL_LINK: `${linkAvatar}/${file.filename}`,
        });
      } else {
        await db.HOTEL.create({
          HOTEL_NAME: data.HOTEL_NAME,
          ADDRESS: data.ADDRESS,
          HOTLINE: data.HOTLINE,
        });
      }

      return {
        EM: "Create Hotel success!",
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

const handleDeleteAHotel = async (id) => {
  try {
    let hotel = await db.HOTEL.findOne({
      where: { id: id },
    });

    if (hotel) {
      let LOGO_HORIZONTAL_PATH = hotel.LOGO_HORIZONTAL_PATH;

      if (fs.existsSync(LOGO_HORIZONTAL_PATH)) {
        fs.unlink(LOGO_HORIZONTAL_PATH, (err) => {
          if (err) throw err; //handle your error the way you want to;
          console.log("File was deleted: ", LOGO_HORIZONTAL_PATH); //or else the file will be deleted
        });
      } else {
        console.log("File is not found: ", LOGO_HORIZONTAL_PATH);
      }

      await hotel.destroy();
      return {
        EM: "Delete hotel success!",
        EC: 0,
        DT: [],
      };
    } else {
      return {
        EM: "Hotel is not exist!",
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

const handleGetAllHotel = async () => {
  try {
    let hotels = await db.HOTEL.findAll({
      attributes: [
        "id",
        "HOTEL_NAME",
        "ADDRESS",
        "HOTLINE",
        "HOTEL_START",
        "LATITUDE",
        "LONGGITUDE",
        "SLOGAN_VI",
        "SLOGAN_EN",
        "LOGO_HORIZONTAL_LINK",
        "LOGO_VERTICAL_LINK",
        "LOGO_MIN_LINK",
      ],

      order: [["id", "DESC"]],
    });
    if (hotels) {
      return {
        EM: "get All Hotel Success!",
        EC: 0,
        DT: hotels,
      };
    } else {
      return {
        EM: "get All Hotel Fail",
        EC: 1,
        DT: [],
      };
    }
  } catch (e) {
    console.log("check hotel: ", e);
    return {
      EM: "something wrongs with services",
      EC: 1,
      DT: [],
    };
  }
};

const handleGetAllHotelWithPagination = async (page, limit) => {
  try {
    let offset = (page - 1) * limit;
    const { count, rows } = await db.HOTEL.findAndCountAll({
      offset: offset,
      limit: limit,
      attributes: [
        "id",
        "HOTEL_NAME",
        "ADDRESS",
        "HOTLINE",
        "HOTEL_START",
        "LATITUDE",
        "LONGGITUDE",
        "SLOGAN_VI",
        "SLOGAN_EN",
        "LOGO_HORIZONTAL_LINK",
        "LOGO_VERTICAL_LINK",
        "LOGO_MIN_LINK",
      ],

      order: [["id", "DESC"]],
    });
    let totalPages = Math.ceil(count / limit);
    // console.log(page, limit, count, rows);
    let data = {
      meta: {
        current: page,
        pageSize: limit,
        pages: totalPages,
        total: count,
      },
      hotels: rows,
    };
    return {
      EM: "Get hotel with pagination success",
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

const handleUpdateAHotel = async (data, file) => {
  try {
    if (!data) {
      return {
        EM: "missing paramesters!",
        EC: 1,
        DT: [],
      };
    } else {
      let hotel = await db.HOTEL.findOne({
        where: { id: +data.id },
      });
      let linkAvatar = process.env.LINK_AVATAR;
      if (hotel) {
        if (file) {
          if (fs.existsSync(hotel.LOGO_HORIZONTAL_PATH)) {
            fs.unlink(hotel.LOGO_HORIZONTAL_PATH, (err) => {
              if (err) throw err; //handle your error the way you want to;
              console.log(
                "LOGO_HORIZONTAL_PATH was deleted: ",
                hotel.LOGO_HORIZONTAL_PATH
              ); //or else the file will be deleted
            });
          } else {
            console.log("File is not found: ", hotel.LOGO_HORIZONTAL_PATH);
          }
          await hotel.update({
            HOTEL_NAME: data.HOTEL_NAME,
            ADDRESS: data.ADDRESS,
            HOTLINE: data.HOTLINE,
            LOGO_HORIZONTAL_PATH: `${file.destination}/${file.filename}`,
            LOGO_HORIZONTAL_LINK: `${linkAvatar}/${file.filename}`,
          });

          return {
            EM: "Update hotel success!",
            EC: 0,
            DT: "",
          };
        } else {
          await hotel.update({
            HOTEL_NAME: data.HOTEL_NAME,
            ADDRESS: data.ADDRESS,
            HOTLINE: data.HOTLINE,
          });
          return {
            EM: "Update hotel success!",
            EC: 0,
            DT: "",
          };
        }
      } else {
        return {
          EM: "Hotel is not found!",
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

const handleUpdateAHotelBK = async (data, files) => {
  try {
    if (!data) {
      return {
        EM: "missing paramesters!",
        EC: 1,
        DT: [],
      };
    } else {
      let hotel = await db.HOTEL.findOne({
        where: { id: data.id },
      });
      let linkAvatar = process.env.LINK_AVATAR;
      if (hotel) {
        if (files) {
          let logoHorizontal =
            files.logoHorizontal && files.logoHorizontal[0]
              ? `${linkAvatar}/${files.logoHorizontal[0].filename}`
              : hotel.LOGO_HORIZONTAL_LINK;
          let logoVertical =
            files.logoVertical && files.logoVertical[0]
              ? `${linkAvatar}/${files.logoVertical[0].filename}`
              : hotel.LOGO_VERTICAL_LINK;
          let logoMin =
            files.logoMin && files.logoMin[0]
              ? `${linkAvatar}/${files.logoMin[0].filename}`
              : hotel.LOGO_MIN_LINK;

          let logoHorizontalPath =
            files.logoHorizontal && files.logoHorizontal[0]
              ? `${files.logoHorizontal[0].destination}/${files.logoHorizontal[0].filename}`
              : hotel.LOGO_HORIZONTAL_PATH;
          let logoVerticalPath =
            files.logoVertical && files.logoVertical[0]
              ? `${files.logoVertical[0].destination}/${files.logoVertical[0].filename}`
              : hotel.LOGO_VERTICAL_PATH;
          let logoMinPath =
            files.logoMin && files.logoMin[0]
              ? `${files.logoMin[0].destination}/${files.logoMin[0].filename}`
              : hotel.LOGO_MIN_PATH;

          if (
            files.logoHorizontal &&
            files.logoHorizontal[0] &&
            files.logoHorizontal[0].filename
          ) {
            if (fs.existsSync(hotel.LOGO_HORIZONTAL_PATH)) {
              fs.unlink(hotel.LOGO_HORIZONTAL_PATH, (err) => {
                if (err) throw err; //handle your error the way you want to;
                console.log(
                  "LOGO_HORIZONTAL_PATH was deleted: ",
                  hotel.LOGO_HORIZONTAL_PATH
                ); //or else the file will be deleted
              });
            } else {
              console.log("File is not found: ", hotel.LOGO_HORIZONTAL_PATH);
            }
          }
          if (
            files.logoVertical &&
            files.logoVertical[0] &&
            files.logoVertical[0].filename
          ) {
            if (fs.existsSync(hotel.LOGO_VERTICAL_PATH)) {
              fs.unlink(hotel.LOGO_VERTICAL_PATH, (err) => {
                if (err) throw err; //handle your error the way you want to;
                console.log(
                  "LOGO_VERTICAL_PATH was deleted: ",
                  hotel.LOGO_VERTICAL_PATH
                ); //or else the file will be deleted
              });
            } else {
              console.log("File is not found: ", hotel.LOGO_VERTICAL_PATH);
            }
          }
          if (files.logoMin && files.logoMin[0] && files.logoMin[0].filename) {
            if (fs.existsSync(hotel.LOGO_MIN_PATH)) {
              fs.unlink(hotel.LOGO_MIN_PATH, (err) => {
                if (err) throw err; //handle your error the way you want to;
                console.log("LOGO_MIN_PATH was deleted: ", hotel.LOGO_MIN_PATH); //or else the file will be deleted
              });
            } else {
              console.log("File is not found: ", hotel.LOGO_MIN_PATH);
            }
          }

          await hotel.update({
            HOTEL_NAME: data.hotelName ? data.hotelName : hotel.hotelName,
            ADDRESS: data.address ? data.address : hotel.address,
            HOTLINE: data.hotline ? data.hotline : hotel.hotline,
            HOTEL_START: data.hotelStart ? data.hotelStart : hotel.hotelStart,
            LATITUDE: data.latitude ? data.latitude : hotel.latitude,
            LONGGITUDE: data.longgitude ? data.longgitude : hotel.longgitude,
            DEVICE_COUNT: +data.deviceCount
              ? +data.deviceCount
              : hotel.deviceCount,
            SLOGAN_VI: data.sloganVi ? data.sloganVi : hotel.sloganVi,
            SLOGAN_EN: data.sloganEn ? data.sloganEn : hotel.sloganEn,
            LOGO_HORIZONTAL_LINK: logoHorizontal,
            LOGO_VERTICAL_LINK: logoVertical,
            LOGO_MIN_LINK: logoMin,
            LOGO_HORIZONTAL_PATH: logoHorizontalPath,
            LOGO_VERTICAL_PATH: logoVerticalPath,
            LOGO_MIN_PATH: logoMinPath,
          });
        }
        return {
          EM: "Update hotel success!",
          EC: 0,
          DT: "",
        };
      } else {
        if (files) {
          let logoHorizontalPath =
            files.logoHorizontal && files.logoHorizontal[0]
              ? `${files.logoHorizontal[0].destination}/${files.logoHorizontal[0].filename}`
              : "";
          let logoVerticalPath =
            files.logoVertical && files.logoVertical[0]
              ? `${files.logoVertical[0].destination}/${files.logoVertical[0].filename}`
              : "";
          let logoMinPath =
            files.logoMin && files.logoMin[0]
              ? `${files.logoMin[0].destination}/${files.logoMin[0].filename}`
              : "";

          if (
            files.logoHorizontal &&
            files.logoHorizontal[0] &&
            files.logoHorizontal[0].filename
          ) {
            if (fs.existsSync(logoHorizontalPath)) {
              fs.unlink(logoHorizontalPath, (err) => {
                if (err) throw err; //handle your error the way you want to;
                console.log(
                  "LOGO_HORIZONTAL_PATH was deleted: ",
                  logoHorizontalPath
                ); //or else the file will be deleted
              });
            } else {
              console.log("File is not found: ", logoHorizontalPath);
            }
          }
          if (
            files.logoVertical &&
            files.logoVertical[0] &&
            files.logoVertical[0].filename
          ) {
            if (fs.existsSync(logoVerticalPath)) {
              fs.unlink(logoVerticalPath, (err) => {
                if (err) throw err; //handle your error the way you want to;
                console.log(
                  "LOGO_VERTICAL_PATH was deleted: ",
                  logoVerticalPath
                ); //or else the file will be deleted
              });
            } else {
              console.log("File is not found: ", logoVerticalPath);
            }
          }
          if (files.logoMin && files.logoMin[0] && files.logoMin[0].filename) {
            if (fs.existsSync(logoMinPath)) {
              fs.unlink(logoMinPath, (err) => {
                if (err) throw err; //handle your error the way you want to;
                console.log("LOGO_MIN_PATH was deleted: ", logoMinPath); //or else the file will be deleted
              });
            } else {
              console.log("File is not found: ", logoMinPath);
            }
          }
        }

        return {
          EM: "Hotel is not found!",
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

const handleCreateCategoryChannel = async (data) => {
  try {
    if (!data) {
      return {
        EM: "missing paramesters!",
        EC: 1,
        DT: "",
      };
    } else {
      //handle create a new hotel with logo
      const connection = await mysql.createConnection({
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE_NAME,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        Promise: bluebird,
      });
      const [channelOldMax, fields] = await connection.execute(
        `SELECT MAX(SORT_ORDER) AS "SORT_ORDER" FROM CHANNEL_CATE`
      );

      await db.CHANNEL_CATE.create({
        CATE_NAME_EN: data.CATE_NAME_EN,
        CATE_NAME_VI: data.CATE_NAME_VI,
        // SORT_ORDER: data.SORT_ORDER,
        SORT_ORDER: channelOldMax[0].SORT_ORDER + 1,
        CATE_STATUS: 1,
      });

      return {
        EM: "Create Category Channel success!",
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

const handleGetCategoryChannel = async () => {
  try {
    let categoryChannel = await db.CHANNEL_CATE.findAll({
      order: [["SORT_ORDER", "ASC"]],
    });
    if (categoryChannel) {
      return {
        EM: "get All Category Channel Success!",
        EC: 0,
        DT: categoryChannel,
      };
    } else {
      return {
        EM: "get All Category Channel Fail",
        EC: 1,
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

const handleUpdateCategoryChannel = async (data) => {
  try {
    if (!data) {
      return {
        EM: "missing paramesters!",
        EC: 1,
        DT: "",
      };
    } else {
      let categoryChannel = await db.CHANNEL_CATE.findOne({
        where: { id: data.id },
        raw: true,
      });
      let categoryChannelAll = await db.CHANNEL_CATE.findAll({
        raw: true,
        order: [["SORT_ORDER", "ASC"]],
      });

      if (data.SORT_ORDER > categoryChannel.SORT_ORDER) {
        if (
          +data.SORT_ORDER >
          categoryChannelAll[categoryChannelAll.length - 1].SORT_ORDER
        ) {
          return {
            EM: "Update category channel hotel Fail!, số thứ tự được chọn lớn hơn phần tử lớn nhất ",
            EC: 1,
            DT: "",
          };
        }
        const targetIndex = categoryChannelAll.findIndex(
          (item) => item.id === categoryChannel.id
        );
        // Tạo mảng trước và sau phần tử tìm thấy
        let endIndex = +data.SORT_ORDER - categoryChannel.SORT_ORDER;

        const arrayAfterTarget = categoryChannelAll.slice(
          targetIndex + 1,
          targetIndex + endIndex + 1
        );

        if (arrayAfterTarget && arrayAfterTarget.length > 0) {
          for (let i = 0; i < arrayAfterTarget.length; i++) {
            await db.CHANNEL_CATE.update(
              { SORT_ORDER: arrayAfterTarget[i].SORT_ORDER - 1 },
              { where: { id: arrayAfterTarget[i].id } }
            );
          }
        }
      } else if (+data.SORT_ORDER < categoryChannel.SORT_ORDER) {
        // Ex: data : stt = 2 vs order old = 3

        let categoryOrderNew = await db.CHANNEL_CATE.findOne({
          where: { SORT_ORDER: +data.SORT_ORDER },
          raw: true,
        });

        if (categoryOrderNew) {
          let endIndexExtend =
            categoryChannel.SORT_ORDER - categoryOrderNew.SORT_ORDER;

          const targetIndex = categoryChannelAll.findIndex(
            (item) => item.id === categoryOrderNew.id
          );

          const arrayAfterTarget = categoryChannelAll.slice(
            targetIndex,
            targetIndex + endIndexExtend
          );

          if (arrayAfterTarget && arrayAfterTarget.length > 0) {
            for (let i = 0; i < arrayAfterTarget.length; i++) {
              await db.CHANNEL_CATE.update(
                { SORT_ORDER: arrayAfterTarget[i].SORT_ORDER + 1 },
                { where: { id: arrayAfterTarget[i].id } }
              );
            }
          }
        }
      }

      ////
      if (categoryChannel) {
        await db.CHANNEL_CATE.update(
          {
            CATE_NAME_EN: data.CATE_NAME_EN
              ? data.CATE_NAME_EN
              : categoryChannel.CATE_NAME_EN,
            CATE_NAME_VI: data.CATE_NAME_VI
              ? data.CATE_NAME_VI
              : categoryChannel.CATE_NAME_VI,
            SORT_ORDER: data.SORT_ORDER
              ? data.SORT_ORDER
              : categoryChannel.SORT_ORDER,
            CATE_STATUS: data.CATE_STATUS ? 1 : 0,
          },
          { where: { id: data.id } }
        );
        return {
          EM: "Update category channel success!",
          EC: 0,
          DT: "",
        };
      } else {
        return {
          EM: "Category channel is not found!",
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

const handleDeleteCategoryChannel = async (id) => {
  try {
    let categoryChannel = await db.CHANNEL_CATE.findOne({
      where: { id: id },
      raw: true,
    });

    let categoryChannelAll = await db.CHANNEL_CATE.findAll({
      raw: true,
      order: [["SORT_ORDER", "ASC"]],
    });

    const targetIndex = categoryChannelAll.findIndex(
      (item) => item.id === categoryChannel.id
    );

    const arrayAfterTarget = categoryChannelAll.slice(targetIndex + 1);

    if (arrayAfterTarget && arrayAfterTarget.length > 0) {
      for (let i = 0; i < arrayAfterTarget.length; i++) {
        await db.CHANNEL_CATE.update(
          { SORT_ORDER: arrayAfterTarget[i].SORT_ORDER - 1 },
          { where: { id: arrayAfterTarget[i].id } }
        );
      }
    }

    if (categoryChannel) {
      await db.CHANNEL_CATE.destroy({
        where: { id: id },
      });
      return {
        EM: "Delete categoryChannel success!",
        EC: 0,
        DT: "",
      };
    } else {
      return {
        EM: "categoryChannel is not exist!",
        EC: 1,
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

const handleCreateChannel = async (data, file) => {
  try {
    if (!data) {
      return {
        EM: "missing paramesters!",
        EC: 1,
        DT: "",
      };
    } else {
      let channelCheck = await db.CHANNEL.findOne({
        where: { CHANNEL_NAME_EN: data.CHANNEL_NAME_EN },
        raw: true,
      });

      if (channelCheck) {
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
          EM: "Channel is Exist Please check again!",
          EC: 1,
          DT: "",
        };
      } else {
        if (file) {
          let linkAvatar = process.env.LINK_AVATAR;
          const connection = await mysql.createConnection({
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE_NAME,
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            Promise: bluebird,
          });
          const [channelOldMax, fields] = await connection.execute(
            `SELECT MAX(CHANNEL_ORDER) AS "CHANNEL_ORDER" FROM CHANNEL`
          );

          await db.CHANNEL.create({
            CHANNEL_NAME_EN: data.CHANNEL_NAME_EN,
            CHANNEL_NAME_VI: data.CHANNEL_NAME_VI,
            CHANNEL_URL_HLS: data.CHANNEL_URL_HLS ? data.CHANNEL_URL_HLS : "",
            CHANNEL_PATH: `${file.destination}/${file.filename}`,
            CHANNEL_LINK: `${linkAvatar}/${file.filename}`,
            CHANNEL_MULTICAST_URL:
              data.MULTICAST_IP && data.MULTICAST_PORT
                ? `udp://${data.MULTICAST_IP}/${data.MULTICAST_PORT}`
                : "",
            CHANNEL_STATUS: 1,
            MULTICAST_IP: data.MULTICAST_IP,
            MULTICAST_PORT: data.MULTICAST_PORT,
            CHANNEL_ORDER: channelOldMax[0].CHANNEL_ORDER
              ? channelOldMax[0].CHANNEL_ORDER + 1
              : 1,
          });

          const [countIdMaxChannel, fieldMax] = await connection.execute(
            `SELECT MAX(id) AS ID FROM CHANNEL`
          );

          const [countOrderChannel, orderChannel] = await connection.execute(
            `SELECT MAX(CHANNEL_ORDER) AS "ORDER" FROM CHANNEL_CATE_MAP WHERE CATE_ID = ${data.category_id}`
          );

          if (countIdMaxChannel) {
            await db.CHANNEL_CATE_MAP.create({
              CHANNEL_ID: countIdMaxChannel[0].ID,
              CATE_ID: data.category_id,
              CHANNEL_ORDER: countOrderChannel[0].ORDER
                ? countOrderChannel[0].ORDER + 1
                : 1,
            });
          }
        } else {
          const connection = await mysql.createConnection({
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE_NAME,
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            Promise: bluebird,
          });
          const [channelOldMax, channelOld] = await connection.execute(
            `SELECT MAX(CHANNEL_ORDER) AS "CHANNEL_ORDER" FROM CHANNEL`
          );

          await db.CHANNEL.create({
            CHANNEL_NAME_EN: data.CHANNEL_NAME_EN,
            CHANNEL_NAME_VI: data.CHANNEL_NAME_VI,
            CHANNEL_URL_HLS: data.CHANNEL_URL_HLS ? data.CHANNEL_URL_HLS : "",
            CHANNEL_PATH: "",
            CHANNEL_LINK: "",
            CHANNEL_MULTICAST_URL:
              data.MULTICAST_IP && data.MULTICAST_PORT
                ? data.MULTICAST_IP + data.MULTICAST_PORT
                : "",
            CHANNEL_STATUS: 1,
            MULTICAST_IP: data.MULTICAST_IP,
            MULTICAST_PORT: data.MULTICAST_PORT,
            CHANNEL_ORDER: channelOldMax[0].CHANNEL_ORDER + 1,
          });

          const [countIdMaxChannel, fields] = await connection.execute(
            `SELECT MAX(id) AS ID FROM CHANNEL;`
          );
          const [countOrderChannel, orderChannel] = await connection.execute(
            `SELECT MAX(CHANNEL_ORDER) AS "ORDER"
             FROM CHANNEL_CATE_MAP WHERE CATE_ID = ${data.category_id}`
          );

          if (countIdMaxChannel) {
            await db.CHANNEL_CATE_MAP.create({
              CHANNEL_ID: countIdMaxChannel[0].ID,
              CATE_ID: data.category_id,
              CHANNEL_ORDER: countOrderChannel[0].ORDER
                ? countOrderChannel[0].ORDER + 1
                : 1,
            });
          }
        }
        return {
          EM: "Create Channel success!",
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
      DT: "",
    };
  }
};

const handleCreateInformationHotel = async (data, file) => {
  try {
    if (!data) {
      return {
        EM: "missing paramesters!",
        EC: 1,
        DT: "",
      };
    } else {
      if (file) {
        let linkAvatar = process.env.LINK_AVATAR;
        await db.INFORMATION_HOTEL.create({
          SUBJECT: data.SUBJECT,
          OPEN_LETTER_VI: data.OPEN_LETTER_VI,
          CONTENT_TITLE_VI: data.CONTENT_TITLE_VI,
          BACKGROUND_PATH: `${file.destination}/${file.filename}`,
          BACKGROUND_LINK: `${linkAvatar}/${file.filename}`,
          OPEN_LETTER_EN: data.OPEN_LETTER_EN,
          STATUS: 1,
          CONTENT_TITLE_EN: data.CONTENT_TITLE_EN,
        });

        return {
          EM: "Create Channel success!",
          EC: 0,
          DT: "",
        };
      } else {
        await db.INFORMATION_HOTEL.create({
          SUBJECT: data.SUBJECT,
          OPEN_LETTER_VI: data.OPEN_LETTER_VI,
          CONTENT_TITLE_VI: data.CONTENT_TITLE_VI,
          OPEN_LETTER_EN: data.OPEN_LETTER_EN,
          STATUS: 1,
          CONTENT_TITLE_EN: data.CONTENT_TITLE_EN,
        });

        return {
          EM: "Create Channel success!",
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
      DT: "",
    };
  }
};

const getChannelWithPagination = async (current, pageSize, id) => {
  try {
    let offset = (current - 1) * pageSize;
    let countChannel = await db.CHANNEL.count({
      // where: { CHANNEL_STATUS: 1 },
      distinct: true,
      col: "id",
    });
    let groupGetLinkAccept = await db.USER.findOne({
      attributes: [],
      include: [
        {
          model: db.GROUP,
          attributes: ["NAME_VI"],
        },
      ],
      where: { _id: id },
      raw: true,
    });
    // console.log(groupGetLinkAccept["GROUP.NAME_VI"]);
    if (
      groupGetLinkAccept &&
      groupGetLinkAccept["GROUP.NAME_VI"] === "Supper Admin"
    ) {
      const { count, rows } = await db.CHANNEL.findAndCountAll({
        offset: offset,
        limit: pageSize,
        attributes: [
          "id",
          "CHANNEL_ORDER",
          "CHANNEL_NAME_VI",
          "CHANNEL_NAME_EN",
          "CHANNEL_STATUS",
          "CHANNEL_LINK",
          "CHANNEL_URL_HLS",
          "CHANNEL_MULTICAST_URL",
          "MULTICAST_IP",
          "MULTICAST_PORT",
        ],

        include: [
          {
            model: db.CHANNEL_CATE,
            attributes: ["id", "CATE_NAME_VI", "CATE_NAME_EN", "CATE_STATUS"],
            // where: { CATE_STATUS: 1 },
            through: { attributes: ["CHANNEL_ORDER"] },
          },
        ],
        // where: { CHANNEL_STATUS: 1 },
        order: [["CHANNEL_ORDER", "ASC"]],
      });
      let totalPages = Math.ceil(count / pageSize);
      let data = {
        meta: {
          current: current,
          pageSize: pageSize,
          pages: totalPages,
          total: countChannel,
        },
        channels: rows,
      };
      return {
        EM: "pagination success",
        EC: 0,
        DT: data,
      };
    } else {
      const { count, rows } = await db.CHANNEL.findAndCountAll({
        offset: offset,
        limit: pageSize,
        attributes: [
          "id",
          "CHANNEL_ORDER",
          "CHANNEL_NAME_VI",
          "CHANNEL_NAME_EN",
          "CHANNEL_STATUS",
          "CHANNEL_LINK",
        ],

        include: [
          {
            model: db.CHANNEL_CATE,
            attributes: ["id", "CATE_NAME_VI", "CATE_NAME_EN", "CATE_STATUS"],
            // where: { CATE_STATUS: 1 },
            through: { attributes: ["CHANNEL_ORDER"] },
          },
        ],
        // where: { CHANNEL_STATUS: 1 },
        order: [["CHANNEL_ORDER", "ASC"]],
      });
      let totalPages = Math.ceil(count / pageSize);
      let data = {
        meta: {
          current: current,
          pageSize: pageSize,
          pages: totalPages,
          total: countChannel,
        },
        channels: rows,
      };
      return {
        EM: "pagination success",
        EC: 0,
        DT: data,
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

const getChannelWithId = async (channelId) => {
  try {
    let countChannel = await db.CHANNEL.count({
      where: { CHANNEL_STATUS: 1 },
      distinct: true,
      col: "id",
    });

    const { count, rows } = await db.CHANNEL.findAndCountAll({
      limit: 1,
      attributes: [
        "id",
        "CHANNEL_ORDER",
        "CHANNEL_NAME_VI",
        "CHANNEL_NAME_EN",
        "CHANNEL_STATUS",
        "CHANNEL_LINK",
      ],
      include: [
        {
          model: db.CHANNEL_CATE,
          attributes: ["id", "CATE_NAME_VI", "CATE_NAME_EN", "CATE_STATUS"],
          // where: { CATE_STATUS: 1 },
          through: { attributes: ["CHANNEL_ORDER"] },
        },
      ],
      where: { id: channelId },
      order: [["CHANNEL_ORDER", "ASC"]],
    });

    let data = {
      meta: {
        current: 1,
        pageSize: 1,
        pages: 1,
        total: countChannel,
      },
      channels: rows,
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
      DT: "",
    };
  }
};

const getChannelFilter = async (categoryId, status) => {
  try {
    let countChannel = await db.CHANNEL.count({
      where: { CHANNEL_STATUS: 1 },
      distinct: true,
      col: "id",
    });

    if (categoryId === -1 && status === -1) {
      let countChannel1 = await db.CHANNEL.count({
        // where: { CHANNEL_STATUS: 1 },
        distinct: true,
        col: "id",
      });

      const { count, rows } = await db.CHANNEL.findAndCountAll({
        attributes: [
          "id",
          "CHANNEL_ORDER",
          "CHANNEL_NAME_VI",
          "CHANNEL_NAME_EN",
          "CHANNEL_STATUS",
          "CHANNEL_LINK",
        ],
        include: [
          {
            model: db.CHANNEL_CATE,
            attributes: ["id", "CATE_NAME_VI", "CATE_NAME_EN", "CATE_STATUS"],
            // where: { CATE_STATUS: 1 },
            through: { attributes: ["CHANNEL_ORDER"] },
          },
        ],
        // where: { CHANNEL_STATUS: 1 },
        order: [["CHANNEL_ORDER", "ASC"]],
      });

      let data = {
        meta: {
          current: 1,
          pageSize: 1,
          pages: 1,
          total: countChannel1,
        },
        channels: rows,
      };
      return {
        EM: "pagination success",
        EC: 0,
        DT: data,
      };
    } else {
      if (categoryId === -1 && (status === 1 || status === 0)) {
        const { count, rows } = await db.CHANNEL.findAndCountAll({
          // limit: 1,
          attributes: [
            "id",
            "CHANNEL_ORDER",
            "CHANNEL_NAME_VI",
            "CHANNEL_NAME_EN",
            "CHANNEL_STATUS",
            "CHANNEL_LINK",
          ],
          include: [
            {
              model: db.CHANNEL_CATE,
              attributes: ["id", "CATE_NAME_VI", "CATE_NAME_EN", "CATE_STATUS"],

              through: { attributes: ["CHANNEL_ORDER"] },
            },
          ],

          where: { CHANNEL_STATUS: status },
          order: [["CHANNEL_ORDER", "ASC"]],
        });

        let data = {
          meta: {
            current: 1,
            pageSize: 1,
            pages: 1,
            total: countChannel,
          },
          channels: rows,
        };

        return {
          EM: "pagination success",
          EC: 0,
          DT: data,
        };
      }
      if (categoryId && categoryId !== -1 && status === -1) {
        const { count, rows } = await db.CHANNEL.findAndCountAll({
          // limit: 1,
          attributes: [
            "id",
            "CHANNEL_ORDER",
            "CHANNEL_NAME_VI",
            "CHANNEL_NAME_EN",
            "CHANNEL_STATUS",
            "CHANNEL_LINK",
          ],
          include: [
            {
              model: db.CHANNEL_CATE,
              attributes: ["id", "CATE_NAME_VI", "CATE_NAME_EN", "CATE_STATUS"],
              where: { id: categoryId },
              through: { attributes: ["CHANNEL_ORDER"] },
            },
          ],

          // where: { id: channelId },

          order: [["CHANNEL_ORDER", "ASC"]],
        });

        let data = {
          meta: {
            current: 1,
            pageSize: 1,
            pages: 1,
            total: countChannel,
          },
          channels: rows,
        };
        return {
          EM: "pagination success",
          EC: 0,
          DT: data,
        };
      }
      if (categoryId && categoryId !== -1 && (status === 0 || status === 1)) {
        const { count, rows } = await db.CHANNEL.findAndCountAll({
          // limit: 1,
          attributes: [
            "id",
            "CHANNEL_ORDER",
            "CHANNEL_NAME_VI",
            "CHANNEL_NAME_EN",
            "CHANNEL_STATUS",
            "CHANNEL_LINK",
          ],
          include: [
            {
              model: db.CHANNEL_CATE,
              attributes: ["id", "CATE_NAME_VI", "CATE_NAME_EN", "CATE_STATUS"],
              where: { id: categoryId },
              through: { attributes: ["CHANNEL_ORDER"] },
            },
          ],

          // where: { id: channelId },
          where: { CHANNEL_STATUS: status },
          order: [["CHANNEL_ORDER", "ASC"]],
        });

        let data = {
          meta: {
            current: 1,
            pageSize: 1,
            pages: 1,
            total: countChannel,
          },
          channels: rows,
        };
        return {
          EM: "pagination success",
          EC: 0,
          DT: data,
        };
      }
    }

    // if (categoryId && !status && status !== 0) {
    //   const { count, rows } = await db.CHANNEL.findAndCountAll({
    //     // limit: 1,
    //     attributes: [
    //       "id",
    //       "CHANNEL_ORDER",
    //       "CHANNEL_NAME_VI",
    //       "CHANNEL_NAME_EN",
    //       "CHANNEL_STATUS",
    //       "CHANNEL_LINK",
    //       "CHANNEL_URL_HLS",
    //       "CHANNEL_MULTICAST_URL",
    //       "MULTICAST_IP",
    //       "MULTICAST_PORT",
    //     ],
    //     include: [
    //       {
    //         model: db.CHANNEL_CATE,
    //         attributes: ["id", "CATE_NAME_VI", "CATE_NAME_EN", "CATE_STATUS"],
    //         where: { id: categoryId },
    //         through: { attributes: ["CHANNEL_ORDER"] },
    //       },
    //     ],

    //     // where: { id: channelId },
    //     order: [["CHANNEL_ORDER", "ASC"]],
    //   });

    //   let data = {
    //     meta: {
    //       current: 1,
    //       pageSize: 1,
    //       pages: 1,
    //       total: countChannel,
    //     },
    //     channels: rows,
    //   };
    //   return {
    //     EM: "pagination success",
    //     EC: 0,
    //     DT: data,
    //   };
    // } else if (!categoryId && (status === 0 || status === 1)) {
    //   const { count, rows } = await db.CHANNEL.findAndCountAll({
    //     // limit: 1,
    //     attributes: [
    //       "id",
    //       "CHANNEL_ORDER",
    //       "CHANNEL_NAME_VI",
    //       "CHANNEL_NAME_EN",
    //       "CHANNEL_STATUS",
    //       "CHANNEL_LINK",
    //       "CHANNEL_URL_HLS",
    //       "CHANNEL_MULTICAST_URL",
    //       "MULTICAST_IP",
    //       "MULTICAST_PORT",
    //     ],
    //     include: [
    //       {
    //         model: db.CHANNEL_CATE,
    //         attributes: ["id", "CATE_NAME_VI", "CATE_NAME_EN", "CATE_STATUS"],

    //         through: { attributes: ["CHANNEL_ORDER"] },
    //       },
    //     ],

    //     where: { CHANNEL_STATUS: status },
    //     order: [["CHANNEL_ORDER", "ASC"]],
    //   });
    //   let data = {
    //     meta: {
    //       current: 1,
    //       pageSize: 1,
    //       pages: 1,
    //       total: countChannel,
    //     },
    //     channels: rows,
    //   };
    //   return {
    //     EM: "pagination success",
    //     EC: 0,
    //     DT: data,
    //   };
    // } else if ((categoryId && status === 0) || status === 1) {
    //   const { count, rows } = await db.CHANNEL.findAndCountAll({
    //     // limit: 1,
    //     attributes: [
    //       "id",
    //       "CHANNEL_ORDER",
    //       "CHANNEL_NAME_VI",
    //       "CHANNEL_NAME_EN",
    //       "CHANNEL_STATUS",
    //       "CHANNEL_LINK",
    //       "CHANNEL_URL_HLS",
    //       "CHANNEL_MULTICAST_URL",
    //       "MULTICAST_IP",
    //       "MULTICAST_PORT",
    //     ],
    //     include: [
    //       {
    //         model: db.CHANNEL_CATE,
    //         attributes: ["id", "CATE_NAME_VI", "CATE_NAME_EN", "CATE_STATUS"],
    //         where: { id: categoryId },
    //         through: { attributes: ["CHANNEL_ORDER"] },
    //       },
    //     ],
    //     where: { CHANNEL_STATUS: status },
    //     order: [["CHANNEL_ORDER", "ASC"]],
    //   });

    //   let data = {
    //     meta: {
    //       current: 1,
    //       pageSize: 1,
    //       pages: 1,
    //       total: countChannel,
    //     },
    //     channels: rows,
    //   };
    //   return {
    //     EM: "pagination success",
    //     EC: 0,
    //     DT: data,
    //   };
    // }
  } catch (e) {
    console.log(e);
    return {
      EM: "something wrongs with services",
      EC: 1,
      DT: "",
    };
  }
};

const handleGetListInformationHotelWithPagination = async (
  current,
  pageSize
) => {
  try {
    let offset = (current - 1) * pageSize;
    const { count, rows } = await db.INFORMATION_HOTEL.findAndCountAll({
      offset: offset,
      limit: pageSize,
      order: [["id", "DESC"]],
    });

    let totalPages = Math.ceil(count / pageSize);
    let data = {
      meta: {
        current: current,
        pageSize: pageSize,
        pages: totalPages,
        total: count,
      },
      inforHotels: rows,
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
      DT: "",
    };
  }
};

const getAllChannel = async () => {
  try {
    let channels = await db.CHANNEL.findAll({
      attributes: [
        "id",
        "CHANNEL_NAME_VI",
        "CHANNEL_NAME_EN",
        "CHANNEL_STATUS",
        "CHANNEL_LINK",
      ],

      include: [
        {
          model: db.CHANNEL_CATE,
          attributes: ["id", "CATE_NAME_VI", "CATE_NAME_EN", "CATE_STATUS"],
          where: { CATE_STATUS: 1 },
          through: { attributes: ["CHANNEL_ORDER"] },
        },
      ],
      where: { CHANNEL_STATUS: 1 },
      order: [["id", "DESC"]],
    });
    if (channels) {
      return {
        EM: "get All Channel Success!",
        EC: 0,
        DT: channels,
      };
    } else {
      return {
        EM: "get All Channel Fail",
        EC: 1,
        DT: "",
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

const handleGetAllListChannel = async () => {
  let channels = await db.CHANNEL.findAll({
    attributes: [
      "id",
      "CHANNEL_NAME_VI",
      "CHANNEL_NAME_EN",
      "CHANNEL_ORDER",
      "CHANNEL_URL_HLS",
    ],
    // where: { CHANNEL_STATUS: 1 },

    order: [["CHANNEL_ORDER", "ASC"]],
  });

  if (channels) {
    return {
      EM: "get All Channel For LiveTv Success!",
      EC: 0,
      DT: channels,
    };
  } else {
    return {
      EM: "get All Channel For LiveTv Fail",
      EC: 1,
      DT: "",
    };
  }
};

const handleDeleteChannel = async (id) => {
  try {
    let channel = await db.CHANNEL.findOne({
      where: { id: id },
      raw: true,
    });

    if (channel && channel.CHANNEL_STATUS === 0) {
      if (channel.CHANNEL_PATH) {
        let channelDelete = channel.CHANNEL_PATH;

        if (fs.existsSync(channelDelete)) {
          fs.unlink(channelDelete, (err) => {
            if (err) throw err; //handle your error the way you want to;
            console.log("File was deleted: ", channelDelete); //or else the file will be deleted
          });
        } else {
          console.log("File is not found: ", channelDelete);
        }
      }

      await db.CHANNEL.destroy({ where: { id: channel.id } });
      return {
        EM: "Delete channel success!",
        EC: 0,
        DT: "",
      };
    }

    let channelAll = await db.CHANNEL.findAll({
      raw: true,
      order: [["CHANNEL_ORDER", "ASC"]],
    });

    const targetIndex = channelAll.findIndex((item) => item.id === channel.id);
    // Tạo mảng trước và sau phần tử tìm thấy
    const arrayAfterTarget = channelAll.slice(targetIndex + 1);

    if (arrayAfterTarget && arrayAfterTarget.length > 0) {
      for (let i = 0; i < arrayAfterTarget.length; i++) {
        await db.CHANNEL.update(
          { CHANNEL_ORDER: arrayAfterTarget[i].CHANNEL_ORDER - 1 },
          { where: { id: arrayAfterTarget[i].id } }
        );
      }
    }

    if (channel) {
      await db.CHANNEL.destroy({ where: { id: channel.id } });
      const connection = await mysql.createConnection({
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE_NAME,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        Promise: bluebird,
      });

      const [countIdMaxChannel, fields] = await connection.execute(
        `DELETE FROM CHANNEL_CATE_MAP WHERE CHANNEL_ID = ?;`,
        [id]
      );

      if (channel.CHANNEL_PATH) {
        let channelDelete = channel.CHANNEL_PATH;

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
        EM: "Delete channel success!",
        EC: 0,
        DT: "",
      };
    } else {
      return {
        EM: "channel is not exist!",
        EC: 1,
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

const handleUpdateAChannel_TEST = async (data, file) => {
  try {
    // console.log("Check data: ", data, file);
    if (!data) {
      return {
        EM: "missing paramesters!",
        EC: 1,
        DT: "",
      };
    } else {
      // Tim channel can update
      let channel = await db.CHANNEL.findOne({
        where: { id: +data.id },
        raw: true,
      });
      let channelAll = await db.CHANNEL.findAll({
        raw: true,
        order: [["CHANNEL_ORDER", "ASC"]],
      });

      if (+data.CHANNEL_ORDER > channel.CHANNEL_ORDER) {
        // Ex: data : stt = 3 vs order old = 2

        if (channel) {
          const targetIndex = channelAll.findIndex(
            (item) => item.id === channel.id
          );
          // Tạo mảng trước và sau phần tử tìm thấy
          if (
            +data.CHANNEL_ORDER >
            channelAll[channelAll.length - 1].CHANNEL_ORDER
          ) {
            return {
              EM: "Update service channel hotel Fail!, số thứ tự được chọn lớn hơn phần tử lớn nhất ",
              EC: 1,
              DT: "",
            };
          }

          let endIndex = data.CHANNEL_ORDER - channel.CHANNEL_ORDER;
          const arrayAfterTarget = channelAll.slice(
            targetIndex + 1,
            targetIndex + endIndex + 1
          );
          if (arrayAfterTarget && arrayAfterTarget.length > 0) {
            for (let i = 0; i < arrayAfterTarget.length; i++) {
              await db.CHANNEL.update(
                { CHANNEL_ORDER: arrayAfterTarget[i].CHANNEL_ORDER - 1 },
                { where: { id: arrayAfterTarget[i].id } }
              );
            }
          }
        }
      } else if (+data.CHANNEL_ORDER < +channel.CHANNEL_ORDER) {
        // Ex: data : stt = 2 vs order old = 3

        let channelOrderNew = await db.CHANNEL.findOne({
          where: { CHANNEL_ORDER: +data.CHANNEL_ORDER },
          raw: true,
        });
        let endIndex = channel.CHANNEL_ORDER - channelOrderNew.CHANNEL_ORDER;
        if (channelOrderNew) {
          const targetIndex = channelAll.findIndex(
            (item) => item.id === channelOrderNew.id
          );

          const arrayAfterTarget = channelAll.slice(
            targetIndex,
            targetIndex + endIndex
          );

          if (arrayAfterTarget && arrayAfterTarget.length > 0) {
            for (let i = 0; i < arrayAfterTarget.length; i++) {
              await db.CHANNEL.update(
                { CHANNEL_ORDER: arrayAfterTarget[i].CHANNEL_ORDER + 1 },
                { where: { id: arrayAfterTarget[i].id } }
              );
            }
          }
        }
      } else if (
        +data.CHANNEL_ORDER === +channel.CHANNEL_ORDER &&
        data.CHANNEL_STATUS === "false"
      ) {
        const targetIndex = channelAll.findIndex(
          (item) => item.id === channel.id
        );
        // Tạo mảng trước và sau phần tử tìm thấy
        const arrayAfterTarget = channelAll.slice(targetIndex + 1);
        if (arrayAfterTarget && arrayAfterTarget.length > 0) {
          for (let i = 0; i < arrayAfterTarget.length; i++) {
            await db.CHANNEL.update(
              { CHANNEL_ORDER: arrayAfterTarget[i].CHANNEL_ORDER - 1 },
              { where: { id: arrayAfterTarget[i].id } }
            );
          }
        }

        let linkLogo = process.env.LINK_AVATAR;
        if (channel) {
          if (file) {
            if (fs.existsSync(channel.CHANNEL_PATH)) {
              fs.unlink(channel.CHANNEL_PATH, (err) => {
                if (err) throw err; //handle your error the way you want to;
                console.log("Channel was deleted: ", channel.CHANNEL_PATH); //or else the file will be deleted
              });
            } else {
              console.log("File is not found: ", channel.CHANNEL_PATH);
            }

            await db.CHANNEL.update(
              {
                CHANNEL_NAME_VI: data.CHANNEL_NAME_VI,
                CHANNEL_NAME_EN: data.CHANNEL_NAME_EN,
                CHANNEL_PATH: `${file.destination}/${file.filename}`,
                CHANNEL_LINK: `${linkLogo}/${file.filename}`,
                CHANNEL_URL_HLS: data.CHANNEL_URL_HLS,
                CHANNEL_MULTICAST_URL:
                  data.MULTICAST_IP && data.MULTICAST_PORT
                    ? data.MULTICAST_IP + data.MULTICAST_PORT
                    : "",
                CHANNEL_STATUS: 0,
                MULTICAST_IP: data.MULTICAST_IP,
                MULTICAST_PORT: data.MULTICAST_PORT,
                CHANNEL_ORDER: null,
              },
              { where: { id: +data.id } }
            );
          } else {
            await db.CHANNEL.update(
              {
                CHANNEL_NAME_VI: data.CHANNEL_NAME_VI,
                CHANNEL_NAME_EN: data.CHANNEL_NAME_EN,
                CHANNEL_URL_HLS: data.CHANNEL_URL_HLS,
                CHANNEL_MULTICAST_URL:
                  data.MULTICAST_IP && data.MULTICAST_PORT
                    ? data.MULTICAST_IP + data.MULTICAST_PORT
                    : "",
                CHANNEL_STATUS: 0,
                MULTICAST_IP: data.MULTICAST_IP,
                MULTICAST_PORT: data.MULTICAST_PORT,
                CHANNEL_ORDER: null,
              },
              { where: { id: +data.id } }
            );
          }
          return {
            EM: "Channel hotel success!",
            EC: 0,
            DT: "",
          };
        }
      } else if (
        data.CHANNEL_NAME_EN !== channel.CHANNEL_NAME_EN ||
        data.CHANNEL_NAME_VI !== channel.CHANNEL_NAME_VI ||
        data.CHANNEL_URL_HLS !== channel.CHANNEL_URL_HLS ||
        data.MULTICAST_IP !== channel.MULTICAST_IP ||
        data.MULTICAST_PORT !== channel.MULTICAST_PORT ||
        file
      ) {
        let linkLogo = process.env.LINK_AVATAR;
        if (channel) {
          if (file) {
            //xoá logo kênh cũ
            if (fs.existsSync(channel.CHANNEL_PATH)) {
              fs.unlink(channel.CHANNEL_PATH, (err) => {
                if (err) throw err; //handle your error the way you want to;
                console.log("Channel was deleted: ", channel.CHANNEL_PATH); //or else the file will be deleted
              });
            } else {
              console.log("File is not found: ", channel.CHANNEL_PATH);
            }

            //trong trường hợp order bằng null
            if (data.CHANNEL_ORDER === "null") {
              await db.CHANNEL.update(
                {
                  CHANNEL_NAME_VI: data.CHANNEL_NAME_VI,
                  CHANNEL_NAME_EN: data.CHANNEL_NAME_EN,
                  CHANNEL_PATH: `${file.destination}/${file.filename}`,
                  CHANNEL_LINK: `${linkLogo}/${file.filename}`,
                  CHANNEL_URL_HLS: data.CHANNEL_URL_HLS,
                  CHANNEL_MULTICAST_URL:
                    data.MULTICAST_IP && data.MULTICAST_PORT
                      ? data.MULTICAST_IP + data.MULTICAST_PORT
                      : "",
                  CHANNEL_STATUS: data.CHANNEL_STATUS === "false" ? 0 : 1,
                  MULTICAST_IP: data.MULTICAST_IP,
                  MULTICAST_PORT: data.MULTICAST_PORT,
                },
                { where: { id: +data.id } }
              );
              return {
                EM: "Channel hotel success!",
                EC: 0,
                DT: "",
              };
            } else {
              await db.CHANNEL.update(
                {
                  CHANNEL_NAME_VI: data.CHANNEL_NAME_VI,
                  CHANNEL_NAME_EN: data.CHANNEL_NAME_EN,
                  CHANNEL_PATH: `${file.destination}/${file.filename}`,
                  CHANNEL_LINK: `${linkLogo}/${file.filename}`,
                  CHANNEL_URL_HLS: data.CHANNEL_URL_HLS,
                  CHANNEL_MULTICAST_URL:
                    data.MULTICAST_IP && data.MULTICAST_PORT
                      ? data.MULTICAST_IP + data.MULTICAST_PORT
                      : "",
                  CHANNEL_STATUS: data.CHANNEL_STATUS === "false" ? 0 : 1,
                  MULTICAST_IP: data.MULTICAST_IP,
                  MULTICAST_PORT: data.MULTICAST_PORT,
                  CHANNEL_ORDER: data.CHANNEL_ORDER,
                },
                { where: { id: +data.id } }
              );
              return {
                EM: "Channel hotel success!",
                EC: 0,
                DT: "",
              };
            }
          } else {
            if (data.CHANNEL_ORDER === "null") {
              await db.CHANNEL.update(
                {
                  CHANNEL_NAME_VI: data.CHANNEL_NAME_VI,
                  CHANNEL_NAME_EN: data.CHANNEL_NAME_EN,
                  CHANNEL_URL_HLS: data.CHANNEL_URL_HLS,
                  CHANNEL_MULTICAST_URL:
                    data.MULTICAST_IP && data.MULTICAST_PORT
                      ? data.MULTICAST_IP + data.MULTICAST_PORT
                      : "",
                  CHANNEL_STATUS: data.CHANNEL_STATUS === "false" ? 0 : 1,
                  MULTICAST_IP: data.MULTICAST_IP,
                  MULTICAST_PORT: data.MULTICAST_PORT,
                },
                { where: { id: +data.id } }
              );
              return {
                EM: "Channel hotel success!",
                EC: 0,
                DT: "",
              };
            } else {
              await db.CHANNEL.update(
                {
                  CHANNEL_NAME_VI: data.CHANNEL_NAME_VI,
                  CHANNEL_NAME_EN: data.CHANNEL_NAME_EN,
                  CHANNEL_URL_HLS: data.CHANNEL_URL_HLS,
                  CHANNEL_MULTICAST_URL:
                    data.MULTICAST_IP && data.MULTICAST_PORT
                      ? data.MULTICAST_IP + data.MULTICAST_PORT
                      : "",
                  CHANNEL_STATUS: data.CHANNEL_STATUS === "false" ? 0 : 1,
                  MULTICAST_IP: data.MULTICAST_IP,
                  MULTICAST_PORT: data.MULTICAST_PORT,
                  CHANNEL_ORDER: data.CHANNEL_ORDER,
                },
                { where: { id: +data.id } }
              );
              return {
                EM: "Channel hotel success!",
                EC: 0,
                DT: "",
              };
            }
          }
        } else {
          if (file) {
            let path = `${file.destination}/${file.filename}`;
            if (fs.existsSync(path)) {
              fs.unlink(path, (err) => {
                if (err) throw err; //handle your error the way you want to;
                console.log("Channel was deleted: ", path); //or else the file will be deleted
              });
            } else {
              console.log("File is not found: ", path);
            }
            return {
              EM: "Channel is not found!",
              EC: 1,
              DT: "",
            };
          }
        }
      } else {
        const connection = await mysql.createConnection({
          user: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_DATABASE_NAME,
          host: process.env.DB_HOST,
          port: process.env.DB_PORT,
          Promise: bluebird,
        });
        const [channelOldMax, channelOld] = await connection.execute(
          `SELECT MAX(CHANNEL_ORDER) AS "CHANNEL_ORDER" FROM CHANNEL`
        );
        let linkLogo = process.env.LINK_AVATAR;
        if (channel) {
          if (file) {
            if (fs.existsSync(channel.CHANNEL_PATH)) {
              fs.unlink(channel.CHANNEL_PATH, (err) => {
                if (err) throw err; //handle your error the way you want to;
                console.log("Channel was deleted: ", channel.CHANNEL_PATH); //or else the file will be deleted
              });
            } else {
              console.log("File is not found: ", channel.CHANNEL_PATH);
            }
            await db.CHANNEL.update(
              {
                CHANNEL_NAME_VI: data.CHANNEL_NAME_VI,
                CHANNEL_NAME_EN: data.CHANNEL_NAME_EN,
                CHANNEL_PATH: `${file.destination}/${file.filename}`,
                CHANNEL_LINK: `${linkLogo}/${file.filename}`,
                CHANNEL_URL_HLS: data.CHANNEL_URL_HLS,
                CHANNEL_MULTICAST_URL:
                  data.MULTICAST_IP && data.MULTICAST_PORT
                    ? data.MULTICAST_IP + data.MULTICAST_PORT
                    : "",
                CHANNEL_STATUS: 1,
                MULTICAST_IP: data.MULTICAST_IP,
                MULTICAST_PORT: data.MULTICAST_PORT,
                CHANNEL_ORDER: channelOldMax[0].CHANNEL_ORDER + 1,
              },
              { where: { id: +data.id } }
            );
            return {
              EM: "Channel hotel success!",
              EC: 0,
              DT: "",
            };
          } else {
            await db.CHANNEL.update(
              {
                CHANNEL_NAME_VI: data.CHANNEL_NAME_VI,
                CHANNEL_NAME_EN: data.CHANNEL_NAME_EN,
                CHANNEL_URL_HLS: data.CHANNEL_URL_HLS,
                CHANNEL_MULTICAST_URL:
                  data.MULTICAST_IP && data.MULTICAST_PORT
                    ? data.MULTICAST_IP + data.MULTICAST_PORT
                    : "",
                CHANNEL_STATUS: 1,
                MULTICAST_IP: data.MULTICAST_IP,
                MULTICAST_PORT: data.MULTICAST_PORT,
                CHANNEL_ORDER: channelOldMax[0].CHANNEL_ORDER + 1,
              },
              { where: { id: +data.id } }
            );
            return {
              EM: "Channel hotel success!",
              EC: 0,
              DT: "",
            };
          }
        } else {
          if (file) {
            let path = `${file.destination}/${file.filename}`;
            if (fs.existsSync(path)) {
              fs.unlink(path, (err) => {
                if (err) throw err; //handle your error the way you want to;
                console.log("Channel was deleted: ", path); //or else the file will be deleted
              });
            } else {
              console.log("File is not found: ", path);
            }
            return {
              EM: "Channel is not found!",
              EC: 1,
              DT: "",
            };
          }
        }
      }

      //sau khi update thanh cong thi cap nhat gia tri moi
      let linkLogo = process.env.LINK_AVATAR;
      if (channel) {
        if (file) {
          if (fs.existsSync(channel.CHANNEL_PATH)) {
            fs.unlink(channel.CHANNEL_PATH, (err) => {
              if (err) throw err; //handle your error the way you want to;
              console.log("Channel was deleted: ", channel.CHANNEL_PATH); //or else the file will be deleted
            });
          } else {
            console.log("File is not found: ", channel.CHANNEL_PATH);
          }

          await db.CHANNEL.update(
            {
              CHANNEL_NAME_VI: data.CHANNEL_NAME_VI,
              CHANNEL_NAME_EN: data.CHANNEL_NAME_EN,
              CHANNEL_PATH: `${file.destination}/${file.filename}`,
              CHANNEL_LINK: `${linkLogo}/${file.filename}`,
              CHANNEL_URL_HLS: data.CHANNEL_URL_HLS,
              CHANNEL_MULTICAST_URL:
                data.MULTICAST_IP && data.MULTICAST_PORT
                  ? data.MULTICAST_IP + data.MULTICAST_PORT
                  : "",
              CHANNEL_STATUS: data.CHANNEL_STATUS === "false" ? 0 : 1,
              MULTICAST_IP: data.MULTICAST_IP,
              MULTICAST_PORT: data.MULTICAST_PORT,
              CHANNEL_ORDER: data.CHANNEL_ORDER,
            },
            { where: { id: +data.id } }
          );
        } else {
          await db.CHANNEL.update(
            {
              CHANNEL_NAME_VI: data.CHANNEL_NAME_VI,
              CHANNEL_NAME_EN: data.CHANNEL_NAME_EN,
              CHANNEL_URL_HLS: data.CHANNEL_URL_HLS,
              CHANNEL_MULTICAST_URL:
                data.MULTICAST_IP && data.MULTICAST_PORT
                  ? data.MULTICAST_IP + data.MULTICAST_PORT
                  : "",
              CHANNEL_STATUS: data.CHANNEL_STATUS === "false" ? 0 : 1,
              MULTICAST_IP: data.MULTICAST_IP,
              MULTICAST_PORT: data.MULTICAST_PORT,
              CHANNEL_ORDER: data.CHANNEL_ORDER,
            },
            { where: { id: +data.id } }
          );
        }
        return {
          EM: "Channel hotel success!",
          EC: 0,
          DT: "",
        };
      } else {
        if (file) {
          let path = `${file.destination}/${file.filename}`;
          if (fs.existsSync(path)) {
            fs.unlink(path, (err) => {
              if (err) throw err; //handle your error the way you want to;
              console.log("Channel was deleted: ", path); //or else the file will be deleted
            });
          } else {
            console.log("File is not found: ", path);
          }
          return {
            EM: "Channel is not found!",
            EC: 1,
            DT: "",
          };
        }
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

const handleUpdateAChannel = async (data, file) => {
  try {
    if (!data) {
      return {
        EM: "missing paramesters!",
        EC: 1,
        DT: "",
      };
    } else {
      // Tim channel can update
      let channel = await db.CHANNEL.findOne({
        where: { id: +data.id },
        raw: true,
      });
      let channelAll = await db.CHANNEL.findAll({
        raw: true,
        order: [["CHANNEL_ORDER", "ASC"]],
      });

      if (data.CHANNEL_ORDER !== "null") {
        if (+data.CHANNEL_ORDER > channel.CHANNEL_ORDER) {
          // Ex: data : stt = 3 vs order old = 2

          if (channel) {
            const targetIndex = channelAll.findIndex(
              (item) => item.id === channel.id
            );
            // Tạo mảng trước và sau phần tử tìm thấy
            if (
              +data.CHANNEL_ORDER >
              channelAll[channelAll.length - 1].CHANNEL_ORDER
            ) {
              return {
                EM: "Update service channel hotel Fail!, số thứ tự được chọn lớn hơn phần tử lớn nhất ",
                EC: 1,
                DT: "",
              };
            }

            let endIndex = data.CHANNEL_ORDER - channel.CHANNEL_ORDER;
            const arrayAfterTarget = channelAll.slice(
              targetIndex + 1,
              targetIndex + endIndex + 1
            );
            if (arrayAfterTarget && arrayAfterTarget.length > 0) {
              for (let i = 0; i < arrayAfterTarget.length; i++) {
                await db.CHANNEL.update(
                  { CHANNEL_ORDER: arrayAfterTarget[i].CHANNEL_ORDER - 1 },
                  { where: { id: arrayAfterTarget[i].id } }
                );
              }
            }
          }
        } else if (+data.CHANNEL_ORDER < +channel.CHANNEL_ORDER) {
          // Ex: data : stt = 2 vs order old = 3

          let channelOrderNew = await db.CHANNEL.findOne({
            where: { CHANNEL_ORDER: +data.CHANNEL_ORDER },
            raw: true,
          });
          let endIndex = channel.CHANNEL_ORDER - channelOrderNew.CHANNEL_ORDER;
          if (channelOrderNew) {
            const targetIndex = channelAll.findIndex(
              (item) => item.id === channelOrderNew.id
            );

            const arrayAfterTarget = channelAll.slice(
              targetIndex,
              targetIndex + endIndex
            );

            if (arrayAfterTarget && arrayAfterTarget.length > 0) {
              for (let i = 0; i < arrayAfterTarget.length; i++) {
                await db.CHANNEL.update(
                  { CHANNEL_ORDER: arrayAfterTarget[i].CHANNEL_ORDER + 1 },
                  { where: { id: arrayAfterTarget[i].id } }
                );
              }
            }
          }
        }
      }

      //sau khi update thanh cong thi cap nhat gia tri moi
      let linkLogo = process.env.LINK_AVATAR;

      if (channel) {
        if (file) {
          if (fs.existsSync(channel.CHANNEL_PATH)) {
            fs.unlink(channel.CHANNEL_PATH, (err) => {
              if (err) throw err; //handle your error the way you want to;
              console.log("Channel was deleted: ", channel.CHANNEL_PATH); //or else the file will be deleted
            });
          } else {
            console.log("File is not found: ", channel.CHANNEL_PATH);
          }

          if (data.CHANNEL_ORDER !== "null") {
            await db.CHANNEL.update(
              {
                CHANNEL_NAME_VI: data.CHANNEL_NAME_VI,
                CHANNEL_NAME_EN: data.CHANNEL_NAME_EN,
                CHANNEL_PATH: `${file.destination}/${file.filename}`,
                CHANNEL_LINK: `${linkLogo}/${file.filename}`,
                CHANNEL_URL_HLS: data.CHANNEL_URL_HLS,
                CHANNEL_MULTICAST_URL:
                  data.MULTICAST_IP && data.MULTICAST_PORT
                    ? data.MULTICAST_IP + data.MULTICAST_PORT
                    : "",
                MULTICAST_IP: data.MULTICAST_IP,
                MULTICAST_PORT: data.MULTICAST_PORT,
                CHANNEL_ORDER: data.CHANNEL_ORDER,
              },
              { where: { id: +data.id } }
            );
            return {
              EM: "Channel hotel success!",
              EC: 0,
              DT: "",
            };
          } else {
            await db.CHANNEL.update(
              {
                CHANNEL_NAME_VI: data.CHANNEL_NAME_VI,
                CHANNEL_NAME_EN: data.CHANNEL_NAME_EN,
                CHANNEL_PATH: `${file.destination}/${file.filename}`,
                CHANNEL_LINK: `${linkLogo}/${file.filename}`,
                CHANNEL_URL_HLS: data.CHANNEL_URL_HLS,
                CHANNEL_MULTICAST_URL:
                  data.MULTICAST_IP && data.MULTICAST_PORT
                    ? data.MULTICAST_IP + data.MULTICAST_PORT
                    : "",
                MULTICAST_IP: data.MULTICAST_IP,
                MULTICAST_PORT: data.MULTICAST_PORT,
              },
              { where: { id: +data.id } }
            );
            return {
              EM: "Channel hotel success!",
              EC: 0,
              DT: "",
            };
          }
        } else {
          if (data.CHANNEL_ORDER !== "null") {
            await db.CHANNEL.update(
              {
                CHANNEL_NAME_VI: data.CHANNEL_NAME_VI,
                CHANNEL_NAME_EN: data.CHANNEL_NAME_EN,
                CHANNEL_URL_HLS: data.CHANNEL_URL_HLS,
                CHANNEL_MULTICAST_URL:
                  data.MULTICAST_IP && data.MULTICAST_PORT
                    ? data.MULTICAST_IP + data.MULTICAST_PORT
                    : "",
                MULTICAST_IP: data.MULTICAST_IP,
                MULTICAST_PORT: data.MULTICAST_PORT,
                CHANNEL_ORDER: data.CHANNEL_ORDER,
              },
              { where: { id: +data.id } }
            );
            return {
              EM: "Channel hotel success!",
              EC: 0,
              DT: "",
            };
          } else {
            await db.CHANNEL.update(
              {
                CHANNEL_NAME_VI: data.CHANNEL_NAME_VI,
                CHANNEL_NAME_EN: data.CHANNEL_NAME_EN,
                CHANNEL_URL_HLS: data.CHANNEL_URL_HLS,
                CHANNEL_MULTICAST_URL:
                  data.MULTICAST_IP && data.MULTICAST_PORT
                    ? data.MULTICAST_IP + data.MULTICAST_PORT
                    : "",
                MULTICAST_IP: data.MULTICAST_IP,
                MULTICAST_PORT: data.MULTICAST_PORT,
              },
              { where: { id: +data.id } }
            );
            return {
              EM: "Channel hotel success!",
              EC: 0,
              DT: "",
            };
          }
        }
      } else {
        if (file) {
          let path = `${file.destination}/${file.filename}`;
          if (fs.existsSync(path)) {
            fs.unlink(path, (err) => {
              if (err) throw err; //handle your error the way you want to;
              console.log("Channel was deleted: ", path); //or else the file will be deleted
            });
          } else {
            console.log("File is not found: ", path);
          }
          return {
            EM: "Channel is not found!",
            EC: 1,
            DT: "",
          };
        } else {
          return {
            EM: "Channel is not found!",
            EC: 1,
            DT: "",
          };
        }
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

const handleUpdateStatusChannel = async (data) => {
  //true
  if (data && data.status) {
    const connection = await mysql.createConnection({
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE_NAME,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      Promise: bluebird,
    });
    const [channelOldMax, channelOld] = await connection.execute(
      `SELECT MAX(CHANNEL_ORDER) AS "CHANNEL_ORDER" FROM CHANNEL`
    );
    await db.CHANNEL.update(
      {
        CHANNEL_STATUS: 1,
        CHANNEL_ORDER: channelOldMax[0].CHANNEL_ORDER + 1,
      },
      { where: { id: +data.id } }
    );

    return {
      EM: "Channel is active!",
      EC: 0,
      DT: "",
    };
  } else if (data && data.status === false) {
    //false
    let channel = await db.CHANNEL.findOne({
      where: { id: +data.id },
      raw: true,
    });

    let channelAll = await db.CHANNEL.findAll({
      raw: true,
      order: [["CHANNEL_ORDER", "ASC"]],
    });

    const targetIndex = channelAll.findIndex((item) => item.id === channel.id);
    // Tạo mảng trước và sau phần tử tìm thấy
    const arrayAfterTarget = channelAll.slice(targetIndex + 1);
    if (arrayAfterTarget && arrayAfterTarget.length > 0) {
      for (let i = 0; i < arrayAfterTarget.length; i++) {
        await db.CHANNEL.update(
          { CHANNEL_ORDER: arrayAfterTarget[i].CHANNEL_ORDER - 1 },
          { where: { id: arrayAfterTarget[i].id } }
        );
      }
    }

    await db.CHANNEL.update(
      {
        CHANNEL_STATUS: 0,
        CHANNEL_ORDER: null,
      },
      { where: { id: +data.id } }
    );
    return {
      EM: "Channel is inactive!",
      EC: 0,
      DT: "",
    };
  }
};

const handleCreateChannelCategory = async (data) => {
  try {
    if (!data) {
      return {
        EM: "missing paramesters!",
        EC: 1,
        DT: "",
      };
    } else {
      //handle create a new hotel with logo
      const connection = await mysql.createConnection({
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE_NAME,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        Promise: bluebird,
      });
      const [countOrderChannel, orderChannel] = await connection.execute(
        `SELECT MAX(CHANNEL_ORDER) AS "ORDER" FROM CHANNEL_CATE_MAP WHERE CATE_ID = ${data.category_id}`
      );

      await db.CHANNEL_CATE_MAP.create({
        CHANNEL_ID: data.id,
        CATE_ID: data.category_id,
        // CHANNEL_ORDER: data.SORT_ORDER,
        CHANNEL_ORDER: countOrderChannel[0].ORDER + 1,
      });

      return {
        EM: "Create Category Channel Extend success!",
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

const handleGetCategoryViaChannel = async () => {
  try {
    let channels = await db.CHANNEL_CATE.findAll({
      attributes: [
        "id",
        "CATE_NAME_VI",
        "CATE_NAME_EN",
        "SORT_ORDER",
        "CATE_STATUS",
      ],

      include: [
        {
          model: db.CHANNEL,
          attributes: [
            "id",
            "CHANNEL_NAME_EN",
            "CHANNEL_STATUS",
            "CHANNEL_LINK",
          ],
          through: {
            attributes: ["CHANNEL_ORDER"],
          },
        },
      ],
      order: [
        ["SORT_ORDER", "ASC"],
        [db.CHANNEL, db.CHANNEL_CATE_MAP, "CHANNEL_ORDER", "ASC"],
      ],
    });
    if (channels) {
      return {
        EM: "get All Channel Via Category Success!",
        EC: 0,
        DT: channels,
      };
    } else {
      return {
        EM: "get All Channel Via Category Fail",
        EC: 1,
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

const handleGetCategoryViaChannelWithPage = async (current, pageSize) => {
  try {
    let offset = (current - 1) * pageSize;
    let countChannelCate = await db.CHANNEL_CATE.count({
      // where: { CHANNEL_STATUS: 1 },
      distinct: true,
      col: "id",
    });

    const { count, rows } = await db.CHANNEL_CATE.findAndCountAll({
      offset: offset,
      limit: pageSize,
      attributes: [
        "id",
        "CATE_NAME_VI",
        "CATE_NAME_EN",
        "SORT_ORDER",
        "CATE_STATUS",
      ],
      include: [
        {
          model: db.CHANNEL,
          attributes: [
            "id",
            "CHANNEL_NAME_EN",
            "CHANNEL_STATUS",
            "CHANNEL_LINK",
          ],
          through: {
            attributes: ["CHANNEL_ORDER"],
          },
        },
      ],
      order: [
        ["SORT_ORDER", "ASC"],
        [db.CHANNEL, db.CHANNEL_CATE_MAP, "CHANNEL_ORDER", "ASC"],
      ],
    });

    let totalPages = Math.ceil(count / pageSize);
    let data = {
      meta: {
        current: current,
        pageSize: pageSize,
        pages: totalPages,
        total: countChannelCate,
      },
      channelCates: rows,
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
      DT: "",
    };
  }
};

const handleDeleteAssignChannelCategory = async (data) => {
  try {
    // let channelCategory = await db.CHANNEL_CATE_MAP.findOne({
    //   where: {
    //     [Op.and]: [
    //       { CHANNEL_ID: dataDelete.CHANNEL_ID },
    //       { CATE_ID: dataDelete.CATE_ID },
    //     ],
    //   },
    // });

    let categoryChannel = await db.CHANNEL_CATE_MAP.findOne({
      attributes: ["id", "CHANNEL_ID", "CATE_ID", "CHANNEL_ORDER"],
      where: {
        [Op.and]: [{ CHANNEL_ID: data.CHANNEL_ID }, { CATE_ID: data.CATE_ID }],
      },
      raw: true,
    });

    let categoryChannelAll = await db.CHANNEL_CATE_MAP.findAll({
      attributes: ["id", "CHANNEL_ID", "CATE_ID", "CHANNEL_ORDER"],
      where: { CATE_ID: data.CATE_ID },
      order: [["CHANNEL_ORDER", "ASC"]],
      raw: true,
    });

    const targetIndex = categoryChannelAll.findIndex(
      (item) => item.id === categoryChannel.id
    );
    // Tạo mảng trước và sau phần tử tìm thấy
    const arrayAfterTarget = categoryChannelAll.slice(targetIndex + 1);

    if (arrayAfterTarget && arrayAfterTarget.length > 0) {
      for (let i = 0; i < arrayAfterTarget.length; i++) {
        await db.CHANNEL_CATE_MAP.update(
          { CHANNEL_ORDER: arrayAfterTarget[i].CHANNEL_ORDER - 1 },
          { where: { id: arrayAfterTarget[i].id } }
        );
      }
    }

    if (categoryChannel) {
      // await channelCategory.destroy();
      await db.CHANNEL_CATE_MAP.destroy({
        where: {
          [Op.and]: [
            { CHANNEL_ID: data.CHANNEL_ID },
            { CATE_ID: data.CATE_ID },
          ],
        },
      });
      return {
        EM: "Delete Assign Channel Category success!",
        EC: 0,
        DT: "",
      };
    } else {
      return {
        EM: "Assign Channel Category is not exist!",
        EC: 1,
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

const handleUpdateCategoryChannelAssign = async (data) => {
  try {
    if (!data) {
      return {
        EM: "missing paramesters!",
        EC: 1,
        DT: "",
      };
    } else {
      let categoryChannel = await db.CHANNEL_CATE_MAP.findOne({
        attributes: ["id", "CHANNEL_ID", "CATE_ID", "CHANNEL_ORDER"],
        where: {
          [Op.and]: [{ CHANNEL_ID: data.id }, { CATE_ID: data.CATE_ID }],
        },
        raw: true,
      });

      let categoryChannelAll = await db.CHANNEL_CATE_MAP.findAll({
        attributes: ["id", "CHANNEL_ID", "CATE_ID", "CHANNEL_ORDER"],
        where: { CATE_ID: data.CATE_ID },
        order: [["CHANNEL_ORDER", "ASC"]],
        raw: true,
      });

      if (data.CHANNEL_ORDER > categoryChannel.CHANNEL_ORDER) {
        if (
          +data.CHANNEL_ORDER >
          categoryChannelAll[categoryChannelAll.length - 1].CHANNEL_ORDER
        ) {
          return {
            EM: "Update channel hotel Fail!, số thứ tự được chọn lớn hơn phần tử lớn nhất ",
            EC: 1,
            DT: "",
          };
        }

        const targetIndex = categoryChannelAll.findIndex(
          (item) => item.id === categoryChannel.id
        );
        // Tạo mảng trước và sau phần tử tìm thấy
        let endIndex = +data.CHANNEL_ORDER - categoryChannel.CHANNEL_ORDER;

        const arrayAfterTarget = categoryChannelAll.slice(
          targetIndex + 1,
          targetIndex + endIndex + 1
        );
        if (arrayAfterTarget && arrayAfterTarget.length > 0) {
          for (let i = 0; i < arrayAfterTarget.length; i++) {
            await db.CHANNEL_CATE_MAP.update(
              { CHANNEL_ORDER: arrayAfterTarget[i].CHANNEL_ORDER - 1 },
              { where: { id: arrayAfterTarget[i].id } }
            );
          }
        }
      }

      if (data.CHANNEL_ORDER < categoryChannel.CHANNEL_ORDER) {
        let categoryChannelOrderNew = await db.CHANNEL_CATE_MAP.findOne({
          attributes: ["id", "CHANNEL_ID", "CATE_ID", "CHANNEL_ORDER"],
          where: {
            [Op.and]: [
              { CATE_ID: +data.CATE_ID },
              { CHANNEL_ORDER: data.CHANNEL_ORDER },
            ],
          },
          raw: true,
        });

        if (categoryChannelOrderNew) {
          let endIndexExtend =
            categoryChannel.CHANNEL_ORDER -
            categoryChannelOrderNew.CHANNEL_ORDER;

          const targetIndex = categoryChannelAll.findIndex(
            (item) => item.id === categoryChannelOrderNew.id
          );

          const arrayAfterTarget = categoryChannelAll.slice(
            targetIndex,
            targetIndex + endIndexExtend
          );

          if (arrayAfterTarget && arrayAfterTarget.length > 0) {
            for (let i = 0; i < arrayAfterTarget.length; i++) {
              await db.CHANNEL_CATE_MAP.update(
                { CHANNEL_ORDER: arrayAfterTarget[i].CHANNEL_ORDER + 1 },
                { where: { id: arrayAfterTarget[i].id } }
              );
            }
          }
        } else {
          return {
            EM: "Category channel order new is not found!",
            EC: 1,
            DT: "",
          };
        }
      }

      await db.CHANNEL_CATE_MAP.update(
        { CHANNEL_ORDER: data.CHANNEL_ORDER },
        {
          where: {
            [Op.and]: [{ CHANNEL_ID: data.id }, { CATE_ID: data.CATE_ID }],
          },
        }
      );
      return {
        EM: "Update category channel number success!",
        EC: 0,
        DT: "",
      };

      // if (categoryChannel) {
      //   await categoryChannel.update({
      //     CHANNEL_ORDER: data.CHANNEL_ORDER,
      //   });
      //   return {
      //     EM: "Update category channel number success!",
      //     EC: 0,
      //     DT: "",
      //   };
      // } else {
      //   return {
      //     EM: "Category channel is not found!",
      //     EC: 1,
      //     DT: "",
      //   };
      // }
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

const handleCreatedWifi = async (data) => {
  try {
    if (!data) {
      return {
        EM: "missing paramesters!",
        EC: 1,
        DT: "",
      };
    } else {
      //handle create a new hotel with logo
      await db.INFORMATION_WIFI.create({
        SSID: data.SSID,
        PASSWORD: data.PASSWORD,
        POSSITION: data.POSSITION ? data.POSSITION : "",
        STATUS: 1,
        NOTE: data.NOTE ? data.NOTE : "",
      });

      return {
        EM: "Create Wifi success!",
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

const getWifiWithPagination = async (current, pageSize) => {
  try {
    let offset = (current - 1) * pageSize;
    const { count, rows } = await db.INFORMATION_WIFI.findAndCountAll({
      offset: offset,
      limit: pageSize,
      // where: { CHANNEL_STATUS: 1 },
      order: [["id", "DESC"]],
    });

    let totalPages = Math.ceil(count / pageSize);
    let data = {
      meta: {
        current: current,
        pageSize: pageSize,
        pages: totalPages,
        total: count,
      },
      wifis: rows,
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
      DT: "",
    };
  }
};

const handleDeleteWifi = async (id) => {
  try {
    let wifi = await db.INFORMATION_WIFI.findOne({
      where: { id: id },
    });

    if (wifi) {
      await wifi.destroy();
      return {
        EM: "Delete Wifi success!",
        EC: 0,
        DT: "",
      };
    } else {
      return {
        EM: "Wifi is not exist!",
        EC: 1,
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

const handleUpdateWifi = async (data) => {
  try {
    if (!data) {
      return {
        EM: "missing paramesters!",
        EC: 1,
        DT: "",
      };
    } else {
      let wifi = await db.INFORMATION_WIFI.findOne({
        where: {
          id: data.id,
        },
      });

      if (wifi) {
        await wifi.update({
          SSID: data.SSID,
          PASSWORD: data.PASSWORD,
          POSSITION: data.POSSITION ? data.POSSITION : "",
          STATUS: data.STATUS ? 1 : 0,
          NOTE: data.NOTE ? data.NOTE : "",
        });
        return {
          EM: "Update wifi success!",
          EC: 0,
          DT: "",
        };
      } else {
        return {
          EM: "Wifi is not found!",
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

const handleDeleteBackground = async (id) => {
  try {
    let background = await db.INFORMATION_HOTEL.findOne({
      where: { id: id },
    });

    if (background) {
      await background.destroy();

      if (background.BACKGROUND_PATH) {
        let backgroundDelete = background.BACKGROUND_PATH;

        if (fs.existsSync(backgroundDelete)) {
          fs.unlink(backgroundDelete, (err) => {
            if (err) throw err; //handle your error the way you want to;
            console.log("File was deleted: ", backgroundDelete); //or else the file will be deleted
          });
        } else {
          console.log("File is not found: ", backgroundDelete);
        }
      }

      return {
        EM: "Delete channel success!",
        EC: 0,
        DT: "",
      };
    } else {
      return {
        EM: "channel is not exist!",
        EC: 1,
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

const handleUpdateBackgroundHotel = async (data, file) => {
  try {
    if (!data) {
      return {
        EM: "missing paramesters!",
        EC: 1,
        DT: "",
      };
    } else {
      let backgroundHotel = await db.INFORMATION_HOTEL.findOne({
        where: { id: data.id },
      });
      let linkAvatar = process.env.LINK_AVATAR;
      if (backgroundHotel) {
        if (file) {
          if (fs.existsSync(backgroundHotel.BACKGROUND_PATH)) {
            fs.unlink(backgroundHotel.BACKGROUND_PATH, (err) => {
              if (err) throw err; //handle your error the way you want to;
              console.log(
                "Background was deleted: ",
                backgroundHotel.BACKGROUND_PATH
              ); //or else the file will be deleted
            });
          } else {
            console.log("File is not found: ", backgroundHotel.BACKGROUND_PATH);
          }

          await backgroundHotel.update({
            SUBJECT: data.SUBJECT,
            OPEN_LETTER_VI: data.OPEN_LETTER_VI,
            CONTENT_TITLE_VI: data.CONTENT_TITLE_VI,
            BACKGROUND_PATH: `${file.destination}/${file.filename}`,
            BACKGROUND_LINK: `${linkAvatar}/${file.filename}`,
            OPEN_LETTER_EN: data.OPEN_LETTER_EN,
            STATUS: data.STATUS === "false" ? 0 : 1,
            CONTENT_TITLE_EN: data.CONTENT_TITLE_EN,
          });
        } else {
          await backgroundHotel.update({
            SUBJECT: data.SUBJECT,
            OPEN_LETTER_VI: data.OPEN_LETTER_VI,
            CONTENT_TITLE_VI: data.CONTENT_TITLE_VI,
            OPEN_LETTER_EN: data.OPEN_LETTER_EN,
            STATUS: data.STATUS === "false" ? 0 : 1,
            CONTENT_TITLE_EN: data.CONTENT_TITLE_EN,
          });
        }
        return {
          EM: "Background hotel Update success!",
          EC: 0,
          DT: "",
        };
      } else {
        if (file) {
          let path = `${file.destination}/${file.filename}`;
          if (fs.existsSync(path)) {
            fs.unlink(path, (err) => {
              if (err) throw err; //handle your error the way you want to;
              console.log("Background Hotel was deleted: ", path); //or else the file will be deleted
            });
          } else {
            console.log("File is not found: ", path);
          }
          return {
            EM: "Background Infor Hotel is not found!",
            EC: 1,
            DT: "",
          };
        }
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

const handleCreateGuest = async (data) => {
  try {
    if (!data) {
      return {
        EM: "missing paramesters!",
        EC: 1,
        DT: "",
      };
    } else {
      await db.GUEST.create({
        GUEST_NAME: data.GUEST_NAME,
        ROOM_ID: data.ROOM_ID ? data.ROOM_ID : "",
        BOOK_CHECK_IN_DATE: data.timeDate[0],
        BOOK_CHECK_OUT_DATE: data.timeDate[1],
        NOTE: data.NOTE ? data.NOTE : "",
        STATUS: 1,
      });

      let room = await db.ROOM.findOne({
        where: {
          id: data.ROOM_ID,
        },
      });
      if (room) {
        await room.update({
          ROOM_STATUS: 0,
        });
      }

      return {
        EM: "Create Guest success!",
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

const handleCreateRoom = async (data) => {
  try {
    if (!data) {
      return {
        EM: "missing paramesters!",
        EC: 1,
        DT: "",
      };
    } else {
      await db.ROOM.create({
        INFORMATION_HOTEL_ID: data.INFORMATION_HOTEL_ID,
        WIFI_ID: data.WIFI_ID,
        ROOM_NAME: data.ROOM_NAME,
        ROOM_STATUS: 1,
        NOTE: data.NOTE,
      });

      return {
        EM: "Create Room success!",
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

const handleGetListGuestWithPagination = async (current, pageSize) => {
  try {
    let offset = (current - 1) * pageSize;
    const { count, rows } = await db.GUEST.findAndCountAll({
      offset: offset,
      limit: pageSize,
      attributes: [
        "id",
        "BOOK_CHECK_IN_DATE",
        "BOOK_CHECK_OUT_DATE",
        "GUEST_NAME",
        "NOTE",
        "STATUS",
      ],
      include: [
        {
          model: db.ROOM,
          attributes: ["id", "ROOM_NAME"],
        },
      ],
      order: [["id", "DESC"]],
    });

    let totalPages = Math.ceil(count / pageSize);
    let data = {
      meta: {
        current: current,
        pageSize: pageSize,
        pages: totalPages,
        total: count,
      },
      guests: rows,
    };
    return {
      EM: "Get list Guest success",
      EC: 0,
      DT: data,
    };
  } catch (e) {
    console.log(e);
    return {
      EM: "something wrongs with services",
      EC: 1,
      DT: "",
    };
  }
};

const handleDeleteGuest = async (id) => {
  try {
    let guest = await db.GUEST.findOne({
      where: { id: id },
    });

    if (guest) {
      await guest.destroy();
      return {
        EM: "Delete guest success!",
        EC: 0,
        DT: "",
      };
    } else {
      return {
        EM: "Guest is not exist!",
        EC: 1,
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

const handleUpdateGuest = async (data) => {
  try {
    if (!data) {
      return {
        EM: "missing paramesters!",
        EC: 1,
        DT: "",
      };
    } else {
      let guest = await db.GUEST.findOne({
        where: {
          id: data.id,
        },
      });

      if (guest) {
        //when guest change room
        if (data && data.ROOM_ID) {
          let roomOld = await db.ROOM.findOne({
            where: {
              id: guest.dataValues.ROOM_ID,
            },
          });
          if (roomOld) {
            await roomOld.update({
              ROOM_STATUS: 1,
            });
          }
          let roomNew = await db.ROOM.findOne({
            where: {
              id: data.ROOM_ID,
            },
          });
          if (roomNew) {
            await roomNew.update({
              ROOM_STATUS: 0,
            });
          }
        }

        //when check out room
        if (data && (data.STATUS === false || data.STATUS === 0)) {
          let roomNew = await db.ROOM.findOne({
            where: {
              id: guest.dataValues.ROOM_ID,
            },
          });

          if (roomNew) {
            await roomNew.update({
              ROOM_STATUS: 1,
            });
          }
        } else {
          let roomNew = await db.ROOM.findOne({
            where: {
              id: guest.dataValues.ROOM_ID,
            },
          });

          if (roomNew) {
            await roomNew.update({
              ROOM_STATUS: 0,
            });
          }
        }

        await guest.update({
          GUEST_NAME: data.GUEST_NAME,
          ROOM_ID: data.ROOM_ID ? data.ROOM_ID : guest.ROOM_ID,
          BOOK_CHECK_IN_DATE: data.timeDate[0]
            ? data.timeDate[0]
            : guest.BOOK_CHECK_IN_DATE,
          BOOK_CHECK_OUT_DATE: data.timeDate[1]
            ? data.timeDate[1]
            : guest.BOOK_CHECK_OUT_DATE,
          NOTE: data.NOTE ? data.NOTE : "",
          STATUS: data.STATUS ? 1 : 0,
        });

        return {
          EM: "Update Guest success!",
          EC: 0,
          DT: "",
        };
      } else {
        return {
          EM: "Guest is not found!",
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

const getAllWifi = async () => {
  try {
    let wifis = await db.INFORMATION_WIFI.findAll({
      where: { STATUS: 1 },
      attributes: ["id", "SSID", "PASSWORD"],
    });
    if (wifis) {
      return {
        EM: "get All wifi Success!",
        EC: 0,
        DT: wifis,
      };
    } else {
      return {
        EM: "get All Wifi Fail",
        EC: 1,
        DT: "",
      };
    }
  } catch (e) {
    console.log("check wifi: ", e);
    return {
      EM: "something wrongs with services",
      EC: 1,
      DT: "",
    };
  }
};

const handleGetListAllInformationHotel = async () => {
  try {
    let background = await db.INFORMATION_HOTEL.findAll({
      where: { STATUS: 1 },
      attributes: ["id", "SUBJECT", "BACKGROUND_LINK"],
    });
    if (background) {
      return {
        EM: "get All background Success!",
        EC: 0,
        DT: background,
      };
    } else {
      return {
        EM: "get All background Fail",
        EC: 1,
        DT: "",
      };
    }
  } catch (e) {
    console.log("check background: ", e);
    return {
      EM: "something wrongs with services",
      EC: 1,
      DT: "",
    };
  }
};

const handleGetListAllRoom = async () => {
  try {
    let room = await db.ROOM.findAll({
      // where: { ROOM_STATUS: 1 },
      attributes: ["id", "ROOM_NAME"],
    });
    if (room) {
      return {
        EM: "get All Room Success!",
        EC: 0,
        DT: room,
      };
    } else {
      return {
        EM: "get All Room Fail",
        EC: 1,
        DT: "",
      };
    }
  } catch (e) {
    console.log("check background: ", e);
    return {
      EM: "something wrongs with services",
      EC: 1,
      DT: "",
    };
  }
};

const handleGetListRoomWithPagination = async (current, pageSize) => {
  try {
    let offset = (current - 1) * pageSize;
    const { count, rows } = await db.ROOM.findAndCountAll({
      offset: offset,
      limit: pageSize,
      attributes: ["id", "ROOM_NAME", "ROOM_STATUS", "NOTE"],
      include: [
        {
          model: db.INFORMATION_HOTEL,
          attributes: ["id", "SUBJECT", "BACKGROUND_LINK"],
        },
        {
          model: db.INFORMATION_WIFI,
          attributes: ["id", "SSID", "PASSWORD"],
        },

        {
          model: db.DEVICE_MEMBER,
          attributes: ["id", "MAC_DEVICE"],
        },
      ],

      order: [["id", "DESC"]],
    });

    let totalPages = Math.ceil(count / pageSize);
    let room = {
      meta: {
        current: current,
        pageSize: pageSize,
        pages: totalPages,
        total: count,
      },
      rooms: rows,
    };
    return {
      EM: "Get list Room success",
      EC: 0,
      DT: room,
    };
  } catch (e) {
    console.log(e);
    return {
      EM: "something wrongs with services",
      EC: 1,
      DT: "",
    };
  }
};

const handleDeleteRoom = async (id) => {
  try {
    let room = await db.ROOM.findOne({
      where: { id: id },
    });

    if (room) {
      await room.destroy();
      return {
        EM: "Delete room success!",
        EC: 0,
        DT: "",
      };
    } else {
      return {
        EM: "Room is not exist!",
        EC: 1,
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

const handleUpdateRoom = async (data) => {
  try {
    if (!data) {
      return {
        EM: "missing paramesters!",
        EC: 1,
        DT: "",
      };
    } else {
      let room = await db.ROOM.findOne({
        where: {
          id: data.id,
        },
      });

      if (room) {
        await room.update({
          ROOM_NAME: data.ROOM_NAME,
          WIFI_ID: data.WIFI_ID ? data.WIFI_ID : room.WIFI_ID,
          INFORMATION_HOTEL_ID: data.INFORMATION_HOTEL_ID
            ? data.INFORMATION_HOTEL_ID
            : room.INFORMATION_HOTEL_ID,
          NOTE: data.NOTE ? data.NOTE : "",
          ROOM_STATUS: data.ROOM_STATUS,
        });
        return {
          EM: "Update Room success!",
          EC: 0,
          DT: "",
        };
      } else {
        return {
          EM: "Room is not found!",
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

const handleCreateDevice = async (data) => {
  try {
    if (!data) {
      return {
        EM: "missing paramesters!",
        EC: 1,
        DT: "",
      };
    } else {
      await db.DEVICE_MEMBER.create({
        ROOM_ID: data.ROOM_ID ? data.ROOM_ID : null,
        SERVICE_TYPE: data.SERVICE_TYPE,
        DEVICE_PLAYER_TYPE: data.DEVICE_PLAYER_TYPE,
        MAC_DEVICE: data.MAC_DEVICE,
        SERI_DEVICE: data.SERI_DEVICE,
        SSID: data.SSID,
        STATUS_DEVICE: 1,
        // LAST_LOGIN_DATE: data.LAST_LOGIN_DATE ? data.LAST_LOGIN_DATE : "",
        // LAST_LOGIN_IP: data.LAST_LOGIN_IP ? data.LAST_LOGIN_IP : "",
        NOTE: data.NOTE ? data.NOTE : "",
      });

      return {
        EM: "Create Device success!",
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

const handleGetListDeviceWithPagination = async (current, pageSize) => {
  try {
    let offset = (current - 1) * pageSize;
    const { count, rows } = await db.DEVICE_MEMBER.findAndCountAll({
      offset: offset,
      limit: pageSize,
      attributes: [
        "id",
        "SERVICE_TYPE",
        "DEVICE_PLAYER_TYPE",
        "MAC_DEVICE",
        "SERI_DEVICE",
        "STATUS_DEVICE",
        "SSID",
      ],
      include: [
        {
          model: db.ROOM,
          attributes: ["id", "ROOM_NAME"],
        },
      ],

      order: [["id", "DESC"]],
    });

    let totalPages = Math.ceil(count / pageSize);
    let device = {
      meta: {
        current: current,
        pageSize: pageSize,
        pages: totalPages,
        total: count,
      },
      devices: rows,
    };
    return {
      EM: "Get list Device success",
      EC: 0,
      DT: device,
    };
  } catch (e) {
    console.log(e);
    return {
      EM: "something wrongs with services",
      EC: 1,
      DT: "",
    };
  }
};

const handleDeleteDevice = async (id) => {
  try {
    let device = await db.DEVICE_MEMBER.findOne({
      where: { id: id },
    });

    if (device) {
      await device.destroy();
      return {
        EM: "Delete Device success!",
        EC: 0,
        DT: "",
      };
    } else {
      return {
        EM: "Device is not exist!",
        EC: 1,
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

const handleUpdateDevice = async (data) => {
  try {
    if (!data) {
      return {
        EM: "missing paramesters!",
        EC: 1,
        DT: "",
      };
    } else {
      let device = await db.DEVICE_MEMBER.findOne({
        where: {
          id: data.id,
        },
      });

      if (device) {
        await device.update({
          MAC_DEVICE: data.MAC_DEVICE,
          SERI_DEVICE: data.SERI_DEVICE,
          SERVICE_TYPE: data.SERVICE_TYPE,
          DEVICE_PLAYER_TYPE: data.DEVICE_PLAYER_TYPE,
          ROOM_ID: data.ROOM_ID,
          STATUS_DEVICE: data.STATUS_DEVICE ? 1 : 0,
        });
        return {
          EM: "Update Device success!",
          EC: 0,
          DT: "",
        };
      } else {
        return {
          EM: "Device is not found!",
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
  handleCreateAHotel,
  handleDeleteAHotel,
  handleGetAllHotel,
  handleGetAllHotelWithPagination,
  handleUpdateAHotel,
  handleCreateCategoryChannel,
  handleGetCategoryChannel,
  handleUpdateCategoryChannel,
  handleDeleteCategoryChannel,
  handleCreateChannel,
  getAllChannel,
  getChannelWithPagination,
  handleDeleteChannel,
  handleUpdateAChannel,
  handleCreateChannelCategory,
  handleGetCategoryViaChannel,
  handleDeleteAssignChannelCategory,
  handleUpdateCategoryChannelAssign,
  handleCreatedWifi,
  getWifiWithPagination,
  handleDeleteWifi,
  handleUpdateWifi,
  handleCreateInformationHotel,
  handleGetListInformationHotelWithPagination,
  handleDeleteBackground,
  handleUpdateBackgroundHotel,
  handleCreateGuest,
  handleGetListGuestWithPagination,
  handleDeleteGuest,
  handleUpdateGuest,
  getAllWifi,
  handleGetListAllInformationHotel,
  handleCreateRoom,
  handleGetListRoomWithPagination,
  handleGetListAllRoom,
  handleDeleteRoom,
  handleUpdateRoom,
  handleCreateDevice,
  handleGetListDeviceWithPagination,
  handleDeleteDevice,
  handleUpdateDevice,
  handleGetAllListChannel,
  getChannelWithId,
  getChannelFilter,
  handleGetCategoryViaChannelWithPage,
  handleUpdateStatusChannel,
};
