import { Routes, Route } from "react-router-dom";
import Home from "../pages/HomePage";
import About from "../pages/AboutPage";

import Login from "../pages/LoginPage";
import Signup from "../pages/SignupPage";

import Overview from "../pages/Dashboard/OverviewPage";
import Settings from "../pages/Dashboard/SettingsPage";
import NotFound from "../pages/NotFoundPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />

      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/signup" element={<Signup />} />

      <Route path="/dashboard/overview" element={<Overview />} />
      <Route path="/dashboard/settings" element={<Settings />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
