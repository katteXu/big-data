const path = require('path');
const fs = require('fs');
const moment = require('moment');
// 获取日期json
function getDate() {
  const file = path.resolve(__dirname, "./data");
  const dir = fs.readdirSync(file);
  const dateList = dir.filter(fs => fs !== '.DS_Store')
    .map(item => {
      const text = moment(item).format('YYYY-MM-DD')
      return ({ text, key: item })
    })
  return dateList;
}

// 获取商品类别
function getGoodsType(date) {
  const file = path.resolve(__dirname, `./data/${date}`);
  const dir = fs.readdirSync(file);
  const goodsTypeList = dir.map(item => ({ text: item.split('.')[0], key: item }));

  return goodsTypeList;
}


module.exports = {
  getDate,
  getGoodsType
}