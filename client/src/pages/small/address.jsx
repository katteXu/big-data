// MAPHOOK 这是map的hook，用于加amap的依赖引入的

import React from 'react';
import imgCha from '../../../public/img/small/产地销量可视化/茶.jpg';
import imgGuoFu from '../../../public/img/small/产地销量可视化/果脯.jpg';
import imgHuaHuiMiaoMu from '../../../public/img/small/产地销量可视化/花卉苗木.jpg';
import imgLiangYou from '../../../public/img/small/产地销量可视化/粮油.jpg';
import imgShiYongJun from '../../../public/img/small/产地销量可视化/食用菌.jpg';
import imgShuCai from '../../../public/img/small/产地销量可视化/蔬菜.jpg';
import imgShuiChanPin from '../../../public/img/small/产地销量可视化/水产品.jpg';
import imgShuiGuo from '../../../public/img/small/产地销量可视化/水果.jpg';
import imgYaoCai from '../../../public/img/small/产地销量可视化/药材.jpg';

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
        <div className={styles.item3}>
          <img src={imgCha} alt="" />
          <div className={styles.title}>茶</div>
        </div>

        <div className={styles.item3}>
          <img src={imgGuoFu} alt="" />
          <div className={styles.title}>果脯</div>
        </div>

        <div className={styles.item3}>
          <img src={imgHuaHuiMiaoMu} alt="" />
          <div className={styles.title}>花卉苗木</div>
        </div>
        <div className={styles.item3}>
          <img src={imgLiangYou} alt="" />
          <div className={styles.title}>粮油</div>
        </div>
        <div className={styles.item3}>
          <img src={imgShiYongJun} alt="" />
          <div className={styles.title}>食用菌</div>
        </div>

        <div className={styles.item3}>
          <img src={imgShuCai} alt="" />
          <div className={styles.title}>蔬菜</div>
        </div>
        <div className={styles.item3}>
          <img src={imgShuiChanPin} alt="" />
          <div className={styles.title}>水产品</div>
        </div>
        <div className={styles.item3}>
          <img src={imgShuiGuo} alt="" />
          <div className={styles.title}>水果</div>
        </div>


        <div className={styles.item3}>
          <img src={imgYaoCai} alt="" />
          <div className={styles.title}>药材</div>
        </div>
      </div>
    </div>
  }
}


export default Page;
