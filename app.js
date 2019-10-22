const Koa = require('koa');
const Router = require('koa-router');
const Public = require('koa-static');
const cors = require('koa2-cors');
const history = require('koa-connect-history-api-fallback');
const bodyParser = require('koa-bodyparser');
const xlsx = require('xlsx');
const path = require('path');
const config = require('./config');
const { Good, GoodType } = require('./models');

const app = new Koa();
const router = new Router();
const home = Public(path.resolve(__dirname, "./client/dist/"))

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

// 根据传参导入数据库
router.get('/api/import', async ctx => {
  const { date, goodsType } = ctx.query;
  const res = await importDataBase(date, goodsType);
  ctx.body = {
    count: res.length,
    data: res
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
  const { date, goodsType } = ctx.query;
  const query = {};
  date && (query.date = date)
  goodsType && (query.typeId = goodsType);
  const data = await Good.findAll({
    where: query
  });
  ctx.body = data;
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


router.get('/api/currentUser', async ctx => {
  ctx.body = {
    name: 'Serati Ma',
    avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
    userid: '00000001',
    email: 'antdesign@alipay.com',
    signature: '海纳百川，有容乃大',
    title: '交互专家',
    group: '蚂蚁金服－某某某事业群－某某平台部－某某技术部－UED',
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

router.get('/api/fake_chart_data', async ctx => {
  ctx.body = getFakeChartData;
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
  return await Good.bulkCreate(record);
}

// 获取文件json
function getFile(date, typeName) {
  const file = path.resolve(__dirname, `./data/${date}/${typeName}.xlsx`);
  const data = xlsx.readFile(file);
  const worksheet = data.Sheets.Sheet1;
  const json = xlsx.utils.sheet_to_json(worksheet, { header: ["imgUrl", "title", "discountPrice", "originalPrice", "address", "salesVolume", "link"] });
  return json;
}

app.use(bodyParser());
app.use(router.routes());
app.use(history());
app.use(home);
app.use(cors());

app.listen(config.port, () => {
  console.log(`服务启动成功！ 访问链接：http://localhost:${config.port}`);
})