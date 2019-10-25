import { Col, Icon, Row, Tooltip } from 'antd';
import { FormattedMessage } from 'umi-plugin-react/locale';
import React from 'react';
import numeral from 'numeral';
// import { list } from 'postcss';
import { ChartCard, MiniArea, Field } from './Charts';
// import Trend from './Trend';
// import Yuan from '../utils/Yuan';
// import styles from '../style.less';

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
  '#00CC00', '#00CCFF',
  '#9933FF', '#CCCCFF',
  '#FF99FF', '#FF9900',
  '#0033FF', '#BBBBBB',
]

const IntroduceRow = ({ loading, visitData }) => (
  <Row gutter={24} type="flex">
    {/* 总销售额 */}
    {
      visitData.map((item, i) => <Col {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          loading={loading}
          title={<FormattedMessage id="analysis2.analysis.visitsXX" defaultMessage={<span style={{ color: color[i % 7], fontSize: 20 }}>{item.name}</span>} />}
          // action={
          //   <Tooltip
          //     title={
          //       <FormattedMessage id="analysis2.analysis.introduce" defaultMessage="Introduce" />
          //     }
          //   >
          //     <Icon type="info-circle-o" />
          //   </Tooltip>
          // }
          total={numeral(item.total).format('0,0')}
          footer={
            <Field
              label={
                <FormattedMessage id="analysis2.analysis.day-visitsXX" defaultMessage="总销量" />
              }
              value={numeral(item.total).format('0,0')}
            />
          }
          contentHeight={46}
        >
          <MiniArea color={color[i % 7]} data={item.data} />
        </ChartCard>
      </Col>,
      )
    }
  </Row>
);

export default IntroduceRow;
