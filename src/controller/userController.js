import userApiService from "../service/userApiService";

//get all user or pagination user
const readFunc = async (req, res) => {
  try {
    if (req.query.current && req.query.pageSize) {
      let current = req.query.current;
      let pageSize = req.query.pageSize;
      let data = await userApiService.getUserWithPagination(
        +current,
        +pageSize
      );
      return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    } else if (req.query.userId) {
      let userId = req.query.userId;
      let data = await userApiService.getInforUser(userId);
      return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    } else {
      let data = await userApiService.getAllUser();
      return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      EM: "error from server, PCLNCPT",
      EC: "-1",
      DT: "",
    });
  }
};

//create list users
const handleBulkUser = async (req, res) => {
  try {
    let data = await userApiService.handleBulkUser(req.body);

    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
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

//detele user hotel
const deleteFunc = async (req, res) => {
  try {
    if (+req.body.id === 58) {
      return res.status(200).json({
        EM: "Ahthentication app so it can't be deleted",
        EC: 1,
        DT: "",
      });
    }
    let data = await userApiService.deleteUser(req.body.id);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
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

//update user
const updateFunc = async (req, res) => {
  try {
    let data = await userApiService.updateUser(req.body, req.file);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      EM: "error from server, PCLNCPT",
      EC: -1,
      DT: "",
    });
  }
};

const handleSearchName = async (req, res) => {
  try {
    let data = await userApiService.handleSearchName(req.body);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      EM: "Error from server, contact PCLNCPT",
      EC: -1,
      DT: "",
    });
  }
};

//create a user
const handleCreateUser = async (req, res) => {
  try {
    // console.log("check data request ", req.body, req.file);
    let response = await userApiService.handleCreateUser(req.body, req.file);
    return res.status(200).json({
      EM: response.EM,
      EC: response.EC,
      DT: response.DT,
    });
  } catch {
    return res.status(500).json({
      EM: "Error from server, PCLNCPT",
      EC: "-1",
      DT: "",
    });
  }
};

//check account Hotel
const getUserAccount = async (req, res) => {
  try {
    const path = req.path;
    console.log(`Đã gọi đường dẫn URL: ${path}`);
    return res.status(200).json({
      EM: "Get Account from user successfully!",
      EC: 0,
      DT: {
        id: req && req.user && req.user.id ? req.user.id : "",
        email: req && req.user && req.user.email ? req.user.email : "",
        first_name:
          req && req.user && req.user.first_name ? req.user.first_name : "",
        last_name:
          req && req.user && req.user.last_name ? req.user.last_name : "",
        avatar: req && req.user && req.user.avatar ? req.user.avatar : "",
        api_token: req && req.user && req.api_token ? req.api_token : "",
        groupId: req && req.user && req.user.groupId ? req.user.groupId : "",
      },
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      EM: "error from server, lien he PCLNCPT",
      EC: -1,
      DT: "",
    });
  }
};

const checkToken = async (req, res) => {
  try {
    let response = await userApiService.checkToken(req.body.token);
    return res.status(200).json({
      EM: response.EM,
      EC: response.EC,
      DT: response.DT,
    });
  } catch {
    return res.status(500).json({
      EM: "Error from server, PCLNCPT",
      EC: "-1",
      DT: "",
    });
  }
};

//change password hotel
const handleChangePassword = async (req, res) => {
  try {
    let data = await userApiService.handleChangePassword(req.body);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      EM: "error from server, PCLNCPT",
      EC: "-1",
      DT: "",
    });
  }
};

module.exports = {
  readFunc,
  deleteFunc,
  updateFunc,
  getUserAccount,
  handleCreateUser,
  handleBulkUser,
  handleChangePassword,
  checkToken,
  handleSearchName,
};
