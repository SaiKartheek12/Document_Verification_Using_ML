import React, { useState, useEffect } from 'react';
import './Form.css';



const Form = () => {
  const [verificationResults, setVerificationResults] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    pdf: '',
    name: '',
    dateOfBirth: '',
    aadharNumber: '',
  });
  const [loading, setLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    // Check if the selected file is a PDF or JPG
    if (file && (file.type === 'application/pdf' || file.type === 'image/jpeg')) {
      setSelectedFile(file);
      console.log('File uploaded:', file);

      // Reset prediction result when a new file is selected
      setPredictionResult(null);
    } else {
      alert('Please select a valid PDF or JPG file.');
      setSelectedFile(null) 
    }
  };



  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true); // Set loading state to true

    // Check if all fields are filled
    if (!formData.name || !formData.dateOfBirth ||!formData.aadharNumber || !selectedFile) {
      alert('Please fill in all fields and select a PDF file.');
      setLoading(false);
      return;
    }
    window.alert('Form submitted successfully');
    // Use FormData to handle file uploads
    const formDataForUpload = new FormData();
    formDataForUpload.append('pdf', selectedFile);
    formDataForUpload.append('name', formData.name);
    formDataForUpload.append('dateOfBirth', formData.dateOfBirth);
    formDataForUpload.append('aadharNumber', formData.aadharNumber);

    // Make a request to your server to handle the form submission
    try {
      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formDataForUpload,
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Form submitted successfully:', data.message);
        // Add logic to handle the response as needed
        // Add this log to check the value received from the server
        console.log('is_valid_aadhaar from server:', data.is_valid_aadhaar);
        setVerificationResults(data.verification_results);

        const result = data.is_valid_aadhaar;
        setPredictionResult(result);
        setFormSubmitted(true);
      } else {
        console.error('Error submitting form:', response.statusText);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
    finally {
      setLoading(false);
      // resetForm();
    }
  };

  useEffect(() => {
    // This useEffect will be triggered whenever predictionResult changes
    // console.log('Prediction Result:', predictionResult);
  }, [predictionResult]); // Dependency array ensures useEffect runs only when predictionResult changes


  return (
    <>
      <div className='page-container'>
        <div className="form-container">
          <div className='form-content'>
            <br></br>
            <form onSubmit={handleSubmit} className={`custom-form ${formSubmitted ? 'form-submitted' : ''}`}>
              <h2>Document Submission Form</h2>
              <label>
                Name:
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <br />

              <label>
                Date of Birth:
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <br />

              <label>
                Aadhar Number:
                <input
                  type="text"
                  name="aadharNumber"
                  value={formData.aadharNumber}
                  onChange={handleInputChange}
                  minLength={12}
                  maxLength={15}
                  required
                />
              </label>
              <br />

              <label>
                Upload File (PDF or JPG):
                <input
                  type="file"
                  accept=".pdf, .jpg, .jpeg"
                  onChange={(e) => handleFileChange(e)}
                />
              </label>

              <br />

              {/* Log prediction result for debugging */}
              {console.log('Prediction Result:', predictionResult)}

              {/* Conditionally render loading symbol */}
              {loading && (
                <div className="loading-container">
                  <p className="loading-text">Loading...</p>
                  <div className="spinner"></div>
                </div>
              )}

              {/* Conditionally render prediction result */}
              {predictionResult === true && (
                <p style={{ color: 'green' }}>
                  Document is relevant <span role="img" aria-label="Tick">✅</span>
                </p>
              )}
              {predictionResult === false && (
                <p style={{ color: 'red' }}>
                  Document is irrelevant <span role="img" aria-label="Alert">⚠️</span>
                </p>
              )}

              <button type="submit">Submit</button>

            </form>

          </div>
        </div>
        </div>
        <div className="verification-results container">
          {verificationResults && (
            <>
            <h2>uploaded Image</h2>
            <img src={`http://localhost:5000/Images/cropped/photo.jpg?${new Date().getTime()}`} alt="Aadhar image" height={"250px"} />
<br></br>
            <h2>Extracted Images</h2>
            <div className="row">
              <div className="col-md-6">
              <p>
               Aadhar number verified as:
               <span className={verificationResults['aadhar no'] ? 'tick-mark' : 'cross-mark'} dangerouslySetInnerHTML={{ __html: verificationResults['aadhar no'] ? '&#10004;' : '&#10008;' }}></span>
              </p>

                <img src={`http://localhost:5000/Images/cropped/cropped_0.0.jpg?${new Date().getTime()}`} alt="Aadhar number" height={"50px"} /><br></br>
              </div>
              <div className="col-md-6">
              <p>DOB verified as:
              <span className={verificationResults['dob'] ? 'tick-mark' : 'cross-mark'} dangerouslySetInnerHTML={{ __html: verificationResults['dob'] ? '&#10004;' : '&#10008;' }}></span>
                 </p>
                <img src={`http://localhost:5000/Images/cropped/cropped_1.0.jpg?${new Date().getTime()}`} alt="DOB" height={"50px"} /><br></br>
              </div>
              <div className="col-md-6">
              <p>Emblem logo verified as: 
              <span className={verificationResults['emblem logo'] ? 'tick-mark' : 'cross-mark'} dangerouslySetInnerHTML={{ __html: verificationResults['emblem logo'] ? '&#10004;' : '&#10008;' }}></span>
                </p>
                <img src={`http://localhost:5000/Images/cropped/cropped_2.0.jpg?${new Date().getTime()}`} alt="Emblem logo" height={"50px"} /><br></br>
              </div>
              <div className="col-md-6">
              <p>GOI symbol verified as: 
              <span className={verificationResults['goi symbol'] ? 'tick-mark' : 'cross-mark'} dangerouslySetInnerHTML={{ __html: verificationResults['goi symbol'] ? '&#10004;' : '&#10008;' }}></span>
                </p>
                <img src={`http://localhost:5000/Images/cropped/cropped_3.0.jpg?${new Date().getTime()}`} alt="Goi symbol" height={"50px"} /><br></br>
              </div>
              <div className="col-md-6">
              <p>Name verified as:
              <span className={verificationResults['name'] ? 'tick-mark' : 'cross-mark'} dangerouslySetInnerHTML={{ __html: verificationResults['name'] ? '&#10004;' : '&#10008;' }}></span>

                 </p>
                <img src={`http://localhost:5000/Images/cropped/cropped_4.0.jpg?${new Date().getTime()}`} alt="Name" height={"50px"} /><br></br>
              </div>
            </div>
            </>
          )}

        </div>
    </>
  );
};

export default Form;