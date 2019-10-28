
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Row, Col, Select, Button, Table, message, Alert, Drawer, Modal, Checkbox } from 'antd';
import {
  getDateList,
  getGoodsTypeList,
  importData,
  getDataList,
  deleteData,
  cleanData,
} from '@/services/data';

class Home extends Component {
  state = {
    dateList: [],
    goodsTypeList: [],
    dataList: [],
    columns: [
      {
        title: '日期',
        dataIndex: 'date',
        key: 'date',
        width: 100,
      },
      {
        title: '名称',
        dataIndex: 'title',
        key: 'title',
        width: 250,
      },
      {
        title: '折扣价',
        dataIndex: 'discountPrice',
        key: 'discountPrice',
        width: 100,
      },
      {
        title: '原价',
        dataIndex: 'originalPrice',
        key: 'originalPrice',
        width: 100,
      },
      {
        title: '地址',
        dataIndex: 'address',
        key: 'address',
        width: 80,
      },
      {
        title: '销量',
        dataIndex: 'salesVolume',
        key: 'salesVolume',
        width: 80,
      },
      {
        title: '图片',
        dataIndex: 'imgUrl',
        key: 'imgUrl',
        width: 120,
        render: value => <Button size="small" type="link" onClick={() => {
          this.setState({
            imgUrl: value,
            showImg: true,
          })
        }} >查看</Button>,
      },
      {
        title: '链接',
        dataIndex: 'link',
        key: 'link',
        width: 120,
        render: value => <a href={value} target="blank" >链接</a>,
      },
    ],
    reqMessage: '',
    loading: false,
    iloading: false,
    dloading: false,
    imgUrl: '',
    showImg: false,
    isClean: true,
  };

  componentDidMount() {
    this.getDate();
    this.getGoodsType();
  }

  // 查询日期
  getDate = async () => {
    const dateList = await getDateList();
    this.setState({
      dateList,
    });
  }

  // 查询商品类别
  getGoodsType = async () => {
    const goodsTypeList = await getGoodsTypeList();
    this.setState({
      goodsTypeList,
    })
  }

  query = async () => {
    const { date, goodsType } = this.state;
    const params = {
      date,
      goodsType,
    }
    this.setState({
      loading: true,
    })
    const res = await getDataList({ params });
    this.setState({
      dataList: res,
      loading: false,
      reqMessage: `成功获取数据 ${res.length} 条`,
    });
  }

  // 导入数据
  import = async () => {
    const { idate, igoodsType } = this.state;
    if (!idate) {
      message.error('日期不能为空');
      return;
    }
    if (!igoodsType) {
      message.error('商品类型不能为空');
      return;
    }
    this.setState({
      iloading: true,
    })
    const res = await importData(idate, igoodsType);
    if (res.count) {
      this.setState({
        dataList: res.data,
        reqMessage: `成功导入数据 ${res.count} 条`,
        visible: false,
        iloading: false,
      });
    }
  }

  // 清洗数据
  clean = async () => {
    const res = await cleanData();
    if (res) {
      message.success('清洗完毕');
    }
  }

  // 删除
  delete = async () => {
    const { date, goodsType } = this.state;
    const params = { date, goodsType };
    this.setState({
      dloading: true,
    });
    const { data } = await deleteData({ params });

    this.setState({
      dloading: false,
      reqMessage: `成功删除数据 ${data} 条`,
      dataList: [],
    })
  }

  confirm = () => {
    Modal.confirm({
      title: '确认删除',
      content: '根选择的条件删除数据库中的数据,如未选择 则删除所有',
      onOk: async () => {
        await this.delete()
      },
      okText: '确认',
      cancelText: '取消',
    })
  }

  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const {
      dateList,
      goodsTypeList,
      dataList,
      columns,
      reqMessage,
      loading,
      iloading,
      dloading,
      imgUrl,
      isClean,
      showImg } = this.state;
    return (
      <PageHeaderWrapper title="数据库操作" content="可将excel导入数据库 ，根据查询数据库信息，根据条件清空数据库信息">
        <Row gutter={8} type="flex" align="bottom">
          <Col span={6}>
            <p>日期分类</p>
            <Select style={{ width: '100%' }} placeholder="请选择日期" allowClear onChange={value => {
              this.setState({
                date: value,
              });
            }}>
              {
                dateList.map(item => <Select.Option key={item.key} value={item.key} >
                  {item.text}
                </Select.Option>)
              }
            </Select>
          </Col>
          <Col span={6}>
            <p>商品类别</p>
            <Select style={{ width: '100%' }} placeholder="请选择商品分类" allowClear onChange={value => {
              this.setState({
                goodsType: value,
              })
            }}>
              {
                goodsTypeList.map(item => <Select.Option key={item.id} value={item.id}>
                  {item.name}
                </Select.Option>)
              }
            </Select>
          </Col>
          <Col span={12}>
            <Button onClick={this.query} loading={loading}>查询</Button>
            <Button style={{ marginLeft: 12 }} onClick={this.confirm} loading={dloading} type="danger" >删除</Button>
            <Button style={{ marginLeft: 12 }} onClick={this.showDrawer} type="link" size="small">导入</Button>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }}>
          <Col>
            {
              reqMessage && <Alert style={{ marginBottom: 10 }} message={`${reqMessage}`} type="success" showIcon />
            }
            <Table
              loading={loading}
              rowKey="id"
              bordered
              size="middle"
              columns={columns}
              dataSource={dataList} />
          </Col>
        </Row>

        {/* 导入数据 */}
        <Drawer
          title="导入数据库"
          placement="right"
          width={300}
          closable
          onClose={this.onClose}
          visible={this.state.visible}
        >
          <Row>
            <Col>
              <p>日期分类</p>
              <Select style={{ width: '100%' }} placeholder="请选择日期" onChange={value =>
                this.setState({
                  idate: value,
                })
              } >
                {
                  dateList.map(item =>
                    <Select.Option key={item.key} value={item.key}
                    >
                      {item.text}
                    </Select.Option>)
                }
              </Select>
            </Col>
          </Row>
          <Row style={{ marginTop: 12 }}>
            <Col>
              <p>商品类别</p>
              <Select style={{ width: '100%' }} placeholder="请选择商品分类" onChange={value => {
                this.setState({
                  igoodsType: value,
                })
              }}>
                {
                  goodsTypeList.map(item =>
                    <Select.Option key={item.id} value={item.id}>
                      {item.name}
                    </Select.Option>)
                }
              </Select>
            </Col>
          </Row>
          <Row style={{ marginTop: 12 }}>
            <Col>
              <Checkbox checked={isClean} onChange={e => this.setState({ isClean: e.target.checked })}>清洗数据</Checkbox>
            </Col>
          </Row>
          <Row style={{ marginTop: 12 }} gutter={12}>
            <Col span={12}>
              <Button block type="primary" onClick={this.import} loading={iloading}>确认导入</Button>
            </Col>
            <Col span={12}>
              <Button block onClick={this.clean} loading={iloading}>数据清洗</Button>
            </Col>
          </Row>
        </Drawer>
        {/* 删除确认 */}
        <Modal
          footer={null}
          visible={showImg}
          onCancel={() => this.setState({
            showImg: false,
          })}
          destroyOnClose
          bodyStyle={{ height: 400 }}
          width={400}
        >
          <img src={imgUrl} style={{ width: '100%', height: '100%' }} alt="" />
        </Modal>
      </PageHeaderWrapper>
    )
  }
}

export default Home
