import React from 'react';

const ImageComponent = () => {
    return (
        <div>
            <h2>uploaded Image</h2>
            <img src="http://localhost:5000/Images/Cropped/photo.jpg" alt="Aadhar image" height={"250px"} /><br></br>
            <h2>Extracted Images</h2>
            <img src="http://localhost:5000/Images/Cropped/cropped_0.0.jpg" alt="Aadhar number" /><br></br>
            <img src="http://localhost:5000/Images/Cropped/cropped_1.0.jpg" alt="DOB" /><br></br>
            <img src="http://localhost:5000/Images/Cropped/cropped_2.0.jpg" alt="Emblem logo" /><br></br>
            <img src="http://localhost:5000/Images/Cropped/cropped_3.0.jpg" alt="Goi symbol" /><br></br>
            <img src="http://localhost:5000/Images/Cropped/cropped_4.0.jpg" alt="Name" />
        </div>
    );
};

export default ImageComponent;