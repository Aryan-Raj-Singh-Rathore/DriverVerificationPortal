import React, { useState } from "react";
import axios from "axios";
import { Card, Button, Alert, Form } from "react-bootstrap";

const DriverStatus = () => {
  const [licenseNumber, setLicenseNumber] = useState('');
  const [driver, setDriver] = useState(null);
  const [error, setError] = useState('');

  const handleCheckStatus = async () => {
    if (!licenseNumber.trim()) {
      setError("Please enter a license number.");
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5096/api/driver/status/${licenseNumber}`);
      console.log("Driver response:", response.data); // See what’s actually coming
      setDriver(response.data);
      setError('');
    } catch (err) {
      console.error("Error fetching status", err);
      setDriver(null);
      setError("Driver not found. Please check the license number.");
    }
  };

  const handleReset = () => {
    setLicenseNumber('');
    setDriver(null);
    setError('');
  };

  return (
    <div className="container mt-5">
      {!driver ? (
        <Card className="mx-auto shadow-lg p-4" style={{ maxWidth: "500px" }}>
          <h4 className="text-center mb-4">Check Your Driver Status</h4>
          <Form.Group>
            <Form.Control
              type="text"
              placeholder="Enter License Number"
              value={licenseNumber}
              onChange={(e) => setLicenseNumber(e.target.value)}
            />
          </Form.Group>
          <Button variant="primary" className="mt-3 w-100" onClick={handleCheckStatus}>
            Check Status
          </Button>
          {error && <Alert variant="danger" className="mt-3 text-center">{error}</Alert>}
        </Card>
      ) : (
        <Card className="mx-auto shadow-lg" style={{ maxWidth: "600px" }}>
          {driver.imageUrl && (
            <Card.Img
              variant="top"
              src={driver.imageUrl}
              alt="Driver Profile"
              style={{ height: '300px', objectFit: 'cover' }}
            />
          )}
          <Card.Body>
            <h5 className="text-center text-success mb-3">✅ Your Driver Details</h5>
            <p><strong>Full Name:</strong> {driver.name}</p>
            <p><strong>Email:</strong> {driver.email}</p>
            <p><strong>Contact Number:</strong> {driver.contactNumber}</p>
            <p><strong>License Number:</strong> {driver.licenseNumber}</p>
            <p>
              <strong>Status:</strong>{" "}
              <span className={`badge ${
                driver.status === 'Verified' ? 'bg-success' :
                driver.status === 'Rejected' ? 'bg-danger' :
                'bg-warning text-dark'
              }`}>
                {driver.status}
              </span>
            </p>
            <div className="text-center mt-4">
              <Button variant="secondary" onClick={handleReset}>Check Another</Button>
            </div>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default DriverStatus;
