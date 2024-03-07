import hotelService from "../services/hotelService";

const handleCreateServiceHotel = async (req, res) => {
  try {
    let response = await hotelService.handleCreateService(req.body);

    return res.status(200).json({
      EM: response.EM,
      EC: response.EC,
      DT: response.DT,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      EM: "Error from server, PCLNCPT",
      EC: "-1",
      DT: "",
    });
  }
};

const handleCreateMenuHotel = async (req, res) => {
  try {
    let response = await hotelService.handleCreateMenuHotel(req.body);

    return res.status(200).json({
      EM: response.EM,
      EC: response.EC,
      DT: response.DT,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      EM: "Error from server, PCLNCPT",
      EC: "-1",
      DT: "",
    });
  }
};

const handleCreateExploreHotel = async (req, res) => {
  try {
    let response = await hotelService.handleCreateExploreHotel(req.body);

    return res.status(200).json({
      EM: response.EM,
      EC: response.EC,
      DT: response.DT,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      EM: "Error from server, PCLNCPT",
      EC: "-1",
      DT: "",
    });
  }
};

const handleCreateGuideHotel = async (req, res) => {
  try {
    let response = await hotelService.handleCreateGuideHotel(req.body);

    return res.status(200).json({
      EM: response.EM,
      EC: response.EC,
      DT: response.DT,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      EM: "Error from server, PCLNCPT",
      EC: "-1",
      DT: "",
    });
  }
};

const handleUpdateServiceExtend = async (req, res) => {
  try {
    let response = await hotelService.handleUpdateServiceExtend(
      req.body,
      req.file
    );
    console.log(response);
    return res.status(200).json({
      EM: response.EM,
      EC: response.EC,
      DT: response.DT,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      EM: "Error from server, PCLNCPT",
      EC: "-1",
      DT: "",
    });
  }
};

const handleUpdateMenuExtend = async (req, res) => {
  try {
    let response = await hotelService.handleUpdateMenuExtend(
      req.body,
      req.file
    );
    console.log(response);
    return res.status(200).json({
      EM: response.EM,
      EC: response.EC,
      DT: response.DT,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      EM: "Error from server, PCLNCPT",
      EC: "-1",
      DT: "",
    });
  }
};

const handleUpdateExploreExtend = async (req, res) => {
  try {
    let response = await hotelService.handleUpdateExploreExtend(
      req.body,
      req.file
    );

    return res.status(200).json({
      EM: response.EM,
      EC: response.EC,
      DT: response.DT,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      EM: "Error from server, PCLNCPT",
      EC: "-1",
      DT: "",
    });
  }
};

const handleUpdateGuideExtend = async (req, res) => {
  try {
    let response = await hotelService.handleUpdateGuideExtend(
      req.body,
      req.file
    );

    return res.status(200).json({
      EM: response.EM,
      EC: response.EC,
      DT: response.DT,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      EM: "Error from server, PCLNCPT",
      EC: "-1",
      DT: "",
    });
  }
};

const handleServiceExtend = async (req, res) => {
  try {
    let response = await hotelService.handleCreateExtendService(
      req.body,
      req.file
    );

    return res.status(200).json({
      EM: response.EM,
      EC: response.EC,
      DT: response.DT,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      EM: "Error from server, PCLNCPT",
      EC: "-1",
      DT: "",
    });
  }
};

const handleCreateMenuHotelExtend = async (req, res) => {
  try {
    console.log("check body: ", req.body);
    let response = await hotelService.handleCreateMenuHotelExtend(
      req.body,
      req.file
    );

    return res.status(200).json({
      EM: response.EM,
      EC: response.EC,
      DT: response.DT,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      EM: "Error from server, PCLNCPT",
      EC: "-1",
      DT: "",
    });
  }
};

const handleCreateExploreExtend = async (req, res) => {
  try {
    let response = await hotelService.handleCreateExploreExtend(
      req.body,
      req.file
    );

    return res.status(200).json({
      EM: response.EM,
      EC: response.EC,
      DT: response.DT,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      EM: "Error from server, PCLNCPT",
      EC: "-1",
      DT: "",
    });
  }
};

const handleCreateGuideExtend = async (req, res) => {
  try {
    let response = await hotelService.handleCreateGuideExtend(
      req.body,
      req.file
    );

    return res.status(200).json({
      EM: response.EM,
      EC: response.EC,
      DT: response.DT,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      EM: "Error from server, PCLNCPT",
      EC: "-1",
      DT: "",
    });
  }
};

const handleGetListServiceHotel = async (req, res) => {
  try {
    if (req.query.current && req.query.pageSize) {
      let current = req.query.current;
      let pageSize = req.query.pageSize;
      let data = await hotelService.getServiceWithPagination(
        +current,
        +pageSize
      );
      return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    } else {
      let data = await hotelService.getAllService();
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

const handleGetListMenuHotel = async (req, res) => {
  try {
    if (req.query.current && req.query.pageSize) {
      let current = req.query.current;
      let pageSize = req.query.pageSize;
      let data = await hotelService.getMenuHotelWithPagination(
        +current,
        +pageSize
      );
      return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    } else {
      let data = await hotelService.getAllMenuHotel();
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

const handleGetListExploreHotel = async (req, res) => {
  try {
    if (req.query.current && req.query.pageSize) {
      let current = req.query.current;
      let pageSize = req.query.pageSize;
      let data = await hotelService.getExploreHotelWithPagination(
        +current,
        +pageSize
      );
      return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    } else {
      let data = await hotelService.getAllExploreHotel();
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

const handleGetListGuideHotel = async (req, res) => {
  try {
    if (req.query.current && req.query.pageSize) {
      let current = req.query.current;
      let pageSize = req.query.pageSize;

      let data = await hotelService.getGuideHotelWithPagination(
        +current,
        +pageSize
      );
      return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    } else {
      let data = await hotelService.getAllGuideHotel();
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

const handleDeleteServiceExtend = async (req, res) => {
  try {
    let response = await hotelService.handleDeleteServiceExtend(req.body);

    return res.status(200).json({
      EM: response.EM,
      EC: response.EC,
      DT: response.DT,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      EM: "Error from server, PCLNCPT",
      EC: "-1",
      DT: "",
    });
  }
};

const handleDeleteMenuExtend = async (req, res) => {
  try {
    let response = await hotelService.handleDeleteMenuExtend(req.body);

    return res.status(200).json({
      EM: response.EM,
      EC: response.EC,
      DT: response.DT,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      EM: "Error from server, PCLNCPT",
      EC: "-1",
      DT: "",
    });
  }
};

const handleDeleteExploreExtend = async (req, res) => {
  try {
    let response = await hotelService.handleDeleteExploreExtend(req.body);

    return res.status(200).json({
      EM: response.EM,
      EC: response.EC,
      DT: response.DT,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      EM: "Error from server, PCLNCPT",
      EC: "-1",
      DT: "",
    });
  }
};

const handleDeleteGuideExtend = async (req, res) => {
  try {
    let response = await hotelService.handleDeleteGuideExtend(req.body);

    return res.status(200).json({
      EM: response.EM,
      EC: response.EC,
      DT: response.DT,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      EM: "Error from server, PCLNCPT",
      EC: "-1",
      DT: "",
    });
  }
};

const handleUpdateService = async (req, res) => {
  try {
    if (req.body.isChangeStatus) {
      let data = await hotelService.handleUpdateStatusService(req.body);
      return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    } else {
      let response = await hotelService.handleUpdateService(req.body);
      return res.status(200).json({
        EM: response.EM,
        EC: response.EC,
        DT: response.DT,
      });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      EM: "Error from server, PCLNCPT",
      EC: "-1",
      DT: "",
    });
  }
};

const handleUpdateMenuHotel = async (req, res) => {
  try {
    if (req.body.isChangeStatus) {
      let data = await hotelService.handleUpdateStatusMenu(req.body);
      return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    } else {
      let response = await hotelService.handleUpdateMenuHotel(req.body);
      return res.status(200).json({
        EM: response.EM,
        EC: response.EC,
        DT: response.DT,
      });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      EM: "Error from server, PCLNCPT",
      EC: "-1",
      DT: "",
    });
  }
};

const handleUpdateExploreHotel = async (req, res) => {
  try {
    if (req.body.isChangeStatus) {
      let data = await hotelService.handleUpdateStatusExplore(req.body);
      return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    } else {
      let response = await hotelService.handleUpdateExploreHotel(req.body);
      return res.status(200).json({
        EM: response.EM,
        EC: response.EC,
        DT: response.DT,
      });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      EM: "Error from server, PCLNCPT",
      EC: "-1",
      DT: "",
    });
  }
};

const handleUpdateGuideHotel = async (req, res) => {
  try {
    if (req.body.isChangeStatus) {
      let data = await hotelService.handleUpdateStatusGuide(req.body);
      return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    } else {
      let response = await hotelService.handleUpdateGuide(req.body);
      return res.status(200).json({
        EM: response.EM,
        EC: response.EC,
        DT: response.DT,
      });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      EM: "Error from server, PCLNCPT",
      EC: "-1",
      DT: "",
    });
  }
};

const handleDeleteService = async (req, res) => {
  try {
    let response = await hotelService.handleDeleteService(req.body);

    return res.status(200).json({
      EM: response.EM,
      EC: response.EC,
      DT: response.DT,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      EM: "Error from server, PCLNCPT",
      EC: "-1",
      DT: "",
    });
  }
};

const handleDeleteMenuHotel = async (req, res) => {
  try {
    let response = await hotelService.handleDeleteMenuHotel(req.body);

    return res.status(200).json({
      EM: response.EM,
      EC: response.EC,
      DT: response.DT,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      EM: "Error from server, PCLNCPT",
      EC: "-1",
      DT: "",
    });
  }
};

const handleDeleteExploreHotel = async (req, res) => {
  try {
    let response = await hotelService.handleDeleteExploreHotel(req.body);

    return res.status(200).json({
      EM: response.EM,
      EC: response.EC,
      DT: response.DT,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      EM: "Error from server, PCLNCPT",
      EC: "-1",
      DT: "",
    });
  }
};

const handleDeleteGuideHotel = async (req, res) => {
  try {
    let response = await hotelService.handleDeleteGuideHotel(req.body);

    return res.status(200).json({
      EM: response.EM,
      EC: response.EC,
      DT: response.DT,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      EM: "Error from server, PCLNCPT",
      EC: "-1",
      DT: "",
    });
  }
};

module.exports = {
  handleCreateServiceHotel,
  handleGetListServiceHotel,
  handleServiceExtend,
  handleUpdateServiceExtend,
  handleDeleteServiceExtend,
  handleUpdateService,
  handleDeleteService,
  handleCreateMenuHotel,
  handleGetListMenuHotel,
  handleUpdateMenuHotel,
  handleDeleteMenuHotel,
  handleCreateMenuHotelExtend,
  handleUpdateMenuExtend,
  handleDeleteMenuExtend,
  handleCreateExploreHotel,
  handleGetListExploreHotel,
  handleUpdateExploreHotel,
  handleDeleteExploreHotel,
  handleCreateExploreExtend,
  handleUpdateExploreExtend,
  handleDeleteExploreExtend,

  handleDeleteGuideHotel,
  handleUpdateGuideHotel,
  handleDeleteGuideExtend,
  handleGetListGuideHotel,
  handleCreateGuideExtend,
  handleUpdateGuideExtend,
  handleCreateGuideHotel,
};
