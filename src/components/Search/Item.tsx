import { ReactNode, PropsWithChildren, FC } from 'react';
import styles from './styles.module.less';

interface IProps {
  label: ReactNode;
  size?: 'small' | 'normal';
}

export const Item: FC<PropsWithChildren<IProps>> = (props: PropsWithChildren<IProps>) => {
  return (
    <div className={styles.item}>
      <div style={{ paddingRight: 12 }}>{props.label}</div>
      <div style={{ width: props.size === 'small' ? 150 : 200 }}>{props.children}</div>
    </div>
  );
};
