// // Function to display messages
// const displayMessage = (message, isError = false) => {
//   const messageDisplay = document.getElementById("message-display");
//   messageDisplay.textContent = message;
//   messageDisplay.style.color = isError ? "#f44336" : "#4CAF50";
// };

// let allStudentsData = [];

// // Fetch all students from backend
// const fetchStudents = async () => {
//   try {
//     const response = await fetch("http://localhost:3000/api/students");
//     allStudentsData = await response.json();
//     populateTable(allStudentsData);
//     populateRollNumberDropdown(allStudentsData);
//     displayMessage("Student data loaded successfully.", false);
//   } catch (error) {
//     displayMessage("Error loading student data.", true);
//   }
// };

// // Populate the table with student data
// const populateTable = (students) => {
//   const tableBody = document.querySelector("#student-table tbody");
//   tableBody.innerHTML = "";

//   if (students.length === 0) {
//     const row = tableBody.insertRow();
//     const cell = row.insertCell();
//     cell.colSpan = 12;
//     cell.textContent = "No student data available.";
//     cell.style.textAlign = "center";
//     cell.style.padding = "1rem";
//     return;
//   }

//   students.forEach((student) => {
//     const row = tableBody.insertRow();
//     row.dataset.docId = student._id || student.id;
//     row.insertCell().textContent = student.name || "";
//     row.insertCell().textContent = student.fatherName || "";
//     row.insertCell().textContent = student.rollNo || "";
//     row.insertCell().textContent = student.dob || "";
//     row.insertCell().textContent = student.address || "";
//     row.insertCell().textContent = student.phone || "";
//     row.insertCell().textContent = student.email || "";
//     row.insertCell().textContent = student.classXPercent || "";
//     row.insertCell().textContent = student.classXIIPercent || "";
//     row.insertCell().textContent = student.aadhar || "";
//     row.insertCell().textContent = student.course || "";
//     row.insertCell().textContent = student.branch || "";
//   });
// };

// // Populate the Roll Number dropdown
// const populateRollNumberDropdown = (students) => {
//   const selectElement = document.getElementById("roll-number-select");
//   selectElement.innerHTML = '<option value="">-- Select Roll No. --</option>';
//   students.forEach((student) => {
//     if (student.rollNo) {
//       const option = document.createElement("option");
//       option.value = student.rollNo;
//       option.textContent = student.rollNo;
//       selectElement.appendChild(option);
//     }
//   });
// };

// // Event Listeners for buttons
// document.getElementById("search-btn").addEventListener("click", () => {
//   const searchInput = document
//     .getElementById("search-roll-number")
//     .value.trim();
//   const selectedId = document.getElementById("roll-number-select").value;

//   let rollNoToSearch = searchInput || selectedId;

//   if (rollNoToSearch) {
//     const filteredStudents = allStudentsData.filter(
//       (student) => student.rollNo === rollNoToSearch
//     );
//     populateTable(filteredStudents);
//     if (filteredStudents.length === 0) {
//       displayMessage(
//         `No student found with Roll Number: ${rollNoToSearch}`,
//         true
//       );
//     } else {
//       displayMessage(
//         `Displaying student with Roll Number: ${rollNoToSearch}`,
//         false
//       );
//     }
//   } else {
//     populateTable(allStudentsData);
//     displayMessage("Displaying all students.", false);
//   }
// });

// document.getElementById("print-btn").addEventListener("click", () => {
//   window.print();
// });

// document.getElementById("add-btn").addEventListener("click", () => {
//   window.location.href = "../NSI/NSI.html";
// });

// document.getElementById("update-btn").addEventListener("click", () => {
//   const tableBody = document.querySelector("#student-table tbody");
//   const selectedRow = tableBody.querySelector("tr.selected");

//   if (selectedRow) {
//     const docId = selectedRow.dataset.docId;
//     // Redirect to update page with student ID
//     window.location.href = `../USD/USD.html?id=${docId}`;
//   } else {
//     displayMessage("Please select a student from the table to update.", true);
//   }
// });

// document
//   .querySelector("#student-table tbody")
//   .addEventListener("click", (event) => {
//     const clickedRow = event.target.closest("tr");
//     if (clickedRow) {
//       document.querySelectorAll("#student-table tbody tr").forEach((row) => {
//         row.classList.remove("selected");
//       });
//       clickedRow.classList.add("selected");
//       displayMessage(
//         `Selected Roll Number: ${clickedRow.cells[2].textContent}`,
//         false
//       );
//     }
//   });

// document.getElementById("cancel-btn").addEventListener("click", () => {
//   document.getElementById("search-roll-number").value = "";
//   document.getElementById("roll-number-select").value = "";
//   populateTable(allStudentsData);
//   document.querySelectorAll("#student-table tbody tr").forEach((row) => {
//     row.classList.remove("selected");
//   });
//   displayMessage("Operation cancelled. Displaying all students.", false);
// });

// // Initial population
// fetchStudents();

// Function to display messages
const displayMessage = (message, isError = false) => {
  const messageDisplay = document.getElementById("message-display");
  messageDisplay.textContent = message;
  messageDisplay.style.color = isError ? "#f44336" : "#4CAF50";
};

let allStudentsData = [];

// Fetch all students from backend
const fetchStudents = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/students");
    allStudentsData = await response.json();
    populateTable(allStudentsData);
    populateRollNumberDropdown(allStudentsData);
    displayMessage("Student data loaded successfully.", false);
  } catch (error) {
    displayMessage("Error loading student data.", true);
  }
};

// Populate the table with student data
const populateTable = (students) => {
  const tableBody = document.querySelector("#student-table tbody");
  tableBody.innerHTML = "";

  if (students.length === 0) {
    const row = tableBody.insertRow();
    const cell = row.insertCell();
    cell.colSpan = 12;
    cell.textContent = "No student data available.";
    cell.style.textAlign = "center";
    cell.style.padding = "1rem";
    return;
  }

  students.forEach((student) => {
    const row = tableBody.insertRow();
    row.dataset.docId = student._id || student.id;
    row.insertCell().textContent = student.name || "";
    row.insertCell().textContent = student.fatherName || "";
    row.insertCell().textContent = student.rollNo || "";
    row.insertCell().textContent = student.dob || "";
    row.insertCell().textContent = student.address || "";
    row.insertCell().textContent = student.phone || "";
    row.insertCell().textContent = student.email || "";
    row.insertCell().textContent = student.classXPercent || "";
    row.insertCell().textContent = student.classXIIPercent || "";
    row.insertCell().textContent = student.aadhar || "";
    row.insertCell().textContent = student.course || "";
    row.insertCell().textContent = student.branch || "";
  });
};

// Populate the Roll Number dropdown
const populateRollNumberDropdown = (students) => {
  const selectElement = document.getElementById("roll-number-select");
  selectElement.innerHTML = '<option value="">-- Select Roll No. --</option>';
  students.forEach((student) => {
    if (student.rollNo) {
      const option = document.createElement("option");
      option.value = student.rollNo;
      option.textContent = student.rollNo;
      selectElement.appendChild(option);
    }
  });
};

// Function to generate PDF for selected student
function generateStudentPDF(student) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(18);
  doc.text('Student Details', 105, 15, null, null, 'center');
  
  // Reset font size
  doc.setFontSize(12);
  
  // Add student details
  let y = 30;
  const details = [
    `Name: ${student.name}`,
    `Father's Name: ${student.fatherName}`,
    `Roll Number: ${student.rollNo}`,
    `Date of Birth: ${student.dob}`,
    `Address: ${student.address}`,
    `Phone: ${student.phone}`,
    `Email: ${student.email}`,
    `Class X (%): ${student.classXPercent || ''}`,
    `Class XII (%): ${student.classXIIPercent || ''}`,
    `Aadhar Number: ${student.aadhar}`,
    `Course: ${student.course}`,
    `Branch: ${student.branch}`
  ];
  
  details.forEach((line, index) => {
    doc.text(line, 20, y + (index * 10));
  });
  
  // Save the PDF
  doc.save(`Student_${student.rollNo}_Details.pdf`);
}

// Event Listeners for buttons
document.getElementById("search-btn").addEventListener("click", () => {
  const searchInput = document
    .getElementById("search-roll-number")
    .value.trim();
  const selectedId = document.getElementById("roll-number-select").value;

  let rollNoToSearch = searchInput || selectedId;

  if (rollNoToSearch) {
    const filteredStudents = allStudentsData.filter(
      (student) => student.rollNo === rollNoToSearch
    );
    populateTable(filteredStudents);
    if (filteredStudents.length === 0) {
      displayMessage(
        `No student found with Roll Number: ${rollNoToSearch}`,
        true
      );
    } else {
      displayMessage(
        `Displaying student with Roll Number: ${rollNoToSearch}`,
        false
      );
    }
  } else {
    populateTable(allStudentsData);
    displayMessage("Displaying all students.", false);
  }
});

document.getElementById("print-btn").addEventListener("click", () => {
  const tableBody = document.querySelector("#student-table tbody");
  const selectedRow = tableBody.querySelector("tr.selected");
  
  if (selectedRow) {
    // Get student data from selected row
    const student = {
      name: selectedRow.cells[0].textContent,
      fatherName: selectedRow.cells[1].textContent,
      rollNo: selectedRow.cells[2].textContent,
      dob: selectedRow.cells[3].textContent,
      address: selectedRow.cells[4].textContent,
      phone: selectedRow.cells[5].textContent,
      email: selectedRow.cells[6].textContent,
      classXPercent: selectedRow.cells[7].textContent,
      classXIIPercent: selectedRow.cells[8].textContent,
      aadhar: selectedRow.cells[9].textContent,
      course: selectedRow.cells[10].textContent,
      branch: selectedRow.cells[11].textContent
    };
    
    // Generate PDF
    generateStudentPDF(student);
  } else {
    // If no student selected, print the whole page
    window.print();
  }
});

document.getElementById("add-btn").addEventListener("click", () => {
  window.location.href = "../NSI/NSI.html";
});

document.getElementById("update-btn").addEventListener("click", () => {
  const tableBody = document.querySelector("#student-table tbody");
  const selectedRow = tableBody.querySelector("tr.selected");

  if (selectedRow) {
    const docId = selectedRow.dataset.docId;
    // Redirect to update page with student ID
    window.location.href = `../USD/USD.html?id=${docId}`;
  } else {
    displayMessage("Please select a student from the table to update.", true);
  }
});

document
  .querySelector("#student-table tbody")
  .addEventListener("click", (event) => {
    const clickedRow = event.target.closest("tr");
    if (clickedRow) {
      document.querySelectorAll("#student-table tbody tr").forEach((row) => {
        row.classList.remove("selected");
      });
      clickedRow.classList.add("selected");
      displayMessage(
        `Selected Roll Number: ${clickedRow.cells[2].textContent}`,
        false
      );
    }
  });

document.getElementById("cancel-btn").addEventListener("click", () => {
  document.getElementById("search-roll-number").value = "";
  document.getElementById("roll-number-select").value = "";
  populateTable(allStudentsData);
  document.querySelectorAll("#student-table tbody tr").forEach((row) => {
    row.classList.remove("selected");
  });
  displayMessage("Operation cancelled. Displaying all students.", false);
});

// Initial population
fetchStudents();