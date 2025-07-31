document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const empIdInput = document.getElementById("employee-id");
  const messageDisplay = document.getElementById("message-display");
  const cancelBtn = document.getElementById("cancel-button");
  const qualificationSelect = document.getElementById("qualification");
  const departmentSelect = document.getElementById("department");

  // Define subjects by qualification
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
    "Ph.D.": [
      "Physics",
      "Chemistry",
      "Mathematics",
      "Education Technology",
      "Linguistics",
      "History",
    ],
    "M.Sc.": ["Physics", "Chemistry", "Computer Science"],
    "B.Sc.": ["Physics", "Chemistry", "Computer Science"],
    "B.A.": ["History", "Literature"],
    "M.A.": ["History", "Literature"],
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

  function showMessage(msg, type) {
    if (messageDisplay) {
      messageDisplay.textContent = msg;
      messageDisplay.className =
        type === "error" ? "error-message" : "success-message";
      setTimeout(() => {
        messageDisplay.textContent = "";
        messageDisplay.className = "";
      }, 3000);
    }
  }

  function populateQualificationOptions() {
    qualificationSelect.innerHTML =
      '<option value="">-- Select Qualification --</option>';

    const allQualifications = Object.keys(subjectsByQualification).sort();

    allQualifications.forEach((qualification) => {
      const option = document.createElement("option");
      option.value = qualification;
      option.textContent = qualification;
      qualificationSelect.appendChild(option);
    });
  }

  function updateDepartmentOptions() {
    const qualification = qualificationSelect.value;
    departmentSelect.innerHTML =
      '<option value="">-- Select Department --</option>';

    if (qualification && subjectsByQualification[qualification]) {
      departmentSelect.disabled = false;
      subjectsByQualification[qualification].forEach((subject) => {
        const option = document.createElement("option");
        option.value = subject;
        option.textContent = subject;
        departmentSelect.appendChild(option);
      });
    } else {
      departmentSelect.disabled = true;
    }
  }

  async function fetchNextEmployeeId() {
    try {
      const res = await fetch(
        "http://university-management-backend-e0sy.onrender.com/api/teachers/next-employee"
      );
      const data = await res.json();
      if (res.ok && data.nextEmployeeId) {
        empIdInput.value = data.nextEmployeeId;
      } else {
        empIdInput.value = "EMP001";
      }
    } catch (err) {
      empIdInput.value = "EMP001";
    }
  }

  function initPage() {
    populateQualificationOptions();
    updateDepartmentOptions();
    fetchNextEmployeeId();

    qualificationSelect.addEventListener("change", updateDepartmentOptions);

    if (cancelBtn) {
      cancelBtn.addEventListener("click", () => {
        window.location.href = "../home/home.html";
      });
    }
  }

  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      const requiredFields = form.querySelectorAll("[required]");
      let valid = true;

      requiredFields.forEach((field) => {
        if (!field.value.trim()) {
          field.classList.add("input-error");
          valid = false;
        } else {
          field.classList.remove("input-error");
        }
      });

      if (departmentSelect.disabled || !departmentSelect.value) {
        departmentSelect.classList.add("input-error");
        valid = false;
        showMessage("Please select a valid department", "error");
      } else {
        departmentSelect.classList.remove("input-error");
      }

      if (!valid) return;

      const formData = {};
      const formElements = Array.from(form.elements).filter((el) => el.name);

      formElements.forEach((field) => {
        let key = field.name;
        formData[key] = field.value.trim();
      });

      formData.employeeId = empIdInput.value;

      if (formData.classXPercent)
        formData.classXPercent = parseFloat(formData.classXPercent);
      if (formData.classXIIPercent)
        formData.classXIIPercent = parseFloat(formData.classXIIPercent);

      try {
        const response = await fetch(
          "http://university-management-backend-e0sy.onrender.com/api/teachers",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          }
        );

        const result = await response.json();

        if (response.ok) {
          showMessage(
            result.message +
              (result.employeeId ? `\nEmployee ID: ${result.employeeId}` : ""),
            "success"
          );
          form.reset();
          updateDepartmentOptions();
          await fetchNextEmployeeId();
        } else {
          if (
            (result.error && result.error.code === 11000) ||
            (result.message &&
              result.message.toLowerCase().includes("duplicate"))
          ) {
            if (result.error && result.error.field === "email") {
              showMessage(
                "This email is already registered. Please use a different email.",
                "error"
              );
            } else if (result.error && result.error.field === "aadhar") {
              showMessage(
                "This Aadhar number is already registered. Please use a different Aadhar.",
                "error"
              );
            } else {
              showMessage(
                "Duplicate entry. Email or Aadhar already exists.",
                "error"
              );
            }
          } else {
            showMessage(result.message || "Submission failed", "error");
          }
        }
      } catch (error) {
        showMessage(
          "Error submitting teacher details. Please try again.",
          "error"
        );
      }
    });
  }

  const style = document.createElement("style");
  style.textContent = `
    .input-error {
      border: 2px solid #e53e3e !important;
      background: #fff5f5 !important;
    }
    .error-message {
      color: #e53e3e;
      margin-top: 10px;
      font-weight: bold;
    }
    .success-message {
      color: #38a169;
      margin-top: 10px;
      font-weight: bold;
    }
    select.input-error {
      border: 2px solid #e53e3e !important;
      background: #fff5f5 !important;
    }
  `;
  document.head.appendChild(style);

  initPage();
});
