import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Layout } from './Layout';
import Login from './pages/Login';
import { IMenu, menuList } from './router';
import { setActiveTab, setTabList } from './store/modules/global';
import { findItemByKey } from './utils';

const App = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const menu = findItemByKey(menuList, 'path', location.pathname) as IMenu;
    if (menu && menu.path !== window.$activeTab) {
      navigate(menu.path);
      dispatch(setActiveTab(menu.path));
      dispatch(setTabList(menu));
    }
  }, [location]);

  if (location.pathname === '/login') {
    return <Login />;
  }

  return <Layout />;
};

export default App;
