const images = [
  "Pooji.jpeg",
  "Pooji 1.jpeg",
  "Family.jpeg",
  "Date Night.jpeg",
  "Jules.jpeg",
  "Fiza.jpeg",
  "Train.jpeg",
  "Big Nani.jpeg",
  "Pooji 2.jpeg",
  "Family 1.jpeg",
  "Date Night 1.jpeg",
  "Jules 1.jpeg",
  "Jules 2.jpeg",
  "Jules 3.jpeg",
  "Fiza 1.jpeg",
  "Pooji 3.jpeg",
  "Train 1.jpeg"
];

const featuredClasses = [
  "photo-card--feature",
  "photo-card--tall",
  "photo-card--wide",
  "",
  "",
  "photo-card--wide",
  "photo-card--tall",
  "",
  "photo-card--feature",
  "",
  "photo-card--wide",
  "",
  "",
  "photo-card--wide",
  "",
  "photo-card--tall",
  ""
];

const keepsakeImages = [
  "Date Night 1.jpeg",
  "Pooji 2.jpeg",
  "Jules 2.jpeg",
  "Family 1.jpeg",
  "Train 1.jpeg",
  "Fiza 1.jpeg",
  "Big Nani.jpeg",
  "Pooji 3.jpeg"
];

const keepsakeTilts = ["-1.2deg", "1.4deg", "-0.7deg", "1.1deg", "-1.6deg", "0.8deg", "-0.9deg", "1.5deg"];
const imagePath = (filename) => `images/${filename}`;

const photoGrid = document.querySelector("#photo-grid");
const keepsakeWall = document.querySelector("#keepsake-wall");
const emptyState = document.querySelector("#empty-state");

function captionFromFilename(filename) {
  return filename
    .replace(/\.[^/.]+$/, "")
    .replace(/\s+\d+$/, "")
    .replace(/[-_]+/g, " ")
    .trim();
}

function altFromFilename(filename) {
  const caption = captionFromFilename(filename);
  return `${caption} during the Dodge family's India trip`;
}

function renderPhotos() {
  if (!photoGrid) return;

  if (!images.length) {
    emptyState.hidden = false;
    return;
  }

  images.forEach((filename, index) => {
    const figure = document.createElement("figure");
    figure.className = ["photo-card", featuredClasses[index] || "", "reveal"]
      .filter(Boolean)
      .join(" ");

    const img = document.createElement("img");
    img.src = imagePath(filename);
    img.alt = altFromFilename(filename);
    img.loading = index < 3 ? "eager" : "lazy";
    img.decoding = "async";

    img.addEventListener("error", () => {
      figure.remove();
      if (!photoGrid.children.length) emptyState.hidden = false;
    });

    figure.append(img);
    photoGrid.append(figure);
  });
}

function renderKeepsakes() {
  if (!keepsakeWall) return;

  keepsakeImages.forEach((filename, index) => {
    const figure = document.createElement("figure");
    figure.className = "keepsake-card reveal";
    figure.style.setProperty("--tilt", keepsakeTilts[index] || "0deg");

    const img = document.createElement("img");
    img.src = imagePath(filename);
    img.alt = altFromFilename(filename);
    img.loading = "lazy";
    img.decoding = "async";

    img.addEventListener("error", () => figure.remove());

    figure.append(img);
    keepsakeWall.append(figure);
  });
}

function observeReveals() {
  const revealEls = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -40px" }
  );

  revealEls.forEach((el, index) => {
    el.style.transitionDelay = `${Math.min(index * 35, 240)}ms`;
    observer.observe(el);
  });
}

renderPhotos();
renderKeepsakes();
observeReveals();
