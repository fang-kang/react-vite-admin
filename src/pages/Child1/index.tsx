import { PageWrapper5S } from '@/components/PageWrapper';
import { PlusOutlined } from '@ant-design/icons';
import { Button, DatePicker, Input, Modal, Popover, Select, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
import { getData } from './data';

const { RangePicker } = DatePicker;

function getLabel() {
  const arr: ILabel[] = [];
  for (let index = 0; index < 100; index++) {
    arr.push({
      value: `${index}-value`,
      label: `${index}-label`,
    });
  }
  return arr;
}

const srarchs: any[] = [
  [
    <Tooltip title="门店编码、门店名称、联系人、手机号、营业时间、地址、配送中心名称、客户名称" placement="top">
      <span style={{ marginRight: 8 }}>其他条件</span>
    </Tooltip>,
    <Input placeholder="请输入" />,
  ],
  ['查询', <Select defaultValue="lucy" options={getLabel()} />],
  ['日期', <DatePicker />],
  ['日期范围', <RangePicker />],
];

const columns = [
  {
    title: (
      <Popover
        content={
          <div>
            <p>Content</p>
            <p>Content</p>
          </div>
        }
        title="Title"
      >
        序号
      </Popover>
    ),
    dataIndex: 'index',
    align: 'center',
    render: (_: any, _r: any, index: number) => index + 1,
    width: 60,
    fixed: 'left',
  },
  {
    title: '品项编码',
    dataIndex: 'goodsCode',
    width: 120,
    align: 'left',
    fixed: 'left',
  },
  {
    title: '品项名称',
    dataIndex: 'goodsName',
    width: 142,
    align: 'left',
    fixed: 'left',
  },
  {
    title: '采购单位',
    dataIndex: 'purchaseUnit',
    width: 70,
    align: 'left',
  },
  {
    title: '询价单号',
    dataIndex: 'billNo',
    align: 'left',
    width: 135,
  },
  {
    title: '大类',
    dataIndex: 'firstCategoryName',
    width: 135,
    align: 'left',
  },
  {
    title: '中类',
    dataIndex: 'secondCategoryName',
    width: 135,
    align: 'left',
  },
  {
    title: '小类',
    dataIndex: 'goodsCategoryName',
    width: 135,
    align: 'left',
  },
  {
    title: '供应商',
    dataIndex: 'supplierName',
    width: 180,
    align: 'left',
  },
  {
    title: '组织',
    dataIndex: 'chainRfqHouseRelationList',
    width: 180,
    align: 'left',
    render: (text: any[]) => {
      const names = (Array.isArray(text) && text.map((v) => v.houseName).join(',')) || '';
      return names;
    },
  },
  {
    title: '本期报价',
    dataIndex: 'taxPrice',
    width: 90,
    align: 'right',
    render: (text: string) => {
      return text ? parseFloat(text).toFixed(2) : '';
    },
  },
  {
    title: '本期税率',
    dataIndex: 'rateValue',
    width: 90,
    align: 'right',
  },
  {
    title: '本期预计含税金额',
    dataIndex: 'predictAmount',
    width: 135,
    align: 'right',
    render: (text: string) => {
      return text ? parseFloat(text).toFixed(2) : '';
    },
  },
  {
    title: '本期预计不含税金额',
    dataIndex: 'predictPreAmount',
    width: 135,
    align: 'right',
    render: (text: string) => {
      return text ? parseFloat(text).toFixed(2) : '';
    },
  },
  {
    title: '当前执行单价',
    dataIndex: 'currAdjustmentPrice',
    width: 135,
    align: 'right',
    render: (text: string) => {
      return text ? parseFloat(text).toFixed(2) : '';
    },
  },

  {
    title: '建议定价',
    dataIndex: 'deliveryPrice',
    width: 90,
    align: 'right',
    render: (text: string) => {
      return text ? parseFloat(text).toFixed(2) : '';
    },
  },
  {
    title: '建议定价差异',
    dataIndex: 'deliveryAmount',
    width: 120,
    align: 'right',
    render: (text: string) => {
      return text ? parseFloat(text).toFixed(2) : '';
    },
  },
  {
    title: '下期执行定价',
    dataIndex: 'adjustmentPrice',
    width: 120,
    align: 'right',
    render: (text: string) => {
      return text ? parseFloat(text).toFixed(2) : '';
    },
  },
  {
    title: '定价差异金额',
    dataIndex: 'compareLastValue',
    width: 120,
    align: 'right',
    render: (text: string) => {
      return text ? parseFloat(text).toFixed(2) : '';
    },
  },
  {
    title: '下期执行税率',
    dataIndex: 'adjustmentRate',
    width: 120,
    align: 'right',
  },
  {
    title: '上期入库数量',
    dataIndex: 'lastGoodsNum',
    width: 120,
    align: 'right',
    render: (text: string) => {
      return text ? parseFloat(text).toFixed(2) : '';
    },
  },
  {
    title: '上期入库含税金额',
    dataIndex: 'lastGoodsAmount',
    width: 130,
    align: 'right',
    render: (text: string) => {
      return text ? parseFloat(text).toFixed(2) : '';
    },
  },
  {
    title: '上期入库不含税金额',
    dataIndex: 'lastGoodsPreAmount',
    width: 130,
    align: 'right',
    render: (text: string) => {
      return text ? parseFloat(text).toFixed(2) : '';
    },
  },
  {
    title: '上期入库含税单价',
    dataIndex: 'lastTaxPrice',
    width: 130,
    align: 'right',
    render: (text: string) => {
      return text ? parseFloat(text).toFixed(2) : '';
    },
  },
  {
    title: '上期入库不含税单价',
    dataIndex: 'lastPretaxPrice',
    width: 130,
    align: 'right',
    render: (text: string) => {
      return text ? parseFloat(text).toFixed(2) : '';
    },
  },
  {
    title: '去年同期入库含税单价',
    dataIndex: 'lastYearTaxPrice',
    width: 145,
    align: 'right',
    render: (text: string) => {
      return text ? parseFloat(text).toFixed(2) : '';
    },
  },
  {
    title: '去年同期入库不含税单价',
    dataIndex: 'lastYearPretaxPrice',
    width: 155,
    align: 'right',
    render: (text: string) => {
      return text ? parseFloat(text).toFixed(2) : '';
    },
  },
  {
    title: '同比去年同期含税调价比率',
    dataIndex: 'lastYearTaxPricePercent',
    width: 165,
    align: 'right',
  },
  {
    title: '同比去年同期不含税调价比率',
    dataIndex: 'lastYearPretaxPricePercent',
    width: 190,
    align: 'right',
  },
  {
    title: '环比上期含税调价比率',
    dataIndex: 'lastTaxPricePercent',
    width: 145,
    align: 'right',
  },
  {
    title: '环比上期不含税调价比率',
    dataIndex: 'lastPretaxPricePercent',
    width: 155,
    align: 'right',
  },
  {
    title: '询价含税调价比率',
    dataIndex: 'taxPricePercent',
    width: 130,
    align: 'right',
  },
  {
    title: '询价不含税调价比率',
    dataIndex: 'pretaxPricePercent',
    width: 130,
    align: 'right',
  },
  {
    title: '报价人',
    dataIndex: 'bidder',
    width: 110,
    align: 'left',
  },
  {
    title: '报价日期',
    dataIndex: 'billDate',
    width: 95,
    align: 'left',
    render: (text: string) => {
      const date = text?.length > 8 ? text.substring(0, 8) : text;
      return date === '0' ? '' : dayjs(date).format('YYYY-MM-DD');
    },
  },
  {
    title: '生效日期',
    dataIndex: 'priceStartDate',
    width: 95,
    align: 'left',
    render: (text: string | number | dayjs.Dayjs | Date | null | undefined) => {
      return text === '0' ? '' : dayjs(text).format('YYYY-MM-DD');
    },
  },
  {
    title: '结束日期',
    dataIndex: 'priceEndDate',
    width: 95,
    align: 'left',
    render: (text: string | number | dayjs.Dayjs | Date | null | undefined) => {
      return text === '0' ? '' : dayjs(text).format('YYYY-MM-DD');
    },
  },
];

export default function Child1(props: any) {
  console.log(props, '==');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    console.log('init');
  }, []);

  return (
    <>
      <PageWrapper5S
        columns={columns}
        getData={getData}
        getHeaderActions={() => [
          <Button
            type="primary"
            onClick={() => {
              Modal.success({
                title: '标题',
                content: '成功',
              });
            }}
          >
            <PlusOutlined />
            新增
          </Button>,
          <Button
            onClick={() => {
              setOpen(true);
            }}
          >
            导出
          </Button>,
          <Button>批量修改</Button>,
        ]}
        getSearchs={() => srarchs}
      />
      <Modal title="标题" closable open={open} onOk={() => setOpen(false)} onCancel={() => setOpen(false)}>
        <div>内容</div>
      </Modal>
    </>
  );
}
