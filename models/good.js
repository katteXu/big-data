module.exports = function (sequelize, DataTypes) {
  return sequelize.define('good', {
    id: {
      type: DataTypes.BIGINT(11),
      autoIncrement: true,
      primaryKey: true,
      unique: true
    },
    title: {
      type: DataTypes.STRING(255)
    },
    discountPrice: {
      type: DataTypes.STRING(255)
    },
    originalPrice: {
      type: DataTypes.STRING(255)
    },
    address: {
      type: DataTypes.STRING(1024),
    },
    salesVolume: {
      type: DataTypes.STRING(255),
      get() {
        const value = this.getDataValue('salesVolume');
        return eval(value.replace('万', '*10000'));
      }
    },
    imgUrl: {
      type: DataTypes.STRING(1024),
    },
    link: {
      type: DataTypes.STRING(1024),
    },
    typeId: {
      type: DataTypes.STRING(255),
    },
    date: {
      type: DataTypes.DATEONLY()
    }
  }, {
    underscored: true,
    freezeTableName: true,
    timestamps: false,
    charset: 'utf8',
    collate: 'utf8_general_ci'
  })
}