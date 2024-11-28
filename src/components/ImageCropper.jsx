import  { useState } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

function ImageCropper() {
  const [crop, setCrop] = useState({
    unit: '%', // Can be 'px' or '%'
    width: 300, 
    aspect: 16 / 9, // Aspect ratio
  });

  const [src, setSrc] = useState(null);

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

  const onCropChange = (newCrop) => {
    setCrop(newCrop);
  };

  return (
    <div>
      <input type="file" onChange={handleImageChange} />
      {src && (
        <ReactCrop
          src={src}
          crop={crop}
          onChange={onCropChange}
          onComplete={(c) => console.log('Crop complete:', c)}
        />
      )}
    </div>
  );
}

export default ImageCropper;
