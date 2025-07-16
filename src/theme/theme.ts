import { createTheme } from "@mui/material/styles";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#121212",
      paper: "#1E1E1E",
    },
    primary: {
      main: "#90caf9", // azul claro
    },
    secondary: {
      main: "#f48fb1", // rosa claro
    },
  },
  typography: {
    fontFamily: `"Inter", "Roboto", "Helvetica", "Arial", sans-serif`,
  },
  shape: {
    borderRadius: 12,
  },
});

export default darkTheme;
