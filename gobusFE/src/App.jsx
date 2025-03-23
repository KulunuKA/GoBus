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
import RequireAuth from "./route/RequireAuth";
import PassengerLayout from "./components/Layouts/PassengerLayout";
import Requests from "./views/Requests";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register/:role" element={<Register />} />
      <Route path="/" element={<PassengerLayout />}>
        <Route path="/" element={<Home />} />
      </Route>

      {/* Bus Owner routes */}
      <Route element={<RequireAuth allowedRole={"BusOwner"} />}>
        <Route path="/busowner" element={<BusOwnerLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="bus" element={<Bus />} />
          <Route path="route" element={<MyRoutes />} />
          <Route path="employee" element={<Employee />} />
          <Route path="requests" element={<Requests />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
