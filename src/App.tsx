import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Layout } from './layout';
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

  return (
    <Routes>
      <Route path="/" index element={<Layout />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<Layout />} />
    </Routes>
  );
};

export default App;
