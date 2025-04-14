import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";


const ProjectDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
 // Get logged-in user details
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login"); // Redirect if not logged in
      return;
    }
  
    // Fetch user's projects
    axios
      .get(`http://localhost:5000/projects?email=${user.email}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setProjects(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching projects:", err);
        setLoading(false);
      });
  }, [user, navigate]);

  const handleDelete = async (projectId) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await axios.delete(`http://localhost:5000/projects/${projectId}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setProjects((prev) => prev.filter((proj) => proj.ID !== projectId));
      } catch (err) {
        console.error("Error deleting project:", err);
        alert("Failed to delete project");
      }
    }
  };
  
  return (
    <div className="dashboard">
      <h2>Project Dashboard</h2>
  
      <div className="tabs">
        <button onClick={() => navigate("/projects/add")}>Add New Project</button>
      </div>
  
      <div className="tab-content">
        {loading ? (
          <p>Loading projects...</p>
        ) : projects.length === 0 ? (
          <p>No projects found. Click "Add New Project" to create one.</p>
        ) : (
          <table border="1" cellPadding="8">
            <thead>
              <tr>
                <th>Project Title</th>
                <th>Industry</th>
                <th>PI</th>
                <th>Co-PI</th>
                <th>Faculty Name</th>
                <th>Faculty ID</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
                {projects.map((project) => (
                  <tr key={project.ID}>
                    <td>{project.projectTitle}</td>
                    <td>{project.industryName}</td>
                    <td>{project.principalInvestigator || "-"}</td>
                    <td>{project.coPrincipalInvestigator || "-"}</td>
                    <td>{project.facultyName || "-"}</td>
                    <td>{project.facultyId || "-"}</td>
                    <td>
                      <button onClick={() => navigate(`/projects/view/${project.ID}`)}>View</button>
                      <button onClick={() => navigate(`/projects/edit/${project.ID}`)}>Edit</button>
                      <button onClick={() => handleDelete(project.ID)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
          </table>
        )}
      </div>
    </div>
  );  
};

export default ProjectDashboard;
