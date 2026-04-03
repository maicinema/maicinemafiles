import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import "./App.css";
import FilmDetails from "./pages/FilmDetails";
import ProtectedRoute from './components/ProtectedRoute'

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
import ResetPassword from "./pages/ResetPassword";

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

 if (loading) {
  return <div style={{ color: "white", padding: "40px" }}>Checking access...</div>;
}

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
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "0 16px",
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

  /* ✅ ADDED: handle Supabase reset session */
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes("access_token")) {
      supabase.auth.getSession().then(() => {
        window.location.href = "/reset-password";
      });
    }
  }, []);
useEffect(() => {
  async function trackVisitor() {
    // ❌ NEVER run on admin pages
    if (location.pathname.startsWith("/admin")) return;

    try {
      const { error } = await supabase
        .from("visitors")
        .insert([
          { created_at: new Date().toISOString() }
        ]);

      if (error) {
        console.log("Visitor tracking error:", error.message);
      }
    } catch (err) {
      console.log("Visitor tracking crashed:", err);
    }
  }

  trackVisitor();
}, [location.pathname]);

  return (
    <>
      {!hideLayout && <Navbar />}
      {!hideLayout && <NavigationArrows />}

      <PageWrapper>
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/" element={<Home />} />
          <Route path="/film/:id" element={<FilmDetails />} />
<Route
  path="/mycinema"
  element={
    <ProtectedRoute>
      <MyCinema />
    </ProtectedRoute>
  }
/>
          <Route path="/comingsoon" element={<ComingSoon />} />
          <Route path="/studios" element={<Studios />} />
          <Route path="/events" element={<Events />} />
          <Route path="/subscribe" element={<Subscribe />} />
          <Route path="/rent/:id" element={<RentFilm />} />
<Route path="/watch/:id" element={<WatchFilm />} />
         <Route path="/createaccount" element={<CreateAccount />} />
          <Route path="/submit-film" element={<SubmitFilm />} />

          {/* SYSTEM */}
          <Route path="/scan-ticket" element={<TicketScanner />} />
          <Route path="/event-monitor" element={<EventMonitor />} />
          <Route path="/event-control" element={<EventControl />} />
          <Route path="/admin-upload-film" element={<AdminFilmUpload />} />

          {/* LOGIN */}
          <Route path="/admin/login" element={<Login />} />

          {/* ✅ RESET PASSWORD (NOW WORKS) */}
          <Route path="/reset-password" element={<ResetPassword />} />

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