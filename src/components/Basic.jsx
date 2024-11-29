/*eslint-disable*/
import React, { useState, useRef, useCallback } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const ImageCropExamples = () => {
  // Scenario 1: Basic Crop with Aspect Ratio
  const [basicCrop, setBasicCrop] = useState({
    unit: '%',
    width: 50,
    aspect: 16 / 9
  });
  const [basicImageSrc, setBasicImageSrc] = useState(null);
  const [basicCroppedImage, setBasicCroppedImage] = useState(null);

  // Scenario 2: Profile Picture Crop (Circular)
  const [profileCrop, setProfileCrop] = useState({
    unit: '%',
    width: 70,
    aspect: 1
  });
  const [profileImageSrc, setProfileImageSrc] = useState(null);
  const [profileCroppedImage, setProfileCroppedImage] = useState(null);

  // Scenario 3: Multiple Image Crop Sizes
  const [multipleCrop, setMultipleCrop] = useState({
    unit: '%',
    width: 50
  });
  const [multipleImageSrc, setMultipleImageSrc] = useState(null);
  const [multipleCroppedImages, setMultipleCroppedImages] = useState({
    large: null,
    medium: null,
    small: null
  });

  // Helper function to handle image upload
  const handleImageUpload = (event, setImageSrc) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', () => setImageSrc(reader.result));
    reader.readAsDataURL(file);
  };

  // Download image function
  const downloadImage = (imageUrl, filename) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = filename || 'cropped-image.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Scenario 1: Crop with Aspect Ratio
  const handleBasicCropComplete = (crop, percentCrop) => {
    makeClientCrop(crop, percentCrop, setBasicCroppedImage);
  };

  // Scenario 2: Profile Picture Crop
  const handleProfileCropComplete = (crop, percentCrop) => {
    makeClientCrop(crop, percentCrop, setProfileCroppedImage, true);
  };

  // Scenario 3: Multiple Image Crop Sizes
  const handleMultipleCropComplete = (crop, percentCrop) => {
    makeMultipleSizeCrops(crop, percentCrop);
  };

  // Generic crop function
  const makeClientCrop = async (crop, percentCrop, setCroppedImage, circular = false) => {
    if (circular) {
      // Ensure crop is circular for profile pictures
      crop.aspect = 1;
    }

    const image = new Image();
    image.src = circular ? profileImageSrc : multipleImageSrc || basicImageSrc;
    
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    
    const cropWidth = (percentCrop.width * image.naturalWidth) / 100;
    const cropHeight = (percentCrop.height * image.naturalHeight) / 100;
    
    const cropX = (percentCrop.x * image.naturalWidth) / 100;
    const cropY = (percentCrop.y * image.naturalHeight) / 100;

    const canvas = document.createElement('canvas');
    canvas.width = cropWidth;
    canvas.height = cropHeight;
    const ctx = canvas.getContext('2d');

    if (circular) {
      // Create circular mask for profile picture
      ctx.beginPath();
      ctx.arc(cropWidth / 2, cropHeight / 2, cropWidth / 2, 0, 2 * Math.PI);
      ctx.closePath();
      ctx.clip();
    }

    ctx.drawImage(
      image,
      cropX, cropY, cropWidth, cropHeight,
      0, 0, cropWidth, cropHeight
    );

    return new Promise((resolve) => {
      canvas.toBlob(blob => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        setCroppedImage(url);
        resolve(url);
      }, 'image/jpeg');
    });
  };

  // Multiple size crop function
  const makeMultipleSizeCrops = async (crop, percentCrop) => {
    const largeCrop = await makeClientCrop({ ...crop, width: 70 }, { ...percentCrop, width: 70 });
    const mediumCrop = await makeClientCrop({ ...crop, width: 50 }, { ...percentCrop, width: 50 });
    const smallCrop = await makeClientCrop({ ...crop, width: 30 }, { ...percentCrop, width: 30 });

    setMultipleCroppedImages({
      large: largeCrop,
      medium: mediumCrop,
      small: smallCrop
    });
  };

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-4">React Image Crop Use Cases</h1>

      {/* Scenario 1: Basic Crop with Aspect Ratio */}
      <div>
        <h2 className="text-xl font-semibold mb-2">1. Landscape Image Crop (16:9 Aspect Ratio)</h2>
        <input 
          type="file" 
          accept="image/*" 
          onChange={(e) => handleImageUpload(e, setBasicImageSrc)}
          className="mb-2"
        />
        {basicImageSrc && (
          <div>
            <ReactCrop
              crop={basicCrop}
              onChange={(newCrop) => setBasicCrop(newCrop)}
              onComplete={handleBasicCropComplete}
              aspect={16 / 9}
            >
              <img src={basicImageSrc} alt="Crop source" />
            </ReactCrop>
            {basicCroppedImage && (
              <div className="mt-2 flex items-center space-x-4">
                <h3>Cropped Image:</h3>
                <img src={basicCroppedImage} alt="Cropped" className="max-w-xs" />
                <button 
                  onClick={() => downloadImage(basicCroppedImage, 'landscape-crop.jpg')}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Download
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Scenario 2: Profile Picture Crop (Circular) */}
      <div>
        <h2 className="text-xl font-semibold mb-2">2. Circular Profile Picture Crop</h2>
        <input 
          type="file" 
          accept="image/*" 
          onChange={(e) => handleImageUpload(e, setProfileImageSrc)}
          className="mb-2"
        />
        {profileImageSrc && (
          <div>
            <ReactCrop
              crop={profileCrop}
              onChange={(newCrop) => setProfileCrop(newCrop)}
              onComplete={handleProfileCropComplete}
              aspect={1}
              circularCrop
            >
              <img src={profileImageSrc} alt="Profile crop source" />
            </ReactCrop>
            {profileCroppedImage && (
              <div className="mt-2 flex items-center space-x-4">
                <h3>Cropped Profile Picture:</h3>
                <img 
                  src={profileCroppedImage} 
                  alt="Cropped Profile" 
                  className="w-32 h-32 rounded-full object-cover" 
                />
                <button 
                  onClick={() => downloadImage(profileCroppedImage, 'profile-crop.jpg')}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Download
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Scenario 3: Multiple Image Crop Sizes */}
      <div>
        <h2 className="text-xl font-semibold mb-2">3. Multiple Image Sizes</h2>
        <input 
          type="file" 
          accept="image/*" 
          onChange={(e) => handleImageUpload(e, setMultipleImageSrc)}
          className="mb-2"
        />
        {multipleImageSrc && (
          <div>
            <ReactCrop
              crop={multipleCrop}
              onChange={(newCrop) => setMultipleCrop(newCrop)}
              onComplete={handleMultipleCropComplete}
            >
              <img src={multipleImageSrc} alt="Multiple sizes crop source" />
            </ReactCrop>
            {multipleCroppedImages.large && (
              <div className="mt-2 flex space-x-4 items-center">
                <div>
                  <h3>Large (70%):</h3>
                  <img 
                    src={multipleCroppedImages.large} 
                    alt="Large Crop" 
                    className="w-64" 
                  />
                  <button 
                    onClick={() => downloadImage(multipleCroppedImages.large, 'large-crop.jpg')}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-2"
                  >
                    Download
                  </button>
                </div>
                <div>
                  <h3>Medium (50%):</h3>
                  <img 
                    src={multipleCroppedImages.medium} 
                    alt="Medium Crop" 
                    className="w-48" 
                  />
                  <button 
                    onClick={() => downloadImage(multipleCroppedImages.medium, 'medium-crop.jpg')}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-2"
                  >
                    Download
                  </button>
                </div>
                <div>
                  <h3>Small (30%):</h3>
                  <img 
                    src={multipleCroppedImages.small} 
                    alt="Small Crop" 
                    className="w-32" 
                  />
                  <button 
                    onClick={() => downloadImage(multipleCroppedImages.small, 'small-crop.jpg')}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-2"
                  >
                    Download
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageCropExamples;