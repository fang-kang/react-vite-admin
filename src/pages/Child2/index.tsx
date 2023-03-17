import { RootState } from '@/store';
import { asyncIncrement, increment } from '@/store/modules/counter';
import { Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';

export default function Counter(props: any) {
  console.log(props, 'props');
  const { count } = useSelector((store: RootState) => store.couter);
  const dispatch = useDispatch();
  const changeNumber = (num: number) => {
    dispatch(increment({ step: num }));
  };

  const changeNumberAsync = (num: number) => {
    dispatch(asyncIncrement({ step: num }) as any);
  };
  return (
    <div>
      <h2>Counter</h2>
      <h2>当前计数: {count}</h2>
      <Button onClick={() => changeNumber(5)}>+5</Button>
      <Button onClick={() => changeNumberAsync(10)}>+10</Button>
    </div>
  );
}
