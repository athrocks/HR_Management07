const express = require("express");
const router = express.Router();
const User = require("./users");
const Employee = require("./employee");
const Experience = require("./experience");
const Personal = require("./personal");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const localStrategy = require("passport-local");
passport.use(new localStrategy(User.authenticate()));

passport.use(
  "plain",
  new LocalStrategy(
    { usernameField: "username" },
    async (username, password, done) => {
      try {
        const user = await User.findOne({ username: username });
        if (!user) return done(null, false, { message: "Incorrect username." });
        if (user.password !== password)
          return done(null, false, { message: "Incorrect password." });
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

router.get("/", function (req, res) {
  res.render("index");
});

router.post("/login", function (req, res) {
  res.render("login");
});

router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).send("Please fill in all required fields.");
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send("User with this email already exists.");
    }

    const newUser = new User({ username, email, password });

    await newUser.save();

    res.render("slider");
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).send("Internal server error.");
  }
});

router.post("/abc", (req, res, next) => {
  passport.authenticate("plain", (err, user, info) => {
    if (err) {
      console.error("Authentication error:", err);
      return res.status(500).send("Internal server error");
    }
    if (!user) {
      console.log("Authentication failed:", info.message);
      return res.redirect("/");
    }
    req.login(user, (err) => {
      if (err) {
        console.error("Login error:", err);
        return res.status(500).send("Internal server error");
      }
      res.render("slider");
    });
  })(req, res, next);
});

router.post("/button1", function (req, res) {
  res.render("button1");
});
router.post("/button2", function (req, res) {
  res.render("button2");
});
router.post("/button3", function (req, res) {
  res.render("button3");
});

router.post("/employee_add_data_button", function (req, res) {
  res.render("add_employee");
});

router.post("/add_employee2", async (req, res) => {
  try {
    const { employeeName, projectName, projectDomain, email2 } = req.body;

    if (!employeeName || !email2 || !projectName || !projectDomain) {
      return res.status(400).send("Please fill in all required fields.");
    }

    const newEmployee = new Employee({
      employeeName,
      projectName,
      projectDomain,
      email2,
    });

    await newEmployee.save();

    res.render("add_employee", {
      successMessage: "Employee added successfully",
    });
  } catch (error) {
    console.error("Error saving employee details:", error);
    res.status(500).json({ error: "Failed to save employee details" });
  }
});

router.post("/employee_work_experience_button", function (req, res) {
  res.render("employee_work_experience");
});

router.post("/work_experience", async (req, res) => {
  try {
    const { employeeName2, email3, year, course } = req.body;

    if (!employeeName2 || !email3 || !year || !course) {
      return res.status(400).send("Please fill in all required fields.");
    }

    const newExperience = new Experience({
      employeeName2,
      email3,
      year,
      course,
    });

    await newExperience.save();

    res.render("employee_work_experience", {
      successMessage: "Experience added successfully",
    });
  } catch (error) {
    console.error("Error saving experience details:", error);
    res.status(500).json({ error: "Failed to save experience details" });
  }
});

router.post("/employee_add_personal_details_button", function (req, res) {
  res.render("employee_personal_details");
});

router.post("/personal_details", async (req, res) => {
  try {
    const { employeeName4, email4, age, bloodGroup } = req.body;

    if (!employeeName4 || !email4 || !age || !bloodGroup) {
      return res.status(400).send("Please fill in all required fields.");
    }

    const newPersonal = new Personal({
      employeeName4,
      email4,
      age,
      bloodGroup,
    });

    await newPersonal.save();

    res.render("employee_work_experience", {
      successMessage: "Personal details saved successfully",
    });
  } catch (error) {
    console.error("Error saving personal details:", error);
    res.status(500).json({ error: "Failed to save personal details" });
  }
});

// Getting data for Employee Details from backend

router.get("/employeeList", async function (req, res, next) {
  try {
    // Fetch all employees from the database
    const employees = await Employee.find({});
    // Render employeeList.ejs with employee data
    res.render("employeeList", { employees: employees });
  } catch (err) {
    console.error("Error fetching employees:", err);
    res.status(500).send("Error fetching employees");
  }
});

router.post("/delete_employees_button", function (req, res) {
  res.render("delete_employees_details");
});

router.post("/delete_employee", async (req, res) => {
  const { employeeName, email2 } = req.body;

  try {
    // Delete the employee from the database
    const result = await Employee.deleteOne({ employeeName, email2 });

    if (result.deletedCount === 0) {
      return res.status(404).send("Employee not found");
    }

    res.status(200).send("Employee deleted successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Gettinf data for workExperience
router.get("/workExperienceList", async function (req, res, next) {
  try {
    const experience = await Experience.find({});
    res.render("workExperienceList", { experience: experience });
  } catch (err) {
    console.error("Error fetching Work Experience:", err);
    res.status(500).send("Error fetching Work Experience");
  }
});

// Gettinf data for personalDetails
router.get("/personalList", async function (req, res, next) {
  try {
    const personal = await Personal.find({});
    res.render("personalList", { personal: personal });
  } catch (err) {
    console.error("Error fetching Personal Details:", err);
    res.status(500).send("Error fetching Personal Details");
  }
});

module.exports = router;
