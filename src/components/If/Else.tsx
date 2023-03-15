import { FC, ReactElement } from 'react';

interface IProps {
  children: ReactElement;
}

export const Else: FC<IProps> = (props: IProps) => props.children;
