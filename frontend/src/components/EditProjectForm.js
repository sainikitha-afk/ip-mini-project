import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditProjectForm = () => {
    const { id } = useParams(); // This should get the project ID from the URL
    const navigate = useNavigate();
    console.log("Project ID from URL:", id);

    const [projectData, setProjectData] = useState({
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
        billSettlementFile: null,
        agreementFile: null,
    });
    const [newFileSelected, setNewFileSelected] = useState(false);
    const [agreementFile, setAgreementFile] = useState(null);

    // Fetch project data when the component mounts
    useEffect(() => {
      const fetchProjectData = async () => {
        try {
          const token = localStorage.getItem("token");
    
          const response = await axios.get(`http://localhost:5000/projects/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
    
          const data = response.data;
    
          setProjectData({
            industryName: data.industryName || "",
            projectTitle: data.projectTitle || "",
            academicYear: data.academicYear || "",
            amountSanctioned: data.amountSanctioned || "",
            amountReceived: data.amountReceived || "",
            studentDetails: data.studentDetails || "",
            projectSummary: data.projectSummary || "",
            principalInvestigator: data.principalInvestigator || "",
            coPrincipalInvestigator: data.coPrincipalInvestigator || "",
            facultyName: data.facultyName || "",
            facultyId: data.facultyId || "",
            billSettlementFile: data.billSettlementFile || null,
            agreementFile: data.agreementFile || null,
          });
        } catch (error) {
          console.error("Error fetching project data:", error);
        }
      };
    
      fetchProjectData();
    }, [id]);    
    

    const handleFileChange = (e) => {
        if (e.target.name === "billSettlementFile") {
            setNewFileSelected(true);
            setProjectData({
                ...projectData,
                billSettlementFile: e.target.files[0],
            });
        } else if (e.target.name === "agreementFile") {
            setAgreementFile(e.target.files[0]);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProjectData({
            ...projectData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
    
      const formData = new FormData();
      for (const key in projectData) {
        if (projectData[key] !== null) {
          formData.append(key, projectData[key]);
        }
      }
    
      if (newFileSelected) {
        formData.append("billSettlementFile", projectData.billSettlementFile);
      }
    
      if (agreementFile) {
        formData.append("agreementFile", agreementFile);
      }
    
      const token = localStorage.getItem("token");  // ✅ Add this line to fetch the token
    
      try {
        const response = await axios.put(`http://localhost:5000/projects/${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,  // ✅ Pass the token in the request
          },
        });
        console.log("Updated project:", response.data);
        alert("Project updated successfully!");
        navigate("/projects");
      } catch (error) {
        console.error("Error updating project:", error);
        alert("Error updating project!");
      }
    };
    

    return (
        <div>
            <h2>Edit Project</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="industryName"
                    value={projectData.industryName}
                    onChange={handleChange}
                    placeholder="Industry Name"
                />
                <input
                    type="text"
                    name="projectTitle"
                    value={projectData.projectTitle}
                    onChange={handleChange}
                    placeholder="Project Title"
                />
                <input
                    type="text"
                    name="academicYear"
                    value={projectData.academicYear}
                    onChange={handleChange}
                    placeholder="Academic Year"
                />
                <input
                    type="number"
                    name="amountSanctioned"
                    value={projectData.amountSanctioned}
                    onChange={handleChange}
                    placeholder="Amount Sanctioned"
                />
                <input
                    type="number"
                    name="amountReceived"
                    value={projectData.amountReceived}
                    onChange={handleChange}
                    placeholder="Amount Received"
                />
                <input
                    type="text"
                    name="studentDetails"
                    value={projectData.studentDetails}
                    onChange={handleChange}
                    placeholder="Student Details"
                />
                <textarea
                    name="projectSummary"
                    value={projectData.projectSummary}
                    onChange={handleChange}
                    placeholder="Project Summary"
                />
                <input
                    type="text"
                    name="principalInvestigator"
                    value={projectData.principalInvestigator}
                    onChange={handleChange}
                    placeholder="Principal Investigator"
                />
                <input
                    type="text"
                    name="coPrincipalInvestigator"
                    value={projectData.coPrincipalInvestigator}
                    onChange={handleChange}
                    placeholder="Co-Principal Investigator"
                />
                <input
                    type="text"
                    name="facultyName"
                    value={projectData.facultyName}
                    onChange={handleChange}
                    placeholder="Faculty Name"
                />
                <input
                    type="email"
                    name="facultyId"
                    value={projectData.facultyId}
                    onChange={handleChange}
                    placeholder="Faculty ID"
                />
                <input
                    type="file"
                    name="billSettlementFile"
                    onChange={handleFileChange}
                />
                <input
                    type="file"
                    name="agreementFile"
                    onChange={handleFileChange}
                />
                <button type="submit">Update Project</button>
            </form>
            <button onClick={() => navigate("/projects")} style={{ marginTop: "1rem" }}>Back to Dashboard </button>
        </div>
    );
};

export default EditProjectForm;
