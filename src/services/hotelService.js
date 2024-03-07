import db from "../models/index";
require("dotenv").config();
import mysql from "mysql2/promise";
import bluebird from "bluebird";
import { Op } from "sequelize";
const fs = require("fs");

const handleCreateService = async (data) => {
  try {
    if (!data) {
      return {
        EM: "missing paramesters!",
        EC: 1,
        DT: "",
      };
    } else {
      const connection = await mysql.createConnection({
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE_NAME,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        Promise: bluebird,
      });
      const [sortOderServices, fields] = await connection.execute(
        `SELECT MAX(SORT_ORDER) AS "SORT_ORDER" FROM CATEGORY_SERVICE`
      );
      console.log("check data: ", sortOderServices);
      await db.CATEGORY_SERVICE.create({
        CATEGORY_NAME_VI: data.CATEGORY_NAME_VI,
        CATEGORY_NAME_EN: data.CATEGORY_NAME_EN,
        SORT_ORDER: sortOderServices[0].SORT_ORDER
          ? sortOderServices[0].SORT_ORDER + 1
          : 1,
        STATUS: 1,
      });

      return {
        EM: "Create new a service success!",
        EC: 0,
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

const handleCreateMenuHotel = async (data) => {
  try {
    if (!data) {
      return {
        EM: "missing paramesters!",
        EC: 1,
        DT: "",
      };
    } else {
      const connection = await mysql.createConnection({
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE_NAME,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        Promise: bluebird,
      });
      const [sortOderServices, fields] = await connection.execute(
        `SELECT MAX(SORT_ORDER) AS "SORT_ORDER" FROM CATEGORY_MENU`
      );
      await db.CATEGORY_MENU.create({
        CATEGORY_NAME_VI: data.CATEGORY_NAME_VI,
        CATEGORY_NAME_EN: data.CATEGORY_NAME_EN,
        SORT_ORDER: sortOderServices[0].SORT_ORDER
          ? sortOderServices[0].SORT_ORDER + 1
          : 1,
        STATUS: 1,
      });

      return {
        EM: "Create new a menu success!",
        EC: 0,
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

const handleCreateExploreHotel = async (data) => {
  try {
    if (!data) {
      return {
        EM: "missing paramesters!",
        EC: 1,
        DT: "",
      };
    } else {
      const connection = await mysql.createConnection({
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE_NAME,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        Promise: bluebird,
      });
      const [sortOderServices, fields] = await connection.execute(
        `SELECT MAX(SORT_ORDER) AS "SORT_ORDER" FROM CATEGORY_EXPLORE`
      );
      await db.CATEGORY_EXPLORE.create({
        CATEGORY_NAME_VI: data.CATEGORY_NAME_VI,
        CATEGORY_NAME_EN: data.CATEGORY_NAME_EN,
        SORT_ORDER: sortOderServices[0].SORT_ORDER
          ? sortOderServices[0].SORT_ORDER + 1
          : 1,
        STATUS: 1,
      });

      return {
        EM: "Create new a explore success!",
        EC: 0,
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

const handleCreateGuideHotel = async (data) => {
  try {
    if (!data) {
      return {
        EM: "missing paramesters!",
        EC: 1,
        DT: "",
      };
    } else {
      const connection = await mysql.createConnection({
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE_NAME,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        Promise: bluebird,
      });
      const [sortOderServices, fields] = await connection.execute(
        `SELECT MAX(SORT_ORDER) AS "SORT_ORDER" FROM CATEGORY_GUIDE`
      );
      await db.CATEGORY_GUIDE.create({
        CATEGORY_NAME_VI: data.CATEGORY_NAME_VI,
        CATEGORY_NAME_EN: data.CATEGORY_NAME_EN,
        SORT_ORDER: sortOderServices[0].SORT_ORDER
          ? sortOderServices[0].SORT_ORDER + 1
          : 1,
        STATUS: 1,
      });

      return {
        EM: "Create new a guide success!",
        EC: 0,
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

const getServiceWithPagination = async (current, pageSize) => {
  try {
    let offset = (current - 1) * pageSize;

    let countService = await db.CATEGORY_SERVICE.count({
      // where: { STATUS: 1 },
      distinct: true,
      col: "id",
    });

    const { count, rows } = await db.CATEGORY_SERVICE.findAndCountAll({
      offset: offset,
      limit: pageSize,
      attributes: [
        "id",
        "CATEGORY_NAME_VI",
        "CATEGORY_NAME_EN",
        "SORT_ORDER",
        "STATUS",
      ],
      include: [
        {
          model: db.SERVICE_HOTEL,
          attributes: [
            "id",
            "SERVICE_LINK",
            "TITLE_EN",
            "SERVICE_DESCRIPTION_EN",
            "TITLE_VI",
            "SERVICE_DESCRIPTION_VI",
            "ORDER",
            "STATUS",
          ],
          // where: { ORDER: 1 },
          required: false,
        },
      ],
      // where: { STATUS: 1 },

      order: [
        ["SORT_ORDER", "ASC"],
        [db.SERVICE_HOTEL, "ORDER", "ASC"],
      ],
    });

    let totalPages = Math.ceil(countService / pageSize);

    let data = {
      meta: {
        current: current,
        pageSize: pageSize,
        pages: totalPages,
        total: countService,
      },
      services: rows,
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

const getMenuHotelWithPagination = async (current, pageSize) => {
  try {
    let offset = (current - 1) * pageSize;

    let countService = await db.CATEGORY_MENU.count({
      // where: { STATUS: 1 },
      distinct: true,
      col: "id",
    });

    const { count, rows } = await db.CATEGORY_MENU.findAndCountAll({
      offset: offset,
      limit: pageSize,
      attributes: [
        "id",
        "CATEGORY_NAME_VI",
        "CATEGORY_NAME_EN",
        "SORT_ORDER",
        "STATUS",
      ],
      include: [
        {
          model: db.MENU_HOTEL,
          attributes: [
            "id",
            "SERVICE_LINK",
            "TITLE_EN",
            "SERVICE_DESCRIPTION_EN",
            "TITLE_VI",
            "SERVICE_DESCRIPTION_VI",
            "ORDER",
            "STATUS",
          ],
          // where: { ORDER: 1 },
          required: false,
        },
      ],
      // where: { STATUS: 1 },

      order: [
        ["SORT_ORDER", "ASC"],
        [db.MENU_HOTEL, "ORDER", "ASC"],
      ],
    });

    let totalPages = Math.ceil(countService / pageSize);

    let data = {
      meta: {
        current: current,
        pageSize: pageSize,
        pages: totalPages,
        total: countService,
      },
      menuHotel: rows,
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

const getExploreHotelWithPagination = async (current, pageSize) => {
  try {
    let offset = (current - 1) * pageSize;

    let countService = await db.CATEGORY_EXPLORE.count({
      // where: { STATUS: 1 },
      distinct: true,
      col: "id",
    });

    const { count, rows } = await db.CATEGORY_EXPLORE.findAndCountAll({
      offset: offset,
      limit: pageSize,
      attributes: [
        "id",
        "CATEGORY_NAME_VI",
        "CATEGORY_NAME_EN",
        "SORT_ORDER",
        "STATUS",
      ],
      include: [
        {
          model: db.EXPLORE_HOTEL,
          attributes: [
            "id",
            "SERVICE_LINK",
            "TITLE_EN",
            "SERVICE_DESCRIPTION_EN",
            "TITLE_VI",
            "SERVICE_DESCRIPTION_VI",
            "ORDER",
            "STATUS",
          ],
          // where: { ORDER: 1 },
          required: false,
        },
      ],
      // where: { STATUS: 1 },

      order: [
        ["SORT_ORDER", "ASC"],
        [db.EXPLORE_HOTEL, "ORDER", "ASC"],
      ],
    });

    let totalPages = Math.ceil(countService / pageSize);

    let data = {
      meta: {
        current: current,
        pageSize: pageSize,
        pages: totalPages,
        total: countService,
      },
      exploreHotel: rows,
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

const getGuideHotelWithPagination = async (current, pageSize) => {
  try {
    let offset = (current - 1) * pageSize;

    let countService = await db.CATEGORY_GUIDE.count({
      // where: { STATUS: 1 },
      distinct: true,
      col: "id",
    });

    const { count, rows } = await db.CATEGORY_GUIDE.findAndCountAll({
      offset: offset,
      limit: pageSize,
      attributes: [
        "id",
        "CATEGORY_NAME_VI",
        "CATEGORY_NAME_EN",
        "SORT_ORDER",
        "STATUS",
      ],
      include: [
        {
          model: db.GUIDE_HOTEL,
          attributes: [
            "id",
            "SERVICE_LINK",
            "TITLE_EN",
            "SERVICE_DESCRIPTION_EN",
            "TITLE_VI",
            "SERVICE_DESCRIPTION_VI",
            "ORDER",
            "STATUS",
          ],
          // where: { ORDER: 1 },
          required: false,
        },
      ],
      // where: { STATUS: 1 },

      order: [
        ["SORT_ORDER", "ASC"],
        [db.GUIDE_HOTEL, "ORDER", "ASC"],
      ],
    });

    let totalPages = Math.ceil(countService / pageSize);

    let data = {
      meta: {
        current: current,
        pageSize: pageSize,
        pages: totalPages,
        total: countService,
      },
      exploreHotel: rows,
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

const handleCreateExtendService = async (data, file) => {
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
        const connection = await mysql.createConnection({
          user: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_DATABASE_NAME,
          host: process.env.DB_HOST,
          port: process.env.DB_PORT,
          Promise: bluebird,
        });
        const [serviceMax, fields] = await connection.execute(
          "SELECT MAX(`ORDER`) AS `ORDER` FROM SERVICE_HOTEL WHERE SERVICE_ID = ? ",
          [+data.service_id]
        );

        await db.SERVICE_HOTEL.create({
          SERVICE_ID: data.service_id,
          TITLE_VI: data.TITLE_VI !== "undefined" ? data.TITLE_VI : "",
          TITLE_EN: data.TITLE_EN !== "undefined" ? data.TITLE_EN : "",
          SERVICE_DESCRIPTION_VI:
            data.SERVICE_DESCRIPTION_VI !== "undefined"
              ? data.SERVICE_DESCRIPTION_VI
              : "",
          SERVICE_DESCRIPTION_EN:
            data.SERVICE_DESCRIPTION_EN !== "undefined"
              ? data.SERVICE_DESCRIPTION_EN
              : "",
          SERVICE_PATH: `${file.destination}/${file.filename}`,
          SERVICE_LINK: `${linkAvatar}/${file.filename}`,
          ORDER: serviceMax[0].ORDER ? serviceMax[0].ORDER + 1 : 1,
          IS_SHOW_TEXT:
            data.TITLE_EN !== "undefined" &&
            data.SERVICE_DESCRIPTION_EN !== "undefined"
              ? 1
              : 0,
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
        const [serviceMax, fields] = await connection.execute(
          "SELECT MAX(`ORDER`) AS `ORDER` FROM SERVICE_HOTEL WHERE SERVICE_ID = ? ",
          [+data.service_id]
        );

        await db.SERVICE_HOTEL.create({
          SERVICE_ID: data.service_id,
          TITLE_VI: data.TITLE_VI !== "undefined" ? data.TITLE_VI : "",
          TITLE_EN: data.TITLE_EN !== "undefined" ? data.TITLE_EN : "",
          SERVICE_DESCRIPTION_VI:
            data.SERVICE_DESCRIPTION_VI !== "undefined"
              ? data.SERVICE_DESCRIPTION_VI
              : "",
          SERVICE_DESCRIPTION_EN:
            data.SERVICE_DESCRIPTION_EN !== "undefined"
              ? data.SERVICE_DESCRIPTION_EN
              : "",
          ORDER: serviceMax[0].ORDER ? serviceMax[0].ORDER + 1 : 1,
          IS_SHOW_TEXT:
            data.TITLE_EN !== "undefined" &&
            data.SERVICE_DESCRIPTION_EN !== "undefined"
              ? 1
              : 0,
          STATUS: 1,
        });
      }
      return {
        EM: "Create Service Extend success!",
        EC: 0,
        DT: "",
      };
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

const handleCreateMenuHotelExtend = async (data, file) => {
  try {
    if (!data) {
      return {
        EM: "missing paramesters!",
        EC: 1,
        DT: "",
      };
    } else {
      console.log(data);
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
        const [serviceMax, fields] = await connection.execute(
          "SELECT MAX(`ORDER`) AS `ORDER` FROM MENU_HOTEL WHERE SERVICE_ID = ? ",
          [+data.service_id]
        );

        await db.MENU_HOTEL.create({
          // SERVICE_ID: data.service_id,
          // TITLE_VI: data.TITLE_VI,
          // TITLE_EN: data.TITLE_EN,
          // SERVICE_DESCRIPTION_VI: data.SERVICE_DESCRIPTION_VI,
          // SERVICE_DESCRIPTION_EN: data.SERVICE_DESCRIPTION_EN,
          // SERVICE_PATH: `${file.destination}/${file.filename}`,
          // SERVICE_LINK: `${linkAvatar}/${file.filename}`,
          // ORDER: serviceMax[0].ORDER ? serviceMax[0].ORDER + 1 : 1,
          // STATUS: 1,
          SERVICE_ID: data.service_id,
          TITLE_VI: data.TITLE_VI !== "undefined" ? data.TITLE_VI : "",
          TITLE_EN: data.TITLE_EN !== "undefined" ? data.TITLE_EN : "",
          SERVICE_DESCRIPTION_VI:
            data.SERVICE_DESCRIPTION_VI !== "undefined"
              ? data.SERVICE_DESCRIPTION_VI
              : "",
          SERVICE_DESCRIPTION_EN:
            data.SERVICE_DESCRIPTION_EN !== "undefined"
              ? data.SERVICE_DESCRIPTION_EN
              : "",
          SERVICE_PATH: `${file.destination}/${file.filename}`,
          SERVICE_LINK: `${linkAvatar}/${file.filename}`,
          ORDER: serviceMax[0].ORDER ? serviceMax[0].ORDER + 1 : 1,
          IS_SHOW_TEXT:
            data.TITLE_EN !== "undefined" &&
            data.SERVICE_DESCRIPTION_EN !== "undefined"
              ? 1
              : 0,
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
        const [serviceMax, fields] = await connection.execute(
          "SELECT MAX(`ORDER`) AS `ORDER` FROM MENU_HOTEL WHERE SERVICE_ID = ? ",
          [+data.service_id]
        );

        await db.MENU_HOTEL.create({
          // SERVICE_ID: data.service_id,
          // TITLE_VI: data.TITLE_VI,
          // TITLE_EN: data.TITLE_EN,
          // SERVICE_DESCRIPTION_VI: data.SERVICE_DESCRIPTION_VI,
          // SERVICE_DESCRIPTION_EN: data.SERVICE_DESCRIPTION_EN,
          // ORDER: serviceMax[0].ORDER ? serviceMax[0].ORDER + 1 : 1,
          // STATUS: 1,

          SERVICE_ID: data.service_id,
          TITLE_VI: data.TITLE_VI !== "undefined" ? data.TITLE_VI : "",
          TITLE_EN: data.TITLE_EN !== "undefined" ? data.TITLE_EN : "",
          SERVICE_DESCRIPTION_VI:
            data.SERVICE_DESCRIPTION_VI !== "undefined"
              ? data.SERVICE_DESCRIPTION_VI
              : "",
          SERVICE_DESCRIPTION_EN:
            data.SERVICE_DESCRIPTION_EN !== "undefined"
              ? data.SERVICE_DESCRIPTION_EN
              : "",
          ORDER: serviceMax[0].ORDER ? serviceMax[0].ORDER + 1 : 1,
          IS_SHOW_TEXT:
            data.TITLE_EN !== "undefined" &&
            data.SERVICE_DESCRIPTION_EN !== "undefined"
              ? 1
              : 0,
          STATUS: 1,
        });
      }
      return {
        EM: "Create Menu Extend success!",
        EC: 0,
        DT: "",
      };
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

const handleCreateExploreExtend = async (data, file) => {
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
        const connection = await mysql.createConnection({
          user: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_DATABASE_NAME,
          host: process.env.DB_HOST,
          port: process.env.DB_PORT,
          Promise: bluebird,
        });
        const [serviceMax, fields] = await connection.execute(
          "SELECT MAX(`ORDER`) AS `ORDER` FROM EXPLORE_HOTEL WHERE SERVICE_ID = ? ",
          [+data.service_id]
        );

        await db.EXPLORE_HOTEL.create({
          // SERVICE_ID: data.service_id,
          // TITLE_VI: data.TITLE_VI,
          // TITLE_EN: data.TITLE_EN,
          // SERVICE_DESCRIPTION_VI: data.SERVICE_DESCRIPTION_VI,
          // SERVICE_DESCRIPTION_EN: data.SERVICE_DESCRIPTION_EN,
          // SERVICE_PATH: `${file.destination}/${file.filename}`,
          // SERVICE_LINK: `${linkAvatar}/${file.filename}`,
          // ORDER: serviceMax[0].ORDER ? serviceMax[0].ORDER + 1 : 1,
          // STATUS: 1,

          SERVICE_ID: data.service_id,
          TITLE_VI: data.TITLE_VI !== "undefined" ? data.TITLE_VI : "",
          TITLE_EN: data.TITLE_EN !== "undefined" ? data.TITLE_EN : "",
          SERVICE_DESCRIPTION_VI:
            data.SERVICE_DESCRIPTION_VI !== "undefined"
              ? data.SERVICE_DESCRIPTION_VI
              : "",
          SERVICE_DESCRIPTION_EN:
            data.SERVICE_DESCRIPTION_EN !== "undefined"
              ? data.SERVICE_DESCRIPTION_EN
              : "",
          SERVICE_PATH: `${file.destination}/${file.filename}`,
          SERVICE_LINK: `${linkAvatar}/${file.filename}`,
          ORDER: serviceMax[0].ORDER ? serviceMax[0].ORDER + 1 : 1,
          IS_SHOW_TEXT:
            data.TITLE_EN !== "undefined" &&
            data.SERVICE_DESCRIPTION_EN !== "undefined"
              ? 1
              : 0,
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
        const [serviceMax, fields] = await connection.execute(
          "SELECT MAX(`ORDER`) AS `ORDER` FROM EXPLORE_HOTEL WHERE SERVICE_ID = ? ",
          [+data.service_id]
        );

        await db.EXPLORE_HOTEL.create({
          // SERVICE_ID: data.service_id,
          // TITLE_VI: data.TITLE_VI,
          // TITLE_EN: data.TITLE_EN,
          // SERVICE_DESCRIPTION_VI: data.SERVICE_DESCRIPTION_VI,
          // SERVICE_DESCRIPTION_EN: data.SERVICE_DESCRIPTION_EN,
          // ORDER: serviceMax[0].ORDER ? serviceMax[0].ORDER + 1 : 1,
          // STATUS: 1,

          SERVICE_ID: data.service_id,
          TITLE_VI: data.TITLE_VI !== "undefined" ? data.TITLE_VI : "",
          TITLE_EN: data.TITLE_EN !== "undefined" ? data.TITLE_EN : "",
          SERVICE_DESCRIPTION_VI:
            data.SERVICE_DESCRIPTION_VI !== "undefined"
              ? data.SERVICE_DESCRIPTION_VI
              : "",
          SERVICE_DESCRIPTION_EN:
            data.SERVICE_DESCRIPTION_EN !== "undefined"
              ? data.SERVICE_DESCRIPTION_EN
              : "",
          ORDER: serviceMax[0].ORDER ? serviceMax[0].ORDER + 1 : 1,
          IS_SHOW_TEXT:
            data.TITLE_EN !== "undefined" &&
            data.SERVICE_DESCRIPTION_EN !== "undefined"
              ? 1
              : 0,
          STATUS: 1,
        });
      }
      return {
        EM: "Create Explore Extend success!",
        EC: 0,
        DT: "",
      };
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

const handleCreateGuideExtend = async (data, file) => {
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
        const connection = await mysql.createConnection({
          user: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_DATABASE_NAME,
          host: process.env.DB_HOST,
          port: process.env.DB_PORT,
          Promise: bluebird,
        });
        const [serviceMax, fields] = await connection.execute(
          "SELECT MAX(`ORDER`) AS `ORDER` FROM GUIDE_HOTEL WHERE SERVICE_ID = ? ",
          [+data.service_id]
        );

        await db.GUIDE_HOTEL.create({
          // SERVICE_ID: data.service_id,
          // TITLE_VI: data.TITLE_VI,
          // TITLE_EN: data.TITLE_EN,
          // SERVICE_DESCRIPTION_VI: data.SERVICE_DESCRIPTION_VI,
          // SERVICE_DESCRIPTION_EN: data.SERVICE_DESCRIPTION_EN,
          // SERVICE_PATH: `${file.destination}/${file.filename}`,
          // SERVICE_LINK: `${linkAvatar}/${file.filename}`,
          // ORDER: serviceMax[0].ORDER ? serviceMax[0].ORDER + 1 : 1,
          // STATUS: 1,

          SERVICE_ID: data.service_id,
          TITLE_VI: data.TITLE_VI !== "undefined" ? data.TITLE_VI : "",
          TITLE_EN: data.TITLE_EN !== "undefined" ? data.TITLE_EN : "",
          SERVICE_DESCRIPTION_VI:
            data.SERVICE_DESCRIPTION_VI !== "undefined"
              ? data.SERVICE_DESCRIPTION_VI
              : "",
          SERVICE_DESCRIPTION_EN:
            data.SERVICE_DESCRIPTION_EN !== "undefined"
              ? data.SERVICE_DESCRIPTION_EN
              : "",
          SERVICE_PATH: `${file.destination}/${file.filename}`,
          SERVICE_LINK: `${linkAvatar}/${file.filename}`,
          ORDER: serviceMax[0].ORDER ? serviceMax[0].ORDER + 1 : 1,
          IS_SHOW_TEXT: 0,
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
        const [serviceMax, fields] = await connection.execute(
          "SELECT MAX(`ORDER`) AS `ORDER` FROM GUIDE_HOTEL WHERE SERVICE_ID = ? ",
          [+data.service_id]
        );

        await db.GUIDE_HOTEL.create({
          // SERVICE_ID: data.service_id,
          // TITLE_VI: data.TITLE_VI,
          // TITLE_EN: data.TITLE_EN,
          // SERVICE_DESCRIPTION_VI: data.SERVICE_DESCRIPTION_VI,
          // SERVICE_DESCRIPTION_EN: data.SERVICE_DESCRIPTION_EN,
          // ORDER: serviceMax[0].ORDER ? serviceMax[0].ORDER + 1 : 1,
          // STATUS: 1,

          SERVICE_ID: data.service_id,
          TITLE_VI: data.TITLE_VI !== "undefined" ? data.TITLE_VI : "",
          TITLE_EN: data.TITLE_EN !== "undefined" ? data.TITLE_EN : "",
          SERVICE_DESCRIPTION_VI:
            data.SERVICE_DESCRIPTION_VI !== "undefined"
              ? data.SERVICE_DESCRIPTION_VI
              : "",
          SERVICE_DESCRIPTION_EN:
            data.SERVICE_DESCRIPTION_EN !== "undefined"
              ? data.SERVICE_DESCRIPTION_EN
              : "",
          ORDER: serviceMax[0].ORDER ? serviceMax[0].ORDER + 1 : 1,
          IS_SHOW_TEXT: 1,
          STATUS: 1,
        });
      }
      return {
        EM: "Create Guide Extend success!",
        EC: 0,
        DT: "",
      };
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

const handleUpdateServiceExtend = async (data, file) => {
  try {
    if (!data) {
      return {
        EM: "missing paramesters!",
        EC: 1,
        DT: "",
      };
    } else {
      let serviceExtend = await db.SERVICE_HOTEL.findOne({
        where: { id: +data.id },
        raw: true,
      });

      // nếu order lớn hơn order service hiện tại thì
      if (+data.ORDER > serviceExtend.ORDER) {
        // Ex: data : stt = 3 vs order old = 2
        let serviceExtendAll = await db.SERVICE_HOTEL.findAll({
          where: { SERVICE_ID: +data.service_id },
          raw: true,
          order: [["ORDER", "ASC"]],
        });

        if (serviceExtend) {
          if (
            +data.ORDER > serviceExtendAll[serviceExtendAll.length - 1].ORDER
          ) {
            return {
              EM: "Update service extend hotel Fail!, số thứ tự được chọn lớn hơn phần tử lớn nhất ",
              EC: 0,
              DT: "",
            };
          }

          const targetIndex = serviceExtendAll.findIndex(
            (item) => item.id === serviceExtend.id
          );
          // Tạo mảng trước và sau phần tử tìm thấy
          let endIndex = +data.ORDER - serviceExtend.ORDER;

          const arrayAfterTarget = serviceExtendAll.slice(
            targetIndex + 1,
            targetIndex + endIndex + 1
          );
          if (arrayAfterTarget && arrayAfterTarget.length > 0) {
            for (let i = 0; i < arrayAfterTarget.length; i++) {
              await db.SERVICE_HOTEL.update(
                { ORDER: arrayAfterTarget[i].ORDER - 1 },
                { where: { id: arrayAfterTarget[i].id } }
              );
            }
          }
        }
      }
      // nếu order nhỏ hơn order service hiện tại thì
      else if (+data.ORDER < serviceExtend.ORDER) {
        // Ex: data : stt = 2 vs order old = 3

        let serviceExtendAll = await db.SERVICE_HOTEL.findAll({
          where: { SERVICE_ID: +data.service_id },
          order: [["ORDER", "ASC"]],
          raw: true,
        });

        let serviceExtendOrderNew = await db.SERVICE_HOTEL.findOne({
          where: {
            [Op.and]: [
              { SERVICE_ID: +data.service_id },
              { ORDER: +data.ORDER },
            ],
          },
          raw: true,
        });

        if (serviceExtendOrderNew) {
          let endIndexExtend =
            serviceExtend.ORDER - serviceExtendOrderNew.ORDER;

          const targetIndex = serviceExtendAll.findIndex(
            (item) => item.id === serviceExtendOrderNew.id
          );

          const arrayAfterTarget = serviceExtendAll.slice(
            targetIndex,
            targetIndex + endIndexExtend
          );

          if (arrayAfterTarget && arrayAfterTarget.length > 0) {
            for (let i = 0; i < arrayAfterTarget.length; i++) {
              await db.SERVICE_HOTEL.update(
                { ORDER: arrayAfterTarget[i].ORDER + 1 },
                { where: { id: arrayAfterTarget[i].id } }
              );
            }
          }
        }
      }

      let linkLogo = process.env.LINK_AVATAR;
      if (serviceExtend) {
        if (file) {
          if (fs.existsSync(serviceExtend.SERVICE_PATH)) {
            fs.unlink(serviceExtend.SERVICE_PATH, (err) => {
              if (err) throw err; //handle your error the way you want to;
              console.log("Channel was deleted: ", serviceExtend.SERVICE_PATH); //or else the file will be deleted
            });
          } else {
            console.log("File is not found: ", serviceExtend.SERVICE_PATH);
          }
          await db.SERVICE_HOTEL.update(
            {
              TITLE_VI: data.TITLE_VI !== "undefined" ? data.TITLE_VI : "",
              TITLE_EN: data.TITLE_EN !== "undefined" ? data.TITLE_EN : "",
              SERVICE_DESCRIPTION_VI:
                data.SERVICE_DESCRIPTION_VI !== "undefined"
                  ? data.SERVICE_DESCRIPTION_VI
                  : "",
              SERVICE_DESCRIPTION_EN:
                data.SERVICE_DESCRIPTION_EN !== "undefined"
                  ? data.SERVICE_DESCRIPTION_EN
                  : "",
              SERVICE_PATH: `${file.destination}/${file.filename}`,
              SERVICE_LINK: `${linkLogo}/${file.filename}`,
              STATUS: data.STATUS === "false" ? 0 : 1,
              IS_SHOW_TEXT:
                data.TITLE_EN !== "undefined" &&
                data.TITLE_EN !== "" &&
                data.SERVICE_DESCRIPTION_EN !== "undefined" &&
                data.SERVICE_DESCRIPTION_EN !== ""
                  ? 1
                  : 0,
              ORDER: data.ORDER,
            },
            { where: { id: +data.id } }
          );
        } else {
          await db.SERVICE_HOTEL.update(
            {
              TITLE_VI: data.TITLE_VI !== "undefined" ? data.TITLE_VI : "",
              TITLE_EN: data.TITLE_EN !== "undefined" ? data.TITLE_EN : "",
              SERVICE_DESCRIPTION_VI:
                data.SERVICE_DESCRIPTION_VI !== "undefined"
                  ? data.SERVICE_DESCRIPTION_VI
                  : "",
              SERVICE_DESCRIPTION_EN:
                data.SERVICE_DESCRIPTION_EN !== "undefined"
                  ? data.SERVICE_DESCRIPTION_EN
                  : "",
              STATUS: data.STATUS === "false" ? 0 : 1,
              IS_SHOW_TEXT:
                data.TITLE_EN !== "undefined" &&
                data.TITLE_EN !== "" &&
                data.SERVICE_DESCRIPTION_EN !== "undefined" &&
                data.SERVICE_DESCRIPTION_EN !== ""
                  ? 1
                  : 0,
              ORDER: data.ORDER,
            },
            { where: { id: +data.id } }
          );
        }
        return {
          EM: "Update service extend hotel success!",
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
            EM: "Service Extend is not found!",
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

const handleUpdateMenuExtend = async (data, file) => {
  try {
    if (!data) {
      return {
        EM: "missing paramesters!",
        EC: 1,
        DT: "",
      };
    } else {
      let serviceExtend = await db.MENU_HOTEL.findOne({
        where: { id: +data.id },
        raw: true,
      });

      // nếu order lớn hơn order service hiện tại thì
      if (+data.ORDER > serviceExtend.ORDER) {
        // Ex: data : stt = 3 vs order old = 2
        let serviceExtendAll = await db.MENU_HOTEL.findAll({
          where: { SERVICE_ID: +data.service_id },
          raw: true,
          order: [["ORDER", "ASC"]],
        });

        if (serviceExtend) {
          if (
            +data.ORDER > serviceExtendAll[serviceExtendAll.length - 1].ORDER
          ) {
            return {
              EM: "Update menu extend hotel Fail!, số thứ tự được chọn lớn hơn phần tử lớn nhất ",
              EC: 0,
              DT: "",
            };
          }

          const targetIndex = serviceExtendAll.findIndex(
            (item) => item.id === serviceExtend.id
          );
          // Tạo mảng trước và sau phần tử tìm thấy
          let endIndex = +data.ORDER - serviceExtend.ORDER;

          const arrayAfterTarget = serviceExtendAll.slice(
            targetIndex + 1,
            targetIndex + endIndex + 1
          );
          if (arrayAfterTarget && arrayAfterTarget.length > 0) {
            for (let i = 0; i < arrayAfterTarget.length; i++) {
              await db.MENU_HOTEL.update(
                { ORDER: arrayAfterTarget[i].ORDER - 1 },
                { where: { id: arrayAfterTarget[i].id } }
              );
            }
          }
        }
      }
      // nếu order nhỏ hơn order service hiện tại thì
      else if (+data.ORDER < serviceExtend.ORDER) {
        // Ex: data : stt = 2 vs order old = 3

        let serviceExtendAll = await db.MENU_HOTEL.findAll({
          where: { SERVICE_ID: +data.service_id },
          order: [["ORDER", "ASC"]],
          raw: true,
        });

        let serviceExtendOrderNew = await db.MENU_HOTEL.findOne({
          where: {
            [Op.and]: [
              { SERVICE_ID: +data.service_id },
              { ORDER: +data.ORDER },
            ],
          },
          raw: true,
        });

        if (serviceExtendOrderNew) {
          let endIndexExtend =
            serviceExtend.ORDER - serviceExtendOrderNew.ORDER;

          const targetIndex = serviceExtendAll.findIndex(
            (item) => item.id === serviceExtendOrderNew.id
          );

          const arrayAfterTarget = serviceExtendAll.slice(
            targetIndex,
            targetIndex + endIndexExtend
          );

          if (arrayAfterTarget && arrayAfterTarget.length > 0) {
            for (let i = 0; i < arrayAfterTarget.length; i++) {
              await db.MENU_HOTEL.update(
                { ORDER: arrayAfterTarget[i].ORDER + 1 },
                { where: { id: arrayAfterTarget[i].id } }
              );
            }
          }
        }
      }

      let linkLogo = process.env.LINK_AVATAR;
      if (serviceExtend) {
        if (file) {
          if (fs.existsSync(serviceExtend.SERVICE_PATH)) {
            fs.unlink(serviceExtend.SERVICE_PATH, (err) => {
              if (err) throw err; //handle your error the way you want to;
              console.log("Menu was deleted: ", serviceExtend.SERVICE_PATH); //or else the file will be deleted
            });
          } else {
            console.log("File is not found: ", serviceExtend.SERVICE_PATH);
          }

          await db.MENU_HOTEL.update(
            {
              // TITLE_VI: data.TITLE_VI,
              // TITLE_EN: data.TITLE_EN,
              // SERVICE_DESCRIPTION_EN: data.SERVICE_DESCRIPTION_EN,
              // SERVICE_DESCRIPTION_VI: data.SERVICE_DESCRIPTION_VI,
              // SERVICE_PATH: `${file.destination}/${file.filename}`,
              // SERVICE_LINK: `${linkLogo}/${file.filename}`,
              // STATUS: data.STATUS === "false" ? 0 : 1,
              // ORDER: data.ORDER,

              TITLE_VI: data.TITLE_VI !== "undefined" ? data.TITLE_VI : "",
              TITLE_EN: data.TITLE_EN !== "undefined" ? data.TITLE_EN : "",
              SERVICE_DESCRIPTION_VI:
                data.SERVICE_DESCRIPTION_VI !== "undefined"
                  ? data.SERVICE_DESCRIPTION_VI
                  : "",
              SERVICE_DESCRIPTION_EN:
                data.SERVICE_DESCRIPTION_EN !== "undefined"
                  ? data.SERVICE_DESCRIPTION_EN
                  : "",
              SERVICE_PATH: `${file.destination}/${file.filename}`,
              SERVICE_LINK: `${linkLogo}/${file.filename}`,
              STATUS: data.STATUS === "false" ? 0 : 1,
              IS_SHOW_TEXT:
                data.TITLE_EN !== "undefined" &&
                data.TITLE_EN !== "" &&
                data.SERVICE_DESCRIPTION_EN !== "undefined" &&
                data.SERVICE_DESCRIPTION_EN !== ""
                  ? 1
                  : 0,
              ORDER: data.ORDER,
            },
            { where: { id: +data.id } }
          );
        } else {
          await db.MENU_HOTEL.update(
            {
              // TITLE_VI: data.TITLE_VI,
              // TITLE_EN: data.TITLE_EN,
              // SERVICE_DESCRIPTION_EN: data.SERVICE_DESCRIPTION_EN,
              // SERVICE_DESCRIPTION_VI: data.SERVICE_DESCRIPTION_VI,
              // STATUS: data.STATUS === "false" ? 0 : 1,
              // ORDER: data.ORDER,

              TITLE_VI: data.TITLE_VI !== "undefined" ? data.TITLE_VI : "",
              TITLE_EN: data.TITLE_EN !== "undefined" ? data.TITLE_EN : "",
              SERVICE_DESCRIPTION_VI:
                data.SERVICE_DESCRIPTION_VI !== "undefined"
                  ? data.SERVICE_DESCRIPTION_VI
                  : "",
              SERVICE_DESCRIPTION_EN:
                data.SERVICE_DESCRIPTION_EN !== "undefined"
                  ? data.SERVICE_DESCRIPTION_EN
                  : "",
              STATUS: data.STATUS === "false" ? 0 : 1,
              IS_SHOW_TEXT:
                data.TITLE_EN !== "undefined" &&
                data.TITLE_EN !== "" &&
                data.SERVICE_DESCRIPTION_EN !== "undefined" &&
                data.SERVICE_DESCRIPTION_EN !== ""
                  ? 1
                  : 0,
              ORDER: data.ORDER,
            },
            { where: { id: +data.id } }
          );
        }
        return {
          EM: "Update menu extend hotel success!",
          EC: 0,
          DT: "",
        };
      } else {
        if (file) {
          let path = `${file.destination}/${file.filename}`;
          if (fs.existsSync(path)) {
            fs.unlink(path, (err) => {
              if (err) throw err; //handle your error the way you want to;
              console.log("Menu was deleted: ", path); //or else the file will be deleted
            });
          } else {
            console.log("File is not found: ", path);
          }
          return {
            EM: "Menu Extend is not found!",
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

const handleUpdateExploreExtend = async (data, file) => {
  try {
    if (!data) {
      return {
        EM: "missing paramesters!",
        EC: 1,
        DT: "",
      };
    } else {
      let serviceExtend = await db.EXPLORE_HOTEL.findOne({
        where: { id: +data.id },
        raw: true,
      });

      // nếu order lớn hơn order service hiện tại thì
      if (+data.ORDER > serviceExtend.ORDER) {
        // Ex: data : stt = 3 vs order old = 2
        let serviceExtendAll = await db.EXPLORE_HOTEL.findAll({
          where: { SERVICE_ID: +data.service_id },
          raw: true,
          order: [["ORDER", "ASC"]],
        });

        if (serviceExtend) {
          if (
            +data.ORDER > serviceExtendAll[serviceExtendAll.length - 1].ORDER
          ) {
            return {
              EM: "Update explore extend hotel Fail!, số thứ tự được chọn lớn hơn phần tử lớn nhất ",
              EC: 0,
              DT: "",
            };
          }

          const targetIndex = serviceExtendAll.findIndex(
            (item) => item.id === serviceExtend.id
          );
          // Tạo mảng trước và sau phần tử tìm thấy
          let endIndex = +data.ORDER - serviceExtend.ORDER;

          const arrayAfterTarget = serviceExtendAll.slice(
            targetIndex + 1,
            targetIndex + endIndex + 1
          );
          if (arrayAfterTarget && arrayAfterTarget.length > 0) {
            for (let i = 0; i < arrayAfterTarget.length; i++) {
              await db.EXPLORE_HOTEL.update(
                { ORDER: arrayAfterTarget[i].ORDER - 1 },
                { where: { id: arrayAfterTarget[i].id } }
              );
            }
          }
        }
      }
      // nếu order nhỏ hơn order service hiện tại thì
      else if (+data.ORDER < serviceExtend.ORDER) {
        // Ex: data : stt = 2 vs order old = 3

        let serviceExtendAll = await db.EXPLORE_HOTEL.findAll({
          where: { SERVICE_ID: +data.service_id },
          order: [["ORDER", "ASC"]],
          raw: true,
        });

        let serviceExtendOrderNew = await db.EXPLORE_HOTEL.findOne({
          where: {
            [Op.and]: [
              { SERVICE_ID: +data.service_id },
              { ORDER: +data.ORDER },
            ],
          },
          raw: true,
        });

        if (serviceExtendOrderNew) {
          let endIndexExtend =
            serviceExtend.ORDER - serviceExtendOrderNew.ORDER;

          const targetIndex = serviceExtendAll.findIndex(
            (item) => item.id === serviceExtendOrderNew.id
          );

          const arrayAfterTarget = serviceExtendAll.slice(
            targetIndex,
            targetIndex + endIndexExtend
          );

          if (arrayAfterTarget && arrayAfterTarget.length > 0) {
            for (let i = 0; i < arrayAfterTarget.length; i++) {
              await db.EXPLORE_HOTEL.update(
                { ORDER: arrayAfterTarget[i].ORDER + 1 },
                { where: { id: arrayAfterTarget[i].id } }
              );
            }
          }
        }
      }

      let linkLogo = process.env.LINK_AVATAR;
      if (serviceExtend) {
        if (file) {
          if (fs.existsSync(serviceExtend.SERVICE_PATH)) {
            fs.unlink(serviceExtend.SERVICE_PATH, (err) => {
              if (err) throw err; //handle your error the way you want to;
              console.log("Explore was deleted: ", serviceExtend.SERVICE_PATH); //or else the file will be deleted
            });
          } else {
            console.log("File is not found: ", serviceExtend.SERVICE_PATH);
          }

          await db.EXPLORE_HOTEL.update(
            {
              TITLE_VI: data.TITLE_VI,
              TITLE_EN: data.TITLE_EN,
              SERVICE_DESCRIPTION_EN: data.SERVICE_DESCRIPTION_EN,
              SERVICE_DESCRIPTION_VI: data.SERVICE_DESCRIPTION_VI,
              SERVICE_PATH: `${file.destination}/${file.filename}`,
              SERVICE_LINK: `${linkLogo}/${file.filename}`,
              STATUS: data.STATUS === "false" ? 0 : 1,
              ORDER: data.ORDER,
            },
            { where: { id: +data.id } }
          );
        } else {
          await db.EXPLORE_HOTEL.update(
            {
              TITLE_VI: data.TITLE_VI,
              TITLE_EN: data.TITLE_EN,
              SERVICE_DESCRIPTION_EN: data.SERVICE_DESCRIPTION_EN,
              SERVICE_DESCRIPTION_VI: data.SERVICE_DESCRIPTION_VI,
              STATUS: data.STATUS === "false" ? 0 : 1,
              ORDER: data.ORDER,
            },
            { where: { id: +data.id } }
          );
        }
        return {
          EM: "Update explore extend hotel success!",
          EC: 0,
          DT: "",
        };
      } else {
        if (file) {
          let path = `${file.destination}/${file.filename}`;
          if (fs.existsSync(path)) {
            fs.unlink(path, (err) => {
              if (err) throw err; //handle your error the way you want to;
              console.log("Explore was deleted: ", path); //or else the file will be deleted
            });
          } else {
            console.log("File is not found: ", path);
          }
          return {
            EM: "Explore Extend is not found!",
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

const handleUpdateGuideExtend = async (data, file) => {
  try {
    if (!data) {
      return {
        EM: "missing paramesters!",
        EC: 1,
        DT: "",
      };
    } else {
      let serviceExtend = await db.GUIDE_HOTEL.findOne({
        where: { id: +data.id },
        raw: true,
      });

      // nếu order lớn hơn order service hiện tại thì
      if (+data.ORDER > serviceExtend.ORDER) {
        // Ex: data : stt = 3 vs order old = 2
        let serviceExtendAll = await db.GUIDE_HOTEL.findAll({
          where: { SERVICE_ID: +data.service_id },
          raw: true,
          order: [["ORDER", "ASC"]],
        });

        if (serviceExtend) {
          if (
            +data.ORDER > serviceExtendAll[serviceExtendAll.length - 1].ORDER
          ) {
            return {
              EM: "Update guide extend hotel Fail!, số thứ tự được chọn lớn hơn phần tử lớn nhất ",
              EC: 0,
              DT: "",
            };
          }

          const targetIndex = serviceExtendAll.findIndex(
            (item) => item.id === serviceExtend.id
          );
          // Tạo mảng trước và sau phần tử tìm thấy
          let endIndex = +data.ORDER - serviceExtend.ORDER;

          const arrayAfterTarget = serviceExtendAll.slice(
            targetIndex + 1,
            targetIndex + endIndex + 1
          );
          if (arrayAfterTarget && arrayAfterTarget.length > 0) {
            for (let i = 0; i < arrayAfterTarget.length; i++) {
              await db.GUIDE_HOTEL.update(
                { ORDER: arrayAfterTarget[i].ORDER - 1 },
                { where: { id: arrayAfterTarget[i].id } }
              );
            }
          }
        }
      }
      // nếu order nhỏ hơn order service hiện tại thì
      else if (+data.ORDER < serviceExtend.ORDER) {
        // Ex: data : stt = 2 vs order old = 3

        let serviceExtendAll = await db.GUIDE_HOTEL.findAll({
          where: { SERVICE_ID: +data.service_id },
          order: [["ORDER", "ASC"]],
          raw: true,
        });

        let serviceExtendOrderNew = await db.GUIDE_HOTEL.findOne({
          where: {
            [Op.and]: [
              { SERVICE_ID: +data.service_id },
              { ORDER: +data.ORDER },
            ],
          },
          raw: true,
        });

        if (serviceExtendOrderNew) {
          let endIndexExtend =
            serviceExtend.ORDER - serviceExtendOrderNew.ORDER;

          const targetIndex = serviceExtendAll.findIndex(
            (item) => item.id === serviceExtendOrderNew.id
          );

          const arrayAfterTarget = serviceExtendAll.slice(
            targetIndex,
            targetIndex + endIndexExtend
          );

          if (arrayAfterTarget && arrayAfterTarget.length > 0) {
            for (let i = 0; i < arrayAfterTarget.length; i++) {
              await db.GUIDE_HOTEL.update(
                { ORDER: arrayAfterTarget[i].ORDER + 1 },
                { where: { id: arrayAfterTarget[i].id } }
              );
            }
          }
        }
      }

      let linkLogo = process.env.LINK_AVATAR;
      if (serviceExtend) {
        if (file) {
          if (fs.existsSync(serviceExtend.SERVICE_PATH)) {
            fs.unlink(serviceExtend.SERVICE_PATH, (err) => {
              if (err) throw err; //handle your error the way you want to;
              console.log("Guide was deleted: ", serviceExtend.SERVICE_PATH); //or else the file will be deleted
            });
          } else {
            console.log("File is not found: ", serviceExtend.SERVICE_PATH);
          }

          await db.GUIDE_HOTEL.update(
            {
              TITLE_VI: data.TITLE_VI,
              TITLE_EN: data.TITLE_EN,
              SERVICE_DESCRIPTION_EN: data.SERVICE_DESCRIPTION_EN,
              SERVICE_DESCRIPTION_VI: data.SERVICE_DESCRIPTION_VI,
              SERVICE_PATH: `${file.destination}/${file.filename}`,
              SERVICE_LINK: `${linkLogo}/${file.filename}`,
              STATUS: data.STATUS === "false" ? 0 : 1,
              ORDER: data.ORDER,
            },
            { where: { id: +data.id } }
          );
        } else {
          await db.GUIDE_HOTEL.update(
            {
              TITLE_VI: data.TITLE_VI,
              TITLE_EN: data.TITLE_EN,
              SERVICE_DESCRIPTION_EN: data.SERVICE_DESCRIPTION_EN,
              SERVICE_DESCRIPTION_VI: data.SERVICE_DESCRIPTION_VI,
              STATUS: data.STATUS === "false" ? 0 : 1,
              ORDER: data.ORDER,
            },
            { where: { id: +data.id } }
          );
        }
        return {
          EM: "Update guide extend hotel success!",
          EC: 0,
          DT: "",
        };
      } else {
        if (file) {
          let path = `${file.destination}/${file.filename}`;
          if (fs.existsSync(path)) {
            fs.unlink(path, (err) => {
              if (err) throw err; //handle your error the way you want to;
              console.log("Guide was deleted: ", path); //or else the file will be deleted
            });
          } else {
            console.log("File is not found: ", path);
          }
          return {
            EM: "Guide Extend is not found!",
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

const handleDeleteServiceExtend = async (data) => {
  try {
    let serviceExtend = await db.SERVICE_HOTEL.findOne({
      where: { id: +data.id },
      raw: true,
    });

    let serviceExtendAll = await db.SERVICE_HOTEL.findAll({
      where: { SERVICE_ID: +data.serviceId },
      raw: true,
      order: [["ORDER", "ASC"]],
    });

    const targetIndex = serviceExtendAll.findIndex(
      (item) => item.id === serviceExtend.id
    );
    // Tạo mảng trước và sau phần tử tìm thấy
    const arrayAfterTarget = serviceExtendAll.slice(targetIndex + 1);

    if (arrayAfterTarget && arrayAfterTarget.length > 0) {
      for (let i = 0; i < arrayAfterTarget.length; i++) {
        await db.SERVICE_HOTEL.update(
          { ORDER: arrayAfterTarget[i].ORDER - 1 },
          { where: { id: arrayAfterTarget[i].id } }
        );
      }
    }

    if (serviceExtend) {
      if (serviceExtend.SERVICE_PATH) {
        let seviceExtendDelete = serviceExtend.SERVICE_PATH;

        if (fs.existsSync(seviceExtendDelete)) {
          fs.unlink(seviceExtendDelete, (err) => {
            if (err) throw err; //handle your error the way you want to;
            console.log("File was deleted: ", seviceExtendDelete); //or else the file will be deleted
          });
        } else {
          console.log("File is not found: ", seviceExtendDelete);
        }
      }

      await db.SERVICE_HOTEL.destroy({ where: { id: serviceExtend.id } });

      return {
        EM: "Delete service extend success!",
        EC: 0,
        DT: "",
      };
    } else {
      return {
        EM: "Service extend is not exist!",
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

const handleDeleteMenuExtend = async (data) => {
  try {
    let serviceExtend = await db.MENU_HOTEL.findOne({
      where: { id: +data.id },
      raw: true,
    });

    let serviceExtendAll = await db.MENU_HOTEL.findAll({
      where: { SERVICE_ID: +data.serviceId },
      raw: true,
      order: [["ORDER", "ASC"]],
    });

    const targetIndex = serviceExtendAll.findIndex(
      (item) => item.id === serviceExtend.id
    );
    // Tạo mảng trước và sau phần tử tìm thấy
    const arrayAfterTarget = serviceExtendAll.slice(targetIndex + 1);

    if (arrayAfterTarget && arrayAfterTarget.length > 0) {
      for (let i = 0; i < arrayAfterTarget.length; i++) {
        await db.MENU_HOTEL.update(
          { ORDER: arrayAfterTarget[i].ORDER - 1 },
          { where: { id: arrayAfterTarget[i].id } }
        );
      }
    }

    if (serviceExtend) {
      if (serviceExtend.SERVICE_PATH) {
        let seviceExtendDelete = serviceExtend.SERVICE_PATH;

        if (fs.existsSync(seviceExtendDelete)) {
          fs.unlink(seviceExtendDelete, (err) => {
            if (err) throw err; //handle your error the way you want to;
            console.log("File was deleted: ", seviceExtendDelete); //or else the file will be deleted
          });
        } else {
          console.log("File is not found: ", seviceExtendDelete);
        }
      }

      await db.MENU_HOTEL.destroy({ where: { id: serviceExtend.id } });

      return {
        EM: "Delete menu extend success!",
        EC: 0,
        DT: "",
      };
    } else {
      return {
        EM: "Menu extend is not exist!",
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

const handleDeleteExploreExtend = async (data) => {
  try {
    let serviceExtend = await db.EXPLORE_HOTEL.findOne({
      where: { id: +data.id },
      raw: true,
    });

    let serviceExtendAll = await db.EXPLORE_HOTEL.findAll({
      where: { SERVICE_ID: +data.serviceId },
      raw: true,
      order: [["ORDER", "ASC"]],
    });

    const targetIndex = serviceExtendAll.findIndex(
      (item) => item.id === serviceExtend.id
    );
    // Tạo mảng trước và sau phần tử tìm thấy
    const arrayAfterTarget = serviceExtendAll.slice(targetIndex + 1);

    if (arrayAfterTarget && arrayAfterTarget.length > 0) {
      for (let i = 0; i < arrayAfterTarget.length; i++) {
        await db.EXPLORE_HOTEL.update(
          { ORDER: arrayAfterTarget[i].ORDER - 1 },
          { where: { id: arrayAfterTarget[i].id } }
        );
      }
    }

    if (serviceExtend) {
      if (serviceExtend.SERVICE_PATH) {
        let seviceExtendDelete = serviceExtend.SERVICE_PATH;

        if (fs.existsSync(seviceExtendDelete)) {
          fs.unlink(seviceExtendDelete, (err) => {
            if (err) throw err; //handle your error the way you want to;
            console.log("File was deleted: ", seviceExtendDelete); //or else the file will be deleted
          });
        } else {
          console.log("File is not found: ", seviceExtendDelete);
        }
      }

      await db.EXPLORE_HOTEL.destroy({ where: { id: serviceExtend.id } });

      return {
        EM: "Delete explore extend success!",
        EC: 0,
        DT: "",
      };
    } else {
      return {
        EM: "Explore extend is not exist!",
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

const handleDeleteGuideExtend = async (data) => {
  try {
    let serviceExtend = await db.GUIDE_HOTEL.findOne({
      where: { id: +data.id },
      raw: true,
    });

    let serviceExtendAll = await db.GUIDE_HOTEL.findAll({
      where: { SERVICE_ID: +data.serviceId },
      raw: true,
      order: [["ORDER", "ASC"]],
    });

    const targetIndex = serviceExtendAll.findIndex(
      (item) => item.id === serviceExtend.id
    );
    // Tạo mảng trước và sau phần tử tìm thấy
    const arrayAfterTarget = serviceExtendAll.slice(targetIndex + 1);

    if (arrayAfterTarget && arrayAfterTarget.length > 0) {
      for (let i = 0; i < arrayAfterTarget.length; i++) {
        await db.GUIDE_HOTEL.update(
          { ORDER: arrayAfterTarget[i].ORDER - 1 },
          { where: { id: arrayAfterTarget[i].id } }
        );
      }
    }

    if (serviceExtend) {
      if (serviceExtend.SERVICE_PATH) {
        let seviceExtendDelete = serviceExtend.SERVICE_PATH;

        if (fs.existsSync(seviceExtendDelete)) {
          fs.unlink(seviceExtendDelete, (err) => {
            if (err) throw err; //handle your error the way you want to;
            console.log("File was deleted: ", seviceExtendDelete); //or else the file will be deleted
          });
        } else {
          console.log("File is not found: ", seviceExtendDelete);
        }
      }

      await db.GUIDE_HOTEL.destroy({ where: { id: serviceExtend.id } });

      return {
        EM: "Delete guide extend success!",
        EC: 0,
        DT: "",
      };
    } else {
      return {
        EM: "Guide extend is not exist!",
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

const handleUpdateService = async (data) => {
  try {
    if (!data) {
      return {
        EM: "missing paramesters!",
        EC: 1,
        DT: "",
      };
    } else {
      let service = await db.CATEGORY_SERVICE.findOne({
        where: { id: +data.id },
        raw: true,
      });

      // nếu order lớn hơn order service hiện tại thì
      if (+data.SORT_ORDER > service.SORT_ORDER) {
        // Ex: data : stt = 3 vs order old = 2
        let serviceAll = await db.CATEGORY_SERVICE.findAll({
          raw: true,
          order: [["SORT_ORDER", "ASC"]],
        });

        if (service) {
          if (+data.SORT_ORDER > serviceAll[serviceAll.length - 1].SORT_ORDER) {
            return {
              EM: "Update service hotel Fail!, số thứ tự được chọn lớn hơn phần tử lớn nhất ",
              EC: 1,
              DT: "",
            };
          }

          const targetIndex = serviceAll.findIndex(
            (item) => item.id === service.id
          );
          // Tạo mảng trước và sau phần tử tìm thấy
          let endIndex = +data.SORT_ORDER - service.SORT_ORDER;

          const arrayAfterTarget = serviceAll.slice(
            targetIndex + 1,
            targetIndex + endIndex + 1
          );
          if (arrayAfterTarget && arrayAfterTarget.length > 0) {
            for (let i = 0; i < arrayAfterTarget.length; i++) {
              await db.CATEGORY_SERVICE.update(
                { SORT_ORDER: arrayAfterTarget[i].SORT_ORDER - 1 },
                { where: { id: arrayAfterTarget[i].id } }
              );
            }
          }
        }
      }
      // nếu order nhỏ hơn order service hiện tại thì
      else if (+data.SORT_ORDER < service.SORT_ORDER) {
        // Ex: data : stt = 2 vs order old = 3

        let serviceAll = await db.CATEGORY_SERVICE.findAll({
          order: [["SORT_ORDER", "ASC"]],
          raw: true,
        });

        let serviceOrderNew = await db.CATEGORY_SERVICE.findOne({
          where: {
            SORT_ORDER: +data.SORT_ORDER,
          },
          raw: true,
        });

        if (serviceOrderNew) {
          let endIndexExtend = service.SORT_ORDER - serviceOrderNew.SORT_ORDER;

          const targetIndex = serviceAll.findIndex(
            (item) => item.id === serviceOrderNew.id
          );

          const arrayAfterTarget = serviceAll.slice(
            targetIndex,
            targetIndex + endIndexExtend
          );

          if (arrayAfterTarget && arrayAfterTarget.length > 0) {
            for (let i = 0; i < arrayAfterTarget.length; i++) {
              await db.CATEGORY_SERVICE.update(
                { SORT_ORDER: arrayAfterTarget[i].SORT_ORDER + 1 },
                { where: { id: arrayAfterTarget[i].id } }
              );
            }
          }
        }
      }

      await db.CATEGORY_SERVICE.update(
        {
          CATEGORY_NAME_EN: data.CATEGORY_NAME_EN,
          CATEGORY_NAME_VI: data.CATEGORY_NAME_VI,
          SORT_ORDER: data.SORT_ORDER,
        },
        { where: { id: +data.id } }
      );

      return {
        EM: "Update service hotel success!",
        EC: 0,
        DT: "",
      };
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

const handleUpdateGuide = async (data) => {
  try {
    if (!data) {
      return {
        EM: "missing paramesters!",
        EC: 1,
        DT: "",
      };
    } else {
      let service = await db.CATEGORY_GUIDE.findOne({
        where: { id: +data.id },
        raw: true,
      });

      // nếu order lớn hơn order service hiện tại thì
      if (+data.SORT_ORDER > service.SORT_ORDER) {
        // Ex: data : stt = 3 vs order old = 2
        let serviceAll = await db.CATEGORY_SERVICE.findAll({
          raw: true,
          order: [["SORT_ORDER", "ASC"]],
        });

        if (service) {
          if (+data.SORT_ORDER > serviceAll[serviceAll.length - 1].SORT_ORDER) {
            return {
              EM: "Update guide hotel Fail!, số thứ tự được chọn lớn hơn phần tử lớn nhất ",
              EC: 1,
              DT: "",
            };
          }

          const targetIndex = serviceAll.findIndex(
            (item) => item.id === service.id
          );
          // Tạo mảng trước và sau phần tử tìm thấy
          let endIndex = +data.SORT_ORDER - service.SORT_ORDER;

          const arrayAfterTarget = serviceAll.slice(
            targetIndex + 1,
            targetIndex + endIndex + 1
          );
          if (arrayAfterTarget && arrayAfterTarget.length > 0) {
            for (let i = 0; i < arrayAfterTarget.length; i++) {
              await db.CATEGORY_GUIDE.update(
                { SORT_ORDER: arrayAfterTarget[i].SORT_ORDER - 1 },
                { where: { id: arrayAfterTarget[i].id } }
              );
            }
          }
        }
      }
      // nếu order nhỏ hơn order service hiện tại thì
      else if (+data.SORT_ORDER < service.SORT_ORDER) {
        // Ex: data : stt = 2 vs order old = 3

        let serviceAll = await db.CATEGORY_GUIDE.findAll({
          order: [["SORT_ORDER", "ASC"]],
          raw: true,
        });

        let serviceOrderNew = await db.CATEGORY_GUIDE.findOne({
          where: {
            SORT_ORDER: +data.SORT_ORDER,
          },
          raw: true,
        });

        if (serviceOrderNew) {
          let endIndexExtend = service.SORT_ORDER - serviceOrderNew.SORT_ORDER;

          const targetIndex = serviceAll.findIndex(
            (item) => item.id === serviceOrderNew.id
          );

          const arrayAfterTarget = serviceAll.slice(
            targetIndex,
            targetIndex + endIndexExtend
          );

          if (arrayAfterTarget && arrayAfterTarget.length > 0) {
            for (let i = 0; i < arrayAfterTarget.length; i++) {
              await db.CATEGORY_GUIDE.update(
                { SORT_ORDER: arrayAfterTarget[i].SORT_ORDER + 1 },
                { where: { id: arrayAfterTarget[i].id } }
              );
            }
          }
        }
      }

      await db.CATEGORY_GUIDE.update(
        {
          CATEGORY_NAME_EN: data.CATEGORY_NAME_EN,
          CATEGORY_NAME_VI: data.CATEGORY_NAME_VI,
          SORT_ORDER: data.SORT_ORDER,
        },
        { where: { id: +data.id } }
      );

      return {
        EM: "Update guide hotel success!",
        EC: 0,
        DT: "",
      };
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

const handleUpdateStatusService = async (data) => {
  try {
    if (!data) {
      return {
        EM: "missing paramesters!",
        EC: 1,
        DT: "",
      };
    } else {
      let service = await db.CATEGORY_SERVICE.findOne({
        where: { id: +data.id },
        raw: true,
      });

      if (service) {
        await db.CATEGORY_SERVICE.update(
          {
            STATUS: data.status ? 1 : 0,
          },
          { where: { id: +data.id } }
        );

        return {
          EM: "Update service hotel success!",
          EC: 0,
          DT: "",
        };
      } else {
        return {
          EM: "service is not found!",
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

const handleUpdateStatusMenu = async (data) => {
  try {
    if (!data) {
      return {
        EM: "missing paramesters!",
        EC: 1,
        DT: "",
      };
    } else {
      let service = await db.CATEGORY_MENU.findOne({
        where: { id: +data.id },
        raw: true,
      });

      if (service) {
        await db.CATEGORY_MENU.update(
          {
            STATUS: data.status ? 1 : 0,
          },
          { where: { id: +data.id } }
        );

        return {
          EM: "Update menu hotel success!",
          EC: 0,
          DT: "",
        };
      } else {
        return {
          EM: "Menu hotel is not found",
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

const handleUpdateStatusExplore = async (data) => {
  try {
    if (!data) {
      return {
        EM: "missing paramesters!",
        EC: 1,
        DT: "",
      };
    } else {
      let service = await db.CATEGORY_EXPLORE.findOne({
        where: { id: +data.id },
        raw: true,
      });

      if (service) {
        await db.CATEGORY_EXPLORE.update(
          {
            STATUS: data.status ? 1 : 0,
          },
          { where: { id: +data.id } }
        );

        return {
          EM: "Update explore hotel success!",
          EC: 0,
          DT: "",
        };
      } else {
        return {
          EM: "Explore hotel is not found",
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

const handleUpdateStatusGuide = async (data) => {
  try {
    if (!data) {
      return {
        EM: "missing paramesters!",
        EC: 1,
        DT: "",
      };
    } else {
      let service = await db.CATEGORY_GUIDE.findOne({
        where: { id: +data.id },
        raw: true,
      });

      if (service) {
        await db.CATEGORY_GUIDE.update(
          {
            STATUS: data.status ? 1 : 0,
          },
          { where: { id: +data.id } }
        );

        return {
          EM: "Update guide hotel success!",
          EC: 0,
          DT: "",
        };
      } else {
        return {
          EM: "Guide hotel is not found",
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

const handleUpdateMenuHotel = async (data) => {
  try {
    if (!data) {
      return {
        EM: "missing paramesters!",
        EC: 1,
        DT: "",
      };
    } else {
      let service = await db.CATEGORY_MENU.findOne({
        where: { id: +data.id },
        raw: true,
      });

      // nếu order lớn hơn order service hiện tại thì
      if (+data.SORT_ORDER > service.SORT_ORDER) {
        // Ex: data : stt = 3 vs order old = 2
        let serviceAll = await db.CATEGORY_MENU.findAll({
          raw: true,
          order: [["SORT_ORDER", "ASC"]],
        });

        if (service) {
          if (+data.SORT_ORDER > serviceAll[serviceAll.length - 1].SORT_ORDER) {
            return {
              EM: "Update service hotel Fail!, số thứ tự được chọn lớn hơn phần tử lớn nhất ",
              EC: 1,
              DT: "",
            };
          }

          const targetIndex = serviceAll.findIndex(
            (item) => item.id === service.id
          );
          // Tạo mảng trước và sau phần tử tìm thấy
          let endIndex = +data.SORT_ORDER - service.SORT_ORDER;

          const arrayAfterTarget = serviceAll.slice(
            targetIndex + 1,
            targetIndex + endIndex + 1
          );
          if (arrayAfterTarget && arrayAfterTarget.length > 0) {
            for (let i = 0; i < arrayAfterTarget.length; i++) {
              await db.CATEGORY_MENU.update(
                { SORT_ORDER: arrayAfterTarget[i].SORT_ORDER - 1 },
                { where: { id: arrayAfterTarget[i].id } }
              );
            }
          }
        }
      }
      // nếu order nhỏ hơn order service hiện tại thì
      else if (+data.SORT_ORDER < service.SORT_ORDER) {
        // Ex: data : stt = 2 vs order old = 3

        let serviceAll = await db.CATEGORY_MENU.findAll({
          order: [["SORT_ORDER", "ASC"]],
          raw: true,
        });

        let serviceOrderNew = await db.CATEGORY_MENU.findOne({
          where: {
            SORT_ORDER: +data.SORT_ORDER,
          },
          raw: true,
        });

        if (serviceOrderNew) {
          let endIndexExtend = service.SORT_ORDER - serviceOrderNew.SORT_ORDER;

          const targetIndex = serviceAll.findIndex(
            (item) => item.id === serviceOrderNew.id
          );

          const arrayAfterTarget = serviceAll.slice(
            targetIndex,
            targetIndex + endIndexExtend
          );

          if (arrayAfterTarget && arrayAfterTarget.length > 0) {
            for (let i = 0; i < arrayAfterTarget.length; i++) {
              await db.CATEGORY_MENU.update(
                { SORT_ORDER: arrayAfterTarget[i].SORT_ORDER + 1 },
                { where: { id: arrayAfterTarget[i].id } }
              );
            }
          }
        }
      }

      await db.CATEGORY_MENU.update(
        {
          CATEGORY_NAME_EN: data.CATEGORY_NAME_EN,
          CATEGORY_NAME_VI: data.CATEGORY_NAME_VI,
          SORT_ORDER: data.SORT_ORDER,
        },
        { where: { id: +data.id } }
      );

      return {
        EM: "Update menu hotel success!",
        EC: 0,
        DT: "",
      };
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

const handleUpdateExploreHotel = async (data) => {
  try {
    if (!data) {
      return {
        EM: "missing paramesters!",
        EC: 1,
        DT: "",
      };
    } else {
      let service = await db.CATEGORY_EXPLORE.findOne({
        where: { id: +data.id },
        raw: true,
      });

      // nếu order lớn hơn order service hiện tại thì
      if (+data.SORT_ORDER > service.SORT_ORDER) {
        // Ex: data : stt = 3 vs order old = 2
        let serviceAll = await db.CATEGORY_EXPLORE.findAll({
          raw: true,
          order: [["SORT_ORDER", "ASC"]],
        });

        if (service) {
          if (+data.SORT_ORDER > serviceAll[serviceAll.length - 1].SORT_ORDER) {
            return {
              EM: "Update explore hotel Fail!, số thứ tự được chọn lớn hơn phần tử lớn nhất ",
              EC: 1,
              DT: "",
            };
          }

          const targetIndex = serviceAll.findIndex(
            (item) => item.id === service.id
          );
          // Tạo mảng trước và sau phần tử tìm thấy
          let endIndex = +data.SORT_ORDER - service.SORT_ORDER;

          const arrayAfterTarget = serviceAll.slice(
            targetIndex + 1,
            targetIndex + endIndex + 1
          );
          if (arrayAfterTarget && arrayAfterTarget.length > 0) {
            for (let i = 0; i < arrayAfterTarget.length; i++) {
              await db.CATEGORY_EXPLORE.update(
                { SORT_ORDER: arrayAfterTarget[i].SORT_ORDER - 1 },
                { where: { id: arrayAfterTarget[i].id } }
              );
            }
          }
        }
      }
      // nếu order nhỏ hơn order service hiện tại thì
      else if (+data.SORT_ORDER < service.SORT_ORDER) {
        // Ex: data : stt = 2 vs order old = 3

        let serviceAll = await db.CATEGORY_EXPLORE.findAll({
          order: [["SORT_ORDER", "ASC"]],
          raw: true,
        });

        let serviceOrderNew = await db.CATEGORY_EXPLORE.findOne({
          where: {
            SORT_ORDER: +data.SORT_ORDER,
          },
          raw: true,
        });

        if (serviceOrderNew) {
          let endIndexExtend = service.SORT_ORDER - serviceOrderNew.SORT_ORDER;

          const targetIndex = serviceAll.findIndex(
            (item) => item.id === serviceOrderNew.id
          );

          const arrayAfterTarget = serviceAll.slice(
            targetIndex,
            targetIndex + endIndexExtend
          );

          if (arrayAfterTarget && arrayAfterTarget.length > 0) {
            for (let i = 0; i < arrayAfterTarget.length; i++) {
              await db.CATEGORY_EXPLORE.update(
                { SORT_ORDER: arrayAfterTarget[i].SORT_ORDER + 1 },
                { where: { id: arrayAfterTarget[i].id } }
              );
            }
          }
        }
      }

      await db.CATEGORY_EXPLORE.update(
        {
          CATEGORY_NAME_EN: data.CATEGORY_NAME_EN,
          CATEGORY_NAME_VI: data.CATEGORY_NAME_VI,
          SORT_ORDER: data.SORT_ORDER,
          STATUS: data.STATUS === false ? 0 : 1,
        },
        { where: { id: +data.id } }
      );

      return {
        EM: "Update explore hotel success!",
        EC: 0,
        DT: "",
      };
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

const handleDeleteService = async (data) => {
  try {
    let service = await db.CATEGORY_SERVICE.findOne({
      where: { id: +data.id },
      raw: true,
    });

    let serviceAll = await db.CATEGORY_SERVICE.findAll({
      raw: true,
      order: [["SORT_ORDER", "ASC"]],
    });

    const targetIndex = serviceAll.findIndex((item) => item.id === service.id);
    // Tạo mảng trước và sau phần tử tìm thấy
    const arrayAfterTarget = serviceAll.slice(targetIndex + 1);
    if (arrayAfterTarget && arrayAfterTarget.length > 0) {
      for (let i = 0; i < arrayAfterTarget.length; i++) {
        await db.CATEGORY_SERVICE.update(
          { SORT_ORDER: arrayAfterTarget[i].SORT_ORDER - 1 },
          { where: { id: arrayAfterTarget[i].id } }
        );
      }
    }
    if (service) {
      await db.CATEGORY_SERVICE.destroy({ where: { id: service.id } });
      return {
        EM: "Delete service success!",
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

const handleDeleteMenuHotel = async (data) => {
  try {
    let service = await db.CATEGORY_MENU.findOne({
      where: { id: +data.id },
      raw: true,
    });

    let serviceAll = await db.CATEGORY_MENU.findAll({
      raw: true,
      order: [["SORT_ORDER", "ASC"]],
    });

    const targetIndex = serviceAll.findIndex((item) => item.id === service.id);
    // Tạo mảng trước và sau phần tử tìm thấy
    const arrayAfterTarget = serviceAll.slice(targetIndex + 1);
    if (arrayAfterTarget && arrayAfterTarget.length > 0) {
      for (let i = 0; i < arrayAfterTarget.length; i++) {
        await db.CATEGORY_MENU.update(
          { SORT_ORDER: arrayAfterTarget[i].SORT_ORDER - 1 },
          { where: { id: arrayAfterTarget[i].id } }
        );
      }
    }
    if (service) {
      await db.CATEGORY_MENU.destroy({ where: { id: service.id } });
      return {
        EM: "Delete menu success!",
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

const handleDeleteExploreHotel = async (data) => {
  try {
    let service = await db.CATEGORY_EXPLORE.findOne({
      where: { id: +data.id },
      raw: true,
    });

    let serviceAll = await db.CATEGORY_EXPLORE.findAll({
      raw: true,
      order: [["SORT_ORDER", "ASC"]],
    });

    const targetIndex = serviceAll.findIndex((item) => item.id === service.id);
    // Tạo mảng trước và sau phần tử tìm thấy
    const arrayAfterTarget = serviceAll.slice(targetIndex + 1);
    if (arrayAfterTarget && arrayAfterTarget.length > 0) {
      for (let i = 0; i < arrayAfterTarget.length; i++) {
        await db.CATEGORY_EXPLORE.update(
          { SORT_ORDER: arrayAfterTarget[i].SORT_ORDER - 1 },
          { where: { id: arrayAfterTarget[i].id } }
        );
      }
    }
    if (service) {
      await db.CATEGORY_EXPLORE.destroy({ where: { id: service.id } });
      return {
        EM: "Delete explore success!",
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

const handleDeleteGuideHotel = async (data) => {
  try {
    let service = await db.CATEGORY_GUIDE.findOne({
      where: { id: +data.id },
      raw: true,
    });

    let serviceAll = await db.CATEGORY_GUIDE.findAll({
      raw: true,
      order: [["SORT_ORDER", "ASC"]],
    });

    const targetIndex = serviceAll.findIndex((item) => item.id === service.id);
    // Tạo mảng trước và sau phần tử tìm thấy
    const arrayAfterTarget = serviceAll.slice(targetIndex + 1);
    if (arrayAfterTarget && arrayAfterTarget.length > 0) {
      for (let i = 0; i < arrayAfterTarget.length; i++) {
        await db.CATEGORY_GUIDE.update(
          { SORT_ORDER: arrayAfterTarget[i].SORT_ORDER - 1 },
          { where: { id: arrayAfterTarget[i].id } }
        );
      }
    }
    if (service) {
      await db.CATEGORY_GUIDE.destroy({ where: { id: service.id } });
      return {
        EM: "Delete guide success!",
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

module.exports = {
  handleCreateService,
  getServiceWithPagination,
  handleCreateExtendService,
  handleUpdateServiceExtend,
  handleUpdateStatusService,
  handleDeleteServiceExtend,
  handleUpdateService,
  handleDeleteService,
  handleCreateMenuHotel,
  getMenuHotelWithPagination,
  handleUpdateMenuHotel,
  handleDeleteMenuHotel,
  handleCreateMenuHotelExtend,
  handleUpdateMenuExtend,
  handleDeleteMenuExtend,
  handleCreateExploreHotel,
  getExploreHotelWithPagination,
  handleUpdateExploreHotel,
  handleDeleteExploreHotel,
  handleCreateExploreExtend,
  handleUpdateExploreExtend,
  handleDeleteExploreExtend,
  handleUpdateStatusMenu,
  handleUpdateStatusExplore,
  handleCreateGuideHotel,
  getGuideHotelWithPagination,
  handleCreateGuideExtend,
  handleUpdateGuideExtend,
  handleUpdateStatusGuide,
  handleDeleteGuideHotel,
  handleUpdateGuide,
  handleDeleteGuideExtend,
};
