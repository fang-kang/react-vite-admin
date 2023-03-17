import { createSlice, Dispatch } from '@reduxjs/toolkit';

export interface CounterState {
  count: number;
}

const initialState: CounterState = {
  count: 0,
};

export const counter = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment(state, { payload }) {
      state.count = state.count + payload.step; // 内置了immutable
    },
    decrement(state) {
      state.count -= 1;
    },
  },
});

// 导出 reducers 方法
export const { increment, decrement } = counter.actions;

// 默认导出
export default counter.reducer;

// 内置了thunk插件，可以直接处理异步请求
export const asyncIncrement = (payload: any) => (dispatch: Dispatch) => {
  setTimeout(() => {
    dispatch(increment(payload));
  }, 2000);
};
