// Function to display messages
const displayMessage = (message, isError = false) => {
  const messageDisplay = document.getElementById("message-display");
  messageDisplay.textContent = message;
  messageDisplay.style.color = isError ? "#f44336" : "#4CAF50";
};

// Populate Roll Number dropdown from backend
const populateRollNumbers = async () => {
  try {
    const response = await fetch(
      "https://university-management-backend-e0sy.onrender.com/api/students"
    );
    const students = await response.json();
    const rollNumberSelect = document.getElementById("roll-number");
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
    if (students.length === 0) {
      displayMessage(
        "No student Roll Numbers found. Please add students first.",
        true
      );
    }
  } catch (error) {
    displayMessage("Error loading Roll Numbers.", true);
  }
};

// Handle form submission
document
  .getElementById("apply-leave-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    const leaveData = {
      rollNo: formData.get("rollNo"),
      leaveDate: formData.get("leaveDate"),
      timeDuration: formData.get("timeDuration"),
    };

    // Basic validation
    if (!leaveData.rollNo || !leaveData.leaveDate || !leaveData.timeDuration) {
      displayMessage("Please fill in all required fields.", true);
      return;
    }

    try {
      const response = await fetch(
        "https://university-management-backend-e0sy.onrender.com/api/student-leave-applications",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(leaveData),
        }
      );
      const result = await response.json();
      if (response.ok) {
        displayMessage("Leave application submitted successfully!", false);
        form.reset();
        populateRollNumbers();
      } else {
        displayMessage(
          result.message || "Database not ready. Please try again.",
          true
        );
      }
    } catch (error) {
      displayMessage(
        "Error submitting leave application. Please try again.",
        true
      );
    }
  });

// Handle Cancel button click
document.getElementById("cancel-button").addEventListener("click", () => {
  document.getElementById("apply-leave-form").reset();
  displayMessage("Form cleared.", false);
});

// Initial population
populateRollNumbers();
