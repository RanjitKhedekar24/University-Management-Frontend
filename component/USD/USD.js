// Function to display messages
const displayMessage = (message, isError = false) => {
  const messageDisplay = document.getElementById("message-display");
  if (messageDisplay) {
    messageDisplay.textContent = message;
    messageDisplay.style.color = isError ? "#f44336" : "#4CAF50";
  }
};

// Helper to get query params
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

let allStudentsData = [];
let selectedStudentId = null;

// Branch mapping by course
const branchesByCourse = {
  "B.Tech": [
    "Computer Science",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
    "Electronics Engineering",
  ],
  "M.Tech": [
    "Computer Science",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
    "Electronics Engineering",
  ],
  "B.Sc.": ["Physics", "Chemistry", "Computer Science"],
  "M.Sc.": ["Physics", "Chemistry", "Computer Science"],
  "B.A.": ["History", "Literature"],
  "M.A.": ["History", "Literature"],
};

// Initialize course dropdown
const initializeCourseDropdown = () => {
  const courseSelect = document.getElementById("course");
  if (!courseSelect) return;

  courseSelect.innerHTML = '<option value="">-- Select Course --</option>';

  Object.keys(branchesByCourse).forEach((course) => {
    const option = document.createElement("option");
    option.value = course;
    option.textContent = course;
    courseSelect.appendChild(option);
  });
};

// Update branch dropdown based on selected course
const updateBranchDropdown = (selectedCourse) => {
  const branchSelect = document.getElementById("branch");
  if (!branchSelect) return;

  branchSelect.innerHTML = '<option value="">-- Select Branch --</option>';
  branchSelect.disabled = true;

  if (selectedCourse && branchesByCourse[selectedCourse]) {
    branchesByCourse[selectedCourse].forEach((branch) => {
      const option = document.createElement("option");
      option.value = branch;
      option.textContent = branch;
      branchSelect.appendChild(option);
    });
    branchSelect.disabled = false;
  }
};

// Fetch students and populate dropdown
const fetchStudentsForDropdown = async (preselectId = null) => {
  const rollNumberSelect = document.getElementById("roll-number-select");
  if (!rollNumberSelect) return;

  try {
    rollNumberSelect.disabled = true;
    rollNumberSelect.innerHTML =
      '<option value="">Loading students...</option>';

    const response = await fetch(
      "http://university-management-backend-e0sy.onrender.com/api/students"
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP ${response.status}: ${errorText || "Unknown error"}`
      );
    }

    const students = await response.json();
    allStudentsData = students;

    rollNumberSelect.innerHTML =
      '<option value="">-- Select Roll Number --</option>';

    students.forEach((student) => {
      if (student.rollNo) {
        const option = new Option(
          `${student.rollNo} - ${student.name}`,
          student.rollNo
        );
        rollNumberSelect.add(option);
      }
    });

    if (preselectId) {
      const student = students.find(
        (s) =>
          s._id === preselectId ||
          s.id === preselectId ||
          s.rollNo === preselectId
      );

      if (student) {
        rollNumberSelect.value = student.rollNo;
        fillFormWithStudentData(student);
        selectedStudentId = student._id || student.id;
        displayMessage(`Loaded: ${student.rollNo} - ${student.name}`, false);
      }
    } else if (students.length > 0) {
      displayMessage("Select a Roll Number to update details", false);
    } else {
      displayMessage("No students found. Please add students first.", true);
    }
  } catch (error) {
    console.error("Fetch students error:", error);
    displayMessage(`Failed to load students: ${error.message}`, true);
    rollNumberSelect.innerHTML = '<option value="">Error loading data</option>';
  } finally {
    rollNumberSelect.disabled = false;
  }
};

// Fill form with student data
const fillFormWithStudentData = (student) => {
  const setValue = (id, value) => {
    const element = document.getElementById(id);
    if (element) element.value = value || "";
  };

  setValue("name", student.name);
  setValue("father-name", student.fatherName);
  setValue("roll-number", student.rollNo);
  setValue("dob", student.dob ? student.dob.substring(0, 10) : "");
  setValue("address", student.address);
  setValue("phone", student.phone);
  setValue("email", student.email);
  setValue("class-x", student.classXPercent);
  setValue("class-xii", student.classXIIPercent);
  setValue("aadhar", student.aadhar);

  const courseSelect = document.getElementById("course");
  const branchSelect = document.getElementById("branch");

  if (courseSelect && student.course) {
    courseSelect.value = student.course;
    updateBranchDropdown(student.course);

    if (branchSelect && student.branch) {
      setTimeout(() => {
        branchSelect.value = student.branch;
      }, 50);
    }
  }
};

// Reset form function
const resetForm = () => {
  const form = document.getElementById("update-student-form");
  if (form) form.reset();

  const rollNumberSelect = document.getElementById("roll-number-select");
  if (rollNumberSelect) rollNumberSelect.value = "";

  updateBranchDropdown(null);
  selectedStudentId = null;
  displayMessage("Form cleared.", false);
};

// Initialize the page
const initializePage = () => {
  initializeCourseDropdown(); // Populate course list first

  const courseSelect = document.getElementById("course");
  if (courseSelect) {
    courseSelect.addEventListener("change", (e) => {
      updateBranchDropdown(e.target.value);
    });
  }

  const rollNumberSelect = document.getElementById("roll-number-select");
  if (rollNumberSelect) {
    rollNumberSelect.addEventListener("change", (event) => {
      const selectedRollNo = event.target.value;
      selectedStudentId = null;

      if (selectedRollNo) {
        const selectedStudent = allStudentsData.find(
          (student) => student.rollNo === selectedRollNo
        );
        if (selectedStudent) {
          selectedStudentId = selectedStudent._id || selectedStudent.id;
          fillFormWithStudentData(selectedStudent);
          displayMessage(
            `Details loaded for Roll Number: ${selectedRollNo}`,
            false
          );
        } else {
          displayMessage(
            "Student not found for the selected Roll Number.",
            true
          );
          resetForm();
        }
      } else {
        resetForm();
        displayMessage("Select a Roll Number to update details.", false);
      }
    });
  }

  const form = document.getElementById("update-student-form");
  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (!selectedStudentId) {
        displayMessage("Please select a Roll Number to update.", true);
        return;
      }

      const formData = new FormData(form);

      const classXPercent = formData.get("classXPercent")
        ? parseFloat(formData.get("classXPercent"))
        : undefined;
      const classXIIPercent = formData.get("classXIIPercent")
        ? parseFloat(formData.get("classXIIPercent"))
        : undefined;

      const updatedData = {
        name: formData.get("name"),
        fatherName: formData.get("fatherName"),
        dob: formData.get("dob"),
        address: formData.get("address"),
        phone: formData.get("phone"),
        email: formData.get("email"),
        classXPercent,
        classXIIPercent,
        aadhar: formData.get("aadhar"),
        course: formData.get("course"),
        branch: formData.get("branch"),
      };

      try {
        const response = await fetch(
          `http://university-management-backend-e0sy.onrender.com/api/students/${selectedStudentId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedData),
          }
        );

        const result = await response.json();
        if (response.ok) {
          displayMessage("Student details updated successfully!", false);
          await fetchStudentsForDropdown();
        } else {
          displayMessage(
            result.message || "Error updating student details.",
            true
          );
        }
      } catch (error) {
        console.error("Update error:", error);
        displayMessage(
          "Error updating student details. Please try again.",
          true
        );
      }
    });
  }

  const cancelButton = document.getElementById("cancel-button");
  if (cancelButton) {
    cancelButton.addEventListener("click", () => {
      resetForm();
      window.location.href = "../home/home.html";
    });
  }

  const studentIdFromUrl = getQueryParam("id");
  fetchStudentsForDropdown(studentIdFromUrl);
};

// Start when DOM is ready
document.addEventListener("DOMContentLoaded", initializePage);
