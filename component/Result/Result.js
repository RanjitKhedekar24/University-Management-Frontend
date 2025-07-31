const displayMessage = (message, isError = false) => {
  const messageDisplay = document.getElementById("message-display");
  messageDisplay.textContent = message;
  messageDisplay.style.color = isError ? "#f44336" : "#4CAF50";
};

let allResultsData = []; // Store all fetched results
let studentNamesMap = new Map(); // Map rollNo to student name

// Fetch student names and map them by roll number
const fetchStudentNames = async () => {
  try {
    const response = await fetch(
      "http://university-management-backend-e0sy.onrender.com/api/students"
    );
    const students = await response.json();
    studentNamesMap.clear();
    students.forEach((student) => {
      if (student.rollNo && student.name) {
        studentNamesMap.set(student.rollNo, student.name);
      }
    });
  } catch (error) {
    displayMessage("Error loading student names.", true);
  }
};

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

// Fetch student results from backend
const fetchResults = async () => {
  try {
    const response = await fetch(
      "http://university-management-backend-e0sy.onrender.com/api/results"
    );
    allResultsData = await response.json();
    populateTable(allResultsData);
    displayMessage("Student results loaded successfully.", false);
  } catch (error) {
    displayMessage("Error loading student results.", true);
  }
};

// Populate the table with student results
const populateTable = (records) => {
  const tableBody = document.querySelector("#results-table tbody");
  tableBody.innerHTML = "";

  if (records.length === 0) {
    const row = tableBody.insertRow();
    const cell = row.insertCell();
    cell.colSpan = 6;
    cell.textContent = "No results found.";
    cell.style.textAlign = "center";
    cell.style.padding = "1rem";
    return;
  }

  records.forEach((record) => {
    if (record.subjects && Array.isArray(record.subjects)) {
      const studentName = studentNamesMap.get(record.rollNo) || "N/A";
      record.subjects.forEach((subjectEntry) => {
        const row = tableBody.insertRow();
        row.insertCell().textContent = record.rollNo || "";
        row.insertCell().textContent = studentName;
        row.insertCell().textContent = record.semester || "";
        row.insertCell().textContent = record.course || "";
        row.insertCell().textContent = subjectEntry.subject || "";
        row.insertCell().textContent = subjectEntry.marks || "";
      });
    }
  });
};

// Function to generate PDF for results
function generateResultsPDF(records, rollNumber = null) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Add title
  doc.setFontSize(18);
  const title = rollNumber
    ? `Results for Roll Number: ${rollNumber}`
    : "All Student Results";

  doc.text(title, 105, 15, null, null, "center");

  // Prepare data for table
  const tableData = [];

  records.forEach((record) => {
    if (record.subjects && Array.isArray(record.subjects)) {
      const studentName = studentNamesMap.get(record.rollNo) || "N/A";
      record.subjects.forEach((subjectEntry) => {
        tableData.push([
          record.rollNo || "",
          studentName,
          record.semester || "",
          record.course || "",
          subjectEntry.subject || "",
          subjectEntry.marks || "",
        ]);
      });
    }
  });

  // Create table
  doc.autoTable({
    head: [["Roll No.", "Name", "Semester", "Course", "Subject", "Marks"]],
    body: tableData,
    startY: 25,
    theme: "grid",
    styles: { fontSize: 10 },
    headStyles: { fillColor: [41, 128, 185] },
    didDrawPage: (data) => {
      // Add footer with page numbers
      const pageCount = doc.internal.getNumberOfPages();
      const currentPage = data.pageNumber;
      doc.setFontSize(10);
      doc.text(
        `Page ${currentPage} of ${pageCount}`,
        data.settings.margin.left,
        doc.internal.pageSize.height - 10
      );
    },
  });

  // Save the PDF
  const fileName = rollNumber
    ? `Results_${rollNumber}.pdf`
    : "All_Student_Results.pdf";

  doc.save(fileName);
}

// Event Listeners for buttons
document.getElementById("search-btn").addEventListener("click", () => {
  const selectedRollNumber =
    document.getElementById("roll-number-select").value;
  let filteredRecords = allResultsData;
  if (selectedRollNumber) {
    filteredRecords = filteredRecords.filter(
      (record) => record.rollNo === selectedRollNumber
    );
  }
  populateTable(filteredRecords);
  if (filteredRecords.length === 0) {
    displayMessage(
      `No results found for Roll Number: ${selectedRollNumber}`,
      true
    );
  } else {
    displayMessage(
      selectedRollNumber
        ? `Displaying results for Roll Number: ${selectedRollNumber}`
        : "Displaying all student results.",
      false
    );
  }
});

document.getElementById("print-btn").addEventListener("click", () => {
  const selectedRollNumber =
    document.getElementById("roll-number-select").value;
  let recordsToExport = allResultsData;

  if (selectedRollNumber) {
    recordsToExport = recordsToExport.filter(
      (record) => record.rollNo === selectedRollNumber
    );
  }

  if (recordsToExport.length > 0) {
    generateResultsPDF(recordsToExport, selectedRollNumber);
  } else {
    displayMessage("No results to generate PDF.", true);
  }
});

document.getElementById("back-btn").addEventListener("click", () => {
  window.history.back();
});

// Initial population
(async () => {
  await fetchStudentNames();
  await populateRollNumbers();
  await fetchResults();
})();
