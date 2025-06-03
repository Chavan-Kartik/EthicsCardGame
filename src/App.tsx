import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import PeriodSelection from "./pages/PeriodSelection";  // ✅ correct
import GamePage from "./pages/GamePage";
import History from "./pages/History";
import RequireAuth from "./components/RequireAuth";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      {/* <Route path="/select-period" element={<PeriodSelection />} /> */}

      {/* ✅ PROTECTED ROUTES */}
      <Route
        path="/select-period"    
        element={
          <RequireAuth>
            <PeriodSelection />
          </RequireAuth>
        }
      />


      <Route
        path="/game/:period"
        element={
          <RequireAuth>
            <GamePage />
          </RequireAuth>
        }
      />

      <Route
        path="/history"
        element={
          <RequireAuth>
            <History />
          </RequireAuth>
        }
      />
    </Routes>
  );
}
