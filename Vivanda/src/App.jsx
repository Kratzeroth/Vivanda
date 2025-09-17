import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "../components/login.jsx";
import { Register } from "../components/register.jsx";
<<<<<<< HEAD
import { MainPage } from "../components/home.jsx";

=======
import { Home } from "../components/home.jsx";
import "./App.css";
>>>>>>> 0054bc7 (integracion del main)
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
<<<<<<< HEAD
          <Route path="/home" element={<MainPage />} /> 
=======
          <Route path="/home" element={<Home />} /> 
>>>>>>> 0054bc7 (integracion del main)
        </Routes>
      </Router>
    </>
  );
}

export default App;
