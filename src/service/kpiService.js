import db from "../models/index";

const handleCreateConcurrentPosition = async (data) => {
  try {
    if (!data) {
      return {
        EM: "missing paramesters!",
        EC: 1,
        DT: "",
      };
    } else {
      //handle create a new user with avartar
      await db.CONCURRENT_POSITION.create({
        CRITERIAL_NAME: data.criterialName,
        SCORE: data.score,
        NOTE: data.note,
        STATE: 1,
      });
      return {
        EM: "Create New ConcurrentPosition success!",
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
  handleCreateConcurrentPosition,
};
