export const fileToDataURL = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = (e) => resolve(e.target.result);
    reader.readAsDataURL(file);
  });
};
export const dataURLToImage = (dataURL) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.src = dataURL;
  });
};
const canvastoFile = (canvas, type, quality) => {
  return new Promise((resolve) => canvas.toBlob((blob) => resolve(blob), type, quality));
};
/**
 * Compress image file
 * @param {Object}  file
 * @param {String} type file type
 * @param {Nubmber} quality 0-1
 * @returns new image file
 */
export const compressionFile = async (file, type = "image/jpeg", quality = 1, size = 200) => {
  const fileName = file.name;
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  const base64 = await fileToDataURL(file);
  const img = await dataURLToImage(base64);
  let widthAfterResize = img.width;
  let heightAfterResize = img.height;
  if (img.width > img.height) {
    widthAfterResize = Math.floor((size * img.width) / img.height);
    heightAfterResize = size;
  } else {
    widthAfterResize = size;
    heightAfterResize = Math.floor((size * img.height) / img.width);
  }

  canvas.width = widthAfterResize;
  canvas.height = heightAfterResize;
  context.clearRect(0, 0, widthAfterResize, heightAfterResize);
  context.drawImage(img, 0, 0, widthAfterResize, heightAfterResize);
  const blob = await canvastoFile(canvas, type, quality);
  const newFile = await new File([blob], fileName, {
    type: type,
  });
  console.log("before compress:", `${file.size / 1024}k`);
  console.log("after compress:", `${newFile.size / 1024}k`);
  return newFile;
};
