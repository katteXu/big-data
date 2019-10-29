const Sequelize = require('sequelize');
const config = require('../config');
const sequelize = new Sequelize(
  config.mysql.database,
  config.mysql.username,
  config.mysql.password,
  {
    'dialect': 'mysql', // 数据库使用mysql
    'host': config.mysql.host, // 数据库服务器ip
    'port': config.mysql.port, // 数据库运行端口
    'timestamps': false, // 这个参数为true是MySQL会自动给每条数据添加createdAt和updateAt字段
    'quoteIdentifiers': true
  }
)

// 商品表
const Good = sequelize.import('./good');

// 商品类型表
const GoodType = sequelize.import('./goodType');

// 整体统计表
const Statistics = sequelize.import('./statistics');

// 清洗数据 查询
const cleanData = async () => {
  const res = await sequelize.query(`
  select 
  b.id id,
  b.name,
  sum(a.discount_price) totalPrice,
  avg(a.discount_price) averagePrice,
  sum(
  case 
  when a.sales_volume like '%万%' then a.sales_volume*10000
  else a.sales_volume*1 end
  ) totalSales
  from good a
  right join goodType b on a.type_id = b.id
  group by b.id
`, {
    type: Sequelize.QueryTypes.SELECT
  });
  const result = Statistics.bulkCreate(res, {
    updateOnDuplicate: ["id","name","totalPrice","averagePrice","totalSales"]
  });
  return result;
}

// 同步数据库
sequelize.sync().then(async () => {
  const res = await GoodType.findAll();
  if (res.length === 0) {
    const record = [
      { name: '茶' },
      { name: '干果' },
      { name: '果脯' },
      { name: '花卉苗木' },
      { name: '粮油' },
      { name: '食用菌' },
      { name: '蔬菜' },
      { name: '水产品' },
      { name: '水果' },
      { name: '烟叶' },
      { name: '药材' }
    ];
    // 初始化商品类型
    GoodType.bulkCreate(record);
  }
});

module.exports = {
  Good,
  GoodType,
  Statistics,
  cleanData
}
