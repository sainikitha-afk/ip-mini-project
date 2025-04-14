import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const DownloadProjects = () => {
  const { user } = useAuth();
  const [facultyList, setFacultyList] = useState([]);
  const [industryList, setIndustryList] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);

  const [filters, setFilters] = useState({
    facultyName: "",
    industryName: "",
    academicYear: "",
    minAmount: "",
  });

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${user.token}`,
        };

        const [facultyRes, industryRes, yearRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/projects/faculty-list`, { headers }),
          axios.get(`${process.env.REACT_APP_API_URL}/projects/industry-list`, { headers }),
          axios.get(`${process.env.REACT_APP_API_URL}/projects/academic-years`, { headers }),
        ]);

        setFacultyList(facultyRes.data);
        setIndustryList(industryRes.data);
        setAcademicYears(yearRes.data);
      } catch (error) {
        console.error("Error fetching lists:", error);
        alert("Failed to fetch filter lists.");
      }
    };

    fetchLists();
  }, [user.token]);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleDownload = async () => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/projects/download?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "filtered-projects.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Download failed");
    }
  };

  return (
    <div>
      <h2>Download Filtered Projects</h2>
      <div>
        <label>Faculty Name:</label>
        <select name="facultyName" value={filters.facultyName} onChange={handleChange}>
          <option value="">All</option>
          {facultyList.map((faculty, idx) => (
            <option key={idx} value={faculty}>
              {faculty}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Industry Name:</label>
        <select name="industryName" value={filters.industryName} onChange={handleChange}>
          <option value="">All</option>
          {industryList.map((industry, idx) => (
            <option key={idx} value={industry}>
              {industry}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Academic Year:</label>
        <select name="academicYear" value={filters.academicYear} onChange={handleChange}>
          <option value="">All</option>
          {academicYears.map((year, idx) => (
            <option key={idx} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Minimum Amount Sanctioned:</label>
        <input
          type="number"
          name="minAmount"
          value={filters.minAmount}
          onChange={handleChange}
          placeholder="₹50000 / ₹100000"
        />
      </div>

      <button onClick={handleDownload}>Download Excel</button>
    </div>
  );
};

export default DownloadProjects;
