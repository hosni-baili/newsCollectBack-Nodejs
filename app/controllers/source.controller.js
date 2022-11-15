const db = require("../models");
const config = require("../config/auth.config");
const Source = db.source;
const Op = db.Sequelize.Op;

const getPagination = (page, size) => {
  const limit = size ? +size : 3;
  const offset = page ? page * limit : 0;

  return { limit, offset };
};

const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: sources } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);

  return { totalItems, sources, totalPages, currentPage };
};

exports.findAll = (req, res) => {

  const { page, size, name, type } = req.query;
  let condition={}
  if(name){
    condition["sourceName"]= { [Op.like]: `%${name}%` };
  }
  if(type){
    condition["sourceType"]={ [Op.like]: `%${type}%` };
  }

  const { limit, offset } = getPagination(page, size);

  Source.findAndCountAll({ where: condition, limit, offset })
    .then(sources => {
      if (!sources) {
        return res.status(404).send({ message: "sources Not found." });
      }
      else{
        const response = getPagingData(sources, page, limit);
        return res.status(200).send(response)        
      }
    })
    .catch(err => {
      console.log('error here')
      return res.status(500).send({ message: err.message });
    });
};


// Create and Save a new Source
exports.create = (req, res) => {

  // Validate request
  if (!req.query) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
  console.log(req.data)
  console.log(req.query)
  console.log(req.params)
  console.log(req.body)

  // Save Source in the database
  Source.create({
    sourceName: req.body.sourceName,
    sourceType: req.body.sourceType,
    sourceLink: req.body.sourceLink,
    sourceLanguage: req.body.sourceLanguage,
    newsCategory: req.body.newsCategory,
    sourceIcon: req.body.sourceIcon
  })
  .then(src=>{
    if(src){
      res.status(200).send({ message: "Source was registered successfully!" });
    } else   
      res.status(200).send({ message: "Source not registered!" });
  })
  .catch(err => {
    res.status(500).send({ message: err.message });
  });
};


// Find a single Source with a id
exports.findOne = (req, res) => {
  Source.findByPk(req.params.id)
  .then(source=>{
           res.status(200).send(source);
    })
  .catch(err => {
      res.status(500).send({ message: err.message });
  });
};

// Update a Source identified by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  console.log(id)
    // Validate Request
    if (!req.body) {
        res.status(400).send({
          message: "Content can not be empty!"
        });
      }

      Source.update(req.body, {
        where: { id: id }
      })
      .then(
        num => {
          if (num == 1) {
            res.send({
              message: "Source was updated successfully."
            });
          } else {
            res.send({
              message: `Cannot update Source with id=${id}. Maybe Source was not found or req.body is empty!`
            });
          }
        }
      )
    };


// Delete a Source with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Source.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Source was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Source with id=${id}. Maybe Source was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Source with id=" + id
      });
    });
};

// Delete all Sources from the database.
exports.deleteAll = (req, res) => {
  Source.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Sources were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Sources."
      });
    });
};


// find all Sources by category
exports.findAllByCategory = (req, res) => {
  const { page, size, name, category } = req.query;
  let condition={}
  if(name){
    condition["sourceName"]= { [Op.like]: `%${name}%` };
  }
  if(category){
    condition["newsCategory"]={ [Op.like]: `%${category}%` };
  }

  const { limit, offset } = getPagination(page, size);

  Source.findAndCountAll({ where: condition, limit, offset })
    .then(data => {
      const response = getPagingData(data, page, limit);
      res.send(response);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving sources."
      });
    });
};