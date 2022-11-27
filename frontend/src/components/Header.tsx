import { useState } from "react";
import { Link, Outlet } from "react-router-dom";

import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";

// https://github.com/pheezx/Gatsby-Portfolio/blob/master/src/components/Header.jsx
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Hidden from "@mui/material/Hidden";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
//import Link from "@mui/material/Link";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Toolbar from "@mui/material/Toolbar";

import { styled } from "@mui/material/styles"; //VS code suggests from "@mui/material" but
//I am following docs: https://mui.com/material-ui/customization/how-to-customize/

import { IState } from "../StateReducer";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const StyledLink = styled(Link)(({ theme }) => ({
  marginRight: 20,
  //underline: "none",
  textDecoration: "none",
  color: `${theme.palette.text.primary}`, //`${theme.palette.primary.main}`
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  marginRight: "auto",
  color: "white",
  backgroundColor: "black",
  borderRadius: 0,
  height: 30,
  border: "2px solid gray",
  borderLeft: "12px solid transparent",
  borderRight: "12px solid transparent",
}));

const navigationLinks = [
  { name: "Home", href: "/" },
  { name: "New", href: "/newbet" },
  { name: "Deposit", href: "/deposit" },
  { name: "Withdraw", href: "/withdraw" },
  { name: "Judge", href: "/judge" },
];

/*const useStyles = makeStyles((theme) => ({
  link: {
    marginRight: 20,
  },
  avatar: {
    marginRight: "auto",
    color: "white",
    backgroundColor: "black",
    borderRadius: 0,
    height: 30,
    border: "2px solid gray",
    borderLeft: "12px solid transparent",
    borderRight: "12px solid transparent",
  },
}));*/
type HeaderPropsT = {
  state: IState;
  connectWallet: () => Promise<void>;
};
export default function NavNormalAndHamburger({
  state,
  connectWallet,
}: HeaderPropsT) {
  const [open, setOpen] = useState(false);
  return (
    <>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <AppBar position="sticky" color="default">
        <Container maxWidth="md">
          <Toolbar disableGutters>
            <StyledAvatar>B</StyledAvatar>
            <Hidden smDown>
              {navigationLinks.map((item) => (
                <StyledLink
                  //color="text.primary"
                  //variant="button"
                  //href={item.href}
                  to={item.href}
                  key={item.name}
                >
                  {item.name}
                </StyledLink>
              ))}
            </Hidden>
            <Hidden smUp>
              <IconButton onClick={() => setOpen(true)}>
                <MenuIcon />
              </IconButton>
            </Hidden>
          </Toolbar>
        </Container>
        <SwipeableDrawer
          anchor="right"
          open={open}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
        >
          <div
            onClick={() => setOpen(false)}
            onKeyPress={() => setOpen(false)}
            role="button"
            tabIndex={0}
          >
            <IconButton>
              <ChevronRightIcon />
            </IconButton>
          </div>
          <Divider />
          <List>
            {navigationLinks.map((item) => (
              <ListItem key={item.name}>
                <StyledLink
                  //color="text.primary"
                  //variant="button"
                  //href={item.href}
                  to={item.href}
                >
                  {item.name}
                </StyledLink>
              </ListItem>
            ))}
          </List>
        </SwipeableDrawer>
      </AppBar>

      <Container maxWidth="md" sx={{ marginTop: "16px" }}>
        {state.address ? (
          <Box marginBottom="16px">
            <Typography variant="subtitle1" >Address: {state.address}</Typography>
            <Typography variant="body2" color="text.secondary">
              Balance: {state.balance ?? "Fetching..."}
            </Typography>
          </Box>
        ) : (
          <Box marginBottom="16px">
            <Typography variant="h6">
              Please connect your wallet to interact with this Dapp
            </Typography>
            <Button
              variant="contained"
              onClick={() => {
                connectWallet();
              }}
            >
              Connect
            </Button>
          </Box>
        )}
        <Outlet />
      </Container>
      </ThemeProvider>
    </>
  );
}
