import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import MyCinema from "./pages/MyCinema";
import ComingSoon from "./pages/ComingSoon";
import Studios from "./pages/Studios";
import Events from "./pages/Events";
import Subscribe from "./pages/Subscribe";
import RentFilm from "./pages/RentFilm";
import WatchFilm from "./pages/WatchFilm";
import CreateAccount from "./pages/CreateAccount";
import TicketScanner from "./pages/TicketScanner";

import Navbar from "./components/Navbar";
import NavigationArrows from "./components/NavigationArrows";
import Footer from "./components/Footer";

function App() {
  return (
    <BrowserRouter>

      {/* NAVBAR ON ALL PAGES */}
      <Navbar />

      {/* GLOBAL BACK / FORWARD BUTTONS */}
      <NavigationArrows />

      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/mycinema" element={<MyCinema />} />
        <Route path="/comingsoon" element={<ComingSoon />} />
        <Route path="/studios" element={<Studios />} />
        <Route path="/events" element={<Events />} />
<Route path="/scan-ticket" element={<TicketScanner />} />

        <Route path="/subscribe" element={<Subscribe />} />
        <Route path="/rent/:title" element={<RentFilm />} />
        <Route path="/watch/:title" element={<WatchFilm />} />
<Route path="/create-account" element={<CreateAccount />} />

      </Routes>

      {/* FOOTER ON ALL PAGES */}
      <Footer />

    </BrowserRouter>
  );
}

export default App;