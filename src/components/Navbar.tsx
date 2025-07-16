import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { Link as RouterLink } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  const navItems = [
    { text: "Cadastro", to: "/" },
    { text: "Selecionar Materiais", to: "/selecionar" },
  ];

  const drawer = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {navItems.map(({ text, to }) => (
          <ListItem key={text} disablePadding>
            <ListItemButton component={RouterLink} to={to}>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1, marginBottom: 3, mx: 3 }}>
      <AppBar
        position="static"
        sx={{
          borderRadius: "7px",
          mt: 1,
          boxShadow: 3,
          backgroundColor: "#18181b",
        }}
      >
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ mr: isMobile ? 0 : 10, flexGrow: isMobile ? 1 : 0 }}>
            RREngenharia
          </Typography>

          {isMobile ? (
            <>
              <IconButton
                color="inherit"
                edge="end"
                aria-label="menu"
                onClick={toggleDrawer(true)}
              >
                <MenuIcon />
              </IconButton>
              <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
              >
                {drawer}
              </Drawer>
            </>
          ) : (
            <Box sx={{ display: "flex", gap: 5 }}>
              {navItems.map(({ text, to }) => (
                <Button
                  key={text}
                  color="inherit"
                  component={RouterLink}
                  to={to}
                  sx={{
                    fontWeight: "500",
                    textTransform: "none",
                    fontSize: "1rem",
                    padding: "5px 20px",
                    transition: "all 0.3s ease-in-out",
                    "&:hover": {
                      backgroundColor: "#fff",
                      color: "#2c2c2c",
                      boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                    },
                  }}
                >
                  {text}
                </Button>
              ))}
            </Box>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
