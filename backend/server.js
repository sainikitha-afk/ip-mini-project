const express = require("express");
const multer = require("multer");
const cors = require("cors");
const XLSX = require("xlsx");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const path = require("path");

const app = express();
const PORT = 5000;
const SECRET_KEY = "mysecretkey"; // Use environment variable in production

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

// Helper functions
function readExcel(filename) {
  if (!fs.existsSync(filename)) {
    return [];
  }

  const workbook = XLSX.readFile(filename);
  const sheetName = workbook.SheetNames[0];
  return XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: "" });
}

function writeExcel(filename, data) {
  const allHeaders = Array.from(new Set(data.flatMap(obj => Object.keys(obj))));
  const worksheet = XLSX.utils.json_to_sheet(data, { header: allHeaders });
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, filename);
}

function generateId(projects) {
  return Math.max(0, ...projects.map((p) => (typeof p.ID === "number" ? p.ID : parseInt(p.ID) || 0))) + 1;
}

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) return res.sendStatus(401);
  jwt.verify(token.split(" ")[1], SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// User Registration
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const users = readExcel("users.xlsx");

  if (users.some((u) => u.email === email)) {
    return res.status(400).json({ message: "Email already registered" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ name, email, password: hashedPassword });
  writeExcel("users.xlsx", users);
  res.status(201).json({ message: "User registered successfully" });
});

// User Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const users = readExcel("users.xlsx");
  const user = users.find((u) => u.email === email);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ email: user.email }, SECRET_KEY, { expiresIn: "1h" });
  res.json({ token });
});

// Get all projects
app.get("/projects", authenticateToken, (req, res) => {
  const allProjects = readExcel("projects.xlsx");

  // Only show projects created by the logged-in user
  const userProjects = allProjects.filter(
    (project) => project.createdBy === req.user.email
  );

  res.json(userProjects);
});

// Add a new project (No changes)
app.post(
  "/projects",
  authenticateToken,
  upload.fields([
    { name: "billSettlementFile" },
    { name: "agreementFile" },
  ]),
  (req, res) => {
    const projects = readExcel("projects.xlsx");
    const newProject = {
      ID: generateId(projects),
      industryName: req.body.industryName || "",
      projectTitle: req.body.projectTitle || "",
      academicYear: req.body.academicYear || "",
      amountSanctioned: parseFloat(req.body.amountSanctioned) || 0,
      amountReceived: parseFloat(req.body.amountReceived) || 0,
      studentDetails: req.body.studentDetails || "",
      projectSummary: req.body.projectSummary || "",
      principalInvestigator: req.body.principalInvestigator || "",
      coPrincipalInvestigator: req.body.coPrincipalInvestigator || "",
      facultyName: req.body.facultyName || "",
      facultyId: req.body.facultyId || "",
      billSettlementFile: req.files?.billSettlementFile?.[0]?.filename || "",
      agreementFile: req.files?.agreementFile?.[0]?.filename || "",
      createdBy: req.user.email,
      createdAt: new Date().toISOString(),
    };
    
    projects.push(newProject);
    writeExcel("projects.xlsx", projects);
    res.status(201).json(newProject);
  }
);

// **UPDATE PROJECT** route: Refined version
app.put('/projects/:id', authenticateToken, upload.fields([
  { name: 'billSettlementFile', maxCount: 1 },
  { name: 'agreementFile', maxCount: 1 }
]), (req, res) => {
  try {
    const projectId = parseInt(req.params.id);
    const projects = readExcel("projects.xlsx");

    // Find the project to update by ID and ensure it belongs to the logged-in user
    const projectIndex = projects.findIndex(
      (p) => parseInt(p.ID) === projectId && p.createdBy === req.user.email
    );

    if (projectIndex === -1) {
      return res.status(404).json({ message: "Project not found or you don't have permission to edit it" });
    }

    // Get the existing project data
    const existingProject = projects[projectIndex];

    // Prepare the updated project data
    const updatedProject = {
      ...existingProject,
      industryName: req.body.industryName || existingProject.industryName,
      projectTitle: req.body.projectTitle || existingProject.projectTitle,
      academicYear: req.body.academicYear || existingProject.academicYear,
      amountSanctioned: parseFloat(req.body.amountSanctioned) || existingProject.amountSanctioned,
      amountReceived: parseFloat(req.body.amountReceived) || existingProject.amountReceived,
      studentDetails: req.body.studentDetails || existingProject.studentDetails,
      projectSummary: req.body.projectSummary || existingProject.projectSummary,
      principalInvestigator: req.body.principalInvestigator || existingProject.principalInvestigator,
      coPrincipalInvestigator: req.body.coPrincipalInvestigator || existingProject.coPrincipalInvestigator,
      facultyName: req.body.facultyName || existingProject.facultyName,
      facultyId: req.body.facultyId || existingProject.facultyId,
      // File handling
      billSettlementFile: req.files?.billSettlementFile?.[0]?.filename || existingProject.billSettlementFile,
      agreementFile: req.files?.agreementFile?.[0]?.filename || existingProject.agreementFile,
    };

    // Update the project in the array
    projects[projectIndex] = updatedProject;

    // Write the updated data back to Excel
    writeExcel("projects.xlsx", projects);

    // Send back the updated project
    res.json(updatedProject);
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get a project by ID (No changes)
app.get("/projects/:id", authenticateToken, (req, res) => {
  const id = parseInt(req.params.id);
  const projects = readExcel("projects.xlsx");

  console.log("User from token:", req.user.email);
  console.log("Project ID requested:", id);
  console.log("All project creators:", projects.map(p => p.createdBy));

  const project = projects.find(
    (p) => parseInt(p.ID) === id && p.createdBy === req.user.email
  );

  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  res.json(project);
});


// Delete a project (No changes)
app.delete("/projects/:id", authenticateToken, (req, res) => {
  let projects = readExcel("projects.xlsx");
  const id = parseInt(req.params.id);
  const projectIndex = projects.findIndex((p) => parseInt(p.ID) === id);
  if (projectIndex === -1) {
    return res.status(404).json({ message: "Project not found" });
  }
  projects.splice(projectIndex, 1);
  writeExcel("projects.xlsx", projects);
  res.json({ message: "Project deleted successfully" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
