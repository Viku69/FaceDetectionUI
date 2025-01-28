import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [image, setImage] = useState(null);
  const [base64Image, setBase64Image] = useState("");
  const [output, setOutput] = useState(null);
  const [imageList, setImageList] = useState([]);

  // Fetch images from the "images" folder
  useEffect(() => {
    const images = ["virat_kohli.jpg", "lionel_messi.jpg", "maria_sharapova.jpg", "roger_federer.webp", "serena_williams.jpg",]; // Add more images if present
    setImageList(images);
  }, []);

  // Handle image drop
  const handleImageDrop = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBase64Image(reader.result);
      };
      reader.readAsDataURL(file);
      setImage(file);
    }
  };

  // Make API call
  const handleImageUpload = async () => {
    if (!base64Image) {
      alert("Please upload an image first.");
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:8000/classify_image", {
        image_data: base64Image,
      });
      setOutput(response.data);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("There was an error with the image upload.");
    }
  };

  // Reset function to clear the image and results
  const handleReset = () => {
    setImage(null);
    setBase64Image("");
    setOutput(null);
  };

  return (
    <div className="App">
      <h1>Face Recognition System</h1>

      <div className="container">
        {/* Left Side - Display all images */}
        <div className="card left-side">
          <h2>All Persons</h2>
          <div className="image-grid">
            {imageList.map((img, index) => (
              <img key={index} src={`../images/${img}`} alt={img} />
            ))}
          </div>
        </div>

        {/* Right Side - Upload and classify image */}
        <div className="card right-side">
          <h2>Upload an Image</h2>
          <input type="file" accept="image/*" onChange={handleImageDrop} />
          {base64Image && (
            <div className="preview">
              <img src={base64Image} alt="Uploaded Preview" />
            </div>
          )}
          <button onClick={handleImageUpload}>Classify Image</button>
          <button onClick={handleReset} className="reset-btn">Reset</button>

          {output && (
            <>
              <h2>Possible Matches:</h2>
              <ul>
                {output.map((person, index) => (
                  <li key={index}>
                    <strong>{person.class}</strong> -{" "}
                    {person.class_probability[index].toFixed(2)}% probability
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
