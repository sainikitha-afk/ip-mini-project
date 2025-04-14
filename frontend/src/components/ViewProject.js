// src/components/ViewProject.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ViewProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token;

    axios.get(`http://localhost:5000/projects/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => {
        if (res.data.createdBy !== user.email) {
          alert("You do not have permission to view this project.");
          navigate("/projects");
        } else {
          setProject(res.data);
        }
      })
      .catch(() => {
        alert("Failed to fetch project");
        navigate("/projects");
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return <h2>Loading project...</h2>;
  if (!project) return <h2>Project not found</h2>;

  return (
    <div className="project-form">
      <h2>Project Details</h2>
      <div className="form-group"><strong>Industry:</strong> {project.industryName}</div>
      <div className="form-group"><strong>Title:</strong> {project.projectTitle}</div>
      <div className="form-group"><strong>Academic Year:</strong> {project.academicYear}</div>
      <div className="form-group"><strong>Amount Sanctioned:</strong> ₹{project.amountSanctioned}</div>
      <div className="form-group"><strong>Amount Received:</strong> ₹{project.amountReceived}</div>
      <div className="form-group"><strong>Students:</strong> {project.studentDetails}</div>
      <div className="form-group"><strong>Summary:</strong> {project.projectSummary}</div>
      <div className="form-group"><strong>Principal Investigator:</strong> {project.principalInvestigator}</div>
      <div className="form-group"><strong>Co-Principal Investigator:</strong> {project.coPrincipalInvestigator}</div>
      <div className="form-group"><strong>Faculty Name:</strong> {project.facultyName}</div>
      <div className="form-group"><strong>Faculty ID:</strong> {project.facultyId}</div>
      <button onClick={() => navigate("/projects")} className="edit-btn">Back to Dashboard</button>
    </div>
  );
};

export default ViewProject;
