import  { useState, useRef } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

function ImageCropperWithPreview() {
  const [crop, setCrop] = useState({ unit: 'px', width: 100, height: 100, x: 0, y: 0 });
  const [src, setSrc] = useState(null);
  const [croppedImageUrl, setCroppedImageUrl] = useState(null);
  const imageRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setSrc(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = (crop) => {
    if (imageRef.current && crop.width && crop.height) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const image = imageRef.current;

      canvas.width = crop.width;
      canvas.height = crop.height;

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

      setCroppedImageUrl(canvas.toDataURL());
    }
  };

  return (
    <div>
      <input type="file" onChange={handleImageChange} />
      {src && (
        <>
          <ReactCrop
            src={src}
            crop={crop}
            onChange={(newCrop) => setCrop(newCrop)}
            onComplete={onCropComplete}
            imageRef={imageRef}
          />
          {croppedImageUrl && (
            <div>
              <h3>Cropped Image:</h3>
              <img src={croppedImageUrl} alt="Cropped preview" />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ImageCropperWithPreview;
