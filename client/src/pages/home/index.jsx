import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {
  Row,
  Col,
  Select,
  Button,
  Table,
  message,
  Alert,
  Drawer,
  Modal,
  Checkbox,
  Tag,
} from 'antd';
import Tags from '@/utils/tags';
import {
  getDateList,
  getGoodsTypeList,
  importData,
  getDataList,
  deleteData,
  cleanData,
  uploadData,
  importAllData,
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
        render: value => (
          <Button
            size="small"
            type="link"
            onClick={() => {
              this.setState({
                imgUrl: value,
                showImg: true,
              });
            }}
          >
            查看
          </Button>
        ),
      },
      {
        title: '链接',
        dataIndex: 'link',
        key: 'link',
        width: 120,
        render: value => (
          <a href={value} target="blank">
            链接
          </a>
        ),
      },
      {
        title: '标签',
        dataIndex: 'tags',
        key: 'tags',
        width: 320,
        render: (value, record) => {
          const { typeId, title } = record;
          const tags = Tags[typeId];
          const resultTag = [];
          const { color } = tags;
          let resultCode = '';
          let otherCode = '';
          let otherTag = '';
          if (tags.children) {
            Object.keys(tags.children).forEach(key => {
              const code = key;
              const item = tags.children[key];
              const tagList = item.tagList.filter(tag => title.includes(tag));
              if (tagList.length > 0) {
                resultCode = code;
                resultTag.push(...tagList);
              } else {
                otherCode = key;
                otherTag = tags.children[key].tagsName;
              }
            });
          }
          return (
            <div>
              <Tag color="lime">{`编号：${resultCode || otherCode}`}</Tag>
              {resultTag.map(tag => (
                <Tag key={tag} color={color}>
                  {tag}
                </Tag>
              ))}
              {resultTag.length === 0 && (
                <Tag key={otherTag} color={color}>
                  {otherTag}
                </Tag>
              )}
            </div>
          );
        },
      },
    ],
    reqMessage: '',
    loading: false,
    iloading: false,
    dloading: false,
    imgUrl: '',
    showImg: false,
    isClean: true,
    msgType: 'success',
    aloading: false,
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
  };

  // 查询商品类别
  getGoodsType = async () => {
    const goodsTypeList = await getGoodsTypeList();
    this.setState({
      goodsTypeList,
    });
  };

  query = () => {
    this.setState(
      {
        page: 1,
      },
      this.setDataList,
    );
  };

  setDataList = async () => {
    const { date, goodsType, page } = this.state;
    const params = {
      date,
      goodsType,
      page,
      limit: 10,
    };
    this.setState({
      loading: true,
    });
    const res = await getDataList({ params });
    this.setState({
      dataList: res.rows,
      count: res.count,
      loading: false,
      reqMessage: `获取数据 ${res.count} 条`,
      msgType: 'success',
    });
  };

  // 导入数据
  import = async () => {
    const { idate, igoodsType, isClean } = this.state;
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
    });
    const res = await importData(idate, igoodsType, isClean);
    if (res.count) {
      this.setState({
        reqMessage: `导入数据 ${res.count} 条`,
        msgType: 'info',
        visible: false,
        iloading: false,
      });
    }
  };

  // 全部导入
  importAll = async () => {
    this.setState({
      aloading: true,
    });
    const res = await importAllData();

    console.log(res);

    this.setState({
      aloading: false,
    });
  };

  // 清洗数据
  clean = async () => {
    const res = await cleanData();
    if (res) {
      message.success('清洗完毕');
    }
  };

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
      reqMessage: `删除数据 ${data} 条`,
      msgType: 'warning',
      dataList: [],
    });
  };

  confirm = () => {
    Modal.confirm({
      title: '确认删除',
      content: '根据选择的条件删除数据库中的数据,如未选择 则删除所有',
      onOk: async () => {
        await this.delete();
      },
      okText: '确认',
      cancelText: '取消',
    });
  };

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

  upload = async () => {
    const { files } = document.getElementById('file');
    if (files[0]) {
      const fd = new FormData();
      const { name } = files[0];
      if (!/\.(zip)$/.test(name)) {
        message.error('上传文件应为压缩的zip文件');
      }
      fd.append('file', files[0]);
      this.setState({
        uloading: true,
      });
      const res = await uploadData(fd);
      if (res.status === 0) {
        message.success('上传成功');
        this.getDate();
      } else {
        message.error('上传失败');
      }
      this.setState({
        uloading: false,
      });
    }
  };

  onChangePage = page => {
    this.setState(
      {
        page,
      },
      this.setDataList,
    );
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
      showImg,
      uloading,
      page,
      count,
      msgType,
      aloading,
    } = this.state;
    return (
      <PageHeaderWrapper
        title="数据库操作"
        content={
          <ul style={{ listStyleType: 'disc' }}>
            <li>可将打包的excel上传服务端</li>
            <li>可将excel导入数据库</li>
            <li>查询数据库信息</li>
            <li>清空数据库信息</li>
            <li>清洗数据库信息</li>
          </ul>
        }
      >
        <Row gutter={8} type="flex" align="bottom">
          <Col span={6}>
            <p>日期分类</p>
            <Select
              style={{ width: '100%' }}
              placeholder="请选择日期"
              allowClear
              onChange={value => {
                this.setState({
                  date: value,
                });
              }}
            >
              {dateList.map(item => (
                <Select.Option key={item.key} value={item.key}>
                  {item.text}
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col span={6}>
            <p>商品类别</p>
            <Select
              style={{ width: '100%' }}
              placeholder="请选择商品分类"
              allowClear
              onChange={value => {
                this.setState({
                  goodsType: value,
                });
              }}
            >
              {goodsTypeList.map(item => (
                <Select.Option key={item.id} value={item.id}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col span={12}>
            <Button onClick={this.query} loading={loading}>
              查询
            </Button>
            <Button
              style={{ marginLeft: 12 }}
              onClick={this.confirm}
              loading={dloading}
              type="danger"
            >
              删除
            </Button>
            <Button style={{ marginLeft: 12 }} onClick={this.showDrawer} type="link" size="small">
              操作
            </Button>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }}>
          <Col>
            {reqMessage && (
              <Alert
                style={{ marginBottom: 10 }}
                message={`${reqMessage}`}
                type={msgType}
                showIcon
              />
            )}
            <Table
              loading={loading}
              rowKey="id"
              bordered
              size="middle"
              columns={columns}
              dataSource={dataList}
              pagination={{
                onChange: p => this.onChangePage(p),
                pageSize: 10,
                current: page,
                total: count,
              }}
            />
          </Col>
        </Row>

        {/* 导入数据 */}
        <Drawer
          title="数据库操作"
          placement="right"
          width={300}
          closable
          onClose={this.onClose}
          visible={this.state.visible}
        >
          <Row>
            <Col>
              <p>日期分类</p>
              <Select
                style={{ width: '100%' }}
                placeholder="请选择日期"
                onChange={value =>
                  this.setState({
                    idate: value,
                  })
                }
              >
                {dateList.map(item => (
                  <Select.Option key={item.key} value={item.key}>
                    {item.text}
                  </Select.Option>
                ))}
              </Select>
            </Col>
          </Row>
          <Row style={{ marginTop: 12 }}>
            <Col>
              <p>商品类别</p>
              <Select
                style={{ width: '100%' }}
                placeholder="请选择商品分类"
                onChange={value => {
                  this.setState({
                    igoodsType: value,
                  });
                }}
              >
                {goodsTypeList.map(item => (
                  <Select.Option key={item.id} value={item.id}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            </Col>
          </Row>
          <Row style={{ marginTop: 12 }}>
            <Col span={12}>
              <Checkbox
                checked={isClean}
                onChange={e => this.setState({ isClean: e.target.checked })}
              >
                清洗数据
              </Checkbox>
            </Col>
            <Col span={12}>
              <Button
                loading={uloading}
                type="link"
                size="small"
                style={{ float: 'right' }}
                onClick={() => document.getElementById('file').click()}
              >
                上传数据
              </Button>
              <input
                type="file"
                name=""
                id="file"
                style={{ display: 'none' }}
                onChange={this.upload}
              />
            </Col>
          </Row>
          <Row style={{ marginTop: 12 }} gutter={12}>
            <Col span={12}>
              <Button block type="primary" onClick={this.import} loading={iloading}>
                确认导入
              </Button>
            </Col>
            <Col span={12}>
              <Button block onClick={this.clean} loading={iloading}>
                数据清洗
              </Button>
            </Col>
          </Row>
          <Row style={{ marginTop: 12 }}>
            <Col>
              <Button block type="danger" onClick={this.importAll} loading={aloading}>
                全部导入
              </Button>
            </Col>
          </Row>
        </Drawer>

        {/* 显示图片 */}
        <Modal
          footer={null}
          visible={showImg}
          onCancel={() =>
            this.setState({
              showImg: false,
            })
          }
          destroyOnClose
          bodyStyle={{ height: 400 }}
          width={400}
        >
          <img src={imgUrl} style={{ width: '100%', height: '100%' }} alt="" />
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default Home;
