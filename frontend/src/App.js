import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext"; // Import `useAuth` to check user
import ProjectForm from "./components/ProjectForm";
import EditProjectForm from "./components/EditProjectForm";
import ViewProject from "./components/ViewProject";
import Login from "./components/Login";
import Register from "./components/Register";
import ProjectDashboard from "./components/ProjectDashboard";
import DownloadProjects from './components/DownloadProjects';

function ProtectedRoute({ children }) {
  const { user } = useAuth(); // Get user from AuthContext
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/edit-project/:id" component={EditProjectForm} />
          <Route path="/projects/download" element={ <ProtectedRoute> <DownloadProjects /> </ProtectedRoute> } />

          {/* Protect /projects routes */}
          <Route
            path="/projects"
            element={
              <ProtectedRoute>
                <ProjectDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects/add"
            element={
              <ProtectedRoute>
                <ProjectForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects/edit/:id"
            element={
              <ProtectedRoute>
                <EditProjectForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects/view/:id"
            element={
              <ProtectedRoute>
                <ViewProject />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
