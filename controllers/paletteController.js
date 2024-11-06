const Palette = require('../models/Palette');
const accounts = require("../models/accounts");
const nodemailer = require("nodemailer");
const config = require("../config/config");

const sendPaletteRemovalEmail = async (name, email, paletteColors) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: config.email,
                pass: config.password
            }
        });

        const colorBoxes = paletteColors.map(color => `
            <div class="color-box" style="background-color:${color};">${color}</div>
        `).join('');

        const mail = {
            from: config.email,
            to: email,
            subject: "Lemon Teams: Your Palette has been Removed",
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
                            .palette {
                                display: flex;
                                justify-content: space-around;
                                padding: 10px;
                                border: 1px solid #ddd;
                                border-radius: 8px;
                                background-color: #f9f9f9;
                            }
                            .color-box {
                                width: 50px;
                                height: 50px;
                                text-align: center;
                                line-height: 50px;
                                border-radius: 4px;
                                font-size: 12px;
                                color: #fff;
                                margin: 0 5px;
                                text-transform: uppercase;
                                box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);
                            }
                            .footer {
                                text-align: center;
                                background-color: #FFD700;
                                padding: 10px;
                                border-radius: 0 0 8px 8px;
                                margin-top: 20px;
                            }
                            .bold {
                                font-weight: 700;
                                margin: 7px;
                            }
                        </style>
                        <title>Palette Removal Notification</title>
                    </head>
                    <body>
                        <div class="container">
                            <div class="header">
                                <h1>Lemon Teams</h1>
                            </div>
                            <div class="content">
                                <p>Hi ${name},</p>
                                <p>Your palette has been removed for containing duplicate or invalid colors. Here is a summary of the removed palette:</p>
                                <div class="palette">
                                    ${colorBoxes}
                                </div>
                            </div>
                            <div class="footer">
                                <p>&copy; 2024 Lemon Teams. All rights reserved.</p>
                            </div>
                        </div>
                    </body>
                    </html>`
        };

        await transporter.sendMail(mail);
    } catch (error) {
        console.error('Error sending email:', error.message);
    }
};

// Function to validate hex values
function isValidHexColor(color) {
    const hexColorRegex = /^#([0-9A-F]{3}){1,2}$/i;
    return hexColorRegex.test(color);
}

// Remove palettes with invalid hex or color format values
async function removeInvalidHexPalettes() {
    try {
        const palettes = await Palette.find({});
        for (const palette of palettes) {
            const colors = [
                palette.color1, palette.color2, palette.color3, palette.color4, palette.color5,
                palette.color6, palette.color7, palette.color8, palette.color9, palette.color10
            ].filter(Boolean).map(color => color.toLowerCase());

            const invalidColors = colors.filter(color => !isValidHexColor(color) && !color.startsWith('rgb'));

            if (invalidColors.length > 0) {
                const user = await accounts.findOne({ identity: palette.identity });
                if (user) {
                    const deleted = await Palette.deleteOne({ _id: palette._id });
                    if (deleted) {
                        await sendPaletteRemovalEmail(user.name, user.email, colors);
                    }
                }
            }
        }
    } catch (error) {
        console.error('Error removing palettes with invalid hex values:', error.message);
    }
}

// Remove duplicate palettes
async function removeDuplicatePalettes() {
    try {
        const palettes = await Palette.find({});
        const seenPalettes = new Map();

        for (const palette of palettes) {
            const key = JSON.stringify([
                palette.color1, palette.color2, palette.color3, palette.color4, palette.color5,
                palette.color6, palette.color7, palette.color8, palette.color9, palette.color10
            ].filter(Boolean).map(color => color.toLowerCase()).sort());

            if (seenPalettes.has(key)) {
                const user = await accounts.findOne({ identity: palette.identity });
                if (user) {
                    const deleted = await Palette.deleteOne({ _id: palette._id });
                    if (deleted) {
                        await sendPaletteRemovalEmail(user.name, user.email, [
                            palette.color1, palette.color2, palette.color3, palette.color4, palette.color5,
                            palette.color6, palette.color7, palette.color8, palette.color9, palette.color10
                        ].filter(Boolean));
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

// Delete palettes with identical colors
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
            ].filter(Boolean).map(color => color.toLowerCase());

            const uniqueColors = new Set(colors);
            const user = await accounts.findOne({ identity: palette.identity });
            if (uniqueColors.size === 1) {
                const deleted = await Palette.deleteOne({ _id: palette._id });
                if (deleted) {
                    await sendPaletteRemovalEmail(user.name, user.email, colors);
                }
            }
        }
    } catch (error) {
        console.error('Error in deleting identical color palettes:', error.message);
    }
};

module.exports = { sendPaletteRemovalEmail, removeInvalidHexPalettes, removeDuplicatePalettes, deleteIdenticalColorPalettes };
