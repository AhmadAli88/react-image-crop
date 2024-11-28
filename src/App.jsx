import './App.css';
import CropDemo from './components/ImageCropper';

function App() {
  const imageUrl = 'https://images.unsplash.com/photo-1439871846984-851e435a999b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDN8NnNNVmpUTFNrZVF8fGVufDB8fHx8fA%3D%3D';

  return (
    <div>
      <h1>Image Crop Demo</h1>
      <CropDemo src={imageUrl} />
    </div>
  );
}

export default App;
