// utils.js
export const drawImageOnCanvas = (image, canvas, crop) => {
    if (!crop || !canvas || !image) {
      return;
    }
  
    const ctx = canvas.getContext('2d');
    const pixelRatio = window.devicePixelRatio;
  
    canvas.width = crop.width * pixelRatio;
    canvas.height = crop.height * pixelRatio;
  
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = 'high';
  
    ctx.drawImage(
      image,
      crop.x,
      crop.y,
      crop.width,
      crop.height,
      0,
      0,
      crop.width,
      crop.height
    );
  };
  
  export const generateDownload = (canvas, crop) => {
    if (!crop || !canvas) {
      return;
    }
    canvas.toBlob(
      (blob) => {
        const previewUrl = window.URL.createObjectURL(blob);
  
        const anchor = document.createElement('a');
        anchor.download = 'cropped-image.png';
        anchor.href = previewUrl;
        anchor.click();
  
        window.URL.revokeObjectURL(previewUrl);
      },
      'image/png',
      1
    );
  };
  