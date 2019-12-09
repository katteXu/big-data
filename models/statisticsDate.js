module.exports = function (sequelize, DataTypes) {
  return sequelize.define('statisticsDate', {
    id: {
      type: DataTypes.BIGINT(11),
      autoIncrement: true,
      primaryKey: true,
      unique: true
    },
    typeId: {
      type: DataTypes.BIGINT(11),
    },
    name: {
      type: DataTypes.STRING(255)
    },
    date: {
      type: DataTypes.DATEONLY()
    },
    totalPrice: {
      type: DataTypes.STRING(255)
    },
    averagePrice: {
      type: DataTypes.STRING(255)
    },
    averageOriginalPrice: {
      type: DataTypes.STRING(255)
    },
    totalSales: {
      type: DataTypes.STRING(255)
    }
  }, {
    underscored: true,
    freezeTableName: true,
    timestamps: false,
    charset: 'utf8',
    collate: 'utf8_general_ci'
  })
}