const accounts = require("../models/accounts");
const testimonials = require("../models/Testimonials");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const randomstring = require("randomstring");

const config = require("../config/config");
const Palette = require("../models/Palette");

const AccountVerificationMail = async (name, email, identity) => {
    try {
        const transports = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: config.email,
                pass: config.password
            }
        });

        const mail = {
            from: config.email,
            to: email,
            subject: "Lemon Teams: Verify your account",
            html: `<!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <style>
                            body {
                                font-family: 'Arial', sans-serif;
                                background-color: #f7f7f7;
                                color: #333333;
                                margin: 0;
                                padding: 20px;
                            }
                            .container {
                                max-width: 600px;
                                margin: 0 auto;
                                background-color: #ffffff;
                                padding: 20px;
                                border-radius: 8px;
                                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                            }
                            .header {
                                text-align: center;
                                background-color: #FFD700;
                                padding: 10px;
                                border-radius: 8px 8px 0 0;
                            }
                            .header h1 {
                                margin: 0;
                                color: #333333;
                            }
                            .content {
                                padding: 20px;
                            }
                            .content p {
                                margin: 0 0 20px;
                            }
                            .button {
                                display: inline-block;
                                background-color: #32CD32;
                                color: #ffffff;
                                padding: 10px 20px;
                                text-decoration: none;
                                border-radius: 5px;
                                text-align: center;
                            }
                            .footer {
                                text-align: center;
                                padding: 10px;
                                background-color: #FFD700;
                                border-radius: 0 0 8px 8px;
                                margin-top: 20px;
                            }
                            .footer p {
                                margin: 0;
                            }
                            a{
                                color: #fff;
                            }
                        </style>
                        <title>Welcome to Lemon Teams</title>
                    </head>
                    <body>
                        <div class="container">
                            <div class="header">
                                <h1>Welcome to Lemon Teams!</h1>
                            </div>
                            <div class="content">
                                <p>Hi ${name},</p>
                                <p>Thank you for joining Lemon Teams. We are excited to have you on board! To get started, please confirm your email address by clicking the button below:</p>
                                <p><a href="https://lemonteams.onrender.com/verify?identity=${identity}" class="button" style="color: #fff;">Confirm Email</a></p>
                                <p>Here are a few instructions to help you get started:</p>
                                <ul>
                                    <li>Explore our vibrant color palettes and customize your projects.</li>
                                    <li>Use our project management tools to organize your workflow.</li>
                                    <li>Stay connected with your team using our communication features.</li>
                                </ul>
                                <p>If you have any questions, feel free to contact our support team.</p>
                                <p>Happy collaborating!</p>
                                <p>The Lemon Teams Team</p>
                            </div>
                            <div class="footer">
                                <p>&copy; 2024 Lemon Teams. All rights reserved.</p>
                            </div>
                        </div>
                    </body>
                    </html>
            `
        }
        transports.sendMail(mail, (error, info) => {
            if (error) {
                console.log(error.message);
            } else {
                console.log(info.response);
            }
        });
    } catch (error) {
        console.log(error.message);
    }
};

const PasswordChangeMail = async (name, email, identity, token) => {
    try {
        const transports = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: config.email,
                pass: config.password
            }
        });

        const mail = {
            from: config.email,
            to: email,
            subject: "Lemon Teams: Reset your Password",
            html: `
            <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f7f7f7;
            color: #333333;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            background-color: #FFD700;
            padding: 10px;
            border-radius: 8px 8px 0 0;
        }
        .header h1 {
            margin: 0;
            color: #333333;
        }
        .content {
            padding: 20px;
        }
        .content p {
            margin: 0 0 20px;
        }
        .button {
            display: inline-block;
            background-color: #32CD32;
            color: #ffffff;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            text-align: center;
        }
        .footer {
            text-align: center;
            padding: 10px;
            background-color: #FFD700;
            border-radius: 0 0 8px 8px;
            margin-top: 20px;
        }
        .footer p {
            margin: 0;
        }
        .instructions {
            margin-top: 20px;
            padding: 10px;
            background-color: #f1f1f1;
            border-radius: 5px;
        }
        .instructions p {
            margin: 5px 0;
            font-size: 14px;
        }
        p a {
            color: #fff;
        }
    </style>
    <title>Reset Your Password</title>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Reset Your Password</h1>
        </div>
        <div class="content">
            <p>Hi ${name},</p>
            <p>We received a request to reset your password for your Lemon Teams account. To proceed with resetting your password, please click the button below:</p>
            <p><a href="https://lemonteams.onrender.com/new-password?identity=${identity}&token=${token}" class="button">Reset Password</a></p>
            <p>If you did not request a password reset, please ignore this email. Your password will not be changed.</p>
            <p>For security reasons, this link will expire in 24 hours.</p>
            <div class="instructions">
                <p><strong>Instructions:</strong></p>
                <p>1. Do not share this link with anyone.</p>
                <p>2. If you did not request this email, contact our support team immediately.</p>
                <p>3. Ensure your account information is kept secure and confidential.</p>
            </div>
            <p>Thank you,</p>
            <p>The Lemon Teams Team</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 Lemon Teams. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
            `
        }
        transports.sendMail(mail, (error, info) => {
            if (error) {
                console.log(error.message);
            } else {
                console.log(info.response);
            }
        });
    } catch (error) {
        console.log(error.message);
    }
};

const TestimonialsMail = async (identity, name, Testimonials) => {
    try {
        const transports = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: config.email,
                pass: config.password
            }
        });

        const mail = {
            from: config.email,
            to: config.email,
            subject: "Lemon Teams: Testimonial by " + name,
            html: `
            <h2>Testimonial written by ${name}</h2>
            <br>
            <h3>Identity:</h3> <p>${identity}</p>
            <br>
            <h3>Testimonial:</h3> <p>${Testimonials}</p>
            `
        }
        transports.sendMail(mail, (error, info) => {
            if (error) {
                console.log(error.message);
            } else {
                console.log(info.response);
            }
        });
    } catch (error) {
        console.log(error.message);
    }
};

const FeedbacksMail = async (identity, name, Feedback) => {
    try {
        const transports = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: config.email,
                pass: config.password
            }
        });

        const mail = {
            from: config.email,
            to: config.email,
            subject: "Lemon Teams: Feedback by " + name,
            html: `
            <h2>Feedback written by ${name}</h2>
            <br>
            <h3>Identity:</h3> <p>${identity}</p>
            <br>
            <h3>Feedback:</h3> <p>${Feedback}</p>
            `
        }
        transports.sendMail(mail, (error, info) => {
            if (error) {
                console.log(error.message);
            } else {
                console.log(info.response);
            }
        });
    } catch (error) {
        console.log(error.message);
    }
};

const encryptedPassCode = async (password) => {
    try {
        const passCode = await bcrypt.hash(password, 10);
        return passCode
    } catch (error) {
        console.log(error.message);
    }
};

const identityGenerator = async () => {
    return randomstring.generate(20);
}

const Load = async (req, res) => {
    try {
        const testimonialsData = await testimonials.find();
        res.render("Load", { testimonialsData });
    } catch (error) {
        console.log(error.message);
    }
};

const LoadLogin = async (req, res) => {
    try {
        res.render("Login");
    } catch (error) {
        console.log(error.message);
    }
}

const LoadRegister = async (req, res) => {
    try {
        res.render("Register");
    } catch (error) {
        console.log(error.message);
    }
}

const AddAccount = async (req, res) => {
    try {
        const { name, email, password } = await req.body;
        const encryptedPassword = await encryptedPassCode(password);
        const identity = await identityGenerator();
        const user = await accounts({
            name: name,
            email: email,
            password: encryptedPassword,
            identity: identity
        });
        const data = await user.save();
        AccountVerificationMail(name, email, identity);
        res.render("Register", { message: "Verify you email" });
    } catch (error) {
        console.log(error.message);
    }
}

const LoginAccount = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await accounts.findOne({ email: email });
        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                if (user.verified == true) {
                    req.session.identity = user.identity;
                    res.redirect("/dashboard");
                } else {
                    AccountVerificationMail(user.name, email, user.identity);
                    res.render("Login", { message: "Please verify you email" });
                }
            } else {
                res.render("Login", { message: "Invalid Credentials" });
            }
        } else {
            res.render("Login", { message: "Invalid Credentials" });
        }
    } catch (error) {
        console.log(error.message);
    }
}

const accountActivation = async (req, res) => {
    try {
        const { identity } = await req.query;
        const updateInfo = await accounts.updateOne({ identity: identity }, { $set: { verified: true } });
        res.render("verification_confirmed");
    } catch (error) {
        console.log(error.message);
    }
}

const RequestMailToResetPassword = async (req, res) => {
    try {
        res.render("RequestMailToResetPassword");
    } catch (error) {
        console.log(error.message);
    }
}

const SendResetPasswordMail = async (req, res) => {
    try {
        const { email } = req.body;
        const token = await identityGenerator();
        const user = await accounts.findOne({ email: email });
        if (user) {
            if (user.verified == true) {
                const AccountSetupForResetPassword = await accounts.updateOne({ identity: user.identity }, {
                    $set: {
                        token: token
                    }
                });
                PasswordChangeMail(user.name, email, user.identity, token);
                res.render("RequestMailToResetPassword", { message: "Check your mails to reset your password" });
            } else {
                AccountVerificationMail(user.name, email, user.identity);
                res.render("RequestMailToResetPassword", { message: "Please verify your email" });
            }
        } else {
            res.render("RequestMailToResetPassword", { message: "Invalid Credentials" });
        }
    } catch (error) {
        console.log(error.message);
    }
}

const EnterPasswordLoad = async (req, res) => {
    try {
        const { identity, token } = await req.query;
        res.render("EnterPassword", { identity, token });
    } catch (error) {
        console.log(error.message);
    }
}

const ChangePassword = async (req, res) => {
    try {
        const { identity, token, password } = await req.body;
        const newPassword = await encryptedPassCode(password);
        const user = await accounts.updateOne({ identity: identity, token: token }, { $set: { password: newPassword } });
        res.render("Login", { message: "Your password is changed successfully ✔" });
        const userData = await accounts.updateOne({ identity: identity, token: token }, { $set: { token: "" } });
    } catch (error) {
        console.log(error.message);
    }
}

const productLoad = async (req, res) => {
    try {
        if (!req.session.identity) {
            res.render("Products");
        } else {
            const user = await accounts.findOne({ identity: req.session.identity });
            const profile = "/accounts/" + user.profile
            res.render("Products", { user, profile });
        }
    } catch (error) {
        console.log(error.message);
    }
}

const LoadDashboard = async (req, res) => {
    try {
        const user = await accounts.findOne({ identity: req.session.identity });
        const profile = "/accounts/" + user.profile;
        const palettes = await Palette.find({ identity: req.session.identity });
        const filteredPalettes = palettes.map(palette => {
            return {
                ...palette._doc,
                colors: [
                    palette.color1,
                    palette.color2,
                    palette.color3,
                    palette.color4,
                    palette.color5,
                    palette.color6,
                    palette.color7,
                    palette.color8,
                    palette.color9,
                    palette.color10
                ].filter(color => color !== "")
            };
        });
        res.render("Dashboard", { user, profile, palettes: filteredPalettes });
    } catch (error) {
        console.log(error.message);
    }
};

const LoadProfile = async (req, res) => {
    try {
        const user = await accounts.findOne({ identity: req.session.identity });
        const profile = "/accounts/" + user.profile
        res.render("Profile", { user, profile });
    } catch (error) {
        console.log(error.message);
    }
}

const LemonColorLab = async (req, res) => {
    try {
        const user = await accounts.findOne({ identity: req.session.identity });
        const profile = "/accounts/" + user.profile;
        const newPalettes = await Palette.find({}).sort({ publishing_date: -1 });
        const trendingPalettes = await Palette.find({}).sort({ views: -1 });

        res.render("LemonColorLab", { user, profile, newPalettes, trendingPalettes });
    } catch (error) {
        console.log(error.message);
    }
};

const AddPalette = async (req, res) => {
    try {
        const user = await accounts.findOne({ identity: req.session.identity });
        const profile = "/accounts/" + user.profile
        res.render("addPalette", { user, profile });
    } catch (error) {
        console.log(error.message);
    }
}

const PublishingPalette = async (req, res) => {
    try {
        const identity = req.session.identity;
        const code = await identityGenerator();
        const { color1Hex, color2Hex, color3Hex, color4Hex, color5Hex, color6Hex, color7Hex, color8Hex, color9Hex, color10Hex, name, description, tags } = await req.body;
        const data = Palette({
            identity: identity,
            color1: color1Hex,
            color2: color2Hex,
            color3: color3Hex,
            color4: color4Hex,
            color5: color5Hex,
            color6: color6Hex,
            color7: color7Hex,
            color8: color8Hex,
            color9: color9Hex,
            color10: color10Hex,
            code: code,
            name: name,
            description: description,
            tags: tags
        });
        const saved = await data.save();
        const user = await accounts.findOne({ identity: req.session.identity });
        const profile = "/accounts/" + user.profile
        const newPalettes = await Palette.find({}).sort({ publishing_date: -1 });
        const trendingPalettes = await Palette.find({}).sort({ views: -1 });
        res.redirect("/lemon-color-lab");
    } catch (error) {
        console.log(error.message);
    }
}

const OpenPalette = async (req, res) => {
    try {
        const code = req.query.code;
        const palette = await Palette.findOne({ code: code });

        if (palette) {
            const views = palette.views + 1;
            await Palette.updateOne({ code: code }, { $set: { views: views } });
            const user = await accounts.findOne({ identity: req.session.identity });
            const profile = user ? "/accounts/" + user.profile : undefined;
            const author = await accounts.findOne({ identity: palette.identity });
            res.render("OpenPalette", { palette, user, profile, author });
        } else {
            res.status(404).send("Palette not found");
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
};

const FeedbackLoad = async (req, res) => {
    try {
        const user = await accounts.findOne({ identity: req.session.identity });
        const profile = "/accounts/" + user.profile
        res.render("FeedbackLoad", { user, profile });
    } catch (error) {
        console.log(error.message);
    }
}

const SendFeedback = async (req, res) => {
    try {
        const { Feedback } = req.body;
        const user = await accounts.findOne({ identity: req.session.identity });
        const name = user.name;
        FeedbacksMail(user.identity, name, Feedback);
        const profile = "/accounts/" + user.profile
        res.render("FeedbackLoad", { user, profile, message: "Feedback Delivered ✨" });
    } catch (error) {
        console.log(error.message);
    }
}

const TestimonialLoad = async (req, res) => {
    try {
        const user = await accounts.findOne({ identity: req.session.identity });
        const profile = "/accounts/" + user.profile
        res.render("TestimonialLoad", { user, profile });
    } catch (error) {
        console.log(error.message);
    }
}

const SendTestimonial = async (req, res) => {
    try {
        const { Testimonial } = req.body;
        const user = await accounts.findOne({ identity: req.session.identity });
        const profile = "/accounts/" + user.profile
        const testimonialsData = testimonials({
            name: user.name,
            Testimonials: Testimonial,
            identity: req.session.identity
        });
        const data = await testimonialsData.save();
        res.render("TestimonialLoad", { user, profile, message: "Testimonial Delivered" });
        TestimonialsMail(req.session.identity, user.name, Testimonial);
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    Load,
    LoadProfile,
    LoadLogin,
    LoadDashboard,
    LoadRegister,
    AddAccount,
    LoginAccount,
    accountActivation,
    RequestMailToResetPassword,
    SendResetPasswordMail,
    EnterPasswordLoad,
    ChangePassword,
    productLoad,
    LemonColorLab,
    AddPalette,
    PublishingPalette,
    OpenPalette,
    FeedbackLoad,
    SendFeedback,
    TestimonialLoad,
    SendTestimonial
};
