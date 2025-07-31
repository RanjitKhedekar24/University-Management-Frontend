const displayMessage = (message, isError = false) => {
  const messageDisplay = document.getElementById("message-display");
  messageDisplay.textContent = message;
  messageDisplay.style.color = isError ? "#f44336" : "#4CAF50";
};

const populateTable = (feeData) => {
  const tableBody = document.querySelector("#fee-structure-table tbody");
  tableBody.innerHTML = "";

  if (!feeData || feeData.length === 0) {
    const row = tableBody.insertRow();
    const cell = row.insertCell();
    cell.colSpan = 9;
    cell.textContent = "No fee structure data available. Add some data.";
    cell.style.textAlign = "center";
    cell.style.padding = "1rem";
    return;
  }

  feeData.forEach((entry) => {
    const row = tableBody.insertRow();
    row.insertCell().textContent = entry.course || "";
    for (let sem = 1; sem <= 8; sem++) {
      const feeObj = entry.fees.find((f) => f.semester === sem);
      row.insertCell().textContent = feeObj ? feeObj.amount : "";
    }
  });
};

const fetchFeeStructure = async () => {
  try {
    const response = await fetch(
      "http://university-management-backend-e0sy.onrender.com/api/fees"
    );
    const feeData = await response.json();
    populateTable(feeData);
    displayMessage("Fee structure loaded successfully.", false);
  } catch (error) {
    displayMessage("Error loading fee structure data.", true);
  }
};

fetchFeeStructure();
