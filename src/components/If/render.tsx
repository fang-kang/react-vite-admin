import { IProps } from './If';

export const render = (props: IProps) => {
  return props.when ? props.children : null;
};
