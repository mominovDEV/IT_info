const { Router } = require("express");

const router = Router();

// const express = require("express");

const authorRoute = require("./author.routes");
const userRouter = require("./user.routes");

// express.Router.prefix = function (path, subRouter) {
//   const router = Router();
//   this.use(path, router);
//   subRouter(router);
//   return router;
// };


router.use("/author", authorRoute);
router.use("/user", userRouter);

// router.prefix("/api", (apiRouter) => {
//   apiRouter.use("/dictionary", require("./dictionary.routes"));
//   apiRouter.use("/description", require("./description.routes"));
//   apiRouter.use("/category", require("./category.routes"));
//   apiRouter.use("/author", require("./author.routes"));
//   apiRouter.use("/admin", require("./admin.routes"));
//   apiRouter.use("/topic", require("./topic.routes"));
// });

module.exports = router;
