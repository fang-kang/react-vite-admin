import React from 'react';
import { Button, Spin, Table, Tooltip } from 'antd';
import mitt from 'mitt';
import { SearchPanelHOC } from './SearchPanelHOC';
import { OADate, onWindowResize } from '@/utils';
import { If } from '@/components/If';
import { LogoutOutlined, SearchOutlined } from '@ant-design/icons';
import { Search } from '@/components/Search';
import { ShowSearchDetail } from './ShowSearchDetail';
import { omit, cloneDeep } from 'lodash-es';

export const emitter = mitt();

export function strDivide(text: string) {
  if (typeof text !== 'string') {
    return [text];
  }
  const arr: string[] = [];
  text.split('').forEach((t, i) => {
    const index = Math.floor(i / 80);

    if (!arr[index]) {
      arr[index] = '';
    }

    arr[index] += t;
  });
  return arr;
}

export type SearchType = 'date' | 'datetime' | 'radio' | 'select' | 'input' | 'inputNum' | 'sort' | 'range';

interface ITableWrapper<T = any> {
  /**
   * 使用页面的authority key
   */
  businessType?: string;
  /**
   * 用于触发 当前组件刷新
   * @deprecated 请使用方法 PageWrapper5S.fresh(businessType) 代替
   */
  autoFreshKey?: number;

  /**
   * 设置页面右上角部分的全局按钮(导出, 批量删除等)
   */
  getHeaderActions?: (params: Record<string, any>, selected: { ids: string[]; rows: T[] }) => React.ReactChild[];

  /**
   * 筛选条件
   * 需要返回一个二维数组
   */
  getSearchs?: (
    onChange: (searchKey: string, value: any) => void,
    setDefaultSearchs: (defaultSearchs: Record<string, any>) => void
  ) => Array<[React.ReactChild, React.ReactChild?]>;

  /**
   * 列配置
   */
  columns: any[];

  /**
   * 获取接口数据
   * 统一处理分页配置(因各业务线pageNo, pageSize不统一)
   */
  getData: (data: {
    size: number;
    pageSize: number;
    current: number;
    pageNum: number;
    pageNo: number;
    [key: string]: any;
  }) => Promise<{ total: number; dataSource: T[] }>;

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

export interface ISearchParam {
  keyString?: string;
  key: string;
  value: string | { label: string; value: string }[] | [any, any];
  type: SearchType;
}

function columnModifyByConfig(localColumns: any[], serverColumns: any[]) {
  const columnNameKey: { [k: string]: any } = {};

  let lockedIndex = -1;
  serverColumns.forEach((o: { columnName: string | number; locked: number }, i: number) => {
    columnNameKey[o.columnName] = o;
    if (o.locked === 1) {
      lockedIndex = i;
    }
  });

  // 当第一列为复选框时, 默认为固定列
  if (localColumns[0]?.columnKey === '$checkbox') {
    lockedIndex += 1;
  }

  return localColumns
    .map((o: { columnKey: string | number; fixed: any; width: any; sort: number }, i: number) => {
      const conf = columnNameKey[o.columnKey];
      if (conf) {
        return {
          ...o,
          fixed: i <= lockedIndex,
          sort: conf.sort,
          show: conf.display === 1,
          width: o.fixed ? o.width : conf.columnWidth,
        };
      }
      return o;
    })
    .sort((a, b) => a.sort - b.sort);
}

const SearchPanel = SearchPanelHOC(
  class extends React.Component<{ ActionPanel: any }> {
    render() {
      return <span>{this.props.ActionPanel}</span>;
    }
  }
);

export class PageWrapper5S<T> extends React.Component<ITableWrapper<T>> {
  params: Record<string, any> = {};

  cacheItems: Record<string, any> = {};

  isParamsChange = false;

  columns: any[] = [];

  static instances: {
    noneKeys: PageWrapper5S<any>[];
    [k: string]: PageWrapper5S<any>[];
  } = {
    noneKeys: [],
  };

  /**
   * 取当前组件的businessType值(即权限码)
   * 当组件不需要businessType时, 传空即可
   */
  static fresh = (key = 'none') => {
    PageWrapper5S.instances[key].forEach((that: any) => {
      if (that.updater.isMounted(that)) {
        that.setState({
          selectedRowKeys: [],
        });
        that.getData();
      }
    });
  };

  state = {
    title: '',
    loading: false,
    showColSelect: false,
    size: 20,
    current: 1,
    dataSource: [],
    total: 0,
    currentSearchParams: this.props.currentSearchParams || [],
    columns: [] as any[],
    selectedRowKeys: [] as string[],
    queryParams: '',
    scrollX: 0,
    tableHeight: 0,
  };

  constructor(props: ITableWrapper) {
    super(props);

    if (this.props.businessType) {
      PageWrapper5S.instances[this.props.businessType] = [this];
    } else {
      PageWrapper5S.instances.noneKeys.push(this);
    }

    const columnKeys: string[] = [];
    props.searchTypeList?.forEach(([keys, type]) => {
      columnKeys.push(...keys);
    });

    this.columns = props.columns.map((column) => {
      return {
        ...column,
        titleHover: {
          showHover: true,
          showHide: true,
          showSort: column.titleHover?.showSort || false,
          showSelect: true,
          isReorderable: true,
          isResizable: true,
          allowCellsRecycling: false,
        },
      };
    });

    if (this.props.checkable) {
      this.columns.unshift({
        // 多选框
        columnKey: '$checkbox',
        type: 'input-checkbox',
        fixed: true,
        width: 50,
        header: {
          text: '复选框',
        },
        show: true,
        disabled: (item: any) => {
          return typeof this.props.checkable === 'function' ? !this.props.checkable(item) : false;
        },
      });
    }

    this.state.columns = this.columns;
  }

  async componentDidMount() {
    this.resize();
    window.addEventListener('resize', this.resize);
    const scrollX: number = this.props.columns.reduce((num: number, column: any): number => {
      return (num += (column.width as number) || 135);
    }, 0);

    this.getData();

    this.setState({
      title: 'title',
      scrollX,
    });

    emitter.on('show-loading', () => {
      this.setState({
        loading: true,
      });
    });

    emitter.on('hide-loading', () => {
      this.setState({
        loading: false,
      });
    });
  }

  componentWillReceiveProps(next: ITableWrapper) {
    if (next.autoFreshKey !== this.props.autoFreshKey) {
      this.setState(
        {
          currentSearchParams: next.currentSearchParams || this.state.currentSearchParams,
          selectedRowKeys: [],
        },
        this.getData
      );
      this.cacheItems = {};
    } else if (next.currentSearchParams !== this.props.currentSearchParams) {
      this.setState({
        currentSearchParams: next.currentSearchParams || [],
      });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
    emitter.off('show-loading');
    emitter.off('hide-loading');
  }

  resize = () => {
    const tableHeight = onWindowResize(135);
    this.setState(() => {
      console.log(tableHeight, 'tableHeight');
      return {
        tableHeight,
      };
    });
  };

  getData = () => {
    this.setState({ loading: true });
    const params = {
      ...this.params,
      ...this.formatSearchParams(this.state.currentSearchParams),
      size: this.state.size,
      current: this.state.current,
      pageNo: this.state.current,
      pageNum: this.state.current,
      pageSize: this.state.size,
    };

    if (
      JSON.stringify(omit(cloneDeep(params), ['size', 'current', 'groupID', 'pageNo', 'pageSize'])) !==
      this.state.queryParams
    ) {
      this.setState({
        selectedRowKeys: [],
      });
      this.cacheItems = {};
    }

    this.props.getData(params).then((data) => {
      if (data.dataSource.length === 0 && this.state.current >= 2) {
        this.setState(
          {
            current: this.state.current - 1,
          },
          this.getData
        );
      } else {
        const queryParmas = omit(cloneDeep(params), ['size', 'current', 'groupID', 'pageNo', 'pageSize']);

        this.setState({
          dataSource: data.dataSource,
          total: data.total,
          isParamsChange: false,
          loading: false,
          queryParams: JSON.stringify(queryParmas),
        });
      }
    });
  };

  formatSearchParams = (params: ISearchParam[] = []) => {
    const result: { [k: string]: any } = {};
    const sortFieldList: { fieldName: string; order: string }[] = [];
    params.forEach((o) => {
      const mapKey = this.props.searchKeyMap?.[o.key] || o.key;
      switch (o.type) {
        case 'date': {
          const [startDate, endDate] = this.props.searchKeyMap?.[o.key] || [];
          result[startDate] = OADate.encode(o.value[0], 'D');
          result[endDate] = OADate.encode(o.value[1], 'D');
          break;
        }

        case 'datetime': {
          const [startDate, endDate] = this.props.searchKeyMap?.[o.key] || [];
          result[startDate] = OADate.encode(o.value[0], 'D') + '000000';
          result[endDate] = OADate.encode(o.value[1], 'D') + '235959';
          break;
        }

        case 'select': {
          // 与后端商定的格式
          const key = o.key.endsWith('List') ? o.key : `${o.key}List`;
          result[key] = (o.value as []).map((v: { value: string }) => v.value);
          break;
        }

        case 'radio': {
          result[mapKey] = (o.value as any[])?.[0]?.value || '';
          break;
        }

        case 'sort':
          sortFieldList.push({ fieldName: mapKey, order: o.value as string });
          break;

        case 'range': {
          const rangeArr = (o.value as string).split('~');
          result[`${mapKey}Min`] = rangeArr[0];
          result[`${mapKey}Max`] = rangeArr[1];
          break;
        }

        default: {
          result[mapKey] = typeof o.value === 'string' ? o.value.trim() : o.value;
          break;
        }
      }
    });
    result.sortFieldList = sortFieldList;
    return result;
  };

  onSearchChange = (key: string, value: any) => {
    this.params[key] = typeof value === 'string' ? value.trim() : value;
    this.isParamsChange = true;
  };

  onSearchDelete = (pos: number) => {
    this.state.currentSearchParams.splice(pos, 1);
    this.setState(
      {
        current: 1,
        currentSearchParams: this.state.currentSearchParams,
      },
      this.getData
    );
  };

  onPageChange = (current: number, size: number) => {
    this.setState(
      {
        current,
        size,
      },
      this.getData
    );
  };

  render() {
    const { businessType, searchTypeList = [], getSearchs, getHeaderActions } = this.props;
    const { dataSource, currentSearchParams, tableHeight, columns, selectedRowKeys, size, current } = this.state;

    const search = getSearchs?.(this.onSearchChange, (defaultSearchs) => {
      this.params = { ...defaultSearchs, ...this.params };
    });

    const params = {
      size,
      current,
      pageNo: current,
      pageSize: size,
      pageNum: this.state.current,
      ...this.params,
      ...this.formatSearchParams(currentSearchParams),
    };

    return (
      <Spin spinning={this.state.loading} style={{ height: '100%' }}>
        <div className="layoutsContainer">
          <div className="layoutsHeader">
            <div className="layoutsTool">
              <div className="layoutsToolLeft">
                <h1>{this.state.title}</h1>
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
              scroll={{ x: this.state.scrollX, y: tableHeight }}
              pagination={{
                pageSize: this.state.size,
                position: ['bottomLeft'],
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
  }
}
