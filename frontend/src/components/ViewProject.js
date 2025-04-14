import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const ViewProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const token = localStorage.getItem("token");
    axios
      .get(`${process.env.REACT_APP_API_URL}/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const data = response.data;
        console.log("Project data from server:", data); // ADD THIS
        if (!data || data.createdBy !== user.email) {
          alert("You do not have permission to view this project.");
          navigate("/projects");
        } else {
          setProject(data);
        }
      })      
      .catch((error) => {
        console.error("Error fetching project details:", error);
        alert("Failed to fetch project details.");
        navigate("/projects");
      })
      .finally(() => setLoading(false));
  }, [id, user, navigate]);

  if (!user) return <h2>Please log in to view this project.</h2>;
  if (loading) return <h2>Loading project details...</h2>;
  if (!project) return <h2>Project Not Found</h2>;

  return (
    <div className="view-project-container">
      <h2>Project Details</h2>
      <p><strong>Industry Name:</strong> {project.industryName || "Not provided"}</p>
      <p><strong>Project Title:</strong> {project.projectTitle || "Not provided"}</p>
      <p><strong>Academic Year:</strong> {project.academicYear || "Not provided"}</p>
      <p><strong>Amount Sanctioned:</strong> ₹{project.amountSanctioned || "0"}</p>
      <p><strong>Amount Received:</strong> ₹{project.amountReceived || "0"}</p>
      <p><strong>Student Details:</strong> {project.studentDetails || "Not provided"}</p>
      <p><strong>Summary:</strong> {project.projectSummary || "Not provided"}</p>
      <p><strong>Principal Investigator:</strong> {project.principalInvestigator || "Not provided"}</p>
      <p><strong>Co-Principal Investigator:</strong> {project.coPrincipalInvestigator || "Not provided"}</p>
      <p><strong>Faculty Name:</strong> {project.facultyName || "Not provided"}</p>
      <p><strong>Faculty ID:</strong> {project.facultyId || "Not provided"}</p>
      <button onClick={() => navigate(-1)}>Go Back</button>
    </div>
  );
};

export default ViewProject;
