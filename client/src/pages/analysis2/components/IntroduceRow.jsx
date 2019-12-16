import { Col, Row } from 'antd';
import React from 'react';
import numeral from 'numeral';
import { ChartCard, MiniArea, Field } from './Charts';

const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 6,
  style: {
    marginBottom: 24,
  },
};

const color = [
  '#00CC00',
  '#00CCFF',
  '#9933FF',
  '#CCCCFF',
  '#FF99FF',
  '#FF9900',
  '#0033FF',
  '#BBBBBB',
];
const IntroduceRow = ({ loading, visitData }) => (
  <>
    <Row>
      <Col>
        <h1>日期销量分布图</h1>
      </Col>
    </Row>
    <Row gutter={24} type="flex" style={{ marginTop: 12 }}>
      {/* 总销售额 */}
      {visitData.map((item, i) => (
        <Col key={item.name} {...topColResponsiveProps}>
          <ChartCard
            bordered={false}
            loading={loading}
            title={<span style={{ color: color[i % 7], fontSize: 20 }}>{item.name}</span>}
            total={numeral(item.total).format('0,0')}
            footer={<Field label="总销量" value={numeral(item.total).format('0,0')} />}
            contentHeight={46}
          >
            <MiniArea color={color[i % 7]} data={item.data} />
          </ChartCard>
        </Col>
      ))}
    </Row>
  </>
);

export default IntroduceRow;
