// EnterMarks.js
document.addEventListener("DOMContentLoaded", () => {
  // DOM elements
  const form = document.getElementById("enter-marks-form");
  const rollNumberSelect = document.getElementById("roll-number");
  const semesterSelect = document.getElementById("semester");
  const courseSelect = document.getElementById("course");
  const branchSelect = document.getElementById("branch");
  const marksContainer = document.getElementById("marks-container");
  const messageDisplay = document.getElementById("message-display");

  // Data storage
  let branchData = {};
  let students = [];

  // Initialize the page
  fetchBranchData();
  fetchStudents();

  function fetchBranchData() {
    fetch("./branch.json")
      .then((response) => response.json())
      .then((data) => {
        branchData = data.subjectsByBranchAndSemester;
        populateCourseDropdown();
      })
      .catch((error) => {
        console.error("Error loading branch data:", error);
        showMessage(
          "Failed to load course data. Please try again later.",
          "error"
        );
      });
  }

  function fetchStudents() {
    fetch(
      "https://university-management-backend-e0sy.onrender.com/api/students"
    )
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch students");
        return response.json();
      })
      .then((data) => {
        students = data;
        populateRollNumbers();
      })
      .catch((error) => {
        console.error("Error fetching students:", error);
        showMessage(
          "Failed to load student data. Please try again later.",
          "error"
        );
      });
  }

  // Populate roll number dropdown
  function populateRollNumbers() {
    rollNumberSelect.innerHTML =
      '<option value="">-- Select Roll Number --</option>';
    students.forEach((student) => {
      const option = document.createElement("option");
      option.value = student.rollNo;
      option.textContent = student.rollNo;
      rollNumberSelect.appendChild(option);
    });
  }

  // Populate course dropdown from branch data
  function populateCourseDropdown() {
    courseSelect.innerHTML = '<option value="">-- Select Course --</option>';
    const courses = new Set();

    Object.keys(branchData).forEach((program) => {
      const match = program.match(/\(([^)]+)\)$/);
      if (match && match[1]) {
        courses.add(match[1]);
      }
    });

    courses.forEach((course) => {
      const option = document.createElement("option");
      option.value = course;
      option.textContent = course;
      courseSelect.appendChild(option);
    });
  }

  // Populate branch dropdown based on selected course
  function populateBranchDropdown() {
    const selectedCourse = courseSelect.value;
    branchSelect.innerHTML = '<option value="">-- Select branch --</option>';

    if (!selectedCourse) return;

    Object.keys(branchData).forEach((program) => {
      if (program.includes(selectedCourse)) {
        const branchName = program.replace(` (${selectedCourse})`, "");

        const option = document.createElement("option");
        option.value = branchName;
        option.textContent = branchName;
        branchSelect.appendChild(option);
      }
    });
  }

  // Populate semester dropdown based on selected branch and course
  function populateSemesterDropdown() {
    const selectedCourse = courseSelect.value;
    const selectedBranch = branchSelect.value;
    semesterSelect.innerHTML =
      '<option value="">-- Select Semester --</option>';

    if (!selectedCourse || !selectedBranch) return;

    const programKey = `${selectedBranch} (${selectedCourse})`;
    const semesters = branchData[programKey]
      ? Object.keys(branchData[programKey])
      : [];

    semesters.forEach((semester) => {
      const option = document.createElement("option");
      option.value = semester;
      option.textContent = `Semester ${semester}`;
      semesterSelect.appendChild(option);
    });
  }

  // Generate subject input fields based on selections
  function generateSubjectInputs() {
    const selectedCourse = courseSelect.value;
    const selectedBranch = branchSelect.value;
    const selectedSemester = semesterSelect.value;

    marksContainer.innerHTML = "";

    if (!selectedCourse || !selectedBranch || !selectedSemester) return;

    const programKey = `${selectedBranch} (${selectedCourse})`;
    const subjects = branchData[programKey]?.[selectedSemester] || [];

    if (subjects.length === 0) {
      showMessage("No subjects found for this semester", "warning");
      return;
    }

    const headerRow = document.createElement("div");
    headerRow.className = "marks-grid-header";
    headerRow.innerHTML = `
            <label>Subject</label>
            <label>Marks (0-100)</label>
        `;
    marksContainer.appendChild(headerRow);

    subjects.forEach((subject) => {
      const row = document.createElement("div");
      row.className = "marks-row";
      row.innerHTML = `
                <input type="text" value="${subject}" disabled>
                <input type="number" min="0" max="100" placeholder="Enter marks" required>
            `;
      marksContainer.appendChild(row);
    });
  }

  // Handle form submission
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const rollNo = rollNumberSelect.value;
    const semester = semesterSelect.value;
    const course = courseSelect.value;
    const branch = branchSelect.value;

    if (!rollNo || !semester || !course || !branch) {
      showMessage("Please fill all required fields", "error");
      return;
    }

    const subjectInputs = marksContainer.querySelectorAll(".marks-row");
    const subjects = [];

    let isValid = true;
    subjectInputs.forEach((row) => {
      const subjectName = row.querySelector('input[type="text"]').value;
      const marksInput = row.querySelector('input[type="number"]');
      const marks = parseInt(marksInput.value);

      if (isNaN(marks)) {
        marksInput.style.border = "2px solid red";
        isValid = false;
      } else {
        marksInput.style.border = "";
        subjects.push({
          subject: subjectName,
          marks: marks,
        });
      }
    });

    if (!isValid || subjects.length === 0) {
      showMessage("Please enter valid marks for all subjects (0-100)", "error");
      return;
    }

    const formData = {
      rollNo,
      semester,
      course,
      branch,
      subjects,
    };

    try {
      const response = await fetch(
        "https://university-management-backend-e0sy.onrender.com/api/results",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error("Failed to submit marks");

      const result = await response.json();
      showMessage(result.message || "Marks submitted successfully!", "success");
      form.reset();
      marksContainer.innerHTML = "";
    } catch (error) {
      console.error("Submission error:", error);
      showMessage("Failed to submit marks. Please try again.", "error");
    }
  });

  courseSelect.addEventListener("change", () => {
    populateBranchDropdown();
    semesterSelect.innerHTML =
      '<option value="">-- Select Semester --</option>';
    marksContainer.innerHTML = "";
  });

  branchSelect.addEventListener("change", () => {
    populateSemesterDropdown();
    marksContainer.innerHTML = "";
  });

  semesterSelect.addEventListener("change", generateSubjectInputs);

  rollNumberSelect.addEventListener("change", () => {
    const selectedRollNo = rollNumberSelect.value;
    const student = students.find((s) => s.rollNo === selectedRollNo);

    if (student) {
      courseSelect.value = student.course || "";
      populateBranchDropdown();
      branchSelect.value = student.branch || "";
      populateSemesterDropdown();
    } else {
      courseSelect.value = "";
      branchSelect.value = "";
      semesterSelect.innerHTML =
        '<option value="">-- Select Semester --</option>';
    }

    marksContainer.innerHTML = "";
  });

  function showMessage(message, type) {
    messageDisplay.textContent = message;
    messageDisplay.className = "";
    messageDisplay.classList.add(type);

    if (type === "success") {
      setTimeout(() => {
        messageDisplay.textContent = "";
        messageDisplay.className = "";
      }, 3000);
    }
  }
});
