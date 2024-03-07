import express from "express";
const router = express.Router();
import apiController from "../controller/apiController";
import userController from "../controller/userController";
import hotelController from "../controller/hotelController";
import groupController from "../controller/groupController";
import roleController from "../controller/roleController";
import servicesHotelController from "../controller/servicesHotelController";
import { checkUserJWT, checkUserPerMission } from "../middleware/JWTAction";
import JWTService from "../service/JWTService";
import { uploadAvatar } from "../upload/uploadAvatar";
import sideBarController from "../controller/sideBarController";
import permissionController from "../controller/permissionController";
import MenuAdminController from "../controller/MenuAdminController";
import { uploadLogoChannel } from "../upload/uploadHotel";
/**
 *
 * @param {*} app express app
 */
const initApiHotelRoutes = (app) => {
  //rest api check JWT role and permission
  // router.all("*", checkUserJWT, checkUserPerMission);
  //tắt check token JWT
  router.post("/create-topic", JWTService.createTopic);
  router.get("/refresh-token", JWTService.reFreshToken); //done
  router.post("/check-token", userController.checkToken);
  //Start API Hotel
  //1. Auth
  router.post("/register", apiController.handleRegister); //remove -> forget password
  router.post("/login", apiController.handleLogin); //done
  router.post("/logout", apiController.handleLogout); //done
  router.get("/account", userController.getUserAccount); //done
  router.post("/cInfor", apiController.handleChangeInfor); //done
  router.post("/cPass", apiController.handleChangePassword); //done

  // 1.1 Start  API KPI
  router.post("/add");

  //2. User Management
  router.post(
    "/AUser",
    uploadAvatar.single("avatar"),
    userController.handleCreateUser
  ); //done

  router.post("/BUser", userController.handleBulkUser); // create list users bulk

  router.get("/RUser", userController.readFunc); //gồm get all user vs get all user with pagination

  router.delete("/DUser", userController.deleteFunc); // done

  router.put(
    "/UUser",
    uploadAvatar.single("avatar"),
    userController.updateFunc
  );
  router.post("/user/search-username", userController.handleSearchName);
  router.post("/user/change-password", userController.handleChangePassword); //change PassWord User

  //3. Hotel management
  router.post(
    "/addHotel-BK",
    uploadAvatar.fields([
      {
        name: "logoHorizontal",
        maxCount: 1,
      },
      {
        name: "logoVertical",
        maxCount: 1,
      },
      {
        name: "logoMin",
        maxCount: 1,
      },
    ]),

    hotelController.handleCreateAHotel
  );
  router.post(
    "/Ahotel",
    uploadAvatar.single("logoHorizontal"),
    hotelController.handleCreateAHotel
  );
  router.delete("/Dhotel", hotelController.handleDeleteAHotel);
  router.get("/Rhotel", hotelController.handleGetAllHotel);
  router.put(
    "/updateHotelBK",
    uploadAvatar.fields([
      {
        name: "logoHorizontal",
        maxCount: 1,
      },
      {
        name: "logoVertical",
        maxCount: 1,
      },
      {
        name: "logoMin",
        maxCount: 1,
      },
    ]),
    hotelController.handleUpdateAHotel
  );
  router.put(
    "/UHotel",
    uploadAvatar.single("logoHorizontal"),
    hotelController.handleUpdateAHotel
  );

  //4. Group management
  router.post("/AGroup", groupController.handleCreateGroup);
  router.delete("/DGroup", groupController.handleDeleteGroup);
  router.get("/RGroup", groupController.handleGetAllGroup);
  router.post("/BGroup", groupController.handleBulkGroup);
  router.put("/UGroup", groupController.handleUpdateGroup);

  //5. Role management
  // router.post("/role/create-role-permision", roleController.handleCreateRole);
  // router.delete("/role/delete-role", roleController.handleDeleteRole);
  // router.get("/role/get-all-role", roleController.handleGetAllRole);
  // router.post("/role/bulk-create", roleController.handleBulkRole);
  // router.put("/role/update-role", roleController.handleUpdateRole);

  // router.post("/role/assign-to-group", roleController.assignRoleToGroup);
  // router.get("/role/get-by-group/:groupId", roleController.getRoleByGroup);

  // router.post("/role/assign-to-user", roleController.assignRoleToUser);
  // router.get("/role/get-by-user/:userId", roleController.getRoleByUser);

  //6 Content Management
  router.post(
    "/Asidebar",
    uploadAvatar.single("icon"),
    sideBarController.handleCreateSideBar
  );
  router.delete("/Dsidebar", sideBarController.handleDeleteSideBar);
  router.get("/Rsidebar", sideBarController.handleGetAllSideBar);
  router.put(
    "/Usidebar",
    uploadAvatar.single("icon"),
    sideBarController.handleUpdateSideBar
  );

  //permision - category
  router.post("/ARole", permissionController.handleCreatePermission);

  router.get("/RRole", permissionController.handleReadPermission);

  router.delete("/DRole", permissionController.handleDeletePermission);

  router.get(
    "/permiss-role/:groupId",
    permissionController.getPermissionByRole
  );

  router.post("/assign-role", permissionController.assignPermissionToRole);

  router.put("/URole", permissionController.handleUpdatePermission);

  //menu admin - category
  router.post("/AMenu", MenuAdminController.handleCreateMenuAdmin);

  router.post("/AMenuItem", MenuAdminController.handleCreateMenuAdminItem);

  router.get("/RMenu", MenuAdminController.handleReadMenuAdmin);

  router.put("/UMenu", MenuAdminController.handleUpdateAdminItem);

  router.delete("/DMenu", MenuAdminController.handleDeleteMenuAdmin);

  router.get("/allMenu", MenuAdminController.handleRealAllMenuAdmin);

  router.post("/assignMenuRole", MenuAdminController.assignMenuToRole);

  router.get(
    "/menuByRole/:groupId",
    MenuAdminController.handleGetListMenuByRole
  );

  router.post("/menuDisplay", MenuAdminController.handleMenuDisplay);

  //End API Hotel

  router.post("/Acate", hotelController.handleCreateCategoryChannel);

  router.get("/Rcate", hotelController.handleGetCategoryChannel);

  router.delete("/Dcate", hotelController.handleDeleteCategoryChannel);

  router.put("/Ucate", hotelController.handleUpdateCategoryChannel);

  router.post(
    "/Achannel",
    uploadLogoChannel.single("logo"),
    hotelController.handleCreateChannel
  ); //done

  router.get("/Rchannel", hotelController.handleGetListChannel);

  router.delete("/Dchannel", hotelController.handleDeleteChannel);

  router.put(
    "/Uchannel",
    uploadLogoChannel.single("logo"),
    hotelController.handleUpdateChannel
  );

  router.post("/AChannelCate", hotelController.handleCreateChannelCategory);

  router.delete(
    "/DChannelCate",
    hotelController.handleDeleteAssignChannelCategory
  );

  router.put(
    "/UChannelCate",
    hotelController.handleUpdateCategoryChannelAssign
  );

  router.get("/RChannelCate", hotelController.handleGetCategoryViaChannel);

  //Wifi Hotel

  router.post("/Awifi", hotelController.handleCreatedWifi);

  router.get("/Rwifi", hotelController.handleGetListWifi);

  router.delete("/Dwifi", hotelController.handleDeleteWifi);

  router.put("/Uwifi", hotelController.handleUpdateWifi);

  //Background & Content Hotel
  router.post(
    "/AinforH",
    uploadLogoChannel.single("background"),
    hotelController.handleCreateInformationHotel
  );

  router.get("/RinforH", hotelController.handleGetListInformationHotel);

  router.delete("/DinforH", hotelController.handleDeleteBackground);

  router.put(
    "/UinforH",
    uploadLogoChannel.single("background"),
    hotelController.handleUpdateBackgroundHotel
  );

  router.post("/Aguest", hotelController.handleCreateGuest);
  router.get("/Rguest", hotelController.handleGetListGuest);
  router.delete("/Dguest", hotelController.handleDeleteGuest);
  router.put("/Uguest", hotelController.handleUpdateGuest);

  router.post("/Aroom", hotelController.handleCreateRoom);
  router.get("/Rroom", hotelController.handleGetRoom);
  router.delete("/Droom", hotelController.handleDeleteRoom);
  router.put("/Uroom", hotelController.handleUpdateRoom);

  //Device
  router.post("/Adevice", hotelController.handleCreateDevice);
  router.get("/Rdevice", hotelController.handleGetListDevice);
  router.delete("/Ddevice", hotelController.handleDeleteDevice);
  router.put("/Udevice", hotelController.handleUpdateDevice);

  //Service Hotel
  router.post("/Aservice", servicesHotelController.handleCreateServiceHotel);
  router.get("/Rservice", servicesHotelController.handleGetListServiceHotel);
  router.post(
    "/AserviceEx",
    uploadLogoChannel.single("service_background"),
    servicesHotelController.handleServiceExtend
  );
  router.put(
    "/UserviceEx",
    uploadLogoChannel.single("service_background"),
    servicesHotelController.handleUpdateServiceExtend
  );
  router.delete(
    "/DservicesEx",
    servicesHotelController.handleDeleteServiceExtend
  );
  router.put("/Uservice", servicesHotelController.handleUpdateService);
  router.delete("/Dservice", servicesHotelController.handleDeleteService);

  //Menu Hotel Start
  router.post("/AMenuH", servicesHotelController.handleCreateMenuHotel);
  router.get("/RMenuH", servicesHotelController.handleGetListMenuHotel);
  router.put("/UMenuH", servicesHotelController.handleUpdateMenuHotel);
  router.delete("/DMenuH", servicesHotelController.handleDeleteMenuHotel);
  router.post(
    "/AMenuEx",
    uploadLogoChannel.single("service_background"),
    servicesHotelController.handleCreateMenuHotelExtend
  );
  router.put(
    "/UMenuEx",
    uploadLogoChannel.single("service_background"),
    servicesHotelController.handleUpdateMenuExtend
  );
  router.delete("/DMenuEx", servicesHotelController.handleDeleteMenuExtend);

  //Menu Hotel End

  //Explore Hotel Start
  router.post("/AExplore", servicesHotelController.handleCreateExploreHotel);
  router.get("/RExplore", servicesHotelController.handleGetListExploreHotel);
  router.put("/UExplore", servicesHotelController.handleUpdateExploreHotel);
  router.delete("/DExplore", servicesHotelController.handleDeleteExploreHotel);
  router.post(
    "/AExploreEx",
    uploadLogoChannel.single("service_background"),
    servicesHotelController.handleCreateExploreExtend
  );
  router.put(
    "/UExploreEx",
    uploadLogoChannel.single("service_background"),
    servicesHotelController.handleUpdateExploreExtend
  );
  router.delete(
    "/DExploreEx",
    servicesHotelController.handleDeleteExploreExtend
  );

  //Guide Hotel Start
  router.post("/Aguide", servicesHotelController.handleCreateGuideHotel);
  router.get("/Rguide", servicesHotelController.handleGetListGuideHotel);
  router.put("/Uguide", servicesHotelController.handleUpdateGuideHotel);
  router.delete("/Dguide", servicesHotelController.handleDeleteGuideHotel);
  router.post(
    "/AguideEx",
    uploadLogoChannel.single("service_background"),
    servicesHotelController.handleCreateGuideExtend
  );
  router.put(
    "/UguideEx",
    uploadLogoChannel.single("service_background"),
    servicesHotelController.handleUpdateGuideExtend
  );
  router.delete("/DguideEx", servicesHotelController.handleDeleteGuideExtend);

  //Explore Hotel End

  return app.use("/api/v1/hotel", router);
};

export default initApiHotelRoutes;
