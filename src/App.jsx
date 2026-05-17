import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ResumeDataProvider } from "./context/ResumeDataContext";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";
// Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import About from "./pages/About";
import Contact from "./pages/Contact";
import CategorySelection from "./pages/CategorySelection";
import UniversalDashboard from "./dashboard/UniversalDashboard";
import DashboardLayout from "./layouts/DashboardLayout";
import UserProfile from "./pages/UserProfile";
import AiCareerBuilder from "./pages/AiCareerBuilder";
import Verification from "./pages/Verification";
import AnalysisDashboard from "./dashboard/AnalysisDashboard";

function App() {
  return (
    <AuthProvider>
      <ResumeDataProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Landing />} />
              <Route path="login" element={<Login />} />
              <Route path="features" element={<Features />} />
              <Route path="pricing" element={<Pricing />} />
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
            </Route>

            {/* Category Selection (Protected) */}
            <Route path="/category" element={
              <ProtectedRoute><CategorySelection /></ProtectedRoute>
            } />

            {/* Dashboard Routes (Protected) */}
            <Route path="/dashboard" element={
              <ProtectedRoute><DashboardLayout /></ProtectedRoute>
            }>
              <Route path="it" element={<UniversalDashboard category="it" />} />
              <Route path="non-it" element={<UniversalDashboard category="non-it" />} />
              <Route path="competitive" element={<UniversalDashboard category="competitive" />} />
              <Route path="internship" element={<UniversalDashboard category="internship" />} />
              <Route path="startup" element={<UniversalDashboard category="startup" />} />
              <Route path="profile" element={<UserProfile />} />
              <Route path="career-builder" element={<AiCareerBuilder />} />
              <Route path="verification" element={<Verification />} />
              <Route path="analysis/:companyId" element={<AnalysisDashboard />} />
            </Route>
          </Routes>
        </Router>
      </ResumeDataProvider>
    </AuthProvider>
  );
}

export default App;
