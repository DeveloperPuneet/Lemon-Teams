const express = require("express");
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const multer = require('multer');
const path = require('path');
const randomstring = require("randomstring");
const mongoose = require('mongoose');

const config = require("../config/config");
const auth = require("../middlewares/auth");
const controller = require("../controllers/controller");
const redeemController = require("../controllers/RedeemController");

const router = express();

// Configure MongoDB session store
const store = new MongoDBStore({
  uri: config.database,  // Your MongoDB URI
  collection: 'sessions', // Store sessions in this collection
});

// Handle errors from session store
store.on('error', function (error) {
  console.log('Session Store Error: ', error);
});

// Define session expiration time (30 days in milliseconds)
const sessionExpiration = 1000 * 60 * 60 * 24 * 30;

// Use session middleware with MongoDBStore
router.use(session({
  secret: config.key,  // Strong, unique secret key
  resave: false,
  saveUninitialized: false,
  store: store,        // Using MongoDBStore here
  cookie: { maxAge: sessionExpiration },  // Set cookie expiration time
  rolling: true        // Reset session expiration on each request
}));

// Add an 'expiresAt' field when the session is created
store.on('create', function (sessionId, sessionData) {
  const expiresAt = new Date(Date.now() + sessionExpiration);
  mongoose.connection.collection('sessions').updateOne(
    { _id: sessionId },
    { $set: { expiresAt: expiresAt } }
  );
});

// Ensure TTL index is created on the 'expiresAt' field
mongoose.connection.collection('sessions').createIndex(
  { "expiresAt": 1 },
  { expireAfterSeconds: 0 }
);

// Body Parser Middleware
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

// Static Files Middleware
router.use(express.static('public'));

// View Engine Setup
router.set('view engine', 'pug');
router.set('views', './views');

// Utility function to generate random file names
const randomIdentity = () => {
  try {
    return randomstring.generate(10);
  } catch (error) {
    console.log(error.message);
  }
};

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/accounts'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + randomIdentity() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Define Routes
router.get("/", auth.isLogout, controller.Load);
router.get("/login", auth.isLogout, controller.LoadLogin);
router.get("/register", auth.isLogout, controller.LoadRegister);
router.post("/register", controller.AddAccount);
router.post("/login", controller.LoginAccount);
router.get("/verify", controller.accountActivation);
router.get("/reset-password", controller.RequestMailToResetPassword);
router.post("/reset-password", controller.SendResetPasswordMail);
router.get("/new-password", controller.EnterPasswordLoad);
router.post("/new-password", controller.ChangePassword);
router.get("/account/:identity", auth.isLogin, controller.LoadProfile);
router.get("/account", auth.isLogin, controller.LoadLogin);
router.get("/dashboard", auth.isLogin, controller.LoadDashboard);
router.get("/products", auth.isLogin, controller.productLoad);
router.get("/lemon-color-lab", auth.isLogin, controller.LemonColorLab);
router.get("/lemon-color-lab-preview", auth.isLogin, controller.LemonColorLab);
router.get("/add-palette", auth.isLogin, controller.AddPalette);
router.post("/add-palette", auth.isLogin, controller.PublishingPalette);
router.get("/open-palette", auth.isLogin, controller.OpenPalette);
router.get("/feedback", auth.isLogin, controller.FeedbackLoad);
router.post("/feedback", auth.isLogin, controller.SendFeedback);
router.get("/testimonials", auth.isLogin, controller.TestimonialLoad);
router.post("/testimonials", auth.isLogin, controller.SendTestimonial);
router.get("/logout", auth.isLogin, controller.Logout);
router.get("/delete-account", auth.isLogin, controller.DeleteAccount);
router.post("/save-profile", auth.isLogin, upload.single("profileImage"), controller.SaveProfile);
router.get("/restore-profile-to-default", auth.isLogin, controller.RestoreProfileToDefault);
router.get("/solutions", auth.isLogin, controller.Solutions);
router.get("/privacy-and-policies", controller.PrivacyAndPolicies);
router.get("/donate", auth.isLogin, controller.Donate);
router.get("/join-lemon-teams", auth.isLogin, controller.JoinLemonTeams);
router.get("/support", auth.isLogin, controller.Support);
router.post("/support", auth.isLogin, controller.GetHelp);
router.post("/delete-palette", auth.isLogin, controller.DeletePalette);
router.get("/library", auth.isLogin, controller.LibraryLoad);
router.get("/create-library", auth.isLogin, controller.CreateLibraryLoad);
router.post("/create-library", auth.isLogin, controller.CreatingLibrary);
router.get("/library/:code", auth.isLogin, controller.LoadLibrary);
router.get("/add-code/:code", auth.isLogin, controller.AddCodeLoad);
router.get("/delete-library/:code", auth.isLogin, controller.deleteLibrary);
router.post("/add-code/:code", auth.isLogin, controller.AddingCodeToLibrary);
router.get("/code/:token", auth.isLogin, controller.LoadCodeDetails);
router.get("/import/:token", controller.ImportedLinks);
router.get("/get-palettes", controller.GetPalettes);
router.get("/reedem-code", auth.isLogin, controller.ReedemCodeLoad);
router.post("/reedem-code", auth.isLogin, controller.ReedemCodes);
router.get("/create-redeem-code", auth.isLogin, redeemController.LoadRedeemCodeGenerator);
router.post("/create-redeem-code", auth.isLogin, redeemController.PublishingRedeemCode);
router.get("/lemon-store", auth.isLogin, controller.LemonStoreLoad);
router.post("/auto-redeem-code-generate", auth.isLogin, redeemController.autoRedeemCodeGenerator);
router.get("/redeem-code-winner-game", auth.isLogin, redeemController.redeemCodeWinner);
router.get("/duck-game", auth.isLogin, controller.duckGame);

// For handling wrong requests
router.get("/.well-known/brave-rewards-verification.txt", auth.isLogout, (req,res) => {
  res.send(`This is a Brave Creators publisher verification file.

Domain: lemonteams.onrender.com
Token: f5f2b7d3767d94cb8368ff4cecd5150938396cbd571b35e71d01bbc591913c88
    `)
});
router.get("*", controller.WrongRequestHandler);

module.exports = router;
