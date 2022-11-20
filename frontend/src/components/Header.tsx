// https://github.com/pheezx/Gatsby-Portfolio/blob/master/src/components/Header.jsx
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MenuIcon from '@mui/icons-material/Menu';
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Hidden from "@mui/material/Hidden";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Toolbar from '@mui/material/Toolbar';
import { useState } from "react";

//import { makeStyles } from "@mui/material/styles"; //outdated?
import { styled } from "@mui/material/styles"; //VS code suggests from "@mui/material" but
//I am following docs: https://mui.com/material-ui/customization/how-to-customize/

const StyledLink = styled(Link)(({theme}) => ({
  marginRight: 20,
}))
const StyledAvatar = styled(Avatar)(({theme}) => ({
  marginRight: "auto",
  color: "white",
  backgroundColor: "black",
  borderRadius: 0,
  height: 30,
  border: "2px solid gray",
  borderLeft: "12px solid transparent",
  borderRight: "12px solid transparent",
}))

const navigationLinks = [
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

export default function NavNormalAndHamburger() {
  //const styles = useStyles();
  const [open, setOpen] = useState(false);
  return (
    <AppBar position="sticky" color="default">
      <Container maxWidth="md">
        <Toolbar disableGutters>
          <StyledAvatar 
          //className={styles.avatar}
          >P</StyledAvatar>
          <Hidden smDown>
            {navigationLinks.map((item) => (
              <StyledLink
                //className={styles.link}
                color="text.primary"
                variant="button"
                underline="none"
                href={item.href}
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
                //className={styles.link}
                color="text.primary"
                variant="button"
                underline="none"
                href={item.href}
              >
                {item.name}
              </StyledLink>
            </ListItem>
          ))}
        </List>
      </SwipeableDrawer>
    </AppBar>
  );
}