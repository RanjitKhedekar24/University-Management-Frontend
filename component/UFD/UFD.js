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

let allTeachersData = [];
let selectedTeacherId = null;

// Department mapping by qualification
const subjectsByQualification = {
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
  "Ph.D.": [
    "Physics",
    "Chemistry",
    "Mathematics",
    "Education Technology",
    "Linguistics",
    "History",
  ],
  "B.Ed": [
    "Mathematics",
    "Science",
    "English",
    "Social Science",
    "Computer Education",
  ],
  "M.Ed": [
    "Mathematics",
    "Science",
    "English",
    "Educational Psychology",
    "Curriculum Studies",
  ],
  "M.A. (Education)": [
    "Education Theory",
    "Philosophy of Education",
    "Sociology of Education",
  ],
  "B.A. (Education)": [
    "Child Development",
    "Teaching Methods",
    "Language Teaching",
  ],
  "B.Sc. (Education)": ["Mathematics", "Physics", "Chemistry", "Biology"],
};

// Dynamically populate qualification dropdown
const populateQualificationDropdown = () => {
  const qualificationSelect = document.getElementById("qualification");
  if (!qualificationSelect) return;

  qualificationSelect.innerHTML =
    '<option value="">-- Select Qualification --</option>';

  const qualifications = Object.keys(subjectsByQualification);
  qualifications.forEach((qualification) => {
    const option = document.createElement("option");
    option.value = qualification;
    option.textContent = qualification;
    qualificationSelect.appendChild(option);
  });
};

// Update department dropdown based on qualification
const updateDepartmentOptions = (qualification) => {
  const departmentSelect = document.getElementById("department");
  if (!departmentSelect) return;

  departmentSelect.innerHTML =
    '<option value="">-- Select Department --</option>';
  departmentSelect.disabled = true;

  if (qualification && subjectsByQualification[qualification]) {
    subjectsByQualification[qualification].forEach((department) => {
      const option = document.createElement("option");
      option.value = department;
      option.textContent = department;
      departmentSelect.appendChild(option);
    });
    departmentSelect.disabled = false;
  }
};

// Fetch teachers and populate dropdown
const fetchTeachersForDropdown = async (preselectId = null) => {
  const employeeIdSelect = document.getElementById("employee-id-select");
  if (!employeeIdSelect) return;

  try {
    employeeIdSelect.disabled = true;
    employeeIdSelect.innerHTML =
      '<option value="">Loading teachers...</option>';

    const response = await fetch("http://localhost:3000/api/teachers");

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP ${response.status}: ${errorText || "Unknown error"}`
      );
    }

    const teachers = await response.json();
    allTeachersData = teachers;

    employeeIdSelect.innerHTML =
      '<option value="">-- Select Employee ID --</option>';

    teachers.forEach((teacher) => {
      if (teacher.employeeId) {
        const option = new Option(
          `${teacher.employeeId} - ${teacher.name}`,
          teacher.employeeId
        );
        employeeIdSelect.add(option);
      }
    });

    if (preselectId) {
      const teacher = teachers.find(
        (t) =>
          t._id === preselectId ||
          t.id === preselectId ||
          t.employeeId === preselectId
      );

      if (teacher) {
        employeeIdSelect.value = teacher.employeeId;
        fillFormWithTeacherData(teacher);
        selectedTeacherId = teacher._id || teacher.id;
        displayMessage(
          `Loaded: ${teacher.employeeId} - ${teacher.name}`,
          false
        );
      }
    } else if (teachers.length > 0) {
      displayMessage("Select an Employee ID to update details", false);
    } else {
      displayMessage("No teachers found. Please add teachers first.", true);
    }
  } catch (error) {
    console.error("Fetch teachers error:", error);
    displayMessage(`Failed to load teachers: ${error.message}`, true);
    employeeIdSelect.innerHTML = '<option value="">Error loading data</option>';
  } finally {
    employeeIdSelect.disabled = false;
  }
};

// Fill form with teacher data
const fillFormWithTeacherData = (teacher) => {
  const setValue = (id, value) => {
    const element = document.getElementById(id);
    if (element) element.value = value || "";
  };

  setValue("name", teacher.name);
  setValue("father-name", teacher.fatherName);
  setValue("employee-id", teacher.employeeId);
  setValue("dob", teacher.dob ? teacher.dob.substring(0, 10) : "");
  setValue("address", teacher.address);
  setValue("phone", teacher.phone);
  setValue("email", teacher.email);
  setValue("class-x", teacher.classXPercent);
  setValue("class-xii", teacher.classXIIPercent);
  setValue("aadhar", teacher.aadhar);

  const qualificationSelect = document.getElementById("qualification");
  const departmentSelect = document.getElementById("department");

  if (qualificationSelect && teacher.qualification) {
    qualificationSelect.value = teacher.qualification;
    updateDepartmentOptions(teacher.qualification);

    if (departmentSelect && teacher.department) {
      setTimeout(() => {
        departmentSelect.value = teacher.department;
      }, 50);
    }
  }
};

// Reset form function
const resetForm = () => {
  const form = document.getElementById("update-teacher-form");
  if (form) form.reset();

  const employeeIdSelect = document.getElementById("employee-id-select");
  if (employeeIdSelect) employeeIdSelect.value = "";

  updateDepartmentOptions(null);
  selectedTeacherId = null;
  displayMessage("Form cleared.", false);
};

// Initialize the page
const initializePage = () => {
  populateQualificationDropdown(); // Populate qualification list first

  const qualificationSelect = document.getElementById("qualification");
  if (qualificationSelect) {
    qualificationSelect.addEventListener("change", (e) => {
      updateDepartmentOptions(e.target.value);
    });
  }

  const employeeIdSelect = document.getElementById("employee-id-select");
  if (employeeIdSelect) {
    employeeIdSelect.addEventListener("change", (event) => {
      const selectedEmpId = event.target.value;
      selectedTeacherId = null;

      if (selectedEmpId) {
        const selectedTeacher = allTeachersData.find(
          (teacher) => teacher.employeeId === selectedEmpId
        );
        if (selectedTeacher) {
          selectedTeacherId = selectedTeacher._id || selectedTeacher.id;
          fillFormWithTeacherData(selectedTeacher);
          displayMessage(
            `Details loaded for Employee ID: ${selectedEmpId}`,
            false
          );
        } else {
          displayMessage("Teacher not found for the selected ID.", true);
          resetForm();
        }
      } else {
        resetForm();
        displayMessage("Select an Employee ID to update details.", false);
      }
    });
  }

  const form = document.getElementById("update-teacher-form");
  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (!selectedTeacherId) {
        displayMessage("Please select an Employee ID to update.", true);
        return;
      }

      const formData = new FormData(form);

      const classXPercent = formData.get("classX")
        ? parseFloat(formData.get("classX"))
        : undefined;
      const classXIIPercent = formData.get("classXII")
        ? parseFloat(formData.get("classXII"))
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
        qualification: formData.get("qualification"),
        department: formData.get("department"),
      };

      try {
        const response = await fetch(
          `http://localhost:3000/api/teachers/${selectedTeacherId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedData),
          }
        );

        const result = await response.json();
        if (response.ok) {
          displayMessage("Teacher details updated successfully!", false);
          await fetchTeachersForDropdown();
        } else {
          displayMessage(
            result.message || "Error updating teacher details.",
            true
          );
        }
      } catch (error) {
        console.error("Update error:", error);
        displayMessage(
          "Error updating teacher details. Please try again.",
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

  const teacherIdFromUrl = getQueryParam("id");
  fetchTeachersForDropdown(teacherIdFromUrl);
};

// Start when DOM is ready
document.addEventListener("DOMContentLoaded", initializePage);
