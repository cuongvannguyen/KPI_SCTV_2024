import express from "express";
const router = express.Router();
import homeController from "../controller/homeController"
/**
 *
 * @param {*} app express app
 */
const initWebRoutes = (app) => {
  // router.get("/", (req, res) => {
  //   return res.send("hello World");
  // });
  router.get("/", homeController.handleHelloworld)
  router.get("/user", homeController.handleUserPage);
  router.post("/users/create-user", homeController.handleCreateNewUser)
  router.post("/delete-user/:id", homeController.handleDeleteUser)
  router.get("/update-user/:id", homeController.getUpdateUserPage)
  router.post("/users/update-user", homeController.handleUpdateUser)

  return app.use("/", router);
};

export default initWebRoutes;