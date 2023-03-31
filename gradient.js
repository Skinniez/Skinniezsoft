const gradients = document.querySelectorAll('.gradient');
let activeGradient = null;

gradients.forEach(gradient => {
  gradient.addEventListener('click', () => {
    if (activeGradient) {
      activeGradient.classList.remove('active');
    }
    activeGradient = gradient;
    activeGradient.classList.add('active');
    const code = gradient.dataset.code;
    copyToClipboard(code);
  });
});

const randomizeButton = document.querySelector('.randomize-button');
randomizeButton.addEventListener('click', () => {
  gradients.forEach(gradient => {
    const gradientType = getRandomGradientType();
    const randomColors = getRandomColors(gradientType);
    const randomGradient = `${gradientType}(${randomColors.join(", ")})`;
    gradient.style.backgroundImage = randomGradient;
    gradient.dataset.code = `background-image: ${randomGradient};`;
  });
});

function getRandomColors(gradientType) {
  const numColors = gradientType === "linear-gradient" ? 2 : 3;
  const colors = [];
  for (let i = 0; i < numColors; i++) {
    colors.push(getRandomColor());
  }
  return colors;
}

function getRandomGradientType() {
  const gradientTypes = ["linear-gradient", "radial-gradient", "repeating-linear-gradient", "repeating-radial-gradient"];
  return gradientTypes[Math.floor(Math.random() * gradientTypes.length)];
}

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function copyToClipboard(code) {
  const el = document.createElement('textarea');
  el.value = code;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);

  const button = activeGradient.querySelector('.copy-button');
  button.innerHTML = 'Copied!';
  setTimeout(() => {
    button.innerHTML = 'Copy CSS Code';
  }, 3000);
}
