/* The above code is importing various modules and libraries using the `require` function in Node.js.
It is importing modules related to accounts, testimonials, palette, library, code, bcrypt for
encryption, nodemailer for sending emails, randomstring for generating random strings, fs for file
system operations, path for working with file paths, and cron for scheduling tasks. */
const accounts = require("../models/accounts");
const testimonials = require("../models/Testimonials");
const Palette = require("../models/Palette");
const Library = require("../models/Library");
const Code = require("../models/Code");
const ReedemCode = require("../models/ReedemCode");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const randomstring = require("randomstring");
const fs = require('fs');
const path = require('path');
const cron = require("node-cron");

const config = require("../config/config");

/**
 * The above functions are used to send different types of emails (account verification, password
 * change, testimonials, and feedback) using nodemailer in a Node.js application.
 * @param name - The `name` parameter in the functions represents the name of the recipient or sender
 * for the email communication. It is used to personalize the email content by addressing the
 * individual by their name.
 * @param email - The parameters used in the functions are as follows:
 * @param identity - The `identity` parameter in the functions represents a unique identifier
 * associated with a user or account. It is used to personalize the emails being sent and to provide
 * specific actions or information related to that particular user or account.
 */
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
                                <br>
                                <p>If button is not working you directly Paste this URL to verify your account: https://lemonteams.onrender.com/verify?identity=${identity}</p>
                                <br>
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

/**
 * The function `encryptedPassCode` uses bcrypt to hash a password with a salt round of 10 and returns
 * the hashed passcode asynchronously.
 * @param password - The `password` parameter is the plain text password that you want to encrypt using
 * the `bcrypt` library with a hashing cost factor of 10. The `encryptedPassCode` function takes this
 * password as input, hashes it using bcrypt, and returns the hashed passcode asynchronously.
 * @returns The `encryptedPassCode` function returns the hashed password generated using bcrypt with a
 * cost factor of 10.
 */
const encryptedPassCode = async (password) => {
    try {
        const passCode = await bcrypt.hash(password, 10);
        return passCode
    } catch (error) {
        console.log(error.message);
    }
};

/**
 * The function `identityGenerator` asynchronously generates a random string of 20 characters.
 * @returns The `identityGenerator` function is returning a promise that will resolve to a randomly
 * generated string of length 20.
 */
const identityGenerator = async () => {
    return randomstring.generate(20);
}

/**
 * The function `Load` asynchronously retrieves testimonials data and renders it in a view, handling
 * any errors that may occur.
 * @param req - The `req` parameter typically represents the request object in Node.js applications. It
 * contains information about the HTTP request that triggered the function. This object includes
 * properties such as headers, parameters, query strings, and more, allowing you to access and process
 * data sent from the client to the server.
 * @param res - The `res` parameter in the `Load` function is the response object in Node.js. It is
 * used to send a response back to the client making the request. In this case, the `res.render` method
 * is used to render a view template named "Load" and pass the `test
 * @returns The `Load` function is returning the rendered view "Load" along with the `testimonialsData`
 * object as a parameter.
 */
const Load = async (req, res) => {
    try {
        const testimonialsData = await testimonials.find();
        return res.render("Load", { testimonialsData });
    } catch (error) {
        console.log(error.message);
    }
};

/**
 * The function `LoadLogin` is an asynchronous function that renders a login page and catches any
 * errors that occur.
 * @param req - The `req` parameter typically represents the request object in Node.js applications. It
 * contains information about the HTTP request that triggered the function. This object includes
 * properties such as headers, parameters, query strings, and more, depending on the framework being
 * used (e.g., Express.js). In the provided code
 * @param res - The `res` parameter in the `LoadLogin` function is typically the response object in
 * Node.js. It is used to send a response back to the client making the request. In this case,
 * `res.render("Login")` is rendering a view named "Login" to be sent as the
 * @returns The `LoadLogin` function is returning the result of `res.render("Login")`, which is
 * rendering the "Login" view.
 */
const LoadLogin = async (req, res) => {
    try {
        return res.render("Login");
    } catch (error) {
        console.log(error.message);
    }
}

/**
 * The function `LoadRegister` is an asynchronous function that renders a "Register" page in a web
 * application.
 * @param req - The `req` parameter typically represents the request object in Node.js applications. It
 * contains information about the HTTP request that triggered the function. This object includes
 * properties such as headers, parameters, query strings, and more. In the context of an Express
 * application, `req` is often used to access data
 * @param res - The `res` parameter in the `LoadRegister` function is typically the response object in
 * Node.js. It is used to send a response back to the client making the request. In this case,
 * `res.render("Register")` is rendering the "Register" view to be sent back as the
 * @returns The `LoadRegister` function is returning a call to the `res.render("Register")` method,
 * which is rendering the "Register" view.
 */
const LoadRegister = async (req, res) => {
    try {
        return res.render("Register");
    } catch (error) {
        console.log(error.message);
    }
}

/**
 * The function `AddAccount` handles the process of creating a new user account, encrypting the
 * password, generating an identity, saving the account details, sending a verification email, and
 * rendering a message for email verification.
 * @param req - The `req` parameter typically represents the request object in Node.js applications. It
 * contains information about the HTTP request that triggered the function. This object includes
 * properties such as headers, body, method, URL, and more. In this context, `req` is likely an object
 * that contains the data sent
 * @param res - The `res` parameter in the `AddAccount` function is typically used to send a response
 * back to the client making the request. In this case, it is likely an instance of the response object
 * in Express.js, which allows you to send a response to the client with data or render a view
 * @returns The function `AddAccount` is returning a rendered view of the "Register" page with a
 * message "Verify your email" if the account creation process is successful.
 */
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
        await accounts.updateOne({ identity: identity }, { coin: 10 });
        return res.render("Register", { message: "Verify you email" });
    } catch (error) {
        console.log(error.message);
    }
}

/**
 * The function `LoginAccount` handles user login by checking credentials, verifying email, and
 * redirecting to the dashboard if verified.
 * @param req - The `req` parameter typically represents the request object in Node.js applications. It
 * contains information about the HTTP request that triggered the function. This object includes
 * properties such as `body` (containing the parsed request body), `params` (containing route
 * parameters), `query` (containing query
 * @param res - The `res` parameter in the `LoginAccount` function is the response object that is used
 * to send a response back to the client making the request. In this case, it is typically used to
 * render a view or redirect the user to another page based on the outcome of the login process.
 * @returns The `LoginAccount` function returns different responses based on the conditions:
 */
const LoginAccount = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await accounts.findOne({ email: email });
        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                if (user.verified == true) {
                    req.session.identity = user.identity;
                    return res.redirect("/dashboard");
                } else {
                    AccountVerificationMail(user.name, email, user.identity);
                    return res.render("Login", { message: "Please verify you email" });
                }
            } else {
                return res.render("Login", { message: "Invalid Credentials" });
            }
        } else {
            return res.render("Login", { message: "Invalid Credentials" });
        }
    } catch (error) {
        console.log(error.message);
    }
}

/**
 * The function `accountActivation` updates a user account to set the `verified` status to true based
 * on the provided identity and renders a verification confirmation page.
 * @param req - The `req` parameter typically represents the request object in Node.js applications
 * using frameworks like Express. It contains information about the HTTP request made by the client,
 * including headers, parameters, and body data. In this specific function `accountActivation`, `req`
 * is used to access the query parameters sent with
 * @param res - The `res` parameter in the `accountActivation` function is the response object that
 * will be sent back to the client making the request. It is used to send a response back to the
 * client, such as rendering a page or sending data. In the provided code snippet, the `res` object
 * @returns The function `accountActivation` is returning a call to the `res.render` method with the
 * argument "verification_confirmed". This means that the "verification_confirmed" template will be
 * rendered as the response to the client's request.
 */
const accountActivation = async (req, res) => {
    try {
        const { identity } = await req.query;
        const updateInfo = await accounts.updateOne({ identity: identity }, { $set: { verified: true } });
        return res.render("verification_confirmed");
    } catch (error) {
        console.log(error.message);
    }
}

/**
 * The function RequestMailToResetPassword renders a page for requesting a password reset via email.
 * @param req - The `req` parameter typically represents the request object in Node.js applications. It
 * contains information about the HTTP request that triggered the function. In this case, it is likely
 * an Express request object that is used to handle incoming requests to the server.
 * @param res - The `res` parameter in the `RequestMailToResetPassword` function is typically used to
 * send a response back to the client making the request. In this case, the function is rendering a
 * view named "RequestMailToResetPassword" and sending it as a response to the client.
 * @returns the rendered view "RequestMailToResetPassword".
 */
const RequestMailToResetPassword = async (req, res) => {
    try {
        return res.render("RequestMailToResetPassword");
    } catch (error) {
        console.log(error.message);
    }
}

/**
 * The function `SendResetPasswordMail` handles the process of sending reset password emails based on
 * user verification status and account existence.
 * @param req - req is the request object that contains information about the HTTP request that
 * triggered the function. It includes data such as request headers, parameters, body, and more. In
 * this specific function, the req object is used to extract the email from the request body to
 * initiate the password reset process for a user.
 * @param res - The `res` parameter in the `SendResetPasswordMail` function is typically used to send a
 * response back to the client making the request. In this case, it is likely an instance of the
 * response object in Express.js, which allows you to send a response to the client with data or render
 * @returns The function `SendResetPasswordMail` returns a rendered view with a message based on the
 * conditions met during the process of sending a reset password email. The possible return messages
 * are:
 * 1. "Check your mails to reset your password" if the user is verified and the token is successfully
 * set for password reset.
 * 2. "Please verify your email" if the user is not verified and an account verification
 */
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
                return res.render("RequestMailToResetPassword", { message: "Check your mails to reset your password" });
            } else {
                AccountVerificationMail(user.name, email, user.identity);
                return res.render("RequestMailToResetPassword", { message: "Please verify your email" });
            }
        } else {
            return res.render("RequestMailToResetPassword", { message: "Invalid Credentials" });
        }
    } catch (error) {
        console.log(error.message);
    }
}

/**
 * The function `EnterPasswordLoad` is an asynchronous function that retrieves `identity` and `token`
 * from the request query and renders the "EnterPassword" view with these values.
 * @param req - The `req` parameter typically represents the request object in Node.js applications. It
 * contains information about the HTTP request that triggered the function. This object includes
 * properties such as `query`, `params`, `body`, `headers`, and more, depending on the type of request
 * being made. In your code
 * @param res - The `res` parameter in the `EnterPasswordLoad` function is the response object that
 * will be sent back to the client making the request. It is used to send a response to the client,
 * such as rendering a template or sending data back in a specific format.
 * @returns The function `EnterPasswordLoad` is returning a call to the `res.render` method with the
 * parameters `{ identity, token }`. This means that the function is rendering a view named
 * "EnterPassword" and passing the `identity` and `token` values to that view.
 */
const EnterPasswordLoad = async (req, res) => {
    try {
        const { identity, token } = await req.query;
        return res.render("EnterPassword", { identity, token });
    } catch (error) {
        console.log(error.message);
    }
}

/**
 * The function `ChangePassword` updates a user's password and token in a database and renders a
 * success message in a login page.
 * @param req - The `req` parameter typically represents the request object in Node.js applications. It
 * contains information about the HTTP request that triggered the function. This object includes
 * properties such as headers, body, parameters, and more.
 * @param res - The `res` parameter in the `ChangePassword` function is typically used to send a
 * response back to the client making the request. In this case, it is likely an Express response
 * object that allows you to send data, such as rendering a view or sending JSON data, back to the
 * client.
 * @returns The function `ChangePassword` is returning a rendered view of the "Login" page with a
 * success message indicating that the password has been changed successfully.
 */
const ChangePassword = async (req, res) => {
    try {
        const { identity, token, password } = await req.body;
        const newPassword = await encryptedPassCode(password);
        const user = await accounts.updateOne({ identity: identity, token: token }, { $set: { password: newPassword } });
        const userData = await accounts.updateOne({ identity: identity, token: token }, { $set: { token: "" } });
        return res.render("Login", { message: "Your password is changed successfully ✔" });
    } catch (error) {
        console.log(error.message);
    }
}

/**
 * The function `productLoad` asynchronously loads user data and renders the "Products" page based on
 * the user's session identity.
 * @param req - The `req` parameter typically represents the request object in Node.js applications. It
 * contains information about the HTTP request that triggered the function, such as headers,
 * parameters, body content, and more. In this context, `req` is likely an object that holds data
 * related to the incoming request to the
 * @param res - The `res` parameter in the `productLoad` function is typically the response object in
 * Node.js. It is used to send a response back to the client making the request. In this case, it is
 * being used to render a view called "Products" and pass data (user and profile)
 * @returns If the `req.session.identity` is not set, the function will return a rendering of the
 * "Products" page without any additional data. If the `req.session.identity` is set, the function will
 * retrieve the user's information from the database and construct a profile URL based on that
 * information. Then, it will return a rendering of the "Products" page with the user's data and
 * profile URL
 */
const productLoad = async (req, res) => {
    try {
        if (!req.session.identity) {
            return res.render("Products");
        } else {
            const user = await accounts.findOne({ identity: req.session.identity });
            const profile = "/accounts/" + user.profile
            return res.render("Products", { user, profile });
        }
    } catch (error) {
        console.log(error.message);
    }
}

/**
 * The LoadDashboard function retrieves user data, palettes, and libraries based on the session
 * identity and renders the Dashboard template with the retrieved data.
 * @param req - `req` is the request object, which contains information about the HTTP request that
 * triggered the function. It includes properties like headers, parameters, body, query parameters, and
 * session data. In this function, `req` is used to access the session identity to retrieve
 * user-specific data.
 * @param res - The `res` parameter in the `LoadDashboard` function is the response object that will be
 * used to send the response back to the client making the request. In this case, it is typically used
 * to render the "Dashboard" view with the data retrieved from the database and passed as context to
 * the
 * @returns The `LoadDashboard` function is returning a rendered view of the "Dashboard" template with
 * the following data:
 */
const LoadDashboard = async (req, res) => {
    try {
        const user = await accounts.findOne({ identity: req.session.identity });
        const profile = "/accounts/" + user.profile;
        const palettes = await Palette.find({ identity: req.session.identity });
        const likedPalettes = await Palette.find({ liked: req.session.identity });
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
        const LikedFilteredPalettes = likedPalettes.map(palette => {
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
        const ourLibs = await Library.find({ identity: req.session.identity });
        const savedLibs = await Library.find({ saved: req.session.identity });
        return res.render("Dashboard", { user, profile, palettes: filteredPalettes, likedPalettes: LikedFilteredPalettes, ourLibs, savedLibs });
    } catch (error) {
        console.log(error.message);
    }
};

/**
 * The function LemonColorLab retrieves user information, user profile, new palettes, and trending
 * palettes to render in the LemonColorLab page.
 * @param req - The `req` parameter in the `LemonColorLab` function typically represents the HTTP
 * request object, which contains information about the incoming request from the client, such as the
 * request headers, parameters, body, and more. In this context, `req` is likely being used to access
 * the session
 * @param res - The `res` parameter in the `LemonColorLab` function is the response object that will be
 * sent back to the client making the request. It is used to send the response data back to the client,
 * typically in the form of rendering a template or sending JSON data.
 * @returns The function `LemonColorLab` is returning a rendered view named "LemonColorLab" along with
 * the following data:
 * - `user`: User information retrieved from the database based on the session identity
 * - `profile`: A string representing the user's profile
 * - `newPalettes`: An array of up to 30 public palettes sorted by sorting date in descending order
 * - `
 */
const LemonColorLab = async (req, res) => {
    try {
        const user = await accounts.findOne({ identity: req.session.identity });
        const profile = "/accounts/" + user.profile;
        const newPalettes = await Palette.find({ visibility: "public" }).sort({ sorting_date: -1 }).limit(30);
        const trendingPalettes = await Palette.find({ visibility: "public" }).sort({ views: -1 });
        const sponsered = await Palette.find({ visibility: "public", "sponser": true });
        return res.render("LemonColorLab", { user, profile, newPalettes, trendingPalettes, sponsered });
    } catch (error) {
        console.log(error.message);
    }
};

/**
 * The function AddPalette retrieves user information and renders the addPalette page with the user's
 * profile and configuration.
 * @param req - The `req` parameter typically represents the HTTP request object, which contains
 * information about the incoming request from the client, such as headers, parameters, and body data.
 * In this context, it is being used to access the session identity to find a user in the database.
 * @param res - The `res` parameter in the `AddPalette` function is typically the response object in
 * Express.js. It is used to send a response back to the client making the request. In this case, the
 * `res.render()` method is being used to render the "addPalette" view and pass data
 * @returns The function `AddPalette` is returning a rendered view called "addPalette" along with the
 * `user`, `profile`, and `config` variables as data to be used in the view.
 */
const AddPalette = async (req, res) => {
    try {
        const user = await accounts.findOne({ identity: req.session.identity });
        const profile = "/accounts/" + user.profile
        return res.render("addPalette", { user, profile, config });
    } catch (error) {
        console.log(error.message);
    }
}

/**
 * The function `PublishingPalette` saves a new color palette to a database and redirects to a specific
 * page.
 * @param req - The `req` parameter typically represents the HTTP request in Express.js. It contains
 * information about the request made by the client, such as the request headers, parameters, body, and
 * session data. In your code snippet, `req` is used to access the session identity and the body of the
 * request
 * @param res - The `res` parameter in the `PublishingPalette` function is the response object that
 * will be used to send a response back to the client making the request. In this case, it is likely an
 * instance of the Express.js response object that allows you to send responses, set headers, and
 * perform
 */
const PublishingPalette = async (req, res) => {
    try {
        const identity = req.session.identity;
        const code = await identityGenerator();
        const { color1Hex, color2Hex, color3Hex, color4Hex, color5Hex, color6Hex, color7Hex, color8Hex, color9Hex, color10Hex, name, description, tags, visibility } = await req.body;
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
            tags: tags,
            visibility: visibility
        });
        const saved = await data.save();
        const user = await accounts.findOne({ identity: req.session.identity });
        let coin = user.coin + 2;
        await accounts.updateOne({ identity: req.session.identity }, { coin: coin })
        user.notifications.push({
            app: "Team won",
            comment: '',
            name: "2"
        });
        await user.save();
        const profile = "/accounts/" + user.profile
        const newPalettes = await Palette.find({}).sort({ publishing_date: -1 });
        const trendingPalettes = await Palette.find({}).sort({ views: -1 });
        res.redirect("/lemon-color-lab");
    } catch (error) {
        console.log(error.message);
    }
}

/**
 * The function `OpenPalette` retrieves a palette based on a provided code, updates its view counts,
 * and renders the palette information along with user details if found, handling errors appropriately.
 * @param req - The `req` parameter in the `OpenPalette` function is typically an object representing
 * the HTTP request. It contains information about the request made by the client, such as the request
 * headers, parameters, body, query parameters, and more. In this function, `req.query.code` is used to
 * @param res - The `res` parameter in the `OpenPalette` function is the response object that will be
 * used to send a response back to the client making the request. It is typically used to send data,
 * render a view, or send an error status in response to the client's request.
 * @returns The `OpenPalette` function returns either a rendered view with data including
 * `isPaletteOurs`, `palette`, `user`, `profile`, and `author` if the palette is found, or a 404 status
 * with the message "Palette not found" if the palette is not found. If an error occurs during the
 * process, it returns a 500 status with the message "Internal server error
 */
const OpenPalette = async (req, res) => {
    try {
        const code = req.query.code;
        const palette = await Palette.findOne({ code: code });
        let isPaletteOurs = false;
        if (palette) {
            const views = palette.views + 1;
            const weekly = palette.weeklyViews + 1;
            await Palette.updateOne({ code: code }, { $set: { views: views, weeklyViews: weekly } });
            const user = await accounts.findOne({ identity: req.session.identity });
            const profile = user ? "/accounts/" + user.profile : undefined;
            const author = await accounts.findOne({ identity: palette.identity });
            if (author.identity == req.session.identity) {
                isPaletteOurs = true;
            }
            return res.render("OpenPalette", { isPaletteOurs, palette, user, profile, author });
        } else {
            return res.status(404).send("Palette not found");
        }
    } catch (error) {
        console.error(error.message);
        return res.status(500).send("Internal server error");
    }
};

/**
 * The function `DeletePalette` deletes a palette based on a provided code and redirects to a specific
 * page.
 * @param req - The `req` parameter in the `DeletePalette` function typically represents the request
 * object, which contains information about the HTTP request that triggered the function. This object
 * includes data such as request headers, parameters, body, URL, and more. In this specific function,
 * `req.body.code` is used
 * @param res - The `res` parameter in the `DeletePalette` function is the response object that
 * represents the HTTP response that an Express app sends when it receives an HTTP request. It is used
 * to send a response back to the client making the request. In this function, `res` is used to
 * redirect the
 * @returns The DeletePalette function is returning a redirect response to the "/lemon-color-lab"
 * route. This redirect is being sent in both the success and error cases within the try-catch block.
 */
const DeletePalette = async (req, res) => {
    try {
        const code = req.body.code;
        if (!code) {
            throw new Error("Palette code is required");
        }
        const result = await Palette.deleteOne({ code: code });
        if (result.deletedCount > 0) {
        } else {
            console.log(`No palette found with code ${code}.`);
        }
        return res.redirect("/lemon-color-lab");
    } catch (error) {
        console.log(error.message);
        return res.redirect("/lemon-color-lab");
    }
};


/**
 * The function `FeedbackLoad` retrieves user information and renders a feedback page with the user's
 * profile.
 * @param req - The `req` parameter typically represents the request object in Node.js applications. It
 * contains information about the HTTP request that triggered the function. In this case, it is likely
 * an Express.js request object that contains data such as request headers, parameters, query strings,
 * and more.
 * @param res - The `res` parameter in the `FeedbackLoad` function is the response object that
 * represents the HTTP response that an Express app sends when it receives an HTTP request. It is used
 * to send a response back to the client making the request. In this function, `res` is used to render
 * the
 * @returns The function `FeedbackLoad` is returning the result of rendering the "FeedbackLoad"
 * template with the `user` and `profile` data.
 */
const FeedbackLoad = async (req, res) => {
    try {
        const user = await accounts.findOne({ identity: req.session.identity });
        const profile = "/accounts/" + user.profile
        return res.render("FeedbackLoad", { user, profile });
    } catch (error) {
        console.log(error.message);
    }
}

/**
 * The function `SendFeedback` retrieves user feedback, sends it via email, and renders a confirmation
 * message on the webpage.
 * @param req - The `req` parameter typically represents the HTTP request in a Node.js application. It
 * contains information about the request made by the client, such as the request headers, parameters,
 * body, and more. In the provided code snippet, `req` is being used to access the `body` property,
 * @param res - The `res` parameter in the `SendFeedback` function is typically used to send a response
 * back to the client making the request. In this case, it is likely an Express response object that
 * allows you to send a response to the client with data or render a specific view.
 * @returns The function `SendFeedback` is returning a rendered view called "FeedbackLoad" with the
 * following data: `user`, `profile`, and `message`. The `user` and `profile` variables are being
 * passed to the view to display user information and profile link, while the `message` variable
 * contains the text "Feedback Delivered ✨".
 */
const SendFeedback = async (req, res) => {
    try {
        const { Feedback } = req.body;
        const user = await accounts.findOne({ identity: req.session.identity });
        const name = user.name;
        FeedbacksMail(user.identity, name, Feedback);
        const profile = "/accounts/" + user.profile
        return res.render("FeedbackLoad", { user, profile, message: "Feedback Delivered ✨" });
    } catch (error) {
        console.log(error.message);
    }
}

/**
 * The TestimonialLoad function retrieves user information and renders a testimonial page with the
 * user's profile.
 * @param req - The `req` parameter typically represents the request object in Node.js applications. It
 * contains information about the HTTP request that triggered the function. This information includes
 * headers, parameters, body content, and more. In the provided code snippet, `req` is likely being
 * used to access the session identity to find
 * @param res - The `res` parameter in the `TestimonialLoad` function is the response object in
 * Express.js. It is used to send a response back to the client making the request. In this case, the
 * `res.render` method is used to render a view template named "TestimonialLoad" and
 * @returns The TestimonialLoad function is returning the rendered view "TestimonialLoad" along with
 * the user object and the profile URL.
 */
const TestimonialLoad = async (req, res) => {
    try {
        const user = await accounts.findOne({ identity: req.session.identity });
        const profile = "/accounts/" + user.profile
        return res.render("TestimonialLoad", { user, profile });
    } catch (error) {
        console.log(error.message);
    }
}

/**
 * The function `SendTestimonial` saves a testimonial provided in the request body to the database,
 * sends a testimonial email, and renders a page with a success message.
 * @param req - The `req` parameter in the `SendTestimonial` function is an object representing the
 * HTTP request. It contains information about the request made by the client to the server, such as
 * the request headers, body, parameters, and more. In this function, `req` is used to access the
 * @param res - The `res` parameter in the `SendTestimonial` function is typically used to send a
 * response back to the client making the request. In this case, it is likely an Express response
 * object that allows you to send data back to the client, such as rendering a template or sending a
 * JSON response
 * @returns The function `SendTestimonial` is returning a rendered view called "TestimonialLoad" with
 * the variables `user`, `profile`, and `message: "Testimonial Delivered"`.
 */
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
        TestimonialsMail(req.session.identity, user.name, Testimonial);
        return res.render("TestimonialLoad", { user, profile, message: "Testimonial Delivered" });
    } catch (error) {
        console.log(error.message);
    }
}

/**
 * The function Logout asynchronously destroys the session and redirects the user to the homepage.
 * @param req - The `req` parameter typically represents the request object in Node.js applications. It
 * contains information about the HTTP request that was made, such as headers, parameters, and body
 * data. In this context, `req` is being used to access the session object to destroy the user's
 * session when they log
 * @param res - The `res` parameter in the `Logout` function is typically the response object in
 * Node.js. It is used to send a response back to the client making the request. In this case, the
 * `res` object is being used to redirect the user to the homepage ("/") after destroying the session
 * @returns The `Logout` function is returning a redirection to the root URL ("/") after destroying the
 * session.
 */
const Logout = async (req, res) => {
    try {
        req.session.destroy();
        return res.redirect("/");
    } catch (error) {
        console.log(error.message);
    }
}

/**
 * The function `DeleteAccount` deletes a user account and associated data if the user is
 * authenticated, otherwise it returns a failure message.
 * @param req - The `req` parameter typically represents the HTTP request in Node.js applications. It
 * contains information about the request made by the client, such as the URL, headers, parameters, and
 * body data. In the provided code snippet, `req` is used to access the session data stored in
 * `req.session
 * @param res - The `res` parameter in the `DeleteAccount` function is the response object that is used
 * to send a response back to the client making the request. In this case, it is likely an instance of
 * the Express.js response object that allows you to send data, set headers, and manage the response
 * @returns The function `DeleteAccount` is returning a response based on the outcome of the account
 * deletion process. If the account deletion is successful, it will redirect the user to the homepage
 * ("/"). If there is an error during the deletion process, the error message will be logged to the
 * console. If there is no identity in the session, it will return a response of "Account Deletion
 * Failed".
 */
const DeleteAccount = async (req, res) => {
    try {
        const identity = req.session.identity;
        if (identity) {
            const data = await Palette.deleteMany({ identity: req.session.identity });
            const user = await accounts.deleteOne({ identity: req.session.identity });
        } else {
            return res.send("Account Deletion Failed");
        }
        req.session.destroy();
        return res.redirect("/");
    } catch (error) {
        console.log(error.message);
    }
}

/**
 * The function `SaveProfile` updates user profile information and redirects to the dashboard page in a
 * Node.js application.
 * @param req - The `req` parameter in the `SaveProfile` function stands for the request object. It
 * contains information about the HTTP request made to the server, including the request headers,
 * parameters, body, and more. In this context, `req` is used to access data sent from the client-side,
 * @param res - The `res` parameter in the `SaveProfile` function is the response object that will be
 * used to send a response back to the client making the request. In this case, it is typically used to
 * redirect the user to the "/dashboard" route after saving the profile information.
 * @returns The `SaveProfile` function returns a redirection to "/dashboard" if the profile update is
 * successful. If an error occurs during the process, the function catches the error and logs the error
 * message to the console.
 */
const SaveProfile = async (req, res) => {
    try {
        const identity = req.session.identity;
        const {
            pronounce = '',
            description = '',
            titleLink1 = '',
            titleLink2 = '',
            titleLink3 = '',
            titleLink4 = '',
            link1 = '',
            link2 = '',
            link3 = '',
            link4 = ''
        } = req.body;

        const trimmedPronounce = pronounce.trim();
        const trimmedDescription = description.trim();
        const trimmedTitleLink1 = titleLink1.trim();
        const trimmedTitleLink2 = titleLink2.trim();
        const trimmedTitleLink3 = titleLink3.trim();
        const trimmedTitleLink4 = titleLink4.trim();
        const trimmedLink1 = link1.trim();
        const trimmedLink2 = link2.trim();
        const trimmedLink3 = link3.trim();
        const trimmedLink4 = link4.trim();

        const updateFields = {
            pronounce: trimmedPronounce,
            description: trimmedDescription,
            linkTitle1: trimmedTitleLink1,
            linkTitle2: trimmedTitleLink2,
            linkTitle3: trimmedTitleLink3,
            linkTitle4: trimmedTitleLink4,
            link1: trimmedLink1,
            link2: trimmedLink2,
            link3: trimmedLink3,
            link4: trimmedLink4
        };

        const user = await accounts.findOne({ identity: identity });

        if (req.file) {
            if (user.profile && user.profile !== 'default.png') {
                const oldImagePath = path.join(__dirname, '../public/accounts', user.profile);
                fs.unlink(oldImagePath, (err) => {
                    if (err) {
                        console.error("Failed to delete old profile image:", err);
                    }
                });
            }

            updateFields.profile = req.file.filename;
        }

        await accounts.updateOne({ identity: identity }, { $set: updateFields });

        return res.redirect("/dashboard");
    } catch (error) {
        console.log(error.message);
    }
}

/**
 * The LoadProfile function retrieves user profile information and renders it on a web page, handling
 * cases where the profile being viewed is the user's own or someone else's.
 * @param req - The `req` parameter in the `LoadProfile` function is typically an object representing
 * the HTTP request. It contains information about the request made by the client, such as the request
 * headers, parameters, body, and more. In this function, `req` is used to access the session identity,
 * @param res - The `res` parameter in the `LoadProfile` function is the response object that will be
 * sent back to the client making the request. It is used to send a response to the client, typically
 * by rendering a view template with data or sending JSON data back.
 * @returns The function `LoadProfile` is returning a rendered view called "Profile" along with the
 * following data as an object:
 * - `showProfile`: The profile of the user identified by the `identity` parameter in the request
 * - `profileUser`: The user object retrieved from the database based on the `identity` parameter
 * - `user`: The user object retrieved from the database based on the `
 */
const LoadProfile = async (req, res) => {
    try {
        let isOurProfile = true;
        let user = await accounts.findOne({ identity: req.session.identity });
        const profile = "/accounts/" + user.profile;
        const identity = await req.params.identity;
        if (identity == req.session.identity) {
            isOurProfile = true
        } else {
            isOurProfile = false
        }
        const profileUser = await accounts.findOne({ identity: identity });
        let showProfile;
        if (profileUser) {
            showProfile = await "/accounts/" + profileUser.profile;
        }
        return res.render("Profile", { showProfile, profileUser, user, profile, isOurProfile });
    } catch (error) {
        console.log(error.message);
    }
}

/**
 * The function `RestoreProfileToDefault` updates a user's profile image to the default image and
 * redirects to the dashboard page.
 * @param req - The `req` parameter in the `RestoreProfileToDefault` function typically represents the
 * HTTP request object, which contains information about the incoming request from the client, such as
 * the request headers, parameters, body, and more. It is commonly used in web development with
 * frameworks like Express.js in Node.js
 * @param res - The `res` parameter in the `RestoreProfileToDefault` function is typically used to send
 * a response back to the client in an Express.js application. In this case, it is being used to
 * redirect the user to the "/dashboard" route after updating the user's profile to the default image
 * ("
 * @returns If the `updateUser` operation is successful, the function will return a redirect response
 * to "/dashboard".
 */
const RestoreProfileToDefault = async (req, res) => {
    try {
        const identity = req.session.identity;
        const user = await accounts.findOne({ identity: identity });
        if (user.profile && user.profile !== 'default.png') {
            const oldImagePath = path.join(__dirname, '../public/accounts', user.profile);
            fs.unlink(oldImagePath, (err) => {
                if (err) {
                    console.error("Failed to delete old profile image:", err);
                }
            });
        }
        const updateUser = await accounts.updateOne({ identity: identity }, { $set: { profile: "default.png" } });
        if (updateUser) {
            return res.redirect("/dashboard");
        }
    } catch (error) {
        console.log(error.message);
    }
}

/**
 * The function `PrivacyAndPolicies` retrieves user information and renders a privacy and policies page
 * with the user's profile.
 * @param req - The `req` parameter typically represents the request object in Node.js applications. It
 * contains information about the HTTP request that triggered the function, such as headers,
 * parameters, and body data. In this specific function `PrivacyAndPolicies`, `req` is likely used to
 * access the session identity to find
 * @param res - The `res` parameter in the `PrivacyAndPolicies` function is the response object that
 * will be sent back to the client making the request. It is used to send the response data back to the
 * client, such as rendering a template or sending JSON data.
 * @returns The `PrivacyAndPolicies` function is returning a rendered view named "PrivacyAndPolicies"
 * along with the `user` object and the `profile` variable as data to be passed to the view.
 */
const PrivacyAndPolicies = async (req, res) => {
    try {
        const user = await accounts.findOne({ identity: req.session.identity });
        const profile = "/accounts/" + user.profile
        return res.render("PrivacyAndPolicies", { user, profile });
    } catch (error) {
        console.log(error);
    }
}

/**
 * The function `Solutions` retrieves a user's profile information and renders the "Solutions" page
 * with the user's data.
 * @param req - The `req` parameter typically represents the request object in Node.js applications. It
 * contains information about the HTTP request that triggered the function. In this case, it is likely
 * an Express request object that contains data such as request headers, parameters, query strings, and
 * more.
 * @param res - The `res` parameter in the `Solutions` function is typically used to send a response
 * back to the client in an Express.js application. It represents the response object that contains
 * methods for sending responses to the client, such as rendering a view or sending JSON data. In this
 * case, the `
 * @returns The Solutions function returns a rendered view of the "Solutions" page with the user object
 * and the profile URL as context data.
 */
const Solutions = async (req, res) => {
    try {
        const user = await accounts.findOne({ identity: req.session.identity });
        const profile = "/accounts/" + user.profile
        return res.render("Solutions", { user, profile });
    } catch (error) {
        console.log(error.message);
    }
}

/**
 * The function `Donate` retrieves a user's profile information and renders a donation page with the
 * user's details.
 * @param req - The `req` parameter typically represents the request object in Node.js applications. It
 * contains information about the HTTP request that triggered the function, such as request headers,
 * parameters, body, and session data. In the provided code snippet, `req` is used to access the
 * `session.identity` property to
 * @param res - The `res` parameter in the `Donate` function is the response object that will be sent
 * back to the client making the request. It is used to send a response to the client, such as
 * rendering a template or sending data back in a specific format.
 * @returns The function `Donate` is returning a rendered view called "Donate" along with the `user`
 * object and the `profile` variable.
 */
const Donate = async (req, res) => {
    try {
        const user = await accounts.findOne({ identity: req.session.identity });
        const profile = "/accounts/" + user.profile
        return res.render("Donate", { user, profile });
    } catch (error) {
        console.log(error.message);
    }
}

/**
 * The function `JoinLemonTeams` retrieves user information and renders a page with the user's profile.
 * @param req - The `req` parameter typically represents the HTTP request object, which contains
 * information about the incoming request from the client to the server. This object includes
 * properties such as headers, parameters, query strings, and the request body. In the provided code
 * snippet, `req` is likely being used to access the
 * @param res - The `res` parameter in the `JoinLemonTeams` function is typically used to send a
 * response back to the client making the request. In this case, it is likely an object representing
 * the response that will be sent back to the client. The `res.render` method is commonly used in
 * @returns The function `JoinLemonTeams` is returning a rendered view called "JoinLemonTeams" along
 * with the `user` object and the `profile` variable.
 */
const JoinLemonTeams = async (req, res) => {
    try {
        const user = await accounts.findOne({ identity: req.session.identity });
        const profile = "/accounts/" + user.profile
        return res.render("JoinLemonTeams", { user, profile });
    } catch (error) {
        console.log(error.message);
    }
}

/**
 * The function Support retrieves user information and renders a support page with the user's profile.
 * @param req - The `req` parameter typically represents the HTTP request in a Node.js application. It
 * contains information about the request made by the client, such as the URL, headers, parameters, and
 * body data. In the provided code snippet, `req` is likely being used to access the session identity
 * of the
 * @param res - The `res` parameter in the code snippet refers to the response object in Node.js. It is
 * used to send a response back to the client making the request. In this case, the `res` object is
 * being used to render the "Support" view with the user and profile data.
 * @returns The Support function is returning a rendered view of the "Support" page with the user data
 * and profile information passed as variables to the view.
 */
const Support = async (req, res) => {
    try {
        const user = await accounts.findOne({ identity: req.session.identity });
        const profile = "/accounts/" + user.profile
        return res.render("Support", { user, profile });
    } catch (error) {
        console.log(error.message);
    }
}

/**
 * The function `GetHelp` retrieves user information, sends feedback via email, and redirects to the
 * dashboard page.
 * @param req - The `req` parameter typically represents the request object in Node.js applications. It
 * contains information about the HTTP request that triggered the function. This object includes
 * properties such as headers, parameters, body, and session data. In the provided code snippet, `req`
 * is likely being used to access the session
 * @param res - The `res` parameter in the `GetHelp` function is typically used to send a response back
 * to the client making the request. In this case, it is likely an Express response object that allows
 * you to send data back to the client, such as redirecting to a different page using `res
 * @returns The function `GetHelp` is returning a redirection to the "/dashboard" route after sending a
 * feedback email to the user based on the help request submitted in the request body.
 */
const GetHelp = async (req, res) => {
    try {
        const user = await accounts.findOne({ identity: req.session.identity });
        const help = req.body.help;
        FeedbacksMail(user.identity, user.name, help);
        return res.redirect("/dashboard");
    } catch (error) {
        console.log(error.message)
    }
}

/**
 * The function `LibraryLoad` asynchronously loads user account information and library data to render
 * a library page with new and trending libraries.
 * @param req - The `req` parameter in the `LibraryLoad` function is typically an object representing
 * the HTTP request. It contains information about the request made by the client to the server, such
 * as the request headers, parameters, body, and more. In this context, `req` is used to access the
 * @param res - The `res` parameter in the `LibraryLoad` function is typically used to send a response
 * back to the client making the request. In this case, it is likely an Express response object that
 * allows you to send data, render a view, or redirect the client to another URL.
 * @returns The function `LibraryLoad` is returning a rendered view called "Library" along with the
 * following data as an object:
 * - `user`: The user object retrieved from the database based on the session identity
 * - `profile`: A string representing the user's profile URL
 * - `NewLibs`: An array of the newest 50 library items sorted by `sorting_date` in descending order
 * -
 */
const LibraryLoad = async (req, res) => {
    try {
        const user = await accounts.findOne({ identity: req.session.identity });
        const profile = "/accounts/" + user.profile;
        const NewLibs = await Library.find({}).sort({ sorting_date: -1 }).limit(50);
        const TrendingLibs = await Library.find({}).sort({ views: -1 }).limit(50);
        const allLibs = await Library.find({});
        return res.render("Library", { user, profile, NewLibs, TrendingLibs, allLibs });
    } catch (error) {
        console.log(error);
    }
}

/**
 * The function `CreateLibraryLoad` retrieves user information and renders a page with the user's
 * profile.
 * @param req - The `req` parameter typically represents the HTTP request object, which contains
 * information about the client's request such as the URL, headers, parameters, and body. In the
 * provided code snippet, `req` is likely being used to access the session identity of the user making
 * the request.
 * @param res - The `res` parameter in the `CreateLibraryLoad` function is typically used to send a
 * response back to the client in an Express.js application. It represents the response object that
 * contains methods for sending responses to the client, such as rendering a view or sending JSON data.
 * In this case, the
 * @returns The function `CreateLibraryLoad` is returning a call to the `res.render` method with the
 * parameters "CreateLibraryLoad", { profile, user }. This means that the "CreateLibraryLoad" view will
 * be rendered with the data passed in the `profile` and `user` variables.
 */
const CreateLibraryLoad = async (req, res) => {
    try {
        const user = await accounts.findOne({ identity: req.session.identity });
        const profile = "/accounts/" + user.profile;
        return res.render("CreateLibraryLoad", { profile, user });
    } catch (error) {
        console.log(error.message);
    }
}

/**
 * The function `CreatingLibrary` creates a new library entry with provided name, description, and
 * tags, generates an identity code, and saves the entry to the database.
 * @param req - `req` is the request object that contains information about the HTTP request made to
 * the server. It includes data such as request headers, parameters, body, and session information. In
 * the provided code snippet, `req.body` is used to extract the `name`, `description`, and `tags`
 * @param res - The `res` parameter in the `CreatingLibrary` function is typically used to send a
 * response back to the client making the request. In this case, it is likely an instance of the
 * response object in an Express.js application. The `res` object allows you to send a response with
 * data,
 * @returns The function `CreatingLibrary` is returning a redirection response to the URL
 * `/library/${created.code}` if the library creation is successful. If there is an error during the
 * creation process, it will log "error in creating library" to the console. If there is an error
 * caught in the try-catch block, it will log the error message to the console.
 */
const CreatingLibrary = async (req, res) => {
    try {
        const { name, description, tags } = await req.body;
        const user = await accounts.findOne({ identity: req.session.identity });
        let code = await identityGenerator();
        const LibraryPublishing = await Library({
            name: name,
            description: description,
            tags: tags,
            code: code,
            identity: req.session.identity
        });
        let coin = user.coin + 5
        await accounts.updateOne({ identity: req.session.identity }, { coin: coin });
        user.notifications.push({
            app: "Team won",
            comment: '',
            name: "5"
        });
        await user.save();
        const created = await LibraryPublishing.save();
        if (created) {
            return res.redirect(`/library/${created.code}`);
        } else {
            console.log("error in creating library");
        }
    } catch (error) {
        console.log(error.message);
    }
}

/**
 * The function `deleteLibrary` deletes a library and associated codes based on a given code parameter.
 * @param req - The `req` parameter typically represents the HTTP request in a Node.js application. It
 * contains information about the request made by the client, such as the URL, headers, parameters, and
 * body data. In this context, `req.params.code` is likely extracting a parameter named `code` from the
 * @param res - The `res` parameter in the `deleteLibrary` function is the response object that will be
 * sent back to the client making the request. It is used to send a response back to the client, such
 * as redirecting to another page or sending a status code.
 * @returns If the deletion of the library and library codes is successful, a redirect to '/library' is
 * being returned. If the deletion is not successful, a message "Failed to delete the library" is being
 * logged to the console.
 */
const deleteLibrary = async (req, res) => {
    try {
        const code = req.params.code;
        const lib = await Library.findOne({ code: code });
        const libraryCodes = await Code.deleteMany({ token: { $in: lib.library } });
        const deletion = await Library.deleteOne({ code: code });
        if (deletion && libraryCodes) {
            return res.redirect('/library');
        } else {
            console.log("Failed to delete the library");
        }
    } catch (error) {
        console.log(error.message);
    }
}

/**
 * The function `AddCodeLoad` retrieves user information and renders a page with the user's profile and
 * a specific code.
 * @param req - The `req` parameter typically represents the request object in Node.js applications. It
 * contains information about the HTTP request that triggered the function. This includes details such
 * as the request headers, parameters, body, URL, and more. In the provided code snippet, `req` is used
 * to access the session
 * @param res - The `res` parameter in the `AddCodeLoad` function is typically the response object in
 * Node.js. It is used to send a response back to the client making the request. In this case, it is
 * being used to render the "AddCodeLibrary" view with the user, profile,
 * @returns The function `AddCodeLoad` is returning a rendered view called "AddCodeLibrary" along with
 * the `user`, `profile`, and `code` variables as data to be passed to the view.
 */
const AddCodeLoad = async (req, res) => {
    try {
        const user = await accounts.findOne({ identity: req.session.identity });
        const profile = "/accounts/" + user.profile;
        const code = req.params.code;
        return res.render("AddCodeLibrary", { user, profile, code });
    } catch (error) {
        console.log(error.message);
    }
}

/**
 * The function `AddingCodeToLibrary` adds a new code entry to a library, updating the library's
 * version and tokens accordingly.
 * @param req - The `req` parameter in the function `AddingCodeToLibrary` typically represents the HTTP
 * request object, which contains information about the incoming request from the client. This object
 * includes properties such as headers, parameters, body, and more, depending on the type of request
 * being made (GET, POST,
 * @param res - The `res` parameter in the `AddingCodeToLibrary` function is typically the response
 * object in Node.js applications. It is used to send a response back to the client making the request.
 * In this context, `res` is likely an instance of the response object that will be used to redirect
 * @returns A redirect response to `/library/` is being returned if the code addition process
 * is successful.
 */
const AddingCodeToLibrary = async (req, res) => {
    try {
        const { name, description, code, file } = req.body;
        const libCode = req.params.code;
        const Lib = await Library.findOne({ code: libCode });
        let version = Lib.LTS_version + 1;
        const token = await identityGenerator();
        if (Lib) {
            const Add = await Code({
                name: name,
                code: code,
                description: description,
                version: version,
                token: token,
                file: file
            });
            const saveCode = await Add.save();
            if (saveCode) {
                const updateLibTokens = await Library.updateOne({ code: libCode }, { $push: { library: token } });
                const user = await accounts.findOne({ identity: req.session.identity });
                let coin = user.coin + 10
                await accounts.updateOne({ identity: req.session.identity }, { coin: coin });
                user.notifications.push({
                    app: "Team won",
                    comment: '',
                    name: "10"
                });
                await user.save();
                if (updateLibTokens) {
                    const updateVersion = await Library.updateOne({ code: libCode }, { $set: { LTS_version: version } });
                    if (updateVersion) {
                        return res.redirect(`/library/${libCode}`);
                    }
                }
            }
        }
    } catch (error) {
        console.log(error.message);
    }
}

/**
 * The function `LoadLibrary` retrieves a library based on a provided code, checks ownership, and
 * renders a collection of library codes along with owner information.
 * @param req - The `req` parameter in the `LoadLibrary` function is typically an object representing
 * the HTTP request. It contains information about the request made by the client, such as the request
 * headers, parameters, body, and more. In this function, `req` is used to access the parameters sent
 * in
 * @param res - The `res` parameter in the `LoadLibrary` function is the response object that will be
 * used to send a response back to the client making the request. It is typically used to send HTTP
 * responses with data or status codes. In the provided code snippet, `res` is used to send different
 * @returns The `LoadLibrary` function returns either a rendered view of the "LibraryCollection"
 * template with the user, profile, library, isLibOurs, libraryCodes, and owner data, or an error
 * message "Library not found" if the library is not found, or "Server Error" if there is a server
 * error.
 */
const LoadLibrary = async (req, res) => {
    try {
        let isLibOurs = false;
        const code = req.params.code;
        const user = await accounts.findOne({ identity: req.session.identity });
        const profile = "/accounts/" + user.profile;
        const library = await Library.findOne({ code: code });
        if (!library) {
            return res.status(404).send("Library not found");
        }
        if (library.identity === user.identity) {
            isLibOurs = true;
        }
        const libraryCodes = await Code.find({ token: { $in: library.library } });
        const owner = await accounts.findOne({ identity: library.identity });
        return res.render("LibraryCollection", {
            user,
            profile,
            library,
            isLibOurs,
            libraryCodes,
            owner
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Server Error");
    }
};

/**
 * The function `LoadCodeDetails` retrieves code details based on a token and user identity, rendering
 * them on a webpage.
 * @param req - The `req` parameter typically represents the request object in Node.js applications. It
 * contains information about the HTTP request that triggered the function. This information includes
 * details such as the request headers, parameters, body, URL, and more.
 * @param res - The `res` parameter in the `LoadCodeDetails` function is typically used to send a
 * response back to the client making the request. In this case, it is likely an Express response
 * object that allows you to send data, render a view, or send an error response back to the client.
 * @returns The function `LoadCodeDetails` is returning a rendered view called "CodeDetails" along with
 * the `code`, `profile`, `user`, and `token` data to be displayed in the view.
 */
const LoadCodeDetails = async (req, res) => {
    try {
        const { token } = req.params;
        const user = await accounts.findOne({ identity: req.session.identity });
        const profile = "/accounts/" + user.profile;
        const code = await Code.findOne({ token: token });
        return res.render("CodeDetails", { code, profile, user, token });
    } catch (error) {
        console.log(error.message);
    }
}

/**
 * The function `ImportedLinks` retrieves code based on a token, updates view count for a library, and
 * sends the code in a response.
 * @param req - The `req` parameter typically represents the HTTP request that is being made to the
 * server. It contains information about the request such as headers, parameters, body, and more. In
 * this specific function, `req` is being used to extract the `token` from the request parameters.
 * @param res - The `res` parameter in the function `ImportedLinks` is typically used to send a
 * response back to the client making the request. In this case, it is the response object representing
 * the HTTP response that the server sends when it receives a request. The `res.send(code.code)`
 * statement in
 * @returns The code is returning the `code` property of the `code` object found in the database.
 */
const ImportedLinks = async (req, res) => {
    try {
        const token = req.params.token;
        const code = await Code.findOne({ token: token });
        const updateFields = await Library.findOne({ library: token });
        if (updateFields) {
            const views = parseInt(updateFields.views) + 1;
            const libraryViews = await Library.updateOne({ library: token }, { $set: { views: views } });
            const user = await accounts.findOne({ identity: req.session.identity });
            let coin = user.coin + 0.01;
            await accounts.updateOne({ identity: req.session.identity }, {
                coin: coin
            });
            user.notifications.push({
                app: "Team won",
                comment: '',
                name: "0.01"
            });
            await user.save();
        };
        return res.send(code.code);
    } catch (error) {
        console.log(error.message);
    }
}

/**
 * The function `GetPalettes` fetches public palettes from a database, sorts them by views in
 * descending order, and implements pagination based on the requested page and limit.
 * @param req - `req` is the request object which contains information about the HTTP request that
 * triggered this function. It includes data such as query parameters, headers, body content, and more.
 * In this case, `req.query.page` and `req.query.limit` are used to extract the page number and limit
 * for
 * @param res - The `res` parameter in the `GetPalettes` function is the response object that will be
 * used to send a response back to the client making the request. In this case, it is used to send a
 * JSON response containing the palettes fetched from the database or an error message if there was
 */
const GetPalettes = async (req, res) => {
    const page = parseInt(req.query.page) || 1; // Current page
    const limit = parseInt(req.query.limit) || 50; // Number of palettes to load

    try {
        // Fetch palettes from database with filtering, sorting, and pagination
        const palettes = await Palette.find({ visibility: "public" })
            .sort({ views: -1 }) // Sort by views in descending order
            .skip((page - 1) * limit)
            .limit(limit);

        res.json({ palettes });
    } catch (error) {
        res.status(500).json({ message: "Error fetching palettes" });
    }
};

/**
 * The function `VerifyReminderAccount` fetches unauthorized accounts and sends verification emails to
 * each account.
 * @param req - The `req` parameter typically stands for the request object in Node.js applications
 * using frameworks like Express. It contains information about the HTTP request that triggered the
 * function. This information can include headers, parameters, body content, and more. In the context
 * of your `VerifyReminderAccount` function, the `
 * @param res - The `res` parameter in the `VerifyReminderAccount` function is typically used to send a
 * response back to the client making the request. In this case, it is likely an Express response
 * object that allows you to send HTTP responses with data or status codes. In the provided code
 * snippet, `res
 */
const VerifyReminderAccount = async (req, res) => {
    try {
        // Fetch all unauthorized accounts
        const unauthorizedAccounts = await accounts.find({ verified: false });

        // Loop through each unauthorized account and send a verification email
        for (const account of unauthorizedAccounts) {
            // Call the function to send the email for each account
            await AccountVerificationMail(account.name, account.email, account.identity);
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ error: 'An error occurred while sending verification emails.' });
    }
};

cron.schedule('0 0 1 * *', async () => {
    await VerifyReminderAccount();
});

/**
 * The function `WrongRequestHandler` attempts to redirect the request to the root path "/" and logs
 * any errors that occur.
 * @param req - The `req` parameter in the `WrongRequestHandler` function typically represents the
 * request object, which contains information about the HTTP request made to the server. This object
 * includes properties such as the request method, request headers, request URL, query parameters, body
 * content (for POST requests), and more.
 * @param res - The `res` parameter in the code snippet refers to the response object in Node.js. It is
 * used to send a response back to the client making the request. In this case, the `res.redirect("/")`
 * statement is redirecting the client to the root URL ("/") in case of a wrong
 */
const WrongRequestHandler = async (req, res) => {
    try {
        return res.redirect("/");
    } catch (error) {
        console.log(error.message);
    }
}

const ReedemCodeLoad = async (req, res) => {
    try {
        const user = await accounts.findOne({ identity: req.session.identity });
        const profile = "/accounts/" + user.profile;
        return res.render("ReedemCode", { user, profile });
    } catch (error) {
        console.log(error.message);
    }
}

const ReedemCodes = async (req, res) => {
    try {
        const identity = req.session.identity;
        const code = req.body.code;
        const isValidCode = await ReedemCode.findOne({ code: code });
        if (isValidCode && !isValidCode.redeemed_by.includes(identity)) {
            const user = await accounts.findOne({ identity: req.session.identity });
            let coin = user.coin
            await accounts.updateOne({ identity: identity }, { coin: coin + isValidCode.amount });
            await ReedemCode.updateOne({ code: code }, { $push: { redeemed_by: identity } });
            const profile = "/accounts/" + user.profile;
            let message = "The is redeemed successfully 😎"
            return res.render("ReedemCode", { user, profile, message });
        } else{
            const user = await accounts.findOne({ identity: req.session.identity });
            const profile = "/accounts/" + user.profile;
            let message = "Invalid code or code is already redeemed 😿"
            return res.render("ReedemCode", { user, profile, message });
        }
    } catch (error) {
        console.log(error.message);
    }
}

// Exporting all the modules in the route file
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
    SendTestimonial,
    Logout,
    DeleteAccount,
    SaveProfile,
    RestoreProfileToDefault,
    PrivacyAndPolicies,
    Solutions,
    JoinLemonTeams,
    Donate,
    Support,
    GetHelp,
    DeletePalette,
    LibraryLoad,
    CreateLibraryLoad,
    CreatingLibrary,
    LoadLibrary,
    AddCodeLoad,
    deleteLibrary,
    AddingCodeToLibrary,
    LoadCodeDetails,
    ImportedLinks,
    GetPalettes,
    VerifyReminderAccount,
    WrongRequestHandler,
    ReedemCodeLoad,
    ReedemCodes
};
