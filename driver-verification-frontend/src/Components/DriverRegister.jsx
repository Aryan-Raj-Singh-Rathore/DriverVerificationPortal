import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import { Form, Button, Card } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DriverRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactNumber: '',
    licenseNumber: '',
  });
  const [capturedImage, setCapturedImage] = useState(null);
  const webcamRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
    toast.success('Image captured successfully!');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!capturedImage) {
      toast.error('Please capture an image before submitting.');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5096/api/driver/register', {
        ...formData,
        imageBase64: capturedImage,
      });
      toast.success('Driver registered successfully!');
      setFormData({ name: '', email: '', contactNumber: '', licenseNumber: '' });
      setCapturedImage(null);
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    }
  };

  return (
    <Card className="p-4 shadow">
      <ToastContainer />
      <h3 className="mb-4">Driver Registration</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Contact Number</Form.Label>
          <Form.Control type="text" name="contactNumber" value={formData.contactNumber} onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>License Number</Form.Label>
          <Form.Control type="text" name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Capture Live Image</Form.Label>
          <div className="d-flex flex-column align-items-center">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width={300}
              height={250}
              className="mb-2 border rounded"
            />
            <Button variant="primary" onClick={captureImage}>Capture</Button>
          </div>
        </Form.Group>

        {capturedImage && (
          <div className="text-center mb-3">
            <h6>Captured Image:</h6>
            <img src={capturedImage} alt="Captured" className="img-thumbnail" style={{ width: '200px' }} />
          </div>
        )}

        <Button type="submit" variant="success">Register</Button>
      </Form>
    </Card>
  );
};

export default DriverRegister;
