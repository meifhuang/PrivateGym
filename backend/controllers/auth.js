const express = require("express");
const catchAsync = require("../utils/CatchAsync");
const passport = require("passport");
const User = require("../models/user");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

// function createAuthRouter(passport) {
router = express.Router();

router.get("/signup", (req, res) => {
  res.json({ messsage: "Hi" });
});

router.post("/emailcheck", async (req, res) => {
  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const { fname, lname, email } = req.body;
  if (fname === "" || lname === "" || email === "") {
    res.status(400).send({
      message: "Please fill in all sections.",
    });
  } else if (/[^a-zA-Z]/.test(fname) || /[^a-zA-Z]/.test(lname)) {
    res.status(400).send({
      message: "Names can only have letters.",
    });
  } else if (!validateEmail(email)) {
    res.status(400).send({
      message: "Please enter a valid email.",
    });
  } else {
    try {
      const findUser = await User.findOne({ email });

      if (findUser) {
        console.log(findUser);

        res.status(400).send({
          message: "Email already exists.",
        });
      } else {
        // throw new Error("Email is fine")
        res.status(200).json({
          success: true,
        });
      }
    } catch (e) {
      console.log(e);
    }
  }
});
router.post(
  "/signup",
  catchAsync(async (req, res) => {
    console.log(req.body);
    const { fname, lname, email, username, password, cpassword } = req.body;

    for (const [key, value] of Object.entries(req.body)) {
      if (value === "") {
        res.status(400).send({
          message: "Please fill in all sections.",
        });
      }
    }

    try {
      const findUsername = await User.findOne({ username });
      const findEmail = await User.findOne({ email });
      if (findUsername) {
        res.status(400).send({
          message: "Username already exists.",
        });
      } else if (findEmail) {
        res.status(400).send({
          message: "Email already exists.",
        });
      } else {
        try {
          const hashPassword = await argon2.hash(req.body.password);
          if (password === cpassword) {
            const user = await User.create({
              fname,
              lname,
              email,
              username,
              password: hashPassword,
            });

            // await user.save()

            res.status(201).json({
              success: true,
              message: "User signed up.",
            });
          } else {
            res.status(400).json({
              success: false,
              message: "Passwords are not identical.",
            });
          }
        } catch (e) {
          console.log(e);
        
        }
      }
    } catch (e) {
      console.log(e);
    }
  })
);

router.get("/login", (req, res) => {
  res.json({
    message: "Login",
  });
});

router.post("/login", async (req, res) => {
  try {
    const foundUser = await User.findOne({
      username: req.body.username,
    });
    // console.log(foundUser.length > 0);
    console.log(foundUser);
    if (foundUser) {
      try {
        const verifyPassword = await argon2.verify(
          foundUser.password,
          req.body.password
        );

        // console.log(verifyPassword, foundUser);
        if (verifyPassword) {
          const user_id = foundUser._id.toString();
          console.log(user_id);
          const token = jwt.sign(
            { username: foundUser.username, id: user_id },
            process.env.JSONKEY
            // { expiresIn: "1h" }
          );
          console.log("verified");

          res.status(200).json({
            success: true,
            message: "User logged in",
            token: token,
            userId: foundUser._id,
          });
        } else {
          res.status(401).json({
            success: false,
            message: "Wrong username or password",
          });
        }
      } catch (e) {
        console.log(e);
        res.status(500).json({
          success: false,
          message: "Something went wrong",
        });
      }
      // response.status(500).json({
      //   success: false,
      //   message: "Email has already been signed up.",
      // });
    } else {
      res.status(500).json({
        success: false,
        message: "User not found.",
      });
    }
  } catch (e) {
    console.log(e);
  }
});

// router.get("/logout", (req, res) => {
//   req.logout(function (err) {
//     if (err) {
//       return next(err);
//     }
//     console.log("Logged out!");
//     res.redirect("/");
//   });
// });

router.get("/logout", (req, res) => {
  res.status(200).json({
    message: "logged out",
  });
});

// return router;
// }

module.exports = router;
