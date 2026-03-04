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

images.forEach(img => {
    img.addEventListener("click", () => {
        console.log("Img clicked");
        viewerImg.src = img.src;
        viewer.classList.add("show");
    });
});

viewer.addEventListener("click", () => {
    viewer.classList.remove("show");
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        viewer.classList.remove("show");
    }
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