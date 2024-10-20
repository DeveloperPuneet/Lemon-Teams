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
    let now = new Date();
    const time = new Date(now);
    const timestamp = time.getTime();
    const seconds = Math.floor((timestamp - new Date(Number(date))) / 1000);

    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return `${interval} year${interval > 1 ? 's' : ''} ago`;

    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return `${interval} month${interval > 1 ? 's' : ''} ago`;

    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return `${interval} day${interval > 1 ? 's' : ''} ago`;

    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return `${interval} hour${interval > 1 ? 's' : ''} ago`;

    interval = Math.floor(seconds / 60);
    if (interval >= 1) return `${interval} minute${interval > 1 ? 's' : ''} ago`;

    return `just now`;
    // Ensure the date is treated as a valid timestamp
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
