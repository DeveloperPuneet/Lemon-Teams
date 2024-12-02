const accounts = require("../models/accounts");
const Palette = require("../models/Palette");
const cron = require("node-cron");
const mongoose = require("mongoose");

const DistributeBadges = async () => {
    try {
        const Accounts = await accounts.find({});
        const palettes = await Palette.find({});
        Accounts.forEach(async (account) => {
            let identity = account.identity;
            let likes = 0;
            // badges for likes of palettes
            palettes.forEach(palette => {
                if (palette.liked.includes(identity)) {
                    likes++;
                }
            });
            if (likes >= 1) {
                if (!account.badges.includes("1-liked-palette.jpeg")) {
                    account.badges.push("1-liked-palette.jpeg");
                }
                if (likes >= 10) {
                    if (!account.badges.includes("10-liked-palette.jpeg")) {
                        account.badges.push("10-liked-palette.jpeg");
                    }
                    if (likes >= 50) {
                        if (!account.badges.includes("50-liked-palette.jpeg")) {
                            account.badges.push("50-liked-palette.jpeg");
                        }
                        if (likes >= 100) {
                            if (!account.badges.includes("100-liked-palette.jpeg")) {
                                account.badges.push("100-liked-palette.jpeg");
                            }
                            if (likes >= 500) {
                                if (!account.badges.includes("500-liked-palette.jpeg")) {
                                    account.badges.push("500-liked-palette.jpeg");
                                }
                                if (likes >= 1000) {
                                    if (!account.badges.includes("1000-liked-palette.jpeg")) {
                                        account.badges.push("1000-liked-palette.jpeg");
                                    }
                                } else {
                                    account.badges.pull("1000-liked-palette.jpeg");
                                }
                            } else {
                                account.badges.pull("500-liked-palette.jpeg");
                            }
                        } else {
                            account.badges.pull("100-liked-palette.jpeg");
                        }
                    } else {
                        account.badges.pull("50-liked-palette.jpeg");
                    }
                } else {
                    account.badges.pull("10-liked-palette.jpeg");
                }
            } else {
                account.badges.pull("1-liked-palette.jpeg");
            }
            //badges for comments on palettes
            for (const palette of palettes) {
                let AdminIdentity = palette.identity;
                let comments = palette.comments.length - 1;
                let AdminAccount = await accounts.findOne({ identity: AdminIdentity });

                if (!AdminAccount) {
                    continue;
                }

                if (comments >= 1) {
                    if (!AdminAccount.badges.includes("1-comment-received.jpeg")) {
                        AdminAccount.badges.push("1-comment-received.jpeg");
                    }
                } else {
                    const badgeIndex = AdminAccount.badges.indexOf("1-comment-received.jpeg");
                    if (badgeIndex !== -1) {
                        AdminAccount.badges.splice(badgeIndex, 1);
                    }
                }

                await AdminAccount.save();
            }
            await account.save();
        });
    } catch (error) {
        console.log(error.message);
    }
}

const deleteExpiredNotifications = async () => {
    try {
        const currentTime = Date.now(); // Get the current time

        const result = await accounts.updateMany(
            {},
            {
                $pull: {
                    notifications: {
                        expire: { $lt: currentTime }
                    }
                }
            }
        );
    } catch (error) {
        console.error("Error deleting expired notifications:", error);
    }
};

// Schedule the cleanup task to run at midnight every day
cron.schedule("0 0 * * *", async () => {
    await deleteExpiredNotifications();
});

cron.schedule('* * * * *', () => {
    DistributeBadges();
});