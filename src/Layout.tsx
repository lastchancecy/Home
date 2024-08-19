// Layout.tsx
import React from 'react';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate, useLocation } from 'react-router-dom';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = React.useState<number>(0);

  React.useEffect(() => {
    switch (location.pathname) {
      case '/profile':
        setValue(2);
        break;
      case '/':
        setValue(0);
        break;
      default:
        setValue(0);
        break;
    }
  }, [location.pathname]);

  return (
    <>
      <main>{children}</main>
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
          switch (newValue) {
            case 0:
              navigate('/Home');
              break;
            case 1:
              navigate('/orders'); // Adjust the path as needed
              break;
            case 2:
              navigate('/profile');
              break;
            default:
              break;
          }
        }}
        sx={{ width: '100%', position: 'fixed', bottom: 0 }}
      >
        <BottomNavigationAction label="Home" icon={<HomeIcon />} />
        <BottomNavigationAction label="Orders" icon={<ShoppingCartIcon />} />
        <BottomNavigationAction label="Account" icon={<PersonIcon />} />
      </BottomNavigation>
    </>
  );
};

export default Layout;
