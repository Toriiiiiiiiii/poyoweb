const ejs = require("ejs");
const express = require("express");
require("dotenv").config();
const fetch = require("node-fetch");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const multer = require("multer");;
const path = require("path");
const db = require("./db");
const FormData = require("form-data");

var router = express.Router();

router.use(cookieParser());
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

const checkAuthMiddleware = (req, res, next) => {
  const token = req.cookies.auth;
  req.jwt = token;
  res.locals.jwt = token;
  res.locals.url = process.env.URL_ENTIRE;
  res.locals.message = req.query.message || res.locals.message ||  undefined;
  res.locals.ip = process.env.SERVER_IP;
  res.locals.dns = process.env.DNS_URL;

  if (!token) {
    res.locals.loggedIn = false;
    return next();
  }

  jwt.verify(token, process.env.AUTH_SECRET, async (err, decoded) => {
    if (err) {
      res.locals.loggedIn = false;
    } else {
      var user = await db.findUserById(await decoded.id);
      if (!user) {
      	res.clearCookie("auth");
        res.redirect("/?message=Invalid auth cookie");
      } else {
      	res.locals.loggedIn = true;
      	res.locals.user = await user;
      	req.user = await user;
      }
    }
    next();
  });
};

const notLoggedInMiddleware = (req, res, next) => {
  if (res.locals.loggedIn) {
    res.redirect("/");
  } else {
    next();
  }
};

const loggedInMiddleware = (req, res, next) => {
  if (!res.locals.loggedIn) {
    res.redirect("/auth/login?message=You need to be logged in");
  } else {
    next();
  }
}

const isAdmin = (req, res, next) => {
    if (req.path == '/auth/login' || req.path == '/') {
        return next(); // Skip middleware for the login route
    }

    if (req.user) {
        if (req.user.admin == 1) {
            next();
        } else {
            res.clearCookie("auth");
            return res.redirect("/auth/login?message=You need to be an admin");
        }
    } else {
        res.clearCookie("auth");
        return res.redirect("/auth/login?message=You need to log in");
    }
};


router.use(checkAuthMiddleware);
router.use(isAdmin);

router.get("/", loggedInMiddleware, async (req, res) => {
	res.render("adminIndex", await { title: "Index", users: await db.readUsers() });	
});

router.get("/auth/login", notLoggedInMiddleware, (req, res) => {
  res.render("adminLogin", { title: "Login" });
});

router.post("/auth/login", notLoggedInMiddleware, async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: "Missing required fields", success: false });
    return;
  } else {
    try {
      const response = await fetch(process.env.API_URL + "auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: email,
          password: password,
        }),
        timeout: 5000,
      });
      const text = await response.text();
      const data = await JSON.parse(await text);
      if (await data.success) {
      	var user = await db.findUserByEmail(email); 
      	if (user.admin == 1) {
        	res.cookie("auth", data.jwt, { httpOnly: true });
        	res.locals.loggedIn = true;
        	return res.redirect("/?message=Successfully logged in");
        } else {
        	return res.redirect('/?message=Not an admin :P')
        }
      } else {
        res.clearCookie("auth");
        res.locals.loggedIn = false;
        return res.redirect("/?message=Error "+data.error);
      }
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ error: "An error occurred; " + error });
    }
  }
});

router.get("/auth/logout", (req, res) => {
  res.clearCookie("auth");
  res.redirect("/");
});


router.post("/user/deleteUser", async (req, res) => {
	const { token } = req.body;
	if (!token) {
		return res.status(403).json({error: "An error occurred", success: false})
	}
	response = await fetch(process.env.API_URL + "auth/removeAccount", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jwt: token,
      })
    });
	res.redirect("/?message=" + JSON.stringify(await response.json()));
});

router.use((req, res, next) => {
  res.status(404).send("404 not found - " + process.env.ADMIN_URL);
});


module.exports = router;
