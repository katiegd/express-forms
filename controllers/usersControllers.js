const usersStorage = require("../storages/usersStorage");
const { body, validationResult } = require("express-validator");

const alphaError = "must only contain letters.";
const lengthErr = "must be between 1 and 10 characters.";
const emailErr = "Please enter a valid email.";
const ageErr = "must be between 18 and 120.";

const validateUser = [
  body("firstName")
    .trim()
    .isAlpha()
    .withMessage(`First name ${alphaError}`)
    .isLength({ min: 1, max: 10 })
    .withMessage(`First name ${lengthErr}`),
  body("lastName")
    .trim()
    .isAlpha()
    .withMessage(`Last name ${alphaError}`)
    .isLength({ min: 1, max: 10 })
    .withMessage(`Last name ${lengthErr}`),
  body("email").trim().isEmail().withMessage(emailErr),
  body("age")
    .optional({ checkFalsy: true })
    .isInt({ min: 18, max: 120 })
    .withMessage(`Age ${ageErr}`),
  body("bio")
    .optional()
    .isLength({ max: 200 })
    .withMessage("Maximum 200 characters."),
];

exports.usersListGet = (req, res) => {
  res.render("index", {
    title: "User list",
    users: usersStorage.getUsers(),
  });
};

exports.usersListSearchGet = (req, res) => {
  const { query } = req.query; // Search input saved in query object
  const filter = {};

  // Email regex pattern
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Filtered query saved & sent to searchUsers
  if (query) {
    if (emailPattern.test(query)) {
      filter.email = query;
    } else {
      filter.lastName = query;
    }
  }

  const users = usersStorage.searchUsers(filter);

  res.render("searchUser", {
    title: "Search",
    users: users,
  });
};

exports.usersCreateGet = (req, res) => {
  res.render("createUser", {
    title: "Create user",
  });
};

exports.usersUpdateGet = (req, res) => {
  const user = usersStorage.getUser(req.params.id);
  res.render("updateUser", {
    title: "Update user",
    user: user,
  });
};

exports.usersCreatePost = [
  validateUser,
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("createUser", {
        title: "Create user",
        errors: errors.array(),
      });
    }
    const { firstName, lastName, email, age, bio } = req.body;
    usersStorage.addUser({ firstName, lastName, email, age, bio });
    res.redirect("/");
  },
];

exports.usersUpdatePost = [
  validateUser,
  (req, res) => {
    const user = usersStorage.getUser(req.params.id);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("updateUser", {
        title: "Update user",
        user: user,
        errors: errors.array(),
      });
    }
    const { firstName, lastName, email, age, bio } = req.body;
    usersStorage.updateUser(req.params.id, {
      firstName,
      lastName,
      email,
      age,
      bio,
    });
    res.redirect("/");
  },
];

exports.usersDeletePost = (req, res) => {
  usersStorage.deleteUser(req.params.id);
  res.redirect("/");
};
