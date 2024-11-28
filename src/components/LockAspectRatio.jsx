import  { useState } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

function LockAspectRatio() {
  const [crop, setCrop] = useState({
    unit: 'px', // can be 'px' or '%'
    width: 50, 
    aspect: 4 / 3, // Aspect ratio is locked
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

  return (
    <div>
      <input type="file" onChange={handleImageChange} />
      {src && (
        <ReactCrop 
          src={src}
          crop={crop}
          onChange={(newCrop) => setCrop(newCrop)}
        />
      )}
    </div>
  );
}

export default LockAspectRatio;
