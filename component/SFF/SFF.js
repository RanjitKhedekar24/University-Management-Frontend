// Function to display messages
const displayMessage = (message, isError = false) => {
  const messageDisplay = document.getElementById("message-display");
  messageDisplay.textContent = message;
  messageDisplay.style.color = isError ? "#f44336" : "#4CAF50";

  // Add animation for payment success
  if (!isError) {
    messageDisplay.classList.add("payment-success");
    setTimeout(() => {
      messageDisplay.classList.remove("payment-success");
    }, 2000);
  }
};

// Helper function to find matching dropdown option
const findMatchingOption = (selectElement, value) => {
  if (!value) return null;

  // Normalize both values for comparison
  const cleanValue = value.trim().toLowerCase();
  const options = Array.from(selectElement.options);

  // Find matching option
  const match = options.find(
    (option) => option.value.trim().toLowerCase() === cleanValue
  );

  return match ? match.value : null;
};

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

// Function to populate branch dropdown
const populateBranchDropdown = (course) => {
  const branchSelect = document.getElementById("branch");
  branchSelect.innerHTML = '<option value="">-- Select Branch --</option>';

  if (course && branchesByCourse[course]) {
    branchesByCourse[course].forEach((branch) => {
      const option = document.createElement("option");
      option.value = branch;
      option.textContent = branch;
      branchSelect.appendChild(option);
    });
  }
};

let allStudentsData = []; // Cache all student data
let feeStructureData = {}; // Cache fee structure data (course -> {semesterN: amount})

// Fetch all students and populate the dropdown
const fetchStudentsForDropdown = async () => {
  const rollNumberSelect = document.getElementById("roll-number-select");
  try {
    const response = await fetch(
      "https://university-management-backend-e0sy.onrender.com/api/students"
    );
    const students = await response.json();
    allStudentsData = students;
    rollNumberSelect.innerHTML =
      '<option value="">-- Select Roll No --</option>';
    students.forEach((student) => {
      if (student.rollNo && student.rollNo.trim() !== "") {
        const option = document.createElement("option");
        option.value = student.rollNo;
        option.textContent = student.rollNo;
        rollNumberSelect.appendChild(option);
      }
    });
    if (students.length === 0) {
      displayMessage("No students found. Please add students first.", true);
    }
  } catch (error) {
    displayMessage("Error loading student Roll Numbers.", true);
  }
};

// Fetch fee structure data and build lookup
const fetchFeeStructureData = async () => {
  try {
    const response = await fetch(
      "https://university-management-backend-e0sy.onrender.com/api/fees"
    );
    const fees = await response.json();
    // Build a lookup: feeStructureData[course][semesterN] = amount
    feeStructureData = {};
    fees.forEach((fee) => {
      if (fee.course && Array.isArray(fee.fees)) {
        feeStructureData[fee.course] = {};
        fee.fees.forEach((semFee) => {
          feeStructureData[fee.course][`semester${semFee.semester}`] =
            semFee.amount;
        });
      }
    });
  } catch (error) {
    displayMessage("Error loading fee structure data.", true);
  }
};

// Fill student details based on selected Roll Number
const fillStudentDetails = (rollNo) => {
  const selectedStudent = allStudentsData.find(
    (student) => student.rollNo === rollNo
  );

  if (selectedStudent) {
    document.getElementById("student-name").textContent =
      selectedStudent.name || "";
    document.getElementById("father-name").textContent =
      selectedStudent.fatherName || "";

    // Get dropdown elements
    const courseSelect = document.getElementById("course");
    const branchSelect = document.getElementById("branch");

    // Find matching course
    const matchedCourse = findMatchingOption(
      courseSelect,
      selectedStudent.course
    );
    courseSelect.value = matchedCourse || "";

    // Populate branches based on course
    populateBranchDropdown(matchedCourse);

    // Find matching branch
    const matchedBranch = findMatchingOption(
      branchSelect,
      selectedStudent.branch
    );
    branchSelect.value = matchedBranch || "";

    // Reset semester and fee
    document.getElementById("semester").value = "";
    document.getElementById("total-payable").textContent = "0";

    // Calculate fee if semester already selected
    const semester = document.getElementById("semester").value;
    if (semester) {
      calculateTotalPayable();
    }

    // Show warnings if no match found
    if (selectedStudent.course && !matchedCourse) {
      displayMessage(
        `Course "${selectedStudent.course}" not found in options`,
        true
      );
    }

    if (selectedStudent.branch && !matchedBranch) {
      displayMessage(
        `Branch "${selectedStudent.branch}" not found in options`,
        true
      );
    }
  } else {
    // Clear fields if student not found
    document.getElementById("student-name").textContent = "";
    document.getElementById("father-name").textContent = "";
    document.getElementById("course").value = "";
    populateBranchDropdown("");
    document.getElementById("semester").value = "";
    document.getElementById("total-payable").textContent = "0";
    displayMessage("Student details not found.", true);
  }
};

// Calculate and display total payable fee
const calculateTotalPayable = () => {
  const course = document.getElementById("course").value;
  const semester = document.getElementById("semester").value;
  const totalPayableDisplay = document.getElementById("total-payable");

  if (course && semester && feeStructureData[course]) {
    const fee = feeStructureData[course][semester];
    if (fee) {
      totalPayableDisplay.textContent = fee;
      displayMessage(`Fee for ${course}, ${semester}: ₹${fee}`, false);
    } else {
      totalPayableDisplay.textContent = "N/A";
      displayMessage("Fee not found for selected course and semester.", true);
    }
  } else {
    totalPayableDisplay.textContent = "0";
    if (!course || !semester) {
      displayMessage("Select course and semester to calculate fee.", false);
    } else {
      displayMessage("Fee structure not available for this course.", true);
    }
  }
};

// Event listener for Roll Number selection
document
  .getElementById("roll-number-select")
  .addEventListener("change", (event) => {
    const selectedRollNo = event.target.value;
    if (selectedRollNo) {
      fillStudentDetails(selectedRollNo);
    } else {
      document.getElementById("student-name").textContent = "";
      document.getElementById("father-name").textContent = "";
      document.getElementById("course").value = "";
      populateBranchDropdown("");
      document.getElementById("semester").value = "";
      document.getElementById("total-payable").textContent = "0";
      displayMessage("Select a Roll Number to view details.", false);
    }
  });

// AUTOMATICALLY CALCULATE FEE WHEN COURSE OR SEMESTER CHANGES
document.getElementById("course").addEventListener("change", function () {
  populateBranchDropdown(this.value);
  calculateTotalPayable();
});
document
  .getElementById("semester")
  .addEventListener("change", calculateTotalPayable);

// Remove update button since it's no longer needed
document.getElementById("update-button").remove();

document
  .getElementById("fee-payment-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const rollNo = document.getElementById("roll-number-select").value;
    const course = document.getElementById("course").value;
    const branch = document.getElementById("branch").value;
    const semester = document.getElementById("semester").value;
    const totalPayable = document.getElementById("total-payable").textContent;
    const name = document.getElementById("student-name").textContent;
    const fatherName = document.getElementById("father-name").textContent;

    if (
      !rollNo ||
      !course ||
      !branch ||
      !semester ||
      totalPayable === "0" ||
      totalPayable === "N/A"
    ) {
      displayMessage(
        "Please select all details and ensure a valid fee is displayed.",
        true
      );
      return;
    }

    const paymentData = {
      rollNo: rollNo,
      name: name,
      fatherName: fatherName,
      course: course,
      branch: branch,
      semester: semester,
      totalPayable: Number(totalPayable),
    };

    try {
      const response = await fetch(
        "https://university-management-backend-e0sy.onrender.com/api/student-fees",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(paymentData),
        }
      );
      const result = await response.json();
      if (response.ok) {
        displayMessage("✅ Fee payment recorded successfully!", false);

        // Add success animation to the message
        const messageDisplay = document.getElementById("message-display");
        messageDisplay.classList.add("payment-success");

        setTimeout(() => {
          document.getElementById("fee-payment-form").reset();
          document.getElementById("student-name").textContent = "";
          document.getElementById("father-name").textContent = "";
          document.getElementById("total-payable").textContent = "0";
          populateBranchDropdown("");
          messageDisplay.classList.remove("payment-success");
        }, 3000);

        fetchStudentsForDropdown();
      } else {
        displayMessage(
          result.message || "Database not ready. Please try again.",
          true
        );
      }
    } catch (error) {
      displayMessage("Error recording fee payment. Please try again.", true);
    }
  });

document.getElementById("back-button").addEventListener("click", () => {
  window.history.back();
});

// Initial population
(async () => {
  await fetchStudentsForDropdown();
  await fetchFeeStructureData();

  // Initialize branch dropdown with current course value
  const initialCourse = document.getElementById("course").value;
  populateBranchDropdown(initialCourse);

  displayMessage(
    "Fee data loaded successfully. Select a student to begin.",
    false
  );
})();
