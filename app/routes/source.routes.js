const { authJwt } = require("../middleware");
const source = require("../controllers/source.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

    // Retrieve all Sources
  app.get("/api/source", source.findAll);

   // Create a new Source
  app.post("/api/source", source.create);

    // Retrieve all Sources by category
  app.get("/api/source/category", source.findAllByCategory);
  
    // Retrieve a single Source with id
  app.get("/api/source/:id", source.findOne);
  
    // Update a Source with id
    app.put("/api/source/:id", source.update);
  
    // Delete a Source with id
    app.delete("/api/source/:id", source.delete);
  
    // Delete all Sources
    app.delete("/api/source", source.deleteAll);

};