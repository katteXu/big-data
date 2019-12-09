const Koa = require('koa');
const Router = require('koa-router');
const Public = require('koa-static');
const cors = require('koa2-cors');
const multer = require('koa-multer'); //加载koa-multer模块 
const history = require('koa-connect-history-api-fallback');
const bodyParser = require('koa-bodyparser');
const xlsx = require('xlsx');
const path = require('path');
const _ = require('lodash');
const fs = require('fs');
const compressing = require('compressing');
const config = require('./config');
const { Good, GoodType, Statistics, cleanData } = require('./models');
const app = new Koa();
const router = new Router();
const home = Public(path.resolve(__dirname, "./client/dist/"))

const storage = multer.diskStorage({
  //文件保存路径  
  destination: function (req, file, cb) {
    cb(null, './temp/');
  },
  //修改文件名称  
  filename: function (req, file, cb) {
    const fileFormat = (file.originalname).split(".");
    cb(null, Date.now() + "." + fileFormat[fileFormat.length - 1]);
  },
});
// 加载配置
const upload = multer({ storage });

const { getDate, getGoodsType, getFakeChartData } = require('./api');

// 获取日期列表
router.get('/api/getDateList', async ctx => {
  const res = getDate();
  ctx.body = res;
});

// 获取商品类别 根据日期 获取excel文件
// router.get('/api/getGoodsTypeList', async ctx => {
//   const { date } = ctx.query;
//   if (date) {
//     const res = getGoodsType(date);
//     ctx.body = res;
//   } else {
//     ctx.body = [];
//   }
// });

// 直接从数据库获取
router.get('/api/getGoodsTypeList', async ctx => {
  const type = await GoodType.findAll();
  ctx.body = type;
});

// 根据传参导入数据库 并清洗
router.get('/api/import', async ctx => {
  const { date, goodsType, isClean } = ctx.query;
  const res = await importDataBase(date, goodsType);
  if (isClean === 'true') {
    await cleanData();
  }
  ctx.body = {
    count: res.length
  }
});

// 删除数据
router.get('/api/delete', async ctx => {
  const { date, goodsType } = ctx.query;
  const query = {};
  date && (query.date = date);
  goodsType && (query.typeId = goodsType);
  const data = await Good.destroy({
    where: query
  })
  ctx.body = {
    data
  }
});

// 查询数据接口
router.get('/api/getData', async ctx => {
  const { date, goodsType, page, limit } = ctx.query;
  const query = {};
  date && (query.date = date)
  goodsType && (query.typeId = goodsType);

  const res = await Good.findAndCountAll({
    where: query,
    offset: (page - 1) * limit,
    limit: limit * 1,
  });
  ctx.body = res;
});

// 登录接口
router.post('/api/login', async ctx => {
  const { userName, password } = ctx.request.body;
  if (userName === "admin" && password === '123456') {
    ctx.body = {
      status: 'ok',
      message: '登录成功',
      currentAuthority: 'admin',
      type: 'account'
    }
  } else {
    ctx.body = {
      status: 'fail',
      message: '登录失败，用户名或密码不正确'
    }
  }
});

// 获取当前用户
router.get('/api/currentUser', async ctx => {
  ctx.body = {
    name: '管理员',
    avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
    userid: '00000001',
    email: '417560450@qq.com',
    signature: '',
    title: '数据专家',
    group: '所属团队',
    tags: [
      {
        key: '0',
        label: '很有想法的',
      },
      {
        key: '1',
        label: '专注设计',
      },
      {
        key: '2',
        label: '辣~',
      },
      {
        key: '3',
        label: '大长腿',
      },
      {
        key: '4',
        label: '川妹子',
      },
      {
        key: '5',
        label: '海纳百川',
      },
    ],
    notifyCount: 12,
    unreadCount: 11,
    country: 'China',
    geographic: {
      province: {
        label: '浙江省',
        key: '330000',
      },
      city: {
        label: '杭州市',
        key: '330100',
      },
    },
    address: '西湖区工专路 77 号',
    phone: '0752-268888888',
  }
});

// 获取统计数据
router.get('/api/fake_chart_data', async ctx => {
  // const res = await Good.findAll();
  // const type = await GoodType.findAll();
  // console.log(res);
  // const result = _.chain(res)
  //   .groupBy("typeId")
  //   .map(function (value, key) {
  //     // const resByType = await Good.findAll({ where: { typeId: key } });
  //     // const date = _.chain(resByType).groupBy("date").map(function (value, key) {
  //     //   return {
  //     //     one: _reduce(value, function (result, current) {
  //     //       return result + current.salesVolume;
  //     //     }, 0)
  //     //   }
  //     // })
  //     return {
  //       id: key,
  //       salesVolume: _.reduce(value, function (result, current) {
  //         return result + current.salesVolume
  //       }, 0)
  //     };
  //   }).value();
  // 单类商品 日销量
  // const totalByDate = await Promise.all(type.map(async ({ id, name }) => {
  //   const res = await Good.findAll({ where: { typeId: id } });
  //   const result = _.chain(res).groupBy("date").map((value, key) => {
  //     return {
  //       x: key, y: _.reduce(value, function (result, current) {
  //         return result + current.salesVolume
  //       }, 0)
  //     }
  //   })
  //   const total = _.reduce(res, function (result, current) {
  //     return result + current.salesVolume
  //   }, 0)
  //   return { name, data: result, total };
  // }));
  const totalByDate = [
    { name: '茶', data: [], total: 1545433 },
    { name: '干果', data: [], total: 2345433 },
    { name: '果脯', data: [], total: 223456 },
    { name: '粮油', data: [], total: 3437722 },
    { name: '花卉苗木', data: [], total: 343346 },
    { name: '食用菌', data: [], total: 7567345 },
    { name: '水果', data: [], total: 34535 },
    { name: '烟叶', data: [], total: 86779 }
  ]

  // 总销量
  let total = (await Statistics.findAll());
  total = total.map(item => ({ x: item.name, y: item.totalSales * 1 || 0 }));
  ctx.body = { ...getFakeChartData, salesData: total, visitData: totalByDate };
});

// 清洗数据
router.get('/api/clean', async ctx => {
  const res = await cleanData();
  ctx.body = res;
});

// 上传压缩包
router.post('/api/upload', upload.single('file'), async ctx => {
  try {
    delDir('./data/');
    const res = await exportZip(ctx.req.file.filename);
    delDir('./temp/');
    ctx.body = { status: 0, msg: '上传成功' }
  } catch (error) {
    ctx.body = { status: 1, msg: '上传失败', error }
  }
});

router.get('/api/testData', async ctx => {
  ctx.status = 100;
  ctx.body = {
    data: 22222222
  }
});

// 全部导入
router.get('/api/importAll', async ctx => {
  const res = await importAllToDataBase();
  ctx.body = {
    res
  }
})


// 批量导入
const importDataBase = async (date, goodsType) => {
  const type = await GoodType.findAll({
    where: {
      id: goodsType
    }
  });
  const json = getFile(date, type[0].name);
  json.shift();
  const record = json.map(items => ({ ...items, typeId: goodsType, date }));
  return Good.bulkCreate(record);
}

// 全部导入数据库
const importAllToDataBase = async () => {
  const dateList = getDate();
  const goodsTypeList = await GoodType.findAll();
  for (let i = 0; i < dateList.length; i++) {
    const date = dateList[i].key;
    for (let j = 0; j < goodsTypeList.length; j++) {
      const goodsType = goodsTypeList[j].id;
      await importDataBase(date, goodsType);
    }
  }

  return { dateList, goodsTypeList }
}

// 获取文件json
function getFile(date, typeName) {
  const file = path.resolve(__dirname, `./data/${date}/${typeName}.xlsx`);
  const data = xlsx.readFile(file);
  const worksheet = data.Sheets.Sheet1;
  const json = xlsx.utils.sheet_to_json(worksheet, { header: ["imgUrl", "title", "discountPrice", "originalPrice", "address", "salesVolume", "link"] });
  return json;
}

// 解压文件
function exportZip(filename) {
  const filepath = path.resolve(__dirname, `./temp/${filename}`);
  return compressing.zip.uncompress(filepath, './data');
}

//  清空文件夹
function delDir(path) {
  let files = [];
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path);
    files.forEach((file, index) => {
      let curPath = path + "/" + file;
      if (fs.statSync(curPath).isDirectory()) {
        delDir(curPath); //递归删除文件夹
      } else {
        fs.unlinkSync(curPath); //删除文件
      }
    });
  }
}

app.use(bodyParser());
app.use(router.routes());
app.use(history());
app.use(home);
app.use(cors());

app.listen(config.port, () => {
  console.log(`服务启动成功！ 访问链接：http://localhost:${config.port}`);
})