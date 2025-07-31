// // Function to display messages
// const displayMessage = (message, isError = false) => {
//   const messageDisplay = document.getElementById("message-display");
//   messageDisplay.textContent = message;
//   messageDisplay.style.color = isError ? "#f44336" : "#4CAF50";
// };

// let allStudentLeaveData = []; // Store all fetched student leave records

// // Populate Roll Number dropdown from backend
// const populateRollNumbers = async () => {
//   try {
//     const response = await fetch("http://university-management-backend-e0sy.onrender.com/api/students");
//     const students = await response.json();
//     const rollNumberSelect = document.getElementById("roll-number-select");
//     rollNumberSelect.innerHTML =
//       '<option value="">-- Select Roll Number --</option>';
//     students.forEach((student) => {
//       if (student.rollNo) {
//         const option = document.createElement("option");
//         option.value = student.rollNo;
//         option.textContent = student.rollNo;
//         rollNumberSelect.appendChild(option);
//       }
//     });
//   } catch (error) {
//     displayMessage("Error loading Roll Numbers.", true);
//   }
// };

// // Fetch student leave records from backend
// const fetchStudentLeaveRecords = async () => {
//   try {
//     const response = await fetch(
//       "http://university-management-backend-e0sy.onrender.com/api/student-leave-applications"
//     );
//     allStudentLeaveData = await response.json();
//     populateTable(allStudentLeaveData);
//     displayMessage("Student leave records loaded successfully.", false);
//   } catch (error) {
//     displayMessage("Error loading student leave records.", true);
//   }
// };

// // Populate the table with student leave records
// const populateTable = (records) => {
//   const tableBody = document.querySelector("#leave-details-table tbody");
//   tableBody.innerHTML = "";

//   if (records.length === 0) {
//     const row = tableBody.insertRow();
//     const cell = row.insertCell();
//     cell.colSpan = 5;
//     cell.textContent = "No student leave records found.";
//     cell.style.textAlign = "center";
//     cell.style.padding = "1rem";
//     return;
//   }

//   records.forEach((record) => {
//     const row = tableBody.insertRow();
//     row.insertCell().textContent = record.rollNo || "";
//     row.insertCell().textContent = record.leaveDate
//       ? new Date(record.leaveDate).toLocaleDateString()
//       : "";
//     row.insertCell().textContent = record.timeDuration || "";
//     row.insertCell().textContent = record.applicationDate
//       ? new Date(record.applicationDate).toLocaleDateString()
//       : "";
//     row.insertCell().textContent = record.status || "";
//   });
// };

// // Event Listeners for buttons
// // Search by roll number
// // (Assumes there is a select with id 'roll-number-select' and a button with id 'search-btn')
// document.getElementById("search-btn").addEventListener("click", () => {
//   const selectedRollNumber =
//     document.getElementById("roll-number-select").value;
//   if (selectedRollNumber) {
//     const filteredRecords = allStudentLeaveData.filter(
//       (record) => record.rollNo === selectedRollNumber
//     );
//     populateTable(filteredRecords);
//     if (filteredRecords.length === 0) {
//       displayMessage(
//         `No leave records found for Roll Number: ${selectedRollNumber}`,
//         true
//       );
//     } else {
//       displayMessage(
//         `Displaying leave records for Roll Number: ${selectedRollNumber}`,
//         false
//       );
//     }
//   } else {
//     populateTable(allStudentLeaveData);
//     displayMessage("Displaying all student leave records.", false);
//   }
// });

// document.getElementById("print-btn").addEventListener("click", () => {
//   window.print();
// });

// document.getElementById("cancel-btn").addEventListener("click", () => {
//   document.getElementById("roll-number-select").value = "";
//   populateTable(allStudentLeaveData);
//   displayMessage(
//     "Operation cancelled. Displaying all student leave records.",
//     false
//   );
// });

// // Initial population
// (async () => {
//   await populateRollNumbers();
//   await fetchStudentLeaveRecords();
// })();

// Function to display messages
const displayMessage = (message, isError = false) => {
  const messageDisplay = document.getElementById("message-display");
  messageDisplay.textContent = message;
  messageDisplay.style.color = isError ? "#f44336" : "#4CAF50";
};

let allStudentLeaveData = []; // Store all fetched student leave records

// Populate Roll Number dropdown from backend
const populateRollNumbers = async () => {
  try {
    const response = await fetch(
      "http://university-management-backend-e0sy.onrender.com/api/students"
    );
    const students = await response.json();
    const rollNumberSelect = document.getElementById("roll-number-select");
    rollNumberSelect.innerHTML =
      '<option value="">-- Select Roll Number --</option>';
    students.forEach((student) => {
      if (student.rollNo) {
        const option = document.createElement("option");
        option.value = student.rollNo;
        option.textContent = student.rollNo;
        rollNumberSelect.appendChild(option);
      }
    });
  } catch (error) {
    displayMessage("Error loading Roll Numbers.", true);
  }
};

// Fetch student leave records from backend
const fetchStudentLeaveRecords = async () => {
  try {
    const response = await fetch(
      "http://university-management-backend-e0sy.onrender.com/api/student-leave-applications"
    );
    allStudentLeaveData = await response.json();
    populateTable(allStudentLeaveData);
    displayMessage("Student leave records loaded successfully.", false);
  } catch (error) {
    displayMessage("Error loading student leave records.", true);
  }
};

// Populate the table with student leave records
const populateTable = (records) => {
  const tableBody = document.querySelector("#leave-details-table tbody");
  tableBody.innerHTML = "";

  if (records.length === 0) {
    const row = tableBody.insertRow();
    const cell = row.insertCell();
    cell.colSpan = 5;
    cell.textContent = "No student leave records found.";
    cell.style.textAlign = "center";
    cell.style.padding = "1rem";
    return;
  }

  records.forEach((record) => {
    const row = tableBody.insertRow();
    row.insertCell().textContent = record.rollNo || "";
    row.insertCell().textContent = record.leaveDate
      ? new Date(record.leaveDate).toLocaleDateString()
      : "";
    row.insertCell().textContent = record.timeDuration || "";
    row.insertCell().textContent = record.applicationDate
      ? new Date(record.applicationDate).toLocaleDateString()
      : "";
    row.insertCell().textContent = record.status || "";
  });
};

// Function to generate PDF for student leave records
function generateLeaveRecordsPDF(records, rollNumber = null) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Add title
  doc.setFontSize(18);
  const title = rollNumber
    ? `Leave Records for Roll Number: ${rollNumber}`
    : "All Student Leave Records";

  doc.text(title, 105, 15, null, null, "center");

  // Prepare data for table
  const tableData = records.map((record) => [
    record.rollNo || "",
    record.leaveDate ? new Date(record.leaveDate).toLocaleDateString() : "",
    record.timeDuration || "",
    record.applicationDate
      ? new Date(record.applicationDate).toLocaleDateString()
      : "",
    record.status || "",
  ]);

  // Create table
  doc.autoTable({
    head: [
      ["Roll Number", "Leave Date", "Duration", "Application Date", "Status"],
    ],
    body: tableData,
    startY: 25,
    theme: "grid",
    styles: { fontSize: 10 },
    headStyles: { fillColor: [41, 128, 185] },
  });

  // Save the PDF
  const fileName = rollNumber
    ? `Leave_Records_${rollNumber}.pdf`
    : "All_Student_Leave_Records.pdf";

  doc.save(fileName);
}

// Event Listeners for buttons
document.getElementById("search-btn").addEventListener("click", () => {
  const selectedRollNumber =
    document.getElementById("roll-number-select").value;
  if (selectedRollNumber) {
    const filteredRecords = allStudentLeaveData.filter(
      (record) => record.rollNo === selectedRollNumber
    );
    populateTable(filteredRecords);
    if (filteredRecords.length === 0) {
      displayMessage(
        `No leave records found for Roll Number: ${selectedRollNumber}`,
        true
      );
    } else {
      displayMessage(
        `Displaying leave records for Roll Number: ${selectedRollNumber}`,
        false
      );
    }
  } else {
    populateTable(allStudentLeaveData);
    displayMessage("Displaying all student leave records.", false);
  }
});

document.getElementById("print-btn").addEventListener("click", () => {
  const selectedRollNumber =
    document.getElementById("roll-number-select").value;

  if (selectedRollNumber) {
    // Generate PDF for selected roll number
    const filteredRecords = allStudentLeaveData.filter(
      (record) => record.rollNo === selectedRollNumber
    );

    if (filteredRecords.length > 0) {
      generateLeaveRecordsPDF(filteredRecords, selectedRollNumber);
    } else {
      displayMessage("No leave records to generate PDF.", true);
    }
  } else {
    // Generate PDF for all records
    generateLeaveRecordsPDF(allStudentLeaveData);
  }
});

document.getElementById("cancel-btn").addEventListener("click", () => {
  document.getElementById("roll-number-select").value = "";
  populateTable(allStudentLeaveData);
  displayMessage(
    "Operation cancelled. Displaying all student leave records.",
    false
  );
});

// Initial population
(async () => {
  await populateRollNumbers();
  await fetchStudentLeaveRecords();
})();
