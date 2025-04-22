// DriverFaceRegister.js
import React, { useState } from 'react';
import axios from 'axios';

const DriverFaceRegister = () => {
  const [driverId, setDriverId] = useState('');
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('DriverId', driverId);
    formData.append('Image', file);

    try {
      await axios.post('http://localhost:5096/api/facial/register', formData);
      setMessage('Face image uploaded successfully!');
    } catch {
      setMessage('Failed to upload face image.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3">
      <input type="text" placeholder="Driver ID" onChange={e => setDriverId(e.target.value)} required />
      <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} required />
      <button type="submit" className="btn btn-primary">Upload Face</button>
      <p>{message}</p>
    </form>
  );
};

export default DriverFaceRegister;
