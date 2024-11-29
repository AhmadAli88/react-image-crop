import { useState } from 'react';
import CropDemo from './components/ImageCropper';


function App() {
  const [imageSrc, setImageSrc] = useState(null);

  // This function handles the image file selection
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageSrc(reader.result);  // Set base64 encoded image to state
    };
    if (file) {
      reader.readAsDataURL(file);  // Read the file as data URL
    }
  };

  return (
    <div>
      <input type="file" onChange={handleImageUpload} />
      {imageSrc && <CropDemo src={imageSrc} />}
    </div>
  );
}

export default App;
