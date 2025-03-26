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
import Special from "./views/SpecialTripPage/Index";
import UserAccount from "./views/UserAccount";
import Requests from "./views/Requests";
import SingleBusPage from "./views/SingleBusPage";
import Help from "./views/Help/index";
import Trips from "./views/Trips/index";
import PublicPage from "./views/PublicPage/index";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register/:role" element={<Register />} />
      <Route path="/" element={<PassengerLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/special" element={<Special />} />
        <Route path="/userProfile/" element={<UserAccount />} />
        <Route path="/bus/:id" element={<SingleBusPage />} />
        <Route path="/help" element={<Help />} />
        <Route path="/public" element={<PublicPage />} />
        <Route path="/activity" element={<Trips />} />
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
