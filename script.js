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

function buildSlider(data, containerId) {
    const container = document.getElementById(containerId);
    let html = "";

    data.forEach(item => {
        html += `
            <div class="codeLanguage">
                <img src="${item.img}" alt="${item.name}">
                <p>${item.name}</p>
            </div>
        `;
    });

    // duplicate once
    container.innerHTML = html + html;
}

buildSlider(programs, "appSlider");
buildSlider(languages, "codeSlider");

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
const isMobile = window.matchMedia("(max-width: 768px)").matches;

if (isMobile) {
    window.addEventListener("scroll", () => {
        const gallery = document.querySelector(".gallery");
        const scrollPosition = window.scrollY;

        gallery.style.transform = `translateX(${-scrollPosition}px)`;
    });
}

const gallery = document.getElementById("gallery");
const leftBtn = document.querySelector(".gallery-btn.left");
const rightBtn = document.querySelector(".gallery-btn.right");




// gallery controls
const galleries = document.querySelectorAll(".galleryContainer");

galleries.forEach(gallery => {
    const wrapper = gallery.parentElement;
    const leftBtn = wrapper.querySelector(".gallery-btn.left");
    const rightBtn = wrapper.querySelector(".gallery-btn.right");

    function bounce(direction) {
        const amount = 40;

        gallery.style.transition = "transform 0.15s";

        if (direction === "left") {
            gallery.style.transform = `translateX(${amount}px)`;
        } else {
            gallery.style.transform = `translateX(${-amount}px)`;
        }

        setTimeout(() => {
            gallery.style.transform = "translateX(0)";
        }, 150);

        setTimeout(() => {
            gallery.style.transition = "";
        }, 300);

    }

    if (!isMobile) {
        function getStep() {
            const img = gallery.querySelector(".galleryImg");
            const gap = parseFloat(getComputedStyle(gallery).gap) || 0;

            return img.offsetWidth + gap;
        }

        leftBtn.addEventListener("click", () => {
            if (gallery.scrollLeft <= 0) {
                bounce("left");
                return;
            }

            gallery.scrollBy({
                left: -getStep(),
                behavior: "smooth"
            });
        });

        rightBtn.addEventListener("click", () => {
            const maxScroll = gallery.scrollWidth - gallery.clientWidth;

            if (gallery.scrollLeft >= maxScroll - 2) {
                bounce("right");
                return;
            }

            gallery.scrollBy({
                left: getStep(),
                behavior: "smooth"
            });
        });
    }
});

const services = [
    {
        h4: "Creature Design & Sculpting",
        h2: "From small animals to huge dragons.",
        p: "I design and sculpt original creatures for games, cinematics, and concept visualization. Each creature is built with a strong focus on silhouette, anatomy, and surface detail to create believable and visually striking designs."
    },
    {
        h4: "Hard Surface High-Poly Modeling",
        h2: "Vehicles, weapons, props, etc.",
        p: "I create detailed hard surface models for games, cinematics, and concept visualization. My workflow focuses on clean topology, precise forms, and carefully controlled surface detail to produce high-quality models suitable for rendering or further production pipelines."
    },
    {
        h4: "Product Design & Visualization",
        h2: "Bring your product to life in 3D.",
        p: "I design and model products with a focus on form, usability, and visual presentation. My workflow emphasizes clean shapes, balanced proportions, and carefully considered surface detailing to create products that feel refined and functional."
    },
    {
        h4: "Environment & Map Creation",
        h2: "Detailed high quality maps for any game genre.",
        p: "I design and build complete environments and maps from the ground up, handling every stage of production from layout and asset creation to final scene assembly. My environments are built with a strong focus on composition, scale, and atmosphere to create immersive spaces that feel believable and visually engaging."
    },
    {
        h4: "Terrain & Geographic Environment Design",
        h2: "High poly realistic terrain & geography creation",
        p: "I create large-scale terrain and geographic environments designed to form the foundation of immersive digital worlds. My workflow focuses on natural landforms, believable terrain structure, and environmental storytelling through geography."
    },
    {
        h4: "Website Design & Development",
        h2: "High poly realistic terrain & geography creation",
        p: "I design and develop modern websites with a strong focus on visual clarity, performance, and user experience. My workflow combines thoughtful interface design with clean front-end development to produce websites that are both visually engaging and technically reliable."
    },
]

let container = document.getElementById("servicesContainer");

services.forEach(service => {
  const box = document.createElement("div");
  box.className = "serviceBox";

  box.innerHTML = `
    <div class="serviceBoxLine"></div>
    <h4>${service.h4}</h4>
    <h2>${service.h2}</h2>
    <p class="addTransparency">${service.p}</p>
  `;

  container.appendChild(box);
});

const faqs = [
    {
        question: "How can I contact you?",
        answer: "I am most active on Discord and Telegram, thus, those are the best platforms where you can contact me."
    },
    {
        question: "What tools / software do you use?",
        answer: "I mainly use Blender for modeling, however, for texturing I usually use Substance Painter."
    },
    {
        question: "Do you offer fixed price or hourly?",
        answer: "I always quote my projects with a fixed price, I do try to base it so that on average I make 20-30$ an hour, however, if a project takes longer thna I anticipated that is on me, not the client so the original quote will be fixed with some exceptions"
    },
    {
        question: "Is there an upfront payment?",
        answer: "Of course, I preffer 50% of the payment to be paid upfront but 25% will suffice as well, this upfront payment is to avoid scammers and ghosting."
    },
    {
        question: "How much do you charge?",
        answer: "It very heavily depends on the project, some extremely complex and detailed projects can reach up to 400$ while simpler ones can be as low as 15$"
    },
    {
        question: "Can I request revisions?",
        answer: "Of course, I offer as many revisions as it takes to reach the client's vision, having said that abusing the revisions I offer will not be tolerated."
    },
    {
        question: "How do we start working together?",
        answer: "You'll have to reach me either on Discord or Telegram and discuss about the project you'd like to have me work on, I'll give you a quote, once the 25-50% upfront payment is paid we can begin working together on the project."
    },
    {
        question: "How long does a typical project take?",
        answer: "This heavily depends on the size of the project and my availability but it can range from a couple hours to a couple days, I always try finish even the most complex projects in less than 2-3 weeks."
    },
];

container = document.getElementById("faqContainer")

faqs.forEach(faq => {
    const faqDiv = document.createElement("div");
    faqDiv.classList.add("faqQuestion");

    faqDiv.innerHTML = `
        <div class="spacer"></div>

        <div class="faqQuestionContainer">
            <h3>${faq.question}</h3>
            <h3 class="toggleIcon">+</h3>
        </div>

        <p class="addTransparency faqP">${faq.answer}</p>
    `;

    const questionContainer = faqDiv.querySelector(".faqQuestionContainer");
    const answer = faqDiv.querySelector("p");
    const icon = faqDiv.querySelector(".toggleIcon");

    questionContainer.addEventListener("click", () => {
        answer.classList.toggle("show");

        const isOpen = answer.classList.contains("show");
        icon.textContent = isOpen ? "-" : "+";
    });

    container.appendChild(faqDiv);
});


let lastScroll = 0;

const desktopNav = document.getElementById("desktopNav");
const mobileNav = document.getElementById("mobileNav");

window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset;

  // prevent weird behavior at very top
  if (currentScroll <= 0) {
    desktopNav.classList.remove("hidden");
    mobileNav.classList.remove("hidden");
    return;
  }

  // ignore tiny scroll movements (smoothness)
  if (Math.abs(currentScroll - lastScroll) < 10) return;

  if (currentScroll > lastScroll) {
    // scrolling down → hide both
    desktopNav.classList.add("hidden");
    mobileNav.classList.add("hidden");
  } else {
    // scrolling up → show both
    desktopNav.classList.remove("hidden");
    mobileNav.classList.remove("hidden");
  }

  lastScroll = currentScroll;
});