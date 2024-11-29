import { useRef, useState } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { drawImageOnCanvas, generateDownload } from '../components/utilities/utils';

export default function ImageCropper() {
  const [imgSrc, setImgSrc] = useState(''); // Stores the image source
  const [crop, setCrop] = useState({ aspect: 1 }); // Crop configuration
  const [completedCrop, setCompletedCrop] = useState(null); // Stores the completed crop details

  const imgRef = useRef(null); // Reference to the image element
  const canvasRef = useRef(null); // Reference to the canvas element

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.src = reader.result;
      img.onload = () => setImgSrc(reader.result);
      img.onerror = () => {
        alert('Selected file is not a valid image');
        setImgSrc('');
      };
    };
    reader.readAsDataURL(file);
  };

  const handleCompleteCrop = (crop) => {
    if (imgRef.current && crop.width && crop.height) {
      drawImageOnCanvas(imgRef.current, canvasRef.current, crop);
      setCompletedCrop(crop);
    }
  };

  const handleClearImage = () => {
    setImgSrc('');
    setCrop({ aspect: 1 });
    setCompletedCrop(null);
  };

  const handleDownload = () => {
    if (completedCrop) {
      generateDownload(canvasRef.current, completedCrop);
    }
  };

  return (
    <div className="ImageCropper">
      {!imgSrc ? (
        // File selection UI
        <div className="FileSelector">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="FileInput"
          />
        </div>
      ) : (
        // Cropping UI
        <>
          <div className="CropperWrapper">
            <ReactCrop
              crop={crop}
              onChange={(newCrop) => setCrop(newCrop)}
              onComplete={handleCompleteCrop}
              aspect={1}
            >
              <img ref={imgRef} src={imgSrc} alt="Crop preview" />
            </ReactCrop>
          </div>

          <div className="CanvasWrapper">
            <canvas ref={canvasRef} />
          </div>

          <div className="Actions">
            <button onClick={handleClearImage}>Clear Image</button>
            <button 
              onClick={handleDownload} 
              disabled={!completedCrop}
            >
              Download Cropped Image
            </button>
          </div>
        </>
      )}
    </div>
  );
}
