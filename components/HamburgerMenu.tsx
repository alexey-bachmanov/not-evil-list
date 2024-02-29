import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import {
  RootState,
  AppDispatch,
  authActions,
  adminActions,
  loginDialogActions,
} from '@/store';
import sleep from '@/lib/sleep';

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
  const isInAdminMode = useSelector(
    (state: RootState) => state.admin.isInAdminMode
  );
  // decouple menu text state from redux state, since we want to enter
  // admin mode immediately, but wait for the menu to close before changing
  // the menu text
  // this syntax at least assures us that the states match on component mount
  const [adminModeText, setAdminModeText] = useState<
    'Admin mode' | 'Exit Admin Mode'
  >(isInAdminMode ? 'Exit Admin Mode' : 'Admin mode');
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
  // admin mode handlers
  const handleToggleAdminMode = async () => {
    setAnchorEl(null);
    // immediately change the redux state
    if (isInAdminMode) {
      dispatch(adminActions.setAdminMode(false));
    } else {
      dispatch(adminActions.setAdminMode(true));
    }
    // wait 300ms for menu to close before changing text
    await sleep(300);
    setAdminModeText(
      adminModeText === 'Admin mode' ? 'Exit Admin Mode' : 'Admin mode'
    );
  };
  // auth handlers
  const handleLogin = () => {
    setAnchorEl(null);
    dispatch(loginDialogActions.openDialog());
  };
  const handleLogout = async () => {
    setAnchorEl(null);
    // fire the logout thunk
    dispatch(authActions.logout());
    // reset admin mode in our redux state
    dispatch(adminActions.setAdminMode(false));
    // and reset our menu text
    await sleep(300);
    setAdminModeText('Admin mode');
  };

  // homepage:
  //  not logged in: [Add a business][Login]
  //  logged in (user): [Add a business][Logout]
  //  logged in (admin): [Add a business][Admin mode][Logout]
  //  logged in (admin) and in admin mode: [Add a business][Exit admin mode][Logout]
  // add page:
  //  not logged in: [Home][Login]
  //  logged in (user): [Home][Logout]
  //  logged in (admin): [Home][Logout]

  // navigation links
  const navMenuJSX = [];
  if (pathname === '/new-business') {
    navMenuJSX.push(
      <MenuItem key="home" onClick={handleNavigateToHome}>
        Home
      </MenuItem>
    );
  }
  if (pathname === '/') {
    navMenuJSX.push(
      <MenuItem key="add" onClick={handleNavigateToAddItem}>
        Add a business
      </MenuItem>
    );
  }

  // admin mode controls
  const adminModeControlsJSX = (
    <MenuItem key="admin-mode" onClick={handleToggleAdminMode}>
      {adminModeText}
    </MenuItem>
  );

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
        {auth.user.role === 'admin' ? adminModeControlsJSX : null}
        <Divider variant="middle" />
        {authMenuJSX}
      </StyledMenu>
    </div>
  );
};

export default HamburgerMenu;
