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
import AdministratorLayout from "./components/Layouts/AdministratorLayout";
import AdminDashboard from "./views/AdminDashboard/index";
import BusInventory from "./views/BusInventory";
import RouteManagement from "./views/RouteManagement/INDEX.JSX";
import ComplaintManagement from "./views/ComplaintManagement";
import AdminNotifications from "./views/AdminNotifications";
import AdminSettings from "./views/AdminSettings";
import AdminSupportCenter from "./views/AdminSupportCenter";
import PassengerComplaints from "./views/PassengerComplaints";
import PassengerManagement from "./views/PassengerManagemenet/Index";
import AuthorityManagement from "./views/AuthorityManagement";
import PassengerMap from "./views/Map/LiveLocationTracker";
import CustomerSupport from "./views/CustomerSupport";
import AdminChatRoom from "./views/AdminChatRoom";
import ChatPageAdmin from "./views/ChatPageAdmin";
import SupportInbox from "./views/SupportInbox";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register/:role" element={<Register />} />
      <Route path="/" element={<PassengerLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/special" element={<Special />} />
        <Route path="/bus/:id" element={<SingleBusPage />} />
        <Route path="/help" element={<Help />} />
        <Route path="/public-buses" element={<PublicPage />} />

        {/* Passenger routes */}
        <Route element={<RequireAuth allowedRole={"Passenger"} />}>
          <Route path="/userprofile" element={<UserAccount />} />
          <Route path="/activity" element={<Trips />} />
          <Route path="/complaints" element={<PassengerComplaints />} />
          <Route path="/customer-support" element={<CustomerSupport />} />
          <Route path="/customer-support/support-inbox" element={<SupportInbox />} />
          <Route path="/map/:busId" element={<PassengerMap />} />
        </Route>
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

      {/* Administrator routes */}
      <Route path="/administrator" element={<AdministratorLayout />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="passengers" element={<PassengerManagement />} />
        <Route path="authorities" element={<AuthorityManagement />} />
        <Route path="buses" element={<BusInventory />} />
        <Route path="routes" element={<RouteManagement />} />
        <Route path="complaints" element={<ComplaintManagement />} />
        <Route path="chatRoom" element={<AdminChatRoom />} />
        <Route path="chatRoom/:ticketId" element={<ChatPageAdmin />} />
        <Route path="supports" element={<AdminSupportCenter />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>
    </Routes>
  );
}

export default App;
