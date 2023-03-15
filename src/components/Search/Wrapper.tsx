import { CSSProperties, PropsWithChildren, FC } from 'react';
import styles from './styles.module.less';

interface IProps {
  style?: CSSProperties;
}

export const Wrapper: FC<PropsWithChildren<IProps>> = (props: PropsWithChildren<IProps>) => {
  if (props.children === undefined) {
    return null;
  }
  return (
    <div className={styles.wrapper} style={{ ...(props.style || {}) }}>
      {props.children}
    </div>
  );
};
