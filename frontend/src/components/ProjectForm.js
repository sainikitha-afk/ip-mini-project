import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProjectForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    industryName: "",
    projectTitle: "",
    academicYear: "",
    amountSanctioned: "",
    amountReceived: "",
    studentDetails: "",
    projectSummary: "",
    principalInvestigator: "",
    coPrincipalInvestigator: "",
    facultyName: "",
    facultyId: "",
  });

  const [billSettlementFile, setBillSettlementFile] = useState(null);
  const [agreementFile, setAgreementFile] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.email || !user?.token) {
      alert("User not authenticated. Please log in again.");
      return;
    }

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });

      if (billSettlementFile) {
        data.append("billSettlementFile", billSettlementFile);
      }

      if (agreementFile) {
        data.append("agreementFile", agreementFile);
      }

      await axios.post(`${process.env.REACT_APP_API_URL}/projects`, data, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      alert("Project added successfully!");
      navigate("/projects");
    } catch (error) {
      console.error("Error adding project:", error);
      alert("Failed to add project");
    }
  };

  return (
    <div>
      <h2>Add New Project</h2>
      <form onSubmit={handleSubmit}>
        <input name="industryName" value={formData.industryName} onChange={handleChange} placeholder="Industry Name" required />
        <input name="projectTitle" value={formData.projectTitle} onChange={handleChange} placeholder="Project Title" required />
        <input name="academicYear" value={formData.academicYear} onChange={handleChange} placeholder="Academic Year" required />
        <input type="number" name="amountSanctioned" value={formData.amountSanctioned} onChange={handleChange} placeholder="Amount Sanctioned" required />
        <input type="number" name="amountReceived" value={formData.amountReceived} onChange={handleChange} placeholder="Amount Received" required />

        <textarea name="studentDetails" value={formData.studentDetails} onChange={handleChange} placeholder="Student Details" required />
        <textarea name="projectSummary" value={formData.projectSummary} onChange={handleChange} placeholder="Project Summary" required />

        <input name="principalInvestigator" value={formData.principalInvestigator} onChange={handleChange} placeholder="Principal Investigator" required />
        <input name="coPrincipalInvestigator" value={formData.coPrincipalInvestigator} onChange={handleChange} placeholder="Co-Principal Investigator" />
        <input name="facultyName" value={formData.facultyName} onChange={handleChange} placeholder="Faculty Name" required />
        <input name="facultyId" value={formData.facultyId} onChange={handleChange} placeholder="Faculty ID" required />

        <div>
          <label>Bill Settlement File:</label>
          <input type="file" name="billSettlementFile" accept=".pdf,.doc,.docx" onChange={(e) => setBillSettlementFile(e.target.files[0])} required />
        </div>

        <div>
          <label>Agreement File:</label>
          <input type="file" name="agreementFile" accept=".pdf,.doc,.docx" onChange={(e) => setAgreementFile(e.target.files[0])} required />
        </div>

        <button type="submit">Submit Project</button>
      </form>
    </div>
  );
};

export default ProjectForm;
