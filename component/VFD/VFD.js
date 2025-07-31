// Function to display messages
const displayMessage = (message, isError = false) => {
  const messageDisplay = document.getElementById("message-display");
  messageDisplay.textContent = message;
  messageDisplay.style.color = isError ? "#f44336" : "#4CAF50";
};

let allTeachersData = [];

// Fetch all teachers from backend
const fetchTeachers = async () => {
  try {
    const response = await fetch(
      "https://university-management-backend-e0sy.onrender.com/api/teachers"
    );
    allTeachersData = await response.json();
    populateTable(allTeachersData);
    populateEmployeeIdDropdown(allTeachersData);
    displayMessage("Teacher data loaded successfully.", false);
  } catch (error) {
    displayMessage("Error loading teacher data.", true);
  }
};

// Populate the table with teacher data
const populateTable = (teachers) => {
  const tableBody = document.querySelector("#teacher-table tbody");
  tableBody.innerHTML = "";

  if (teachers.length === 0) {
    const row = tableBody.insertRow();
    const cell = row.insertCell();
    cell.colSpan = 12;
    cell.textContent = "No teacher data available.";
    cell.style.textAlign = "center";
    cell.style.padding = "1rem";
    return;
  }

  teachers.forEach((teacher) => {
    const row = tableBody.insertRow();
    row.dataset.docId = teacher._id || teacher.id;
    row.insertCell().textContent = teacher.name || "";
    row.insertCell().textContent = teacher.fatherName || "";
    row.insertCell().textContent = teacher.employeeId || "";
    row.insertCell().textContent = teacher.dob || "";
    row.insertCell().textContent = teacher.address || "";
    row.insertCell().textContent = teacher.phone || "";
    row.insertCell().textContent = teacher.email || "";
    row.insertCell().textContent =
      teacher.classXPercent !== undefined ? teacher.classXPercent : "";
    row.insertCell().textContent =
      teacher.classXIIPercent !== undefined ? teacher.classXIIPercent : "";
    row.insertCell().textContent = teacher.aadhar || "";
    row.insertCell().textContent = teacher.qualification || "";
    row.insertCell().textContent = teacher.department || "";
  });
};

// Populate the Employee ID dropdown
const populateEmployeeIdDropdown = (teachers) => {
  const selectElement = document.getElementById("employee-id-select");
  selectElement.innerHTML = '<option value="">-- Select ID --</option>';
  teachers.forEach((teacher) => {
    if (teacher.employeeId) {
      const option = document.createElement("option");
      option.value = teacher.employeeId;
      option.textContent = teacher.employeeId;
      selectElement.appendChild(option);
    }
  });
};

// Function to generate PDF for selected teacher
function generateTeacherPDF(teacher) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Add title
  doc.setFontSize(18);
  doc.text("Teacher Details", 105, 15, null, null, "center");

  // Reset font size
  doc.setFontSize(12);

  // Add teacher details
  let y = 30;
  const details = [
    `Name: ${teacher.name}`,
    `Father's Name: ${teacher.fatherName}`,
    `Employee ID: ${teacher.employeeId}`,
    `Date of Birth: ${teacher.dob}`,
    `Address: ${teacher.address}`,
    `Phone: ${teacher.phone}`,
    `Email: ${teacher.email}`,
    `Class X (%): ${teacher.classXPercent || ""}`,
    `Class XII (%): ${teacher.classXIIPercent || ""}`,
    `Aadhar Number: ${teacher.aadhar}`,
    `Qualification: ${teacher.qualification}`,
    `Department: ${teacher.department}`,
  ];

  details.forEach((line, index) => {
    doc.text(line, 20, y + index * 10);
  });

  // Add university logo (if available)
  const img = new Image();
  img.src = "university-logo.png"; // Replace with actual path
  img.onload = function () {
    doc.addImage(img, "PNG", 160, 10, 30, 30);
    doc.save(`Teacher_${teacher.employeeId}_Details.pdf`);
  };

  // Save the PDF
  doc.save(`Teacher_${teacher.employeeId}_Details.pdf`);
}

// Event Listeners for buttons
document.getElementById("search-btn").addEventListener("click", () => {
  const searchInput = document
    .getElementById("search-employee-id")
    .value.trim();
  const selectedId = document.getElementById("employee-id-select").value;

  let employeeIdToSearch = searchInput || selectedId;

  if (employeeIdToSearch) {
    const filteredTeachers = allTeachersData.filter(
      (teacher) => teacher.employeeId === employeeIdToSearch
    );
    populateTable(filteredTeachers);
    if (filteredTeachers.length === 0) {
      displayMessage(
        `No teacher found with Employee ID: ${employeeIdToSearch}`,
        true
      );
    } else {
      displayMessage(
        `Displaying teacher with Employee ID: ${employeeIdToSearch}`,
        false
      );
    }
  } else {
    populateTable(allTeachersData);
    displayMessage("Displaying all teachers.", false);
  }
});

document.getElementById("print-btn").addEventListener("click", () => {
  const tableBody = document.querySelector("#teacher-table tbody");
  const selectedRow = tableBody.querySelector("tr.selected");

  if (selectedRow) {
    // Get teacher data from selected row
    const teacher = {
      name: selectedRow.cells[0].textContent,
      fatherName: selectedRow.cells[1].textContent,
      employeeId: selectedRow.cells[2].textContent,
      dob: selectedRow.cells[3].textContent,
      address: selectedRow.cells[4].textContent,
      phone: selectedRow.cells[5].textContent,
      email: selectedRow.cells[6].textContent,
      classXPercent: selectedRow.cells[7].textContent,
      classXIIPercent: selectedRow.cells[8].textContent,
      aadhar: selectedRow.cells[9].textContent,
      qualification: selectedRow.cells[10].textContent,
      department: selectedRow.cells[11].textContent,
    };

    // Generate PDF
    generateTeacherPDF(teacher);
  } else {
    // If no teacher selected, print the whole page
    window.print();
  }
});

document.getElementById("add-btn").addEventListener("click", () => {
  window.location.href = "../NFI/NFI.html";
});

document.getElementById("update-btn").addEventListener("click", () => {
  const tableBody = document.querySelector("#teacher-table tbody");
  const selectedRow = tableBody.querySelector("tr.selected");

  if (selectedRow) {
    const docId = selectedRow.dataset.docId;
    window.location.href = `../UFD/UFD.html?id=${docId}`;
  } else {
    displayMessage("Please select a teacher from the table to update.", true);
  }
});

document
  .querySelector("#teacher-table tbody")
  .addEventListener("click", (event) => {
    const clickedRow = event.target.closest("tr");
    if (clickedRow) {
      document.querySelectorAll("#teacher-table tbody tr").forEach((row) => {
        row.classList.remove("selected");
      });
      clickedRow.classList.add("selected");
      displayMessage(
        `Selected Employee ID: ${clickedRow.cells[2].textContent}`,
        false
      );
    }
  });

document.getElementById("cancel-btn").addEventListener("click", () => {
  document.getElementById("search-employee-id").value = "";
  document.getElementById("employee-id-select").value = "";
  populateTable(allTeachersData);
  document.querySelectorAll("#teacher-table tbody tr").forEach((row) => {
    row.classList.remove("selected");
  });
  displayMessage("Operation cancelled. Displaying all teachers.", false);
});

fetchTeachers();
