document.addEventListener("DOMContentLoaded", () => {
    const colorBoxes = document.querySelectorAll('.color-box');

    colorBoxes.forEach(box => {
        box.addEventListener('click', () => {
            const color = box.getAttribute('data-color');
            navigator.clipboard.writeText(color).then(() => {
                box.innerHTML = "Copied to clipboard";
                setTimeout(() => {
                    box.innerHTML = color;
                }, 1500);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
            });
        });
    });

    const colorMap = {
        "$r": "red",
        "$o": "orange",
        "$y": "yellow",
        "$c": "cyan",
        "$b": "blue",
        "$g": "green",
        "$v": "violet",
        "$p": "pink",
        "$g": "green",
        "$w": "white",
        "$2": "#7bdff2"
    };

    const updateColors = () => {
        const headingElement = document.querySelector("h2");
        const descriptionElement = document.querySelector("h4");

        if (headingElement) {
            let heading = headingElement.innerHTML.trim().toLowerCase();
            const slicedHeading = heading.slice(0, 2);
            if (colorMap[slicedHeading]) {
                headingElement.style.color = colorMap[slicedHeading];
                heading = heading.slice(2).trim();
                headingElement.innerHTML = heading.charAt(0).toUpperCase() + heading.slice(1);
            }
        }

        if (descriptionElement) {
            let description = descriptionElement.innerHTML.trim().toLowerCase();
            const slicedDescription = description.slice(0, 2);
            if (colorMap[slicedDescription]) {
                descriptionElement.style.color = colorMap[slicedDescription];
                description = description.slice(2).trim();
                descriptionElement.innerHTML = description.charAt(0).toUpperCase() + description.slice(1);
            }
        }
    };
    updateColors()
});
