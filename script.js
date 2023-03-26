const inputImage = document.getElementById('inputImage');
const resizeButton = document.getElementById('resizeButton');
const imageGrid = document.getElementById('imageGrid');

const sizes = [128, 72, 64, 36, 32, 18];

function createGridItems() {
  imageGrid.innerHTML = '';
  sizes.forEach((size) => {
    const gridItem = document.createElement('div');
    gridItem.className = 'image-grid-item';
    gridItem.innerHTML = `<label>${size}x${size}</label>`;
    imageGrid.appendChild(gridItem);
  });
}

createGridItems();

const imageGridItems = document.querySelectorAll('.image-grid-item');

inputImage.addEventListener('change', () => {
  if (inputImage.files && inputImage.files.length > 0) {
    resizeButton.disabled = false;
  } else {
    resizeButton.disabled = true;
  }
});

resizeButton.addEventListener('click', () => {
  const file = inputImage.files[0];

  if (!file) {
    return;
  }

  createGridItems();
  const updatedImageGridItems = document.querySelectorAll('.image-grid-item');

  sizes.forEach((size, index) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, size, size);

        const resizedDataURL = canvas.toDataURL(file.type);

        const imageContainer = updatedImageGridItems[index];
        const existingImage = imageContainer.querySelector('img');
        if (existingImage) {
          existingImage.remove();
        }

        const previewImage = document.createElement('img');
        previewImage.src = resizedDataURL;
        previewImage.title = `Click to download ${size}x${size}`;
        previewImage.addEventListener('click', () => {
          const link = document.createElement('a');
          link.href = resizedDataURL;
          link.download = `resized_${size}.${file.type.split('/')[1]}`;
          link.style.display = 'none';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        });

        imageContainer.appendChild(previewImage);
      };
    };

    reader.readAsDataURL(file);
  });
});
