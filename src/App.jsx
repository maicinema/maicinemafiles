import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

import EventMonitor from "./pages/EventMonitor";
import EventControl from "./pages/EventControl";
import TicketScanner from "./pages/TicketScanner";
import AdminFilmUpload from "./pages/AdminFilmUpload";

import Home from "./pages/Home";
import MyCinema from "./pages/MyCinema";
import ComingSoon from "./pages/ComingSoon";
import Studios from "./pages/Studios";
import Events from "./pages/Events";
import Login from "./Login";
import Subscribe from "./pages/Subscribe";
import RentFilm from "./pages/RentFilm";
import WatchFilm from "./pages/WatchFilm";
import CreateAccount from "./pages/CreateAccount";
import SubmitFilm from "./pages/SubmitFilm";

/* ADMIN PAGES */
import AdminDashboard from "./admin/AdminDashboard";
import ManageFilms from "./admin/ManageFilms";
import ManageEvents from "./admin/ManageEvents";
import ReviewSubmissions from "./admin/ReviewSubmissions";
import ManageStudios from "./admin/ManageStudios";
import TicketAdmin from "./admin/TicketAdmin";

/* COMPONENTS */
import Navbar from "./components/Navbar";
import NavigationArrows from "./components/NavigationArrows";
import Footer from "./components/Footer";

/* 🔐 ADMIN PROTECTION */
function ProtectedAdmin({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
  }, []);

  if (loading) return null;

  if (!session) {
    return <Navigate to="/admin/login" replace />;
  }

  if (session.user.email !== "maicinemacom@gmail.com") {
    supabase.auth.signOut();
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

/* ✅ GLOBAL RESPONSIVE WRAPPER */
function PageWrapper({ children }) {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: "1400px", // desktop limit
        margin: "0 auto",
        padding: "0 16px", // mobile padding
        boxSizing: "border-box"
      }}
    >
      {children}
    </div>
  );
}

/* ✅ LAYOUT */
function Layout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const hideLayout = isAdminRoute || location.pathname === "/admin/login";

  return (
    <>
      {!hideLayout && <Navbar />}
      {!hideLayout && <NavigationArrows />}

      {/* ✅ GLOBAL WRAPPER APPLIED HERE */}
      <PageWrapper>
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/" element={<Home />} />
          <Route path="/mycinema" element={<MyCinema />} />
          <Route path="/comingsoon" element={<ComingSoon />} />
          <Route path="/studios" element={<Studios />} />
          <Route path="/events" element={<Events />} />
          <Route path="/subscribe" element={<Subscribe />} />
          <Route path="/rent/:title" element={<RentFilm />} />
          <Route path="/watch/:title" element={<WatchFilm />} />
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/submit-film" element={<SubmitFilm />} />

          {/* SYSTEM */}
          <Route path="/scan-ticket" element={<TicketScanner />} />
          <Route path="/event-monitor" element={<EventMonitor />} />
          <Route path="/event-control" element={<EventControl />} />
          <Route path="/admin-upload-film" element={<AdminFilmUpload />} />

          {/* LOGIN */}
          <Route path="/admin/login" element={<Login />} />

          {/* ADMIN */}
          <Route path="/admin" element={<ProtectedAdmin><AdminDashboard /></ProtectedAdmin>} />
          <Route path="/admin/films" element={<ProtectedAdmin><ManageFilms /></ProtectedAdmin>} />
          <Route path="/admin/events" element={<ProtectedAdmin><ManageEvents /></ProtectedAdmin>} />
          <Route path="/admin/submissions" element={<ProtectedAdmin><ReviewSubmissions /></ProtectedAdmin>} />
          <Route path="/admin/studios" element={<ProtectedAdmin><ManageStudios /></ProtectedAdmin>} />
        </Routes>
      </PageWrapper>

      {!hideLayout && <Footer />}
    </>
  );
}

/* APP */
function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;