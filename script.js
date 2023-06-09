const inputImage = document.getElementById('inputImage');
const resizeButton = document.getElementById('resizeButton');
const imageGrid = document.getElementById('imageGrid');
const fileButton = document.getElementById('fileButton'); // new button element

const sizes = [128, 64, 32, 72, 36, 18];

function createGridItems() {
  imageGrid.innerHTML = '';
  const instructionsGridItem = document.createElement('div');
  instructionsGridItem.className = 'instruction-grid-item';
  instructionsGridItem.innerHTML = `<p>Click the "Upload" button to select an image from your computer. Click the "Resize" button to generate new images at the specified sizes. Click on each resized image to download that size. After resizing you can click the Middle button to reset the form. All images are processed in your browser to protect privacy. No personal data is collected or stored.</p>`;
  imageGrid.appendChild(instructionsGridItem);
  sizes.forEach((size) => {
    const gridItem = document.createElement('div');
    gridItem.className = 'image-grid-item';
    gridItem.innerHTML = `<label>${size}x${size}</label>`;
    imageGrid.appendChild(gridItem);
  });
  fileButton.innerText = 'Selected File'; // reset the button label
}

createGridItems();

const imageGridItems = document.querySelectorAll('.image-grid-item');

inputImage.addEventListener('change', () => {
  if (inputImage.files && inputImage.files.length > 0) {
    resizeButton.disabled = false;
    fileButton.innerText = inputImage.files[0].name; // display the file name on the button
  } else {
    resizeButton.disabled = true;
    fileButton.innerText = 'Selected File'; // reset the button label
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

fileButton.addEventListener('click', () => {
  createGridItems(); // reset the script
});
