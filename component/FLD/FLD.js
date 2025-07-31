
const displayMessage = (message, isError = false) => {
  const messageDisplay = document.getElementById("message-display");
  messageDisplay.textContent = message;
  messageDisplay.style.color = isError ? "#f44336" : "#4CAF50";
};

let allLeaveRecordsData = []; 


const populateEmployeeIds = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/teachers");
    const teachers = await response.json();
    const employeeIdSelect = document.getElementById("employee-id-select");
    employeeIdSelect.innerHTML =
      '<option value="">-- Select Employee ID --</option>';
    teachers.forEach((teacher) => {
      if (teacher.employeeId) {
        const option = document.createElement("option");
        option.value = teacher.employeeId;
        option.textContent = teacher.employeeId;
        employeeIdSelect.appendChild(option);
      }
    });
  } catch (error) {
    displayMessage("Error loading teacher IDs.", true);
  }
};

const fetchLeaveRecords = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/teachers/leave");
    allLeaveRecordsData = await response.json();
    populateTable(allLeaveRecordsData);
    displayMessage("Teacher leave records loaded successfully.", false);
  } catch (error) {
    displayMessage("Error loading leave records.", true);
  }
};

const populateTable = (records) => {
  const tableBody = document.querySelector("#leave-records-table tbody");
  tableBody.innerHTML = "";

  if (records.length === 0) {
    const row = tableBody.insertRow();
    const cell = row.insertCell();
    cell.colSpan = 5;
    cell.textContent = "No leave records found.";
    cell.style.textAlign = "center";
    cell.style.padding = "1rem";
    return;
  }

  records.forEach((record) => {
    const row = tableBody.insertRow();
    row.insertCell().textContent = record.employeeId || "";
    row.insertCell().textContent = record.leaveDate || "";
    row.insertCell().textContent = record.timeDuration || "";
    row.insertCell().textContent = record.applicationDate
      ? new Date(record.applicationDate).toLocaleDateString()
      : "";
    row.insertCell().textContent = record.status || "";
  });
};

function generateLeaveRecordsPDF(records, employeeId = null) {
  if (typeof window.jspdf === 'undefined') {
    displayMessage("PDF library not loaded. Please try again later.", true);
    return;
  }
  
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  
  const title = employeeId 
    ? `Leave Records for Employee ID: ${employeeId}`
    : "All Teacher Leave Records";
  
  const pageWidth = doc.internal.pageSize.getWidth();
  const textWidth = doc.getStringUnitWidth(title) * doc.internal.getFontSize() / doc.internal.scaleFactor;
  const titleX = (pageWidth - textWidth) / 2;
  
  doc.text(title, titleX, 15);
  
  const tableData = records.map(record => [
    record.employeeId || "",
    record.leaveDate ? record.leaveDate.split('T')[0] : "",
    record.timeDuration || "",
    record.applicationDate 
      ? new Date(record.applicationDate).toLocaleDateString() 
      : "",
    record.status || ""
  ]);
  
  doc.autoTable({
    startY: 25,
    head: [["Employee ID", "Date", "Duration", "Application Date", "Status"]],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    styles: {
      fontSize: 10,
      cellPadding: 3
    },
    columnStyles: {
      0: {cellWidth: 30},
      1: {cellWidth: 25},
      2: {cellWidth: 30},
      3: {cellWidth: 35},
      4: {cellWidth: 25}
    }
  });
  
  const fileName = employeeId 
    ? `Leave_Records_${employeeId}.pdf` 
    : "All_Leave_Records.pdf";
    
  doc.save(fileName);
}

document.getElementById("search-btn").addEventListener("click", () => {
  const selectedEmployeeId =
    document.getElementById("employee-id-select").value;
  if (selectedEmployeeId) {
    const filteredRecords = allLeaveRecordsData.filter(
      (record) => record.employeeId === selectedEmployeeId
    );
    populateTable(filteredRecords);
    if (filteredRecords.length === 0) {
      displayMessage(
        `No leave records found for Employee ID: ${selectedEmployeeId}`,
        true
      );
    } else {
      displayMessage(
        `Displaying leave records for Employee ID: ${selectedEmployeeId}`,
        false
      );
    }
  } else {
    populateTable(allLeaveRecordsData);
    displayMessage("Displaying all teacher leave records.", false);
  }
});

document.getElementById("print-btn").addEventListener("click", () => {
  const selectedEmployeeId =
    document.getElementById("employee-id-select").value;

  if (selectedEmployeeId) {
    const filteredRecords = allLeaveRecordsData.filter(
      (record) => record.employeeId === selectedEmployeeId
    );

    if (filteredRecords.length > 0) {
      generateLeaveRecordsPDF(filteredRecords, selectedEmployeeId);
    } else {
      displayMessage("No leave records to generate PDF.", true);
    }
  } else {
    generateLeaveRecordsPDF(allLeaveRecordsData);
  }
});

document.getElementById("cancel-btn").addEventListener("click", () => {
  document.getElementById("employee-id-select").value = "";
  populateTable(allLeaveRecordsData);
  displayMessage(
    "Operation cancelled. Displaying all teacher leave records.",
    false
  );
});

populateEmployeeIds();
fetchLeaveRecords();
