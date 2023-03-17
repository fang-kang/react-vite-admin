import { LogoutOutlined, SearchOutlined } from '@ant-design/icons';
import { Spin, Tooltip, TableColumnProps, Button, Table } from 'antd';
import { useState } from 'react';
import { If } from '../If';
import { Search } from '../Search';
import { ISearchParam, SearchType, ShowSearchDetail } from '../ShowSearchDetail';

interface IProps<T = any> {
  /**
   * 使用页面的authority key
   */
  businessType?: string;
  /**
   * 获取接口数据
   * 统一处理分页配置
   */
  getData: (data: {
    size: number;
    pageSize: number;
    current: number;
    [key: string]: any;
  }) => Promise<{ total: number; dataSource: T[] }>;
  /**
   * 设置页面右上角部分的全局按钮(导出, 批量删除等)
   */
  getHeaderActions?: (params: Record<string, any>, selected: { ids: string[]; rows: T[] }) => React.ReactNode[];

  /**
   * 筛选条件
   * 需要返回一个二维数组
   */
  getSearchs?: (
    onChange: (searchKey: string, value: any) => void,
    setDefaultSearchs: (defaultSearchs: Record<string, any>) => void
  ) => Array<[React.ReactNode, React.ReactNode?]>;

  /**
   * 列配置
   */
  columns: TableColumnProps<T>[];
  /**
   * 筛选条件的key值映射
   * 用于解决 table columns中的key与后端接口字段不一致的问题
   */
  searchKeyMap?: Record<string, any>;

  /**
   * 列中的枚举数据, 用于自定义筛选
   */
  getSelectEnums?: () => Promise<Record<string, { label: string; value: any }[]>>;

  /**
   * 定义特殊筛选列的类型
   */
  searchTypeList?: [string[], SearchType][];

  /**
   * 自定义筛选条件的结果
   */
  currentSearchParams?: ISearchParam[];

  /**
   * 是否启用复选框. 当启用时, getHeaderActions(params, selected) 的第二个参数为相应的数据
   * 当为函数时, 返回true表示可选择, 返回false表示禁用不可选择.
   */
  checkable?: boolean | ((data: T) => boolean);
}

export const PageWrapper = <T,>(props: IProps<T>) => {
  const { getHeaderActions, businessType } = props;
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ size: 20, current: 1, total: 0 });
  const [dataSource, setDataSource] = useState([] as T[]);
  const [currentSearchParams, setCurrentSearchParams] = useState<ISearchParam[]>(props.currentSearchParams || []);
  const [columns, setColumns] = useState<TableColumnProps<T>[]>(props.columns || []);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [queryParams, setQueryParams] = useState('');
  const [scrollX, setScrollX] = useState(0);

  return (
    <Spin spinning={loading}>
      <div className="layoutsContainer">
        <div className="layoutsHeader">
          <div className="layoutsTool">
            <div className="layoutsToolLeft">
              <h1>Title</h1>
            </div>
            <If when={!!getHeaderActions}>
              <div className="layoutsToolRight">
                <ul>
                  {getHeaderActions?.(params, {
                    ids: selectedRowKeys,
                    rows: selectedRowKeys.map((key) => {
                      return this.cacheItems[key];
                    }),
                  }).map((action, n) => (
                    <li key={n}>{action}</li>
                  ))}
                  <If when={!!businessType}>
                    <li>
                      <Button
                        onClick={() => {
                          this.setState({
                            showColSelect: true,
                          });
                        }}
                      >
                        <LogoutOutlined />
                        列选项
                      </Button>
                    </li>
                  </If>
                </ul>
              </div>
            </If>
          </div>
          <div className="layoutsLine"></div>
          <div className="layoutsSearch">
            <div
              style={{
                marginBottom: 10,
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                paddingRight: '55px',
              }}
            >
              <If when={!!search}>
                <Search.Wrapper>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      rowGap: 10,
                    }}
                  >
                    {search?.map(([label, value], n) => {
                      if (value) {
                        return (
                          <Search.Item key={n} label={label}>
                            {value}
                          </Search.Item>
                        );
                      }
                      return label;
                    })}
                    <Button
                      type="primary"
                      onClick={() => {
                        if (this.isParamsChange) {
                          this.setState(
                            {
                              current: 1,
                            },
                            this.getData
                          );
                        } else {
                          this.getData();
                        }

                        this.setState({
                          selectedRowKeys: [],
                        });
                        this.cacheItems = {};
                      }}
                    >
                      <SearchOutlined />
                      查询
                    </Button>
                  </div>
                </Search.Wrapper>
              </If>
            </div>
          </div>
        </div>
        <If when={this.state.currentSearchParams.length > 0}>
          <div style={{ marginLeft: 20 }}>
            <ShowSearchDetail
              clear={() => {
                this.setState(
                  {
                    current: 1,
                    currentSearchParams: [],
                  },
                  this.getData
                );
              }}
              delete={this.onSearchDelete}
              currentSearchParams={this.state.currentSearchParams}
            />
          </div>
        </If>
        <SearchPanel />
        <div className="kc-supply-pageContent layoutsContent tableClass">
          <Table
            columns={columns.map((o) => {
              if (!o.render) {
                o.render = (text: string) => (
                  <Tooltip
                    title={
                      <div>
                        {strDivide(text).map((t, i) => (
                          <div key={i}>{t}</div>
                        ))}
                      </div>
                    }
                  >
                    <div
                      style={{
                        display: 'inline-block',
                        maxWidth: '100%',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {text}
                    </div>
                  </Tooltip>
                );
                o.selectedKey = ['id'];
              }
              return o;
            })}
            dataSource={dataSource}
            scroll={{ x: this.state.scrollX, y: '80vh' }}
            pagination={{
              pageSize: this.state.size,
              showQuickJumper: true,
              showSizeChanger: true,
              current: this.state.current,
              onShowSizeChange: this.onPageChange,
              onChange: this.onPageChange,
              pageSizeOptions: ['20', '50', '100', '200', '500'],
              total: this.state.total,
              showTotal: (total: number, range: [number, number]) => `本页 ${range[0]}-${range[1]} / 共 ${total} 条`,
            }}
          />
        </div>
      </div>
    </Spin>
  );
};
