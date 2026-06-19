import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import VerifyEmail from "../pages/VerifyEmail";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import Snippets from "../pages/Snippets";
import Notes from "../pages/Notes";
import Resources from "../pages/Resources";
import AddSnippet from "../pages/AddSnippet";
import AddNote from "../pages/AddNote";
import AddResource from "../pages/AddResource";
import NotFound from "../pages/NotFound";
import SnippetDetails from "../pages/SnippetDetails";
import EditSnippet from "../pages/EditSnippet";
import NoteDetails from "../pages/NoteDetails";
import EditNote from "../pages/EditNote";
import ResourceDetails from "../pages/ResourceDetails";
import EditResource from "../pages/EditResource";
import EditProfile from "../pages/EditProfile";
 import Explore from "../pages/Explore";
 import PublicProfile from "../pages/PublicProfile";
 import ProtectedRoute from "../components/ProtectedRoute";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Private routes (require authentication) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/snippets"
          element={
            <ProtectedRoute>
              <Snippets />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notes"
          element={
            <ProtectedRoute>
              <Notes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/resources"
          element={
            <ProtectedRoute>
              <Resources />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-snippet"
          element={
            <ProtectedRoute>
              <AddSnippet />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-note"
          element={
            <ProtectedRoute>
              <AddNote />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-resource"
          element={
            <ProtectedRoute>
              <AddResource />
            </ProtectedRoute>
          }
        />
        <Route
          path="/snippet/:id"
          element={
            <ProtectedRoute>
              <SnippetDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-snippet/:id"
          element={
            <ProtectedRoute>
              <EditSnippet />
            </ProtectedRoute>
          }
        />
        <Route
          path="/note/:id"
          element={
            <ProtectedRoute>
              <NoteDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-note/:id"
          element={
            <ProtectedRoute>
              <EditNote />
            </ProtectedRoute>
          }
        />
        <Route
          path="/resource/:id"
          element={
            <ProtectedRoute>
              <ResourceDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-resource/:id"
          element={
            <ProtectedRoute>
              <EditResource />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-profile"
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/explore"
          element={
            <ProtectedRoute>
              <Explore />
            </ProtectedRoute>
          }
        />
        <Route
          path="/developer/:id"
          element={
            <ProtectedRoute>
              <PublicProfile />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;