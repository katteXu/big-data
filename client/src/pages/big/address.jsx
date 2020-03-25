// MAPHOOK 这是map的hook，用于加amap的依赖引入的

import React from 'react';
import imgCha from '../../../public/img/big/产地可视化/茶.jpg';
import imgGanGuo from '../../../public/img/big/产地可视化/干果.jpg';
import imgGuoFu from '../../../public/img/big/产地可视化/果脯.jpg';
import imgHuaHuiMiaoMu from '../../../public/img/big/产地可视化/花卉苗木.jpg';
import imgLiangYou from '../../../public/img/big/产地可视化/粮油.jpg';
import imgShiYongJun from '../../../public/img/big/产地可视化/食用菌.jpg';
import imgShuCai from '../../../public/img/big/产地可视化/蔬菜.jpg';
import imgShuiChanPin from '../../../public/img/big/产地可视化/水产品.jpg';
import imgShuiGuo from '../../../public/img/big/产地可视化/水果.jpg';
import imgYanYe from '../../../public/img/big/产地可视化/烟叶.jpg';
import imgYaoCai from '../../../public/img/big/产地可视化/药材.jpg';

import imgBeiJing from '../../../public/img/big/同产地价格比较可视化/北京.jpg'
import imgFuZhou from '../../../public/img/big/同产地价格比较可视化/福州.jpg'
import imgGuangZhou from '../../../public/img/big/同产地价格比较可视化/广州.jpg'
import imgHangZhou from '../../../public/img/big/同产地价格比较可视化/杭州.jpg'
import imgJiNan from '../../../public/img/big/同产地价格比较可视化/济南.jpg'
import imgNanJing from '../../../public/img/big/同产地价格比较可视化/南京.jpg'
import imgQingDao from '../../../public/img/big/同产地价格比较可视化/青岛.jpg'
import imgShangHai from '../../../public/img/big/同产地价格比较可视化/上海.jpg'
import imgShenZhen from '../../../public/img/big/同产地价格比较可视化/深圳.jpg'
import imgSuZhou from '../../../public/img/big/同产地价格比较可视化/苏州.jpg'
import styles from './style.less';
// 传入adcode获取geojson，部分数据需要处理一下

class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentDidMount() {

  }


  render() {
    return <div>
      <h1>地域分析</h1>
      <div className={styles.main}>
        <div className={styles.item}>
          <img src={imgCha} alt="" />
          <div className={styles.title}>茶</div>
        </div>
        <div className={styles.item}>
          <img src={imgGanGuo} alt="" />
          <div className={styles.title}>干果</div>
        </div>
        <div className={styles.item}>
          <img src={imgGuoFu} alt="" />
          <div className={styles.title}>果脯</div>
        </div>

        <div className={styles.item}>
          <img src={imgHuaHuiMiaoMu} alt="" />
          <div className={styles.title}>花卉苗木</div>
        </div>
        <div className={styles.item}>
          <img src={imgLiangYou} alt="" />
          <div className={styles.title}>粮油</div>
        </div>
        <div className={styles.item}>
          <img src={imgShiYongJun} alt="" />
          <div className={styles.title}>食用菌</div>
        </div>

        <div className={styles.item}>
          <img src={imgShuCai} alt="" />
          <div className={styles.title}>蔬菜</div>
        </div>
        <div className={styles.item}>
          <img src={imgShuiChanPin} alt="" />
          <div className={styles.title}>水产品</div>
        </div>
        <div className={styles.item}>
          <img src={imgShuiGuo} alt="" />
          <div className={styles.title}>水果</div>
        </div>

        <div className={styles.item}>
          <img src={imgYanYe} alt="" />
          <div className={styles.title}>烟叶</div>
        </div>
        <div className={styles.item}>
          <img src={imgYaoCai} alt="" />
          <div className={styles.title}>药材</div>
        </div>
      </div>
      <div className={styles.main2}>
        <div className={styles.bigTitle}>相同产地价格比较</div>
        <div className={styles.content}>
          <div className={styles.item}>
            <img src={imgBeiJing} alt="" />
            <div className={styles.title}>北京</div>
          </div>
          <div className={styles.item}>
            <img src={imgFuZhou} alt="" />
            <div className={styles.title}>福州</div>
          </div>
          <div className={styles.item}>
            <img src={imgGuangZhou} alt="" />
            <div className={styles.title}>广州</div>
          </div>
          <div className={styles.item}>
            <img src={imgHangZhou} alt="" />
            <div className={styles.title}>杭州</div>
          </div>
          <div className={styles.item}>
            <img src={imgJiNan} alt="" />
            <div className={styles.title}>济南</div>
          </div>

          <div className={styles.item}>
            <img src={imgNanJing} alt="" />
            <div className={styles.title}>南京</div>
          </div>
          <div className={styles.item}>
            <img src={imgQingDao} alt="" />
            <div className={styles.title}>青岛</div>
          </div>
          <div className={styles.item}>
            <img src={imgShangHai} alt="" />
            <div className={styles.title}>上海</div>
          </div>
          <div className={styles.item}>
            <img src={imgShenZhen} alt="" />
            <div className={styles.title}>深圳</div>
          </div>
          <div className={styles.item}>
            <img src={imgSuZhou} alt="" />
            <div className={styles.title}>苏州</div>
          </div>
        </div>

      </div>
    </div>
  }
}


export default Page;
