import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch, authActions, uiActions } from '@/store';

// MUI imports
import Menu, { MenuProps } from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import { styled } from '@mui/material/styles';

// create custom styled menu component
const StyledMenu = styled((props: MenuProps) => <Menu {...props} />)(
  ({ theme }) => ({
    '& .MuiPaper-root': {
      marginTop: theme.spacing(1),
      minWidth: 180,
    },
  })
);

const HamburgerMenu: React.FC = function () {
  // to make the menu pop up, we set and unset the anchor element
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const isOpen = Boolean(anchorEl);
  const auth = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const pathname = usePathname();
  // handlers
  // navigation handlers
  const handleNavigateToAddItem = () => {
    setAnchorEl(null);
    router.replace('/new-business');
  };
  const handleNavigateToHome = () => {
    setAnchorEl(null);
    router.replace('/');
  };
  const handleNavigateToAdmin = () => {
    setAnchorEl(null);
    router.replace('/admin');
  };
  // auth handlers
  const handleLogin = () => {
    setAnchorEl(null);
    dispatch(uiActions.openDialog());
  };
  const handleLogout = () => {
    setAnchorEl(null);
    dispatch(authActions.logout());
  };

  // homepage:
  //  not logged in: [Add a business][Login]
  //  logged in (user): [Add a business][Logout]
  //  logged in (admin): [Add a business][Admin][Logout]
  // add page:
  //  not logged in: [Home][Login]
  //  logged in (user): [Home][Logout]
  //  logged in (admin): [Home][Admin][Logout]
  // admin page:
  //  not logged in: [Home][Add a business][Logout]
  //  logged in as admin:[Home][Add a business][Logout]

  // navigation links
  const navMenuJSX = [];
  if (pathname === '/admin' || pathname === '/new-business') {
    navMenuJSX.push(
      <MenuItem key="home" onClick={handleNavigateToHome}>
        Home
      </MenuItem>
    );
  }
  if (pathname === '/' || pathname === '/admin') {
    navMenuJSX.push(
      <MenuItem key="add" onClick={handleNavigateToAddItem}>
        Add a business
      </MenuItem>
    );
  }
  if (
    auth.user.role === 'admin' &&
    (pathname === '/' || pathname === '/new-business')
  ) {
    navMenuJSX.push(
      <MenuItem key="admin" onClick={handleNavigateToAdmin}>
        Admin
      </MenuItem>
    );
  }

  // login/logout links
  const authMenuJSX = [];
  if (auth.status === 'logged in') {
    authMenuJSX.push(
      <MenuItem key="logout" onClick={handleLogout}>
        Log out
      </MenuItem>
    );
  } else {
    authMenuJSX.push(
      <MenuItem key="login" onClick={handleLogin}>
        Log in
      </MenuItem>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: '700',
      }}
    >
      <Button
        id="menu-button"
        variant="contained"
        aria-controls={isOpen ? 'navigation-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={isOpen ? 'true' : undefined}
        onClick={(e) => setAnchorEl(e.currentTarget)}
      >
        <MenuRoundedIcon />
      </Button>
      <StyledMenu
        id="navigation-menu"
        anchorEl={anchorEl}
        open={isOpen}
        onClose={() => setAnchorEl(null)}
        MenuListProps={{ 'aria-labelledby': 'menu-button' }}
      >
        {navMenuJSX}
        <Divider variant="middle" />
        {authMenuJSX}
      </StyledMenu>
    </div>
  );
};

export default HamburgerMenu;
