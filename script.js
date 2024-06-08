let img = null;

document.getElementById("upload").addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (event) {
    img = new Image();
    img.onload = function () {
      const canvas = document.getElementById("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      convertToUnicode(ctx, img.width, img.height);
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
});

document.getElementById("detail").addEventListener("input", function () {
  redrawImage();
});

document.getElementById("speech").addEventListener("input", function () {
  redrawImage();
});

document.getElementById("downloadBtn").addEventListener("click", function () {
  const canvas = document.getElementById("canvas");
  const downloadLink = document.createElement("a");
  downloadLink.href = canvas.toDataURL("image/png");
  downloadLink.download = "unicode-art.png";
  downloadLink.click();
});

document.getElementById("zoomInBtn").addEventListener("click", function () {
  zoomOutput(1.1); // Increase font size by 10%
});

document.getElementById("zoomOutBtn").addEventListener("click", function () {
  zoomOutput(0.9); // Decrease font size by 10%
});

function redrawImage() {
  if (img) {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    convertToUnicode(ctx, img.width, img.height);
  }
}

function zoomOutput(scale) {
  const output = document.getElementById("output");
  const currentSize = parseFloat(window.getComputedStyle(output).fontSize);
  output.style.fontSize = `${currentSize * scale}px`;
}

function convertToUnicode(ctx, width, height) {
  const detailLevel = parseInt(document.getElementById("detail").value);
  const imageData = ctx.getImageData(0, 0, width, height).data;
  const output = document.getElementById("output");
  const speechText = document.getElementById("speech").value;
  let unicodeArt = "";
  let charIndex = 0;

  ctx.clearRect(0, 0, width, height); // Clear the canvas
  ctx.font = `${detailLevel}px monospace`;
  ctx.fillStyle = "#000";

  for (let y = 0; y < height; y += detailLevel) {
    for (let x = 0; x < width; x += detailLevel / 2) {
      const index = (y * width + x) * 4;
      const r = imageData[index];
      const g = imageData[index + 1];
      const b = imageData[index + 2];
      const brightness = (r + g + b) / 3;
      const char = getUnicodeChar(brightness, speechText, charIndex);
      unicodeArt += char;
      ctx.fillText(char, x, y + detailLevel);
      charIndex = (charIndex + 1) % speechText.length;
    }
    unicodeArt += "\n";
  }
  output.textContent = unicodeArt;
}

function getUnicodeChar(brightness, speechText, charIndex) {
  const char = speechText[charIndex];
  if (brightness > 200) return " ";
  if (brightness > 150) return char.toLowerCase();
  if (brightness > 100) return char;
  if (brightness > 50) return char.toUpperCase();
  return char.toUpperCase();
}
