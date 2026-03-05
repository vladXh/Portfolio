// sliders
const languages = [
    {name: "JavaScript", img: "Icons/JavaScript.svg"},
    {name: "Python", img: "Icons/Python.svg"},
    {name: "Lua", img: "Icons/Lua.svg"},
    {name: "C++", img: "Icons/Cpp.svg"},
    {name: "HTML", img: "Icons/HTML.svg"},
    {name: "CSS", img: "Icons/CSS.svg"},
    {name: "Java", img: "Icons/Java.svg"}
];

const programs = [
    {name: "Roblox Studio", img: "Icons/Roblox_Studio.svg"},
    {name: "Adobe Photoshop", img: "Icons/Photoshop.svg"},
    {name: "Adobe Illustrator", img: "Icons/Adobe_Illustrator.svg"},
    {name: "Substance Painter", img: "Icons/Substance_painter.svg"},
    {name: "Blender", img: "Icons/Blender.svg"}
];

function buildSlider(data, times, containerId) {
    const container = document.getElementById(containerId);
    let html = "";

    for (let i = 0; i < times; i++) {
        data.forEach(item => {
            html += `
                <div class="codeLanguage">
                    <img src="${item.img}" alt="${item.name}">
                    <p>${item.name}</p>
                </div>
            `;
        });
    }

    container.innerHTML = html;
}

buildSlider(languages, 4, "codeSlider");
buildSlider(programs, 2, "appSlider");


// nav control
const navToggleBtn = document.getElementById("navToggleBtn");
const navBtn = document.getElementById("navMoreBtns");
const closeNavBtn = document.getElementById("navCloseBtns");
const mobileNavBtns = document.getElementById("mobileNavOptions");
let navToggle = false;

navToggleBtn.addEventListener("click", function(e) {
    e.stopPropagation(); // prevent document click from firing

    navToggle = !navToggle;
    navBtn.classList.toggle("hide");
    closeNavBtn.classList.toggle("hide");
    mobileNavBtns.classList.toggle("show");
});

document.addEventListener("click", (e) => {
    if (navToggle && !mobileNavBtns.contains(e.target)) {
        navToggle = false;

        navBtn.classList.remove("hide");
        closeNavBtn.classList.add("hide");
        mobileNavBtns.classList.remove("show");
    }
});


// image viewer
const images = document.querySelectorAll('img[src*="Images/"]:not(.noZoom)');
const viewer = document.getElementById("imageViewer");
const viewerImg = document.getElementById("viewerImg");

let zoomed = false;
let scale = 1;

let isDragging = false;
let wasDragging = false;

let translateX = 0;
let translateY = 0;

let lastMouseX = 0;
let lastMouseY = 0;

let lastTouchX = 0;
let lastTouchY = 0;

viewerImg.addEventListener("dragstart", (e) => e.preventDefault());

images.forEach(img => {
    img.addEventListener("click", () => {
        viewerImg.src = img.src;
        viewer.classList.add("show");
        resetZoom();
    });
});

function resetZoom() {
    zoomed = false;
    scale = 1;
    translateX = 0;
    translateY = 0;

    updateTransform();
}

viewerImg.addEventListener("click", (e) => {
    e.stopPropagation();

    if (wasDragging) {
        wasDragging = false;
        return;
    }

    if (!zoomed) {
        zoomed = true;
        scale = 2;
    } else {
        zoomed = false;
        scale = 1;
        translateX = 0;
        translateY = 0;
    }

    updateTransform();
});

function updateTransform() {
    viewerImg.style.transform =
        `translate(${translateX}px, ${translateY}px) scale(${scale})`;
}

viewerImg.addEventListener("mousedown", (e) => {
    if (!zoomed) return;

    isDragging = true;
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
});

document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;

    const dx = e.clientX - lastMouseX;
    const dy = e.clientY - lastMouseY;

    translateX += dx;
    translateY += dy;

    lastMouseX = e.clientX;
    lastMouseY = e.clientY;

    wasDragging = true;

    updateTransform();
});

document.addEventListener("mouseup", () => {
    isDragging = false;
});

viewer.addEventListener("click", () => {
    viewer.classList.remove("show");
    resetZoom();
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        viewer.classList.remove("show");
        resetZoom();
    }
});

viewerImg.addEventListener("touchstart", (e) => {
    if (!zoomed) return;

    const touch = e.touches[0];

    isDragging = true;
    lastTouchX = touch.clientX;
    lastTouchY = touch.clientY;
}, { passive:false });

viewerImg.addEventListener("touchmove", (e) => {
    if (!isDragging) return;

    e.preventDefault();

    const touch = e.touches[0];

    const dx = touch.clientX - lastTouchX;
    const dy = touch.clientY - lastTouchY;

    translateX += dx;
    translateY += dy;

    lastTouchX = touch.clientX;
    lastTouchY = touch.clientY;

    wasDragging = true;

    updateTransform();
}, { passive:false });

viewerImg.addEventListener("touchend", () => {
    isDragging = false;
});

// gallery scroll
if (window.matchMedia("(pointer: fine)").matches) {

    const galleries = document.querySelectorAll(".galleryContainer");

    galleries.forEach(gallery => {
        gallery.addEventListener("wheel", (e) => {
            if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                e.preventDefault();
                gallery.scrollLeft += e.deltaY;
            }
        });
    });
}