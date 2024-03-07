import express from "express";
let multer = require("multer");
const router = express.Router();
import apiController from "../controller/apiController";
import userController from "../controller/userController";
import groupController from "../controller/groupController";
import snmpController from "../controller/snmpcontroller";
import roleController from "../controller/roleController";
import logginVPNController from "../controller/logginVPNController";
import channelControler from "../controller/channelController";
import { checkUserJWT, checkUserPerMission } from "../middleware/JWTAction";
import fileController from "../controller/fileController";
import exportDataSctvOnline from "../service/exportSctvOnline/exportDataSctvOnline";
/**
 *
 * @param {*} app express app
 */

const initApiRoutes = (app) => {
  //rest api
  // router.all("*", checkUserJWT, checkUserPerMission);
  router.get("/test-ott", exportDataSctvOnline.testSlectedOTT);

  //Channel
  //Check Status Channel
  router.get("/get-area-dvbt2-kinhdoanh", channelControler.getAreaMonitorT2);
  router.get("/get-area-monitor", channelControler.getAreaMonitor);
  router.get("/get-device-raspbery", channelControler.getDeviceRaspbery);

  router.post("/get-channels", channelControler.getChannels); //check status from Raspberry
  router.post("/action-channels", channelControler.actionChannels); // start|stop channel

  router.get("/get-channel-monitor", channelControler.getChannelMonitor);

  router.get(
    "/get-channel-monitor-dvbt2-kinhdoanh",
    channelControler.getChannelMonitorBusiness
  );

  router.get("/get-one-channel-monitor", channelControler.getOneChannelMonitor);
  router.post(
    "/find-channel-multi-monitor",
    channelControler.findChannelMultiMonitor
  );
  router.get("/get-frequency-channel", channelControler.getFrequencyChannell);
  router.get(
    "/get-frequency-channel-device",
    channelControler.getFrequencyChannelDevice
  );
  router.get("/get-all-channel", channelControler.getAllChannel);
  router.get("/get-channel-catchup", channelControler.getChannelCatchup);
  router.get(
    "/get-schedule-catchup",
    channelControler.getScheduleChannelCatchup
  );

  //Save File to Server
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./src/storage/uploads");
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + file.originalname;
      const name = Buffer.from(uniqueSuffix, "latin1").toString("utf8");
      cb(null, name);
    },
  });

  const upload = multer({ storage: storage });

  router.post("/upload", upload.array("file"), fileController.handleSaveFile);
  router.post(
    "/upload/attachment",
    upload.array("file"),
    fileController.handleSaveFileAttachment
  );
  router.post(
    "/upload/report",
    upload.array("file"),
    fileController.handleSaveFileReport
  );

  router.get("/download/fileAttachment", fileController.downloadFile);

  router.get("/getFile", fileController.getFile);
  router.get("/readFile", fileController.readFiles);
  router.get("/get-Profile-Test", fileController.getProfileTest);
  router.get("/getDetailTest", fileController.getDetailTest);
  router.delete("/delete-register-test", fileController.deleteRegisterTest);
  router.post("/verify-test", fileController.postVerifyTest);
  router.get("/get-department-test", fileController.getDepartmentTest);

  //GET - R, POST - C, PUT - U, DELETE - D
  router.post("/test-api", apiController.testApi);
  router.post("/test-api-box", apiController.exportBox);
  //Loggin VPN
  router.get("/loggin/read", logginVPNController.handleLoginVPN);
  router.post("/changed/accountVpn", logginVPNController.handleChangedVpn);
  router.post(
    "/password/changePasswordSystem",
    userController.handleChangePassWordSystem
  );

  router.post("/register", apiController.handleRegister);
  router.post("/login", apiController.handleLogin);
  router.post("/logout", apiController.handleLogout);

  //user route
  router.get("/account", userController.getUserAccount);
  router.get("/user/read", userController.readFunc);
  router.post("/user/create", userController.createFunc);
  router.delete("/user/delete", userController.deleteFunc);
  router.put("/user/update", userController.updateFunc);

  //post article guide
  router.post("/save-article", userController.postInforArticle);
  router.get("/get-all-article", userController.getAllArticle);
  router.get("/get-content-article", userController.getContentArticle);

  //role route
  router.get("/role/read", roleController.readFunc);
  router.post("/role/create", roleController.createFunc);
  router.delete("/role/delete", roleController.deleteFunc);
  router.put("/role/update", roleController.updateFunc);
  router.get("/role/by-group/:groupId", roleController.getRoleByGroup);
  router.post("/role/assign-to-group", roleController.assignRoleToGroup);

  //group route
  router.get("/group/read", groupController.readFunc);
  router.get("/position/read", groupController.readPosition);
  router.get("/branch/read", groupController.readBranch);

  router.post(
    "/create-new-configure-snmp",
    snmpController.hanleCreatConfigureSnmp
  );
  router.get("/:name/:id", snmpController.handleGetValueOid);
  router.post("/get-all-oid", snmpController.hadleGetAllOid);
  router.delete("/delete-oid", snmpController.handleDeleteOid);

  return app.use("/api/v1", router);
};

export default initApiRoutes;
