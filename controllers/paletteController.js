const Palette = require('../models/Palette');
const accounts = require("../models/accounts");
const nodemailer = require("nodemailer");

const config = require("../config/config");

const PaletteRemovalInformation = async (name, email) => {
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
            subject: "Lemon Teams: Duplicated Palette has been removed",
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
                            <h1>Lemon Teams!</h1>
                        </div>
                        <div class="content">
                            <p>Hi ${name},</p>
                            <p>We hope you're enjoying your experience with Lemon Teams. We wanted to inform you that as part of our ongoing efforts to keep our platform clean and efficient, we have identified and removed some duplicate color palettes.</p>
                            <p>Here are the details:</p>
                            <ul>
                                <li>Any duplicate color palettes with the same set of colors have been removed.</li>
                                <li>Your unique and original palettes are safe and remain intact.</li>
                                <li>This cleanup helps us maintain a high-quality collection of color palettes for all users.</li>
                            </ul>
                            <p>If you have any questions or need further assistance, feel free to contact our support team.</p>
                            <p>Thank you for being a part of the Lemon Teams community!</p>
                            <p>The Lemon Teams Team</p>
                        </div>
                        <div class="footer">
                            <p>&copy; 2024 Lemon Teams. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                    </html>`
        };

        transports.sendMail(mail, (error, info) => {
            if (error) {
                console.error(`Error sending mail to ${email}:`, error.message);
            }
        });
    } catch (error) {
        console.error('Error setting up email transport:', error.message);
    }
};

function arePalettesEqual(palette1, palette2) {
    const colors1 = [
        palette1.color1, palette1.color2, palette1.color3, palette1.color4, palette1.color5,
        palette1.color6, palette1.color7, palette1.color8, palette1.color9, palette1.color10
    ].filter(Boolean);

    const colors2 = [
        palette2.color1, palette2.color2, palette2.color3, palette2.color4, palette2.color5,
        palette2.color6, palette2.color7, palette2.color8, palette2.color9, palette2.color10
    ].filter(Boolean);

    if (colors1.length !== colors2.length) {
        return false;
    }

    colors1.sort();
    colors2.sort();

    for (let i = 0; i < colors1.length; i++) {
        if (colors1[i] !== colors2[i]) {
            return false;
        }
    }
    return true;
}

async function removeDuplicatePalettes() {
    try {
        const palettes = await Palette.find({});
        const seenPalettes = new Map();

        for (const palette of palettes) {
            const key = JSON.stringify([
                palette.color1, palette.color2, palette.color3, palette.color4, palette.color5,
                palette.color6, palette.color7, palette.color8, palette.color9, palette.color10
            ].filter(Boolean).sort());

            if (seenPalettes.has(key)) {
                const user = await accounts.findOne({ identity: palette.identity });
                if (user) {
                    const deletion = await Palette.deleteOne({ _id: palette._id });
                    if (deletion) {
                        await PaletteRemovalInformation(user.name, user.email);
                    }
                }
            } else {
                seenPalettes.set(key, true);
            }
        }
    } catch (error) {
        console.error('Error removing duplicate palettes:', error.message);
    }
}

const deleteIdenticalColorPalettes = async () => {
    try {
        const palettes = await Palette.find();
        for (const palette of palettes) {
            const colors = [
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
            ].filter(color => color);
            const uniqueColors = new Set(colors);
            if (uniqueColors.size === 1) {
                const deleted = await Palette.deleteOne({ _id: palette._id });
                if (deleted) {
                    await PaletteRemovalInformation(user.name, user.email);
                }
            }
        }
    } catch (error) {
        console.error('Error in deleting identical color palettes:', error.message);
    }
};

module.exports = { removeDuplicatePalettes, PaletteRemovalInformation, deleteIdenticalColorPalettes };
