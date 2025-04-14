// src/components/EditProjectForm.js
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

const EditProjectForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [projectData, setProjectData] = useState({});
  const [billFile, setBillFile] = useState(null);
  const [agreementFile, setAgreementFile] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token;
    axios.get(`http://localhost:5000/projects/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then((res) => {
      setProjectData(res.data);
    }).catch(() => {
      alert("Failed to load project");
      navigate("/projects");
    });
  }, [id, navigate]);

  const handleChange = (e) => {
    setProjectData({ ...projectData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = JSON.parse(localStorage.getItem("user"))?.token;
    const formData = new FormData();

    Object.keys(projectData).forEach((key) => {
      if (projectData[key] !== null) {
        formData.append(key, projectData[key]);
      }
    });

    if (billFile) formData.append("billSettlementFile", billFile);
    if (agreementFile) formData.append("agreementFile", agreementFile);

    try {
      await axios.put(`http://localhost:5000/projects/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });
      alert("Project updated!");
      navigate("/projects");
    } catch {
      alert("Update failed");
    }
  };

  return (
    <div className="project-form">
      <h2>Edit Project</h2>
      <form onSubmit={handleSubmit}>
        {[
          ["Industry Name", "industryName"],
          ["Project Title", "projectTitle"],
          ["Academic Year", "academicYear"],
          ["Amount Sanctioned", "amountSanctioned", "number"],
          ["Amount Received", "amountReceived", "number"],
          ["Student Details", "studentDetails"],
          ["Principal Investigator", "principalInvestigator"],
          ["Co-Principal Investigator", "coPrincipalInvestigator"],
          ["Faculty Name", "facultyName"],
          ["Faculty ID", "facultyId", "email"],
        ].map(([label, name, type = "text"]) => (
          <div className="form-group" key={name}>
            <label>{label}</label>
            <input type={type} name={name} value={projectData[name] || ""} onChange={handleChange} />
          </div>
        ))}
        <div className="form-group">
          <label>Project Summary</label>
          <textarea name="projectSummary" value={projectData.projectSummary || ""} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Bill Settlement File</label>
          <input type="file" onChange={(e) => setBillFile(e.target.files[0])} />
        </div>
        <div className="form-group">
          <label>Agreement File</label>
          <input type="file" onChange={(e) => setAgreementFile(e.target.files[0])} />
        </div>
        <button type="submit" className="submit-btn">Update Project</button>
      </form>
      <button onClick={() => navigate("/projects")} className="view-btn" style={{ marginTop: "15px" }}>
        Back to Dashboard
      </button>
    </div>
  );
};

export default EditProjectForm;
