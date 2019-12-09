import { Card, Col, Row } from 'antd';
import React from 'react';
import numeral from 'numeral';
import { Bar } from './Charts';
import styles from '../style.less';

const SalesCard = ({ salesData, loading }) => (
  <Card loading={loading} bordered={false} title="商品总销量">
    <Row type="flex" gutter={40} align="bottom">
      <Col xl={16} lg={12} md={12} sm={24} xs={24}>
        <div className={styles.salesBar}>
          <Bar height={445} title="商品销量" data={salesData} />
        </div>
      </Col>
      <Col xl={8} lg={12} md={12} sm={24} xs={24}>
        <div className={styles.salesRank}>
          <h4 className={styles.rankingTitle}>商品销量排名</h4>
          <ul className={styles.rankingList}>
            {JSON.parse(JSON.stringify(salesData))
              .sort((a, b) => b.y - a.y)
              .map((item, i) => (
                <li key={`${i + 1}`}>
                  <span className={`${styles.rankingItemNumber} ${i < 3 ? styles.active : ''}`}>
                    {i + 1}
                  </span>
                  <span className={styles.rankingItemTitle} title={item.x}>
                    {item.x}
                  </span>
                  <span className={styles.rankingItemValue}>{numeral(item.y).format('0,0')}</span>
                </li>
              ))}
          </ul>
        </div>
      </Col>
    </Row>
  </Card>
);

export default SalesCard;
