const accounts = require("../models/accounts");
const cron = require("node-cron");
const mongoose = require("mongoose");

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