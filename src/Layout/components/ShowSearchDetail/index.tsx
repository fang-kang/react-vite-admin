import { FC } from 'react';
import styles from './style.module.less';

export interface ISearchParam {
  keyString?: string;
  key: string;
  value: string | { label: string; value: string }[] | [any, any];
  type: SearchType;
}

interface IProps {
  currentSearchParams: ISearchParam[];
  clear: () => void;
  delete: (index: number) => void;
}

export type SearchType = 'date' | 'datetime' | 'radio' | 'select' | 'input' | 'inputNum' | 'sort' | 'range';

export const ShowSearchDetail: FC<IProps> = (props: IProps) => {
  const getValue = (item: { type: any; value: any; key: any }) => {
    const { type, value, key } = item;
    let dom = null;
    switch (type) {
      case 'input':
      case 'range': {
        dom = value;
        break;
      }
      case 'sort': {
        dom = value === 'desc' ? '降序' : '升序';
        break;
      }
      case 'select': {
        dom = value.map((i: any, n: number) => (
          <span>
            {i.label}
            {n === value.length - 1 ? '' : ' , '}
          </span>
        ));
        break;
      }
      case 'radio': {
        dom = <span>{value.length ? value[0].label : '-'}</span>;
        break;
      }
      case 'datetime':
      case 'date': {
        const format = 'YYYY-MM-DD';
        dom = <span>{value.length ? `${value[0].format(format)} ~ ${value[1].format(format)}` : ''}</span>;
        break;
      }
      default: {
        break;
      }
    }
    return dom;
  };

  const { currentSearchParams } = props;

  return (
    <div className={styles.currentSearchParams} id="current-search-params">
      <div className={styles.itemContainer}>
        {currentSearchParams.map((item, index) => {
          const value = getValue(item);
          return (
            <div className={styles.itemWrap} key={item.keyString}>
              <span>
                {item.keyString || ''}: {value || ''}
              </span>
              <span
                className={styles.delete}
                onClick={() => {
                  props.delete(index);
                }}
              >
                X
              </span>
            </div>
          );
        })}
      </div>
      <div className={styles.clear}>
        <a onClick={props.clear}>清空</a>
      </div>
    </div>
  );
};
