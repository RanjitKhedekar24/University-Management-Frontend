const branchesByCourse = {
  "B.Tech": [
    "Computer Science",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
    "Electronics Engineering"
  ],
  "M.Tech": [
    "Computer Science",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
    "Electronics Engineering"
  ],
  "B.Sc.": ["Physics", "Chemistry", "Computer Science"],
  "M.Sc.": ["Physics", "Chemistry", "Computer Science"],
  "B.A.": ["History", "Literature"],
  "M.A.": ["History", "Literature"]
};

const populateBranchDropdown = (course) => {
  const branchSelect = document.getElementById("branch");
  branchSelect.innerHTML = '<option value="">-- Select Branch --</option>';
  
  if (course && branchesByCourse[course]) {
    branchesByCourse[course].forEach(branch => {
      const option = document.createElement("option");
      option.value = branch;
      option.textContent = branch;
      branchSelect.appendChild(option);
    });
  }
};

const displayMessage = (message, isError = false) => {
  const messageDisplay = document.getElementById("message-display");
  messageDisplay.textContent = message;
  messageDisplay.style.color = isError ? "#f44336" : "#4CAF50";
  messageDisplay.style.padding = "10px";
  messageDisplay.style.borderRadius = "4px";
  messageDisplay.style.marginTop = "10px";
  messageDisplay.style.textAlign = "center";
};

const generateRollNumber = () => {
  const prefix = "STU";
  const timestamp = new Date().getTime().toString().slice(-5);
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${timestamp}-${random}`;
};

document.addEventListener("DOMContentLoaded", () => {
  const rollNumberInput = document.getElementById("roll-number");
  rollNumberInput.value = generateRollNumber();
  
  const initialCourse = document.getElementById("course").value;
  populateBranchDropdown(initialCourse);
  
  document.getElementById("course").addEventListener("change", function() {
    populateBranchDropdown(this.value);
  });
  
  document.getElementById("student-registration-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const formData = {
      name: document.getElementById("name").value,
      fatherName: document.getElementById("father-name").value,
      rollNo: document.getElementById("roll-number").value,
      dob: document.getElementById("dob").value,
      address: document.getElementById("address").value,
      phone: document.getElementById("phone").value,
      email: document.getElementById("email").value,
      classXPercent: document.getElementById("class-x").value,
      classXIIPercent: document.getElementById("class-xii").value,
      aadhar: document.getElementById("aadhar").value,
      course: document.getElementById("course").value,
      branch: document.getElementById("branch").value
    };
    
    try {
      const response = await fetch("http://localhost:3000/api/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        displayMessage("✅ Student registered successfully!", false);
        document.getElementById("student-registration-form").reset();
        document.getElementById("roll-number").value = generateRollNumber();
        
        const initialCourse = document.getElementById("course").value;
        populateBranchDropdown(initialCourse);
      } else {
        const errorData = await response.json();
        displayMessage(errorData.message || "Registration failed. Please try again.", true);
      }
    } catch (error) {
      displayMessage("Error registering student. Please try again.", true);
    }
  });
  
  document.getElementById("cancel-button").addEventListener("click", () => {
    window.history.back();
  });
});