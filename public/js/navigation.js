const notifyIcon = document.getElementById("notify-icon");
const notification = document.getElementById("notifications");
const menu = document.getElementById("menu");
const close = document.getElementById("close");

menu.addEventListener("click", () => {
    document.getElementById("options").style.right = "0";
});
close.addEventListener("click", () => {
    document.getElementById("options").style.right = "-400px";
});
document.addEventListener("scroll", () => {
    document.getElementById("options").style.right = "-400px";
    notification.style.display = "none";
});

notifyIcon.addEventListener("click", () => {
    if (notification.style.display == "none") {
        notification.style.display = "flex"
    } else {
        notification.style.display = "none"
    }
});

// JavaScript function to calculate "time ago"
function timeAgo(date) {
    let now = Date.now(); // Current timestamp in milliseconds
    setInterval(() => {
        now = now + 1;
    }, 1);
    const timestamp = Number(date); // Ensure the date is treated as a valid number
    const seconds = Math.floor((now - timestamp) / 1000); // Difference in seconds

    let interval = Math.floor(seconds / 31536000); // Years
    if (interval >= 1) return `${interval} year${interval > 1 ? 's' : ''} ago`;

    interval = Math.floor(seconds / 2592000); // Months
    if (interval >= 1) return `${interval} month${interval > 1 ? 's' : ''} ago`;

    interval = Math.floor(seconds / 86400); // Days
    if (interval >= 1) return `${interval} day${interval > 1 ? 's' : ''} ago`;

    interval = Math.floor(seconds / 3600); // Hours
    if (interval >= 1) return `${interval} hour${interval > 1 ? 's' : ''} ago`;

    interval = Math.floor(seconds / 60); // Minutes
    if (interval >= 1) return `${interval} minute${interval > 1 ? 's' : ''} ago`;

    return `just now`;
}

// Update time ago for all notifications
function updateTimeAgo() {
    const timeElements = document.querySelectorAll('.time-ago');

    timeElements.forEach(function (element) {
        const time = element.getAttribute('data-time');
        if (time) {
            const timeAgoText = timeAgo(time);
            element.textContent = timeAgoText;
        }
    });
}

// Call the function every minute (60000ms) to update the times
setInterval(updateTimeAgo, 60);

// Run the function initially when the page loads
document.addEventListener('DOMContentLoaded', updateTimeAgo);
