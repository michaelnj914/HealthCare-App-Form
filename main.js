// =============================
// 📅 AUTO DATE
// =============================
document.querySelector(".date").textContent = new Date().toLocaleDateString();

// =============================
// 📦 STORAGE KEY
// =============================
const STORAGE_KEY = "applications";

// =============================
// 📥 SAVE FORM DATA
// =============================
document
  .getElementById("applicationForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    let data = {};

    formData.forEach((value, key) => {
      // handle multiple checkboxes
      if (data[key]) {
        if (!Array.isArray(data[key])) {
          data[key] = [data[key]];
        }
        data[key].push(value);
      } else {
        data[key] = value;
      }
    });

    // calculate age
    if (data.birthDate) {
      const birth = new Date(data.birthDate);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      data.age = age;
    }

    data.dateApplied = new Date().toLocaleString();

    // save to localStorage
    let applications = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    applications.push(data);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));

    alert("Application submitted successfully!");
    this.reset();
  });

// =============================
// 🔐 LOGIN SYSTEM
// =============================
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "1234";

function showAdmin() {
  document.getElementById("loginSection").classList.remove("hidden");
}

function login() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;

  if (user === ADMIN_USERNAME && pass === ADMIN_PASSWORD) {
    document.getElementById("loginSection").classList.add("hidden");
    document.getElementById("adminSection").classList.remove("hidden");

    renderTable();
  } else {
    alert("Invalid login!");
  }
}

function logout() {
  document.getElementById("adminSection").classList.add("hidden");
}

// =============================
// 📊 RENDER TABLE
// =============================
function renderTable() {
  const tbody = document.getElementById("tableBody");
  const search = document.getElementById("search").value.toLowerCase();
  const filterJob = document.getElementById("filterJob").value.toLowerCase();

  let applications = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

  tbody.innerHTML = "";

  applications.forEach((app, index) => {
    const fullName =
      `${app.firstName || ""} ${app.lastName || ""}`.toLowerCase();
    const job = (app.jobCategory || "").toLowerCase();

    // filters
    if (fullName.includes(search) && job.includes(filterJob)) {
      let row = `
        <tr onclick="viewApplication(${index})" style="cursor:pointer">
          <td>${app.dateApplied || ""}</td>
          <td>${app.firstName || ""} ${app.lastName || ""}</td>
          <td>${app.age || ""}</td>
          <td>${app.jobCategory || ""}</td>
        </tr>
      `;

      tbody.innerHTML += row;
    }
  });
}

// =============================
// 👁️ VIEW / PRINT APPLICATION
// =============================
function viewApplication(index) {
  let applications = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  const app = applications[index];

  let newWindow = window.open("", "_blank");

  newWindow.document.write(`
    <html>
    <head>
      <title>Application Details</title>
      <style>
        body { font-family: Arial; padding: 20px; }
        h2 { text-align: center; }
        .section { margin-bottom: 20px; }
        .label { font-weight: bold; }
      </style>
    </head>
    <body>

      <h2>Application Details</h2>

      <div class="section">
        <p><span class="label">Date Applied:</span> ${app.dateApplied}</p>
        <p><span class="label">Name:</span> ${app.firstName} ${app.lastName}</p>
        <p><span class="label">Age:</span> ${app.age}</p>
        <p><span class="label">Job Category:</span> ${app.jobCategory}</p>
      </div>

      <div class="section">
        <h3>Contact Info</h3>
        <p>Email: ${app.email}</p>
        <p>Phone: ${app.phone}</p>
        <p>Address: ${app.mainAddress}</p>
      </div>

      <div class="section">
        <h3>Education</h3>
        <p>University: ${app.university_name || ""}</p>
        <p>Course: ${app.university_course || ""}</p>
      </div>

      <button onclick="window.print()">Print</button>

    </body>
    </html>
  `);

  newWindow.document.close();
}
