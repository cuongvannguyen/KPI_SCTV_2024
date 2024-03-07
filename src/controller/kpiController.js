import kpiService from "../service/kpiService";
const handleCreateConcurrentPosition = async (req, res) => {
  try {
    let response = await kpiService.handleCreateConcurrentPosition(req.body);
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

module.exports = {
  handleCreateConcurrentPosition,
};
