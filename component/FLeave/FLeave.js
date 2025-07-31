document.addEventListener("DOMContentLoaded", () => {
  const employeeIdSelect = document.getElementById("employee-id");
  const form = document.getElementById("apply-leave-form");
  const messageDisplay = document.getElementById("message-display");

  const API_BASE = "http://university-management-backend-e0sy.onrender.com";

  fetch(`${API_BASE}/api/teachers`)
    .then((res) => res.json())
    .then((teachers) => {
      teachers.forEach((teacher) => {
        const option = document.createElement("option");
        option.value = teacher.employeeId;
        option.textContent = `${teacher.employeeId} - ${teacher.name}`;
        employeeIdSelect.appendChild(option);
      });
    })
    .catch((err) => {
      messageDisplay.textContent = "Failed to load employee IDs.";
      messageDisplay.style.color = "red";
    });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    messageDisplay.textContent = "";

    const employeeId = employeeIdSelect.value;
    const leaveDate = document.getElementById("leave-date").value;
    const timeDuration = document.getElementById("time-duration").value;

    if (!employeeId || !leaveDate || !timeDuration) {
      messageDisplay.textContent = "All fields are required.";
      messageDisplay.style.color = "red";
      return;
    }

    fetch(`${API_BASE}/api/teachers/leave`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ employeeId, leaveDate, timeDuration }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.leaveApplication) {
          messageDisplay.textContent =
            "Leave application submitted successfully.";
          messageDisplay.style.color = "green";
          form.reset();
        } else {
          messageDisplay.textContent = data.message || "Submission failed.";
          messageDisplay.style.color = "red";
        }
      })
      .catch((err) => {
        messageDisplay.textContent = "Error submitting leave application.";
        messageDisplay.style.color = "red";
      });
  });
});
