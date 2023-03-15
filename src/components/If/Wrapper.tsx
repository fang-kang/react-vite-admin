import React, { FC, ReactElement } from 'react';
import { If } from './If';
import { Else } from './Else';
import { ElseIf } from './ElseIf';

interface IProps {
  children: ReactElement[];
}

export const getConditionResult = (when: boolean): boolean => {
  const conditionResult = Boolean(when);

  return conditionResult;
};

export const Wrapper: FC<IProps> = ({ children }: IProps) => {
  let matchingElement: ReactElement | undefined;
  let elseElement: ReactElement | undefined;

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) {
      return;
    }

    if (!matchingElement && (child.type === If || child.type === ElseIf)) {
      const { when } = child.props as any;

      const conditionResult = getConditionResult(when);

      if (conditionResult) {
        matchingElement = child;
      }
    } else if (!elseElement && child.type === Else) {
      elseElement = child;
    }
  });

  return matchingElement ?? elseElement ?? null;
};
