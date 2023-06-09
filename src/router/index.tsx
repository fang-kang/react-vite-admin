import { ReactNode } from 'react';
import Child1 from '@/pages/Child1';
import Child2 from '@/pages/Child2';
import Home from '@/pages/Home';
import { HomeOutlined } from '@ant-design/icons';
import NotFound from '@/pages/NotFound';

export interface IMenu {
  path: string;
  component?: ReactNode;
  title: string;
  isHide?: boolean;
  children?: IMenu[];
  icon?: ReactNode;
  affix?: boolean;
}

export const menuList: IMenu[] = [
  { path: '/home', component: <Home />, icon: <HomeOutlined />, title: '首页', affix: true },
  {
    path: '/child1',
    icon: <HomeOutlined />,
    title: '测试1',
    children: [
      {
        path: '/child1/1',
        component: <Child1 />,
        icon: <HomeOutlined />,
        title: '测试1-111',
      },
      {
        path: '/child1/2',
        component: <Child2 />,
        icon: <HomeOutlined />,
        title: '测试1-222',
        children: [
          {
            path: '/child1/2/222',
            component: <NotFound />,
            icon: <HomeOutlined />,
            title: '测试1-2-222',
          },
        ],
      },
    ],
  },
  {
    path: '/child2',
    icon: <HomeOutlined />,
    title: '测试2',
    children: [
      {
        path: '/child2/1',
        component: <Child1 />,
        icon: <HomeOutlined />,
        title: '测试2-111',
      },
      { path: '/child2/2', component: <Child2 />, icon: <HomeOutlined />, title: '测试2-222' },
    ],
  },
];

export const getMenuList = (props: any): IMenu[] => {
  return [
    { path: '/home', component: <Home />, icon: <HomeOutlined />, title: '首页', affix: true },
    {
      path: '/child1',
      icon: <HomeOutlined />,
      title: '测试1',
      children: [
        {
          path: '/child1/1',
          component: <Child1 {...props} />,
          icon: <HomeOutlined />,
          title: '测试1-111',
        },
        {
          path: '/child1/2',
          component: <Child2 {...props} />,
          icon: <HomeOutlined />,
          title: '测试1-222',
          children: [
            {
              path: '/child1/2/222',
              component: <NotFound />,
              icon: <HomeOutlined />,
              title: '测试1-2-222',
            },
          ],
        },
      ],
    },
    {
      path: '/child2',
      icon: <HomeOutlined />,
      title: '测试2',
      children: [
        {
          path: '/child2/1',
          component: <Child1 {...props} />,
          icon: <HomeOutlined />,
          title: '测试2-111',
        },
        { path: '/child2/2', component: <Child2 {...props} />, icon: <HomeOutlined />, title: '测试2-222' },
      ],
    },
  ];
};
