const fileInput = document.querySelector(".file-input");
const chooseImgBtn = document.querySelector(".choose-img");
const previewImg = document.querySelector(".preview-img img");
const resetFilterBtn = document.querySelector(".reset-filter");
const filterButtons = document.querySelectorAll(".filter .options button");
const filterSlider = document.querySelector(".slider input");
const filterName = document.querySelector(".filter-info .name");
const filterValue = document.querySelector(".filter-info .value");
const rotateLeftBtn = document.querySelector("#left");
const rotateRightBtn = document.querySelector("#right");
const flipHorizontalBtn = document.querySelector("#horizontal");
const flipVerticalBtn = document.querySelector("#vertical");
const saveImgBtn = document.querySelector(".save-img");

let brightness = 100, saturation = 100, inversion = 0, grayscale = 0;
let rotate = 0, flipH = 1, flipV = 1;

chooseImgBtn.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        previewImg.src = reader.result;
        previewImg.style.transform = "none"; // Reset transformations
        rotate = 0; flipH = 1; flipV = 1;
    };
});

const applyFilters = () => {
    previewImg.style.filter = `
        brightness(${brightness}%) 
        saturate(${saturation}%) 
        invert(${inversion}%) 
        grayscale(${grayscale}%)
    `;
    previewImg.style.transform = `rotate(${rotate}deg) scale(${flipH}, ${flipV})`;
};

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        document.querySelector(".filter .options .active")?.classList.remove("active");
        button.classList.add("active");

        filterName.innerText = button.innerText;

        if (button.id === "brightness") {
            filterSlider.max = "200";
            filterSlider.value = brightness;
            filterValue.innerText = `${brightness}%`;
        } else if (button.id === "saturation") {
            filterSlider.max = "200";
            filterSlider.value = saturation;
            filterValue.innerText = `${saturation}%`;
        } else if (button.id === "inversion") {
            filterSlider.max = "100";
            filterSlider.value = inversion;
            filterValue.innerText = `${inversion}%`;
        } else {
            filterSlider.max = "100";
            filterSlider.value = grayscale;
            filterValue.innerText = `${grayscale}%`;
        }
    });
});

filterSlider.addEventListener("input", () => {
    filterValue.innerText = `${filterSlider.value}%`;
    const activeFilter = document.querySelector(".filter .options .active");

    if (activeFilter.id === "brightness") brightness = filterSlider.value;
    else if (activeFilter.id === "saturation") saturation = filterSlider.value;
    else if (activeFilter.id === "inversion") inversion = filterSlider.value;
    else grayscale = filterSlider.value;

    applyFilters();
});

rotateLeftBtn.addEventListener("click", () => {
    rotate -= 90;
    applyFilters();
});

rotateRightBtn.addEventListener("click", () => {
    rotate += 90;
    applyFilters();
});

flipHorizontalBtn.addEventListener("click", () => {
    flipH = flipH === 1 ? -1 : 1;
    applyFilters();
});

flipVerticalBtn.addEventListener("click", () => {
    flipV = flipV === 1 ? -1 : 1;
    applyFilters();
});

resetFilterBtn.addEventListener("click", () => {
    brightness = 100; saturation = 100; inversion = 0; grayscale = 0;
    rotate = 0; flipH = 1; flipV = 1;
    applyFilters();
});

saveImgBtn.addEventListener("click", () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = previewImg.naturalWidth;
    canvas.height = previewImg.naturalHeight;

    ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotate * Math.PI) / 180);
    ctx.scale(flipH, flipV);
    ctx.drawImage(previewImg, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);

    const link = document.createElement("a");
    link.download = "edited-image.png";
    link.href = canvas.toDataURL();
    link.click();
});
