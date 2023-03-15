import { createSlice } from '@reduxjs/toolkit';
import { menuList } from '@/router';

export interface GlobalState {
  tabList: ITab[];
  activeTab: string;
  openKeys: string[];
}

const initTabList = menuList
  .filter((v) => v.affix)
  .map(({ path, title, component, affix }) => ({ label: title, key: path, children: component, closable: !affix }));

const initActiveTab = menuList.filter((v) => v.affix)?.[0]?.path;

const initialState: GlobalState = {
  tabList: initTabList,
  activeTab: initActiveTab,
  openKeys: [],
};

export const global = createSlice({
  // 命名空间
  name: 'global',
  initialState,
  reducers: {
    setTabList(state, { payload }) {
      const index = state.tabList.findIndex((v: ITab) => v.key === payload.path);
      if (index < 0) {
        state.tabList = [...state.tabList, { key: payload.path, children: payload.component, label: payload.title }];
        window.$tabList = [...state.tabList];
      }
    },
    removeTabList(state, { payload }) {
      let newActiveKey = payload;
      let lastIndex = -1;
      state.tabList.forEach((item, i) => {
        if (item.key === payload) {
          lastIndex = i - 1;
        }
      });
      const newPanes = state.tabList.filter((item) => item.key !== payload);
      state.tabList = [...newPanes];
      window.$tabList = [...state.tabList];
      if (newPanes.length && newActiveKey === payload) {
        if (lastIndex >= 0) {
          newActiveKey = newPanes[lastIndex].key;
          state.activeTab = newActiveKey;
          window.$activeTab = newActiveKey;
        } else {
          newActiveKey = newPanes[0].key;
          state.activeTab = newActiveKey;
          window.$activeTab = newActiveKey;
        }
      }
    },
    setActiveTab(state, { payload }) {
      const arr = (payload as string)
        .split('/')
        .filter(Boolean)
        .map((v) => `/${v}`);
      console.log(arr, 'arr');
      state.activeTab = payload;
      state.openKeys = [...arr];
      window.$activeTab = payload;
      window.$openKeys = [...arr];
    },
  },
});

// 导出 reducers 方法
export const { setTabList, setActiveTab, removeTabList } = global.actions;

// 默认导出
export default global.reducer;
