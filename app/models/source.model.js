module.exports = (sequelize, Sequelize) => {
    const Source = sequelize.define("sources", {
        sourceName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      sourceType: {
        type: Sequelize.STRING,
        allowNull: false
      },
      sourceLink: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      sourceLanguage: {
        type: Sequelize.STRING,
        allowNull: false
      },
      newsCategory: {
        type: Sequelize.STRING,
        allowNull: false
      },
      sourceIcon: {
        type: Sequelize.STRING,
        allowNull: false
      }
    });
    return Source;
  };