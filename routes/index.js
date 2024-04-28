const express = require("express");
const router = express.Router();
const User = require("./users");
const MainDB = require("./mainDB");
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
      // const failureMessage = "User with this email already exists.";
      // res.render("login", { failureMessage });
      return res.status(400).send("User with this email already exists.");
      // return res.render("login", { errorMessage: "User with this email already exists." });
    }

    const newUser = new User({ username, email, password });

    await newUser.save();

    res.render("slider");
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).send("Internal server error.");
  }
});

// Slider
router.post("/abc", (req, res, next) => {
  passport.authenticate("plain", (err, user, info) => {
    if (err) {
      console.error("Authentication error:", err);
      return res.status(500).send("Internal server error");
    }
    if (!user) {
      // console.log("Authentication failed:", info.message);
      // return res.redirect("/");
      return res.render("login", { failureMessage: "User Not Found." });
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
    const { employeeName, projectName, projectDomain, email } = req.body;

    if (!employeeName || !email || !projectName || !projectDomain) {
      return res.status(400).send("Please fill in all required fields.");
    }

    const newEmployee = new MainDB({
      employeeName,
      projectName,
      projectDomain,
      email,
    });

    await newEmployee.save();

    const successMessage = "Employee added successfully";

    res.render("add_employee", { successMessage });
  } catch (error) {
    // console.error("Error saving employee details:", error);
    const failureMessage = "Failed to save employee details";
    res.render("add_employee", { failureMessage });
  }
});

router.post("/employee_work_experience_button", function (req, res) {
  res.render("employee_work_experience");
});

router.post("/work_experience", async (req, res) => {
  try {
    const { employeeName, email, year,salary, course } = req.body;

    if (!year || !course || !email || !employeeName || !salary) {
      return res.status(400).send("Please fill in all required fields.");
    }

    // Find the document based on email and name
    const existingEmployee = await MainDB.findOne({
      email,
      employeeName: employeeName,
    });

    if (!existingEmployee) {
      return res.status(404).send("Employee not found.");
    }

    // Update the existing document
    existingEmployee.year = year;
    existingEmployee.course = course;
    existingEmployee.salary = salary;

    // Save the updated document
    await existingEmployee.save();

    const successMessage = "Experience details updated successfully";
    res.render("employee_work_experience", { successMessage });
  } catch (error) {
    console.error("Error updating experience details:", error);
    const failureMessage = "Failed to update experience details";
    res.render("employee_work_experience", { failureMessage });
  }
});

router.post("/employee_add_personal_details_button", function (req, res) {
  res.render("employee_personal_details");
});

router.post("/personal_details", async (req, res) => {
  try {
    const { employeeName, email, age, bloodGroup } = req.body;

    if (!employeeName || !email || !age || !bloodGroup) {
      return res.status(400).send("Please fill in all required fields.");
    }

    const existingEmployee = await MainDB.findOne({
      email,
      employeeName: employeeName,
    });

    if (!existingEmployee) {
      return res.status(404).send("Employee not found.");
    }

    // Update the existing document
    existingEmployee.age = age;
    existingEmployee.bloodGroup = bloodGroup;

    await existingEmployee.save();

    res.render("employee_personal_details", {
      successMessage: "Personal details saved successfully",
    });
  } catch (error) {
    console.error("Error saving personal details:", error);
    res.render("employee_personal_details", {
      failureMessage: "Failed to save personal details",
    });
  }
});

// Getting data for Employee Details from backend

router.get("/employeeList", async function (req, res, next) {
  try {
    const employees = await MainDB.find({});
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
  const { employeeName, email } = req.body;

  try {
    // Delete the employee from the database
    const result = await MainDB.deleteOne({ employeeName, email });

    if (result.deletedCount === 0) {
      return res.status(404).send("Employee not found");
      // res.render("delete_employees_details", {
      //   message: "Employee not found",
      // });
    }
    res.render("delete_employees_details", {
      successMessage: "Employee deleted successfully",
    });
    // res.status(200).send("Employee deleted successfully");
  } catch (err) {
    console.error(err);
    res.render("delete_employees_details", {
      failureMessage: "Failed to delete Employee",
    });
    // res.status(500).send("Server error");
  }
});

// Delete Work Experience
router.post("/delete_work_experience_button", function (req, res) {
  res.render("delete_work_experience");
});

router.post("/delete_employee2", async (req, res) => {
  const { employeeNameW, emailW } = req.body;

  try {
    // Delete the employee from the database
    const result = await MainDB.deleteOne({ employeeNameW, emailW });

    if (result.deletedCount === 0) {
      return res.status(404).send("Employee not found");
    }
    res.render("delete_work_experience", {
      successMessage: "Employee's Work Experience deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.render("delete_work_experience", {
      failureMessage: "Failed to delete Employee's Work Experience",
    });
  }
});

// Delete Personal Details
router.post("/delete_personal_details_button", function (req, res) {
  res.render("delete_personal_details");
});

router.post("/delete_employee3", async (req, res) => {
  const { employeeNameP, emailP } = req.body;

  try {
    // Delete the employee from the database
    const result = await MainDB.deleteOne({ employeeNameP, emailP });

    if (result.deletedCount === 0) {
      return res.status(404).send("Employee not found");
      // res.render("delete_employees_details", {
      //   message: "Employee not found",
      // });
    }
    res.render("delete_personal_details", {
      successMessage: "Employee's Personal Details deleted successfully",
    });
    // res.status(200).send("Employee deleted successfully");
  } catch (err) {
    console.error(err);
    res.render("delete_personal_details", {
      failureMessage: "Failed to delete Employee's Personal Details",
    });
    // res.status(500).send("Server error");
  }
});

// Gettinf data for workExperience
router.get("/workExperienceList", async function (req, res, next) {
  try {
    const experience = await MainDB.find({});
    res.render("workExperienceList", { experience: experience });
  } catch (err) {
    console.error("Error fetching Work Experience:", err);
    res.status(500).send("Error fetching Work Experience");
  }
});

// Gettinf data for personalDetails
router.get("/personalList", async function (req, res, next) {
  try {
    const personal = await MainDB.find({});
    res.render("personalList", { personal: personal });
  } catch (err) {
    console.error("Error fetching Personal Details:", err);
    res.status(500).send("Error fetching Personal Details");
  }
});

module.exports = router;
