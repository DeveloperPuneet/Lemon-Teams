const express = require("express");
const bodyParser = require('body-parser');
const session = require('express-session');
const multer = require('multer');
const path = require('path');
const randomstring = require("randomstring");

const config = require("../config/config");
const auth = require("../middlewares/auth");
const controller = require("../controllers/controller");

const router = express();
router.use(session({ secret: config.key }));
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.static('public'));
router.set('view engine', 'pug');
router.set('views', './views');

const randomIdentity = () => {
    try {
        return randomstring.generate(10);
    } catch (error) {
        console.log(error.message);
    }
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/accounts'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + randomIdentity() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

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
router.get("/products", controller.productLoad);
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
router.get("/privacy-and-policies", auth.isLogin, controller.PrivacyAndPolicies);
router.get("/donate", auth.isLogin, controller.Donate);
router.get("/join-lemon-teams", auth.isLogin, controller.JoinLemonTeams);
router.get("/support", auth.isLogin, controller.Support);
router.post("/support", auth.isLogin, controller.GetHelp);
router.post("/delete-palette", auth.isLogin, controller.DeletePalette);
router.get("/library", auth.isLogin, controller.LibraryLoad);
router.get("/create-library", auth.isLogin, controller.CreateLibraryLoad);
router.post("/create-library", auth.isLogin, controller.CreatingLibrary);
router.get("/library/:code", auth.isLogin, controller.LoadLibrary);
router.get("/add-code", auth.isLogin, controller.AddCodeLoad);

module.exports = router;