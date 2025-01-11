import React from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const withAdminAuth = (WrappedComponent) => {
  return (props) => {
    const navigate = useNavigate();
    const isAdmin = Cookies.get('adminMode') === 'true';

    if (!isAdmin) {
      navigate('/');
      return null;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAdminAuth;
