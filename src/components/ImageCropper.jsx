/*eslint-disable*/

import React, { useState } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

function CropDemo({ src }) {
  const [crop, setCrop] = useState({
    unit: 'px', // Units for the crop area (can be px or %)
    width: 200, // Width of the crop area
    aspect: 16 / 9, // Aspect ratio of the crop area
  });

  return (
    <div>
      <ReactCrop
        src={src}
        crop={crop}
        onChange={(newCrop) => setCrop(newCrop)}
      />
    </div>
  );
}

export default CropDemo;
