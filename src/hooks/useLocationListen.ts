import { useEffect } from 'react';
import { Location, useLocation } from 'react-router-dom';

export default (listener: (location: Location) => void) => {
  const location = useLocation();
  useEffect(() => {
    listener(location);
  }, [location]);
};
