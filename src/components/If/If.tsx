import { FC, ReactElement } from 'react';
import { render } from './render';

export interface IProps {
  when: boolean;
  children: ReactElement;
}

export const If: FC<IProps> = (props: IProps) => render(props);
