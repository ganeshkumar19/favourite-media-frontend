import Home from "./pages/Home";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <Home />
      <ToastContainer position="top-center" autoClose={2500} newestOnTop closeOnClick pauseOnHover />
    </>
  );
}

export default App;

