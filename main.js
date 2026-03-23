// ================= SAVE FORM =================
document
  .getElementById("applicationForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(this);

    let data = {};

    // convert form to object
    formData.forEach((value, key) => {
      if (data[key]) {
        // handle multiple values (checkbox)
        if (!Array.isArray(data[key])) {
          data[key] = [data[key]];
        }
        data[key].push(value);
      } else {
        data[key] = value;
      }
    });

    // HANDLE IMAGE
    const file = formData.get("photo");
    if (file && file.size > 0) {
      const reader = new FileReader();
      reader.onload = function () {
        data.photo = reader.result; // base64 image
        saveApplication(data);
      };
      reader.readAsDataURL(file);
    } else {
      saveApplication(data);
    }
  });

function saveApplication(data) {
  let applications = JSON.parse(localStorage.getItem("applications")) || [];

  data.date = new Date().toLocaleString();
  data.id = Date.now();

  applications.push(data);

  localStorage.setItem("applications", JSON.stringify(applications));

  alert("Application Submitted Successfully!🎉🎉");
  document.getElementById("applicationForm").reset();
}

function showAdmin() {
  // Hide form
  document.getElementById("formSection").classList.add("hidden");

  // Hide Admin button
  document.getElementById("adminBtn").classList.add("hidden");

  // Show login section
  document.getElementById("loginSection").classList.remove("hidden");
}

function login() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;

  if (user === "admin" && pass === "1234") {
    document.getElementById("loginSection").classList.add("hidden");
    document.getElementById("adminSection").classList.remove("hidden");

    renderTable(); // 🔥 VERY IMPORTANT
  } else {
    alert("Invalid login");
  }
}

function logout() {
  window.location.replace("index.html");
}




window.addEventListener("beforeprint", () => {
  document.querySelectorAll("input, textarea").forEach((el) => {
    el.setAttribute("value", el.value);
  });
});





function renderTable() {
  const table = document.getElementById("tableBody");
  table.innerHTML = "";

  const search = document.getElementById("search").value.toLowerCase();
  const filterJob = document.getElementById("filterJob").value.toLowerCase();

  const applications = JSON.parse(localStorage.getItem("applications")) || [];

  const filtered = applications.filter((app) => {
    const fullName =
      `${app.firstName || ""} ${app.lastName || ""}`.toLowerCase();
    const job = (app.applyFor || "").toLowerCase();

    return fullName.includes(search) && job.includes(filterJob);
  });

  if (filtered.length === 0) {
    table.innerHTML = `<tr><td colspan="4">No results</td></tr>`;
    return;
  }

  filtered.reverse().forEach((app) => {
    const age = calculateAge(app.birthDate);

    table.innerHTML += `
      <tr onclick="viewApplication(${app.id})">
        <td>${app.date || ""}</td>
        <td>${app.firstName || ""} ${app.lastName || ""}</td>
        <td>${age || ""}</td>
        <td>${app.applyFor || ""}</td>
      </tr>
    `;
  });
}








function normalizeData(app) {
  return {
    ...app,

    education: [
      {
        school: app.university_name,
        year: app.university_year,
        course: app.university_course,
      },
      {
        school: app.college_name,
        year: app.college_year,
        course: app.college_course,
      },
      {
        school: app.highschool_name,
        year: app.highschool_year,
        course: app.highschool_course,
      },
      {
        school: app.elementary_name,
        year: app.elementary_year,
        course: app.elementary_course,
      },
      {
        school: app.technical_name,
        year: app.technical_year,
        course: app.technical_course,
      },
    ],

    referees: [
      {
        name: app.ref1_name,
        phone: app.ref1_phone,
        address: app.ref1_address,
      },
      {
        name: app.ref2_name,
        phone: app.ref2_phone,
        address: app.ref2_address,
      },
    ],

    employment: [1, 2, 3, 4, 5, 6].map((i) => ({
      company: app[`company${i}`],
      position: app[`position${i}`],
      country: app[`country${i}`],
      year: app[`year${i}`],
      desc: app[`job_desc${i}`],
    })),

    certificates: [1, 2, 3, 4, 5, 6].map((i) => app[`certificate${i}`]),
    awards: [1, 2, 3, 4, 5, 6].map((i) => app[`field${i}`]),
  };
}

function calculateAge(birthDate) {
  if (!birthDate) return "";

  const today = new Date();
  const birth = new Date(birthDate);

  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}

function viewApplication(id) {
  const apps = JSON.parse(localStorage.getItem("applications")) || [];
  let app = apps.find((a) => a.id === id);
  app = normalizeData(app);

  const w = window.open("", "_blank");

  w.document.write(`
<html>
<head>
<title>Application</title>
<link rel="stylesheet" href="styles.css">
<style>
.page {
  // width: 1000px;
  // margin: 20px auto;
  // border: 2px solid #000;
  // padding: 15px;
  background: #fff;
}

.line {
  border-bottom: 1px dashed #000;
  display: inline-block;
  min-width: 150px;
}

.box {
  border: 2px solid #000;
  padding: 10px;
  margin-top: 10px;
}

.box-title {
  font-weight: bold;
  margin-bottom: 10px;
}

@media print {
  .page {
    page-break-after: always;
  }

  button {
    display: none;
  }
}
</style>

</head>
<body>

<div class="form-container">

<!-- HEADER -->
<div class="header">
  <img src="img/logo.gif" class="logo" />
  <div class="header-text">
    <h2>GOD'S WILL INTERNATIONAL PLACEMENT, INC</h2>
    <p>(Data Encoding Form: <strong>Medical Professionals</strong>)</p>
  </div>
</div>

${page1(app)}
${page2(app)}
${page3(app)}
${page4(app)}
${page5(app)}

<button onclick="window.print()">Print / Download PDF</button>

</div>

</body>
</html>
`);

  w.document.close();
}

function page1(app) {
  return `
<div class="page">

<div class="section-box">
<div class="section-title">PERSONAL</div>

<p>Full Name:
<span class="line">${app.lastName} ${app.firstName} ${app.middleName || ""}</span>
</p>

<p>Birth Date:
<span class="line">${app.birthDate}</span>
</p>

<p>Email:
<span class="line">${app.email}</span>
</p>

<p>Contact Number:
<span class="line">${app.phone}</span>
</p>

<p>Address:
<span class="line">${app.mainAddress}</span>
</p>

<p>Height:
<span class="line">${app.height}</span>
Weight:
<span class="line">${app.weight}</span>
</p>

<p>Religion:
<span class="line">${app.religion}</span>
Civil Status:
<span class="line">${app.civilStatus}</span>
</p>

</div>

</div>`;
}

function page2(app) {
  return `
<div class="page">

<div class="box">
<div class="box-title">EDUCATION</div>

<table>
<tr><th>School</th><th>Year</th><th>Course</th></tr>

${app.education
  .map(
    (e) => `
<tr>
<td>${e.school || ""}</td>
<td>${e.year || ""}</td>
<td>${e.course || ""}</td>
</tr>
`,
  )
  .join("")}

</table>
</div>

<div class="box">
<div class="box-title">EXAMS</div>

<table>
<tr><th>Exam</th><th>Year</th></tr>

<tr><td>${app.exam1}</td><td>${app.exam1_year}</td></tr>
<tr><td>${app.exam2}</td><td>${app.exam2_year}</td></tr>
<tr><td>${app.exam3}</td><td>${app.exam3_year}</td></tr>

</table>
</div>

</div>`;
}

function page3(app) {
  return `
<div class="page">

<div class="box">
<div class="box-title">EMPLOYMENT</div>

<table>
<tr><th>Company</th><th>Position</th><th>Country</th><th>Year</th></tr>

${app.employment
  .map(
    (e) => `
<tr>
<td>${e.company || ""}</td>
<td>${e.position || ""}</td>
<td>${e.country || ""}</td>
<td>${e.year || ""}</td>
</tr>
`,
  )
  .join("")}

</table>
</div>

<div class="box">
<div class="box-title">JOB DESCRIPTION</div>

${app.employment
  .map(
    (e) => `
<div class="line">${e.desc || ""}</div><br>
`,
  )
  .join("")}

</div>

</div>`;
}

function page4(app) {
  return `
<div class="page">

<div class="box">
<div class="box-title">CERTIFICATES</div>

${app.certificates
  .map(
    (c, i) => `
<div>${i + 1}. <span class="line">${c || ""}</span></div>
`,
  )
  .join("")}

</div>

<div class="box">
<div class="box-title">REFEREES</div>

<table>
<tr><th>Name</th><th>Phone</th><th>Address</th></tr>

${app.referees
  .map(
    (r) => `
<tr>
<td>${r.name || ""}</td>
<td>${r.phone || ""}</td>
<td>${r.address || ""}</td>
</tr>
`,
  )
  .join("")}

</table>
</div>

</div>`;
}

function page5(app) {
  return `
<div class="page">

<div class="box">
<div class="box-title">FAMILY</div>

<div>Spouse: <span class="line">${app.spouse_name}</span></div>
<div>Children: <span class="line">${app.children_count}</span></div>

<div>Father: <span class="line">${app.father_name}</span></div>
<div>Mother: <span class="line">${app.mother_name}</span></div>

</div>



</div>

</div>`;
}






