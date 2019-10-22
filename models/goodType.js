module.exports = function (sequelize, DataTypes) {
  return sequelize.define('goodType', {
    id: {
      type: DataTypes.BIGINT(11),
      autoIncrement: true,
      primaryKey: true,
      unique: true
    },
    name: {
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