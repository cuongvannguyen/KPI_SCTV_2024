import hotelApiService from "../service/hotelApiService";

const handleCreateAHotel = async (req, res) => {
  try {
    let response = await hotelApiService.handleCreateAHotel(req.body, req.file);
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

const handleDeleteAHotel = async (req, res) => {
  try {
    let data = await hotelApiService.handleDeleteAHotel(req.body.id);
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

const handleGetAllHotel = async (req, res) => {
  try {
    if (req.query.current && req.query.pageSize) {
      let page = req.query.current;
      let limit = req.query.pageSize;
      let data = await hotelApiService.handleGetAllHotelWithPagination(
        +page,
        +limit
      );
      return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    } else {
      let data = await hotelApiService.handleGetAllHotel();
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

const handleUpdateAHotel = async (req, res) => {
  try {
    let data = await hotelApiService.handleUpdateAHotel(req.body, req.file);
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

const handleCreateCategoryChannel = async (req, res) => {
  try {
    let response = await hotelApiService.handleCreateCategoryChannel(req.body);
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

const handleGetCategoryChannel = async (req, res) => {
  try {
    let response = await hotelApiService.handleGetCategoryChannel();
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

const handleGetCategoryViaChannel = async (req, res) => {
  try {
    // let response = await hotelApiService.handleGetCategoryViaChannel();
    // return res.status(200).json({
    //   EM: response.EM,
    //   EC: response.EC,
    //   DT: response.DT,
    // });

    if (req.query.current && req.query.pageSize) {
      let current = req.query.current;
      let pageSize = req.query.pageSize;
      let data = await hotelApiService.handleGetCategoryViaChannelWithPage(
        +current,
        +pageSize
      );
      return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    } else {
      let response = await hotelApiService.handleGetCategoryViaChannel();
      return res.status(200).json({
        EM: response.EM,
        EC: response.EC,
        DT: response.DT,
      });
    }
  } catch {
    return res.status(500).json({
      EM: "Error from server, PCLNCPT",
      EC: "-1",
      DT: "",
    });
  }
};

const handleUpdateCategoryChannel = async (req, res) => {
  try {
    let data = await hotelApiService.handleUpdateCategoryChannel(req.body);
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

const handleDeleteCategoryChannel = async (req, res) => {
  try {
    let data = await hotelApiService.handleDeleteCategoryChannel(req.body.id);
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

const handleCreateChannel = async (req, res) => {
  try {
    let response = await hotelApiService.handleCreateChannel(
      req.body,
      req.file
    );
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

const handleGetListChannel = async (req, res) => {
  try {
    // console.log(">>>check req query: ", req.query);
    if (req.query.channelId) {
      let channelId = req.query.channelId;
      let data = await hotelApiService.getChannelWithId(+channelId);
      return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    }

    if (req.query.categoryId || req.query.status) {
      const categoryId = req.query.categoryId;
      const status = req.query.status;
      let data = await hotelApiService.getChannelFilter(+categoryId, +status);
      return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    }

    if (req.query.current && req.query.pageSize && req.query.id) {
      let current = req.query.current;
      let pageSize = req.query.pageSize;
      let userId = req.query.id;
      let data = await hotelApiService.getChannelWithPagination(
        +current,
        +pageSize,
        +userId
      );
      return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
      //khong truyen len param
    } else {
      let data = await hotelApiService.handleGetAllListChannel();
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

const handleDeleteChannel = async (req, res) => {
  try {
    let data = await hotelApiService.handleDeleteChannel(req.body.id);
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

const handleUpdateChannel = async (req, res) => {
  try {
    if (req.body.isChangeStatus) {
      let data = await hotelApiService.handleUpdateStatusChannel(req.body);
      return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    } else {
      let data = await hotelApiService.handleUpdateAChannel(req.body, req.file);
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

const handleCreateChannelCategory = async (req, res) => {
  try {
    let response = await hotelApiService.handleCreateChannelCategory(req.body);
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

const handleDeleteAssignChannelCategory = async (req, res) => {
  try {
    let data = await hotelApiService.handleDeleteAssignChannelCategory(
      req.body
    );
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

const handleUpdateCategoryChannelAssign = async (req, res) => {
  try {
    let data = await hotelApiService.handleUpdateCategoryChannelAssign(
      req.body
    );
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

const handleCreatedWifi = async (req, res) => {
  try {
    let response = await hotelApiService.handleCreatedWifi(req.body);
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

const handleGetListWifi = async (req, res) => {
  try {
    if (req.query.current && req.query.pageSize) {
      let current = req.query.current;
      let pageSize = req.query.pageSize;
      let data = await hotelApiService.getWifiWithPagination(
        +current,
        +pageSize
      );
      return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    } else {
      let data = await hotelApiService.getAllWifi();
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

const handleDeleteWifi = async (req, res) => {
  try {
    let data = await hotelApiService.handleDeleteWifi(req.body.id);
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

const handleUpdateWifi = async (req, res) => {
  try {
    let data = await hotelApiService.handleUpdateWifi(req.body);
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

const handleCreateInformationHotel = async (req, res) => {
  try {
    let response = await hotelApiService.handleCreateInformationHotel(
      req.body,
      req.file
    );
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

const handleGetListInformationHotel = async (req, res) => {
  try {
    if (req.query.current && req.query.pageSize) {
      let current = req.query.current;
      let pageSize = req.query.pageSize;
      let data =
        await hotelApiService.handleGetListInformationHotelWithPagination(
          +current,
          +pageSize
        );
      return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    } else {
      let data = await hotelApiService.handleGetListAllInformationHotel();
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

const handleDeleteBackground = async (req, res) => {
  try {
    let data = await hotelApiService.handleDeleteBackground(req.body.id);
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

const handleUpdateBackgroundHotel = async (req, res) => {
  try {
    let data = await hotelApiService.handleUpdateBackgroundHotel(
      req.body,
      req.file
    );
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

const handleCreateGuest = async (req, res) => {
  try {
    let response = await hotelApiService.handleCreateGuest(req.body);
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

const handleCreateRoom = async (req, res) => {
  try {
    let response = await hotelApiService.handleCreateRoom(req.body);
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

const handleCreateDevice = async (req, res) => {
  try {
    let response = await hotelApiService.handleCreateDevice(req.body);
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

const handleGetListGuest = async (req, res) => {
  try {
    if (req.query.current && req.query.pageSize) {
      let current = req.query.current;
      let pageSize = req.query.pageSize;
      let data = await hotelApiService.handleGetListGuestWithPagination(
        +current,
        +pageSize
      );
      return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    } else {
      let data = await hotelApiService.handleGetListAllGuest();
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

const handleGetListDevice = async (req, res) => {
  try {
    if (req.query.current && req.query.pageSize) {
      let current = req.query.current;
      let pageSize = req.query.pageSize;
      let data = await hotelApiService.handleGetListDeviceWithPagination(
        +current,
        +pageSize
      );
      return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    } else {
      let data = await hotelApiService.handleGetListAllDevice();
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

const handleDeleteGuest = async (req, res) => {
  try {
    let data = await hotelApiService.handleDeleteGuest(req.body.id);
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

const handleUpdateGuest = async (req, res) => {
  try {
    let data = await hotelApiService.handleUpdateGuest(req.body);
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

const handleGetRoom = async (req, res) => {
  try {
    if (req.query.current && req.query.pageSize) {
      let current = req.query.current;
      let pageSize = req.query.pageSize;
      let data = await hotelApiService.handleGetListRoomWithPagination(
        +current,
        +pageSize
      );
      return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    } else {
      let data = await hotelApiService.handleGetListAllRoom();
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

const handleDeleteRoom = async (req, res) => {
  try {
    let data = await hotelApiService.handleDeleteRoom(req.body.id);
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

const handleUpdateRoom = async (req, res) => {
  try {
    let data = await hotelApiService.handleUpdateRoom(req.body);
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

const handleDeleteDevice = async (req, res) => {
  try {
    let data = await hotelApiService.handleDeleteDevice(req.body.id);
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

const handleUpdateDevice = async (req, res) => {
  try {
    let data = await hotelApiService.handleUpdateDevice(req.body);
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
  handleCreateAHotel,
  handleDeleteAHotel,
  handleGetAllHotel,
  handleUpdateAHotel,
  handleCreateCategoryChannel,
  handleGetCategoryChannel,
  handleUpdateCategoryChannel,
  handleDeleteCategoryChannel,
  handleCreateChannel,
  handleGetListChannel,
  handleDeleteChannel,
  handleUpdateChannel,
  handleCreateChannelCategory,
  handleGetCategoryViaChannel,
  handleDeleteAssignChannelCategory,
  handleUpdateCategoryChannelAssign,
  handleCreatedWifi,
  handleGetListWifi,
  handleDeleteWifi,
  handleUpdateWifi,
  handleCreateInformationHotel,
  handleGetListInformationHotel,
  handleDeleteBackground,
  handleUpdateBackgroundHotel,
  handleCreateGuest,
  handleGetListGuest,
  handleDeleteGuest,
  handleUpdateGuest,
  handleCreateRoom,
  handleGetRoom,
  handleDeleteRoom,
  handleUpdateRoom,
  handleCreateDevice,
  handleGetListDevice,
  handleDeleteDevice,
  handleUpdateDevice,
};
