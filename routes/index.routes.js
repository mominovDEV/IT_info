const { Router } = require("express");
const express = require("express");

express.Router.prefix = function (path, subRouter) {
  const router = Router();
  this.use(path, router);
  subRouter(router);
  return router;
};

const router = Router();

router.prefix("/api", (apiRouter) => {
  apiRouter.use("/dictionary", require('./dictionary.routes'));
  apiRouter.use("/description", require('./description.routes'));
  apiRouter.use("/category", require('./category.routes'));
  apiRouter.use("/author", require('./author.routes'));
  apiRouter.use("/admin", require('./admin.routes'));
});

module.exports = router;
