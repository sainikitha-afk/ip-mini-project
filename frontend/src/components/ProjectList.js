import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProjectList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.email) {
      axios
        .get(`http://localhost:5000/projects?email=${user.email}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        })
        .then((res) => setProjects(res.data))
        .catch((err) => {
          console.error("Error fetching projects:", err);
          setError("Failed to load projects. Please try again.");
        });
    }
  }, [user]);

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:5000/projects/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      })
      .then(() => {
        setProjects((prevProjects) => prevProjects.filter((p) => p.ID !== id));
      })
      .catch((err) => {
        console.error("Error deleting project:", err);
        alert("Failed to delete project.");
      });
  };

  return (
    <div>
      <h2>Your Projects</h2>
      <button onClick={() => navigate("/projects/add")}>Add New Project</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {projects.length === 0 ? (
        <p>No projects found. Click "Add New Project" to create one.</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Title</th>
              <th>Industry</th>
              <th>Year</th>
              <th>Amount</th>
              <th>PI</th>
              <th>Faculty</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.ID}>
                <td>{project.projectTitle}</td>
                <td>{project.industryName}</td>
                <td>{project.academicYear}</td>
                <td>₹{project.amountSanctioned}</td>
                <td>{project.principalInvestigator || "N/A"}</td>
                <td>{project.facultyName || "N/A"}</td>
                <td>
                  <button onClick={() => navigate(`/projects/edit/${project.ID}`)}>Edit</button>
                  <button onClick={() => handleDelete(project.ID)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProjectList;
