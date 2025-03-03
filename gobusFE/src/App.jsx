import "./App.css";
import LoginPage from "./views/LoginPage";
import { Routes, Route } from "react-router-dom";
import Register from "./views/Register";
import Home from "./views/HomePage";
import Dashboard from "./views/Dashboard";
import MyRoutes from "./views/Route/index";
import BusOwnerLayout from "./components/Layouts/BusOwner";
import Bus from "./views/Bus";
import Employee from "./views/Employee";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register/:role" element={<Register />} />
      <Route path="/home" element={<Home />} />

      {/* Bus Owner routes */}
      <Route path="/busowner" element={<BusOwnerLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="bus" element={<Bus />} />
        <Route path="route" element={<MyRoutes />} />
        <Route path="employee" element={<Employee />} />
      </Route>
    </Routes>
  );
}

export default App;
