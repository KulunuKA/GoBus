import "./App.css";
import LoginPage from "./views/LoginPage";
import { Routes, Route } from "react-router-dom";
import Register from "./views/Register";
import Home from "./views/HomePage";
import Dashboard from "./views/Dashboard";

function App() {
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register/:role" element={<Register />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  );
}

export default App;
