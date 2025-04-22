import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import { Button, Card, Form, Spinner } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FaceVerification = () => {
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [licenseNumber, setLicenseNumber] = useState('');
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
    setResult(null);
    toast.info("Image captured. You can now verify.");
  };

  const fetchDrivers = async () => {
    try {
      const res = await axios.get('http://localhost:5096/api/admin/drivers');
      setDrivers(res.data);
    } catch (err) {
      toast.error('Failed to load drivers');
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const verifyFace = async () => {
    if (!capturedImage) {
      toast.warning('Please capture an image first.');
      return;
    }

    if (!licenseNumber) {
      toast.warning('Please select a driver.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5096/api/verify', {
        imageBase64: capturedImage,
        licenseNumber: licenseNumber
      });

      const { matchFound, message, licenseNumber: matchedLicense } = response.data;

      if (matchFound && matchedLicense === licenseNumber) {
        toast.success(message || 'Face matched successfully!');
        setResult("✅ Face matched successfully!");
      } else if (matchFound && matchedLicense !== licenseNumber) {
        toast.warning("Face matched another driver. Please check selection.");
        setResult("⚠️ Face matched someone else. Wrong driver selected?");
      } else {
        toast.info(message || 'Face not matched. Try again.');
        setResult("❌ No match found. Make sure your face is visible.");
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'An error occurred during face verification.';
      toast.error(msg);
      setResult(`❌ ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <ToastContainer />
      <h3 className="text-center mb-4">Live Face Verification</h3>
      <Card className="p-4 shadow-sm border-0">
        <div className="row">
          <div className="col-md-6 text-center">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width="100%"
              className="rounded border"
            />
            <Button className="mt-3" onClick={capture}>
              Capture Image
            </Button>
          </div>

          <div className="col-md-6">
            <Form.Group>
              <Form.Label>Select Driver</Form.Label>
              <Form.Select onChange={(e) => setLicenseNumber(e.target.value)} value={licenseNumber}>
                <option value="">-- Select --</option>
                {drivers.map((d) => (
                  <option key={d.id} value={d.licenseNumber}>
                    {d.name} ({d.licenseNumber})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {capturedImage && (
              <div className="mt-4">
                <h6>Captured Image</h6>
                <img
                  src={capturedImage}
                  alt="Captured"
                  className="img-thumbnail"
                  style={{ maxWidth: '100%' }}
                />
              </div>
            )}

            <Button
              className="mt-3"
              variant="success"
              onClick={verifyFace}
              disabled={loading || !capturedImage || !licenseNumber}
            >
              {loading ? <Spinner animation="border" size="sm" /> : 'Verify Face'}
            </Button>

            {result && (
              <div className="mt-3 alert alert-info text-center">{result}</div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FaceVerification;
