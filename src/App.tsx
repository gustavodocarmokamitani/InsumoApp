import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import MaterialSelector from "./pages/MaterialSelector";
import Navbar from "./components/Navbar";
import { SnackbarProvider } from "notistack";

function App() {
  return (
    <SnackbarProvider
      maxSnack={3}
      autoHideDuration={3000}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
    >
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/selecionar" element={<MaterialSelector />} />
        </Routes>
      </BrowserRouter>
    </SnackbarProvider>
  );
}

export default App;
