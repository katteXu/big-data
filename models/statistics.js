module.exports = function (sequelize, DataTypes) {
  return sequelize.define('statistics', {
    id: {
      type: DataTypes.BIGINT(11),
      autoIncrement: true,
      primaryKey: true,
      unique: true
    },
    name: {
      type: DataTypes.STRING(255)
    },
    totalPrice: {
      type: DataTypes.STRING(255)
    },
    averagePrice: {
      type: DataTypes.STRING(255)
    },
    totalSales: {
      type: DataTypes.STRING(255)
    },
    typeId: {
      type: DataTypes.STRING(255),
    },
  }, {
    underscored: true,
    freezeTableName: true,
    timestamps: false,
    charset: 'utf8',
    collate: 'utf8_general_ci'
  })
}