import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Card, Spinner, Modal, Row, Col, Form } from 'react-bootstrap'; // ⬅️ Added Form
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [drivers, setDrivers] = useState([]);
  const [filteredDrivers, setFilteredDrivers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [driverToDelete, setDriverToDelete] = useState(null);

  useEffect(() => {
    fetchDrivers();
  }, []);

  useEffect(() => {
    filterDrivers();
  }, [search, drivers]);

  const fetchDrivers = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5096/api/admin/drivers');
      setDrivers(res.data);
      setFilteredDrivers(res.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch drivers');
    } finally {
      setLoading(false);
    }
  };

  const filterDrivers = () => {
    const filtered = drivers.filter(driver =>
      driver.name.toLowerCase().includes(search.toLowerCase()) ||
      driver.email.toLowerCase().includes(search.toLowerCase()) ||
      driver.licenseNumber.toLowerCase().includes(search.toLowerCase()) ||
      driver.contactNumber.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredDrivers(filtered);
  };

  const handleDeleteConfirmation = (driver) => {
    setDriverToDelete(driver);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:5096/api/admin/delete/${driverToDelete.id}`);
      toast.success(`Driver "${driverToDelete.name}" deleted successfully.`);
      setDrivers((prev) => prev.filter(d => d.id !== driverToDelete.id));
    } catch (err) {
      toast.error('Failed to delete driver.');
    } finally {
      setShowModal(false);
      setDriverToDelete(null);
    }
  };

  const updateDriverStatus = async (id, action) => {
    try {
      await axios.put(`http://localhost:5096/api/admin/${action}/${id}`);
      toast.success(`Driver ${action}ed successfully.`);
      fetchDrivers();
    } catch (err) {
      toast.error('Action failed.');
    }
  };

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4">Admin Dashboard</h2>
      <ToastContainer />

      <Form className="mb-4 d-flex justify-content-center search-bar-sm">
  <Form.Control
    type="text"
    placeholder="Search drivers..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />
</Form>


      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : error ? (
        <p className="text-danger text-center">{error}</p>
      ) : filteredDrivers.length === 0 ? (
        <div className="text-center mt-5">
          <h5 className="text-muted">No matching drivers found.</h5>
          <img
            src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
            alt="No drivers"
            style={{ maxWidth: '150px', marginTop: '20px' }}
          />
        </div>
      ) : (
        <div className="row justify-content-center">
          {filteredDrivers.map((driver) => (
            <div className="col-md-6 mb-4" key={driver.id}>
              <Card className="shadow-sm hover-card compact-card border-0 p-3">
                <Row className="g-0">
                  <Col md={3} className="d-flex flex-column align-items-center justify-content-center border-end">
                    <Card.Title className="mb-2 small text-muted">Uploaded Photo</Card.Title>
                    {driver.imageUrl ? (
                      <div className="image-container">
                        <img
                          src={driver.imageUrl}
                          alt="Driver"
                          className="driver-image"
                        />
                      </div>
                    ) : (
                      <div className="text-muted small">No image</div>
                    )}
                  </Col>
                  <Col md={9}>
                    <Card.Body className="py-2 px-3">
                      <h6 className="mb-2 fw-semibold">{driver.name}</h6>
                      <Card.Text className="mb-2 small">
                        <strong>Email:</strong> {driver.email} <br />
                        <strong>Phone:</strong> {driver.contactNumber} <br />
                        <strong>License:</strong> {driver.licenseNumber} <br />
                        <strong>Status:</strong>{' '}
                        <span
                          className={`ms-2 badge ${
                            driver.status === 'Verified'
                              ? 'bg-success'
                              : driver.status === 'Rejected'
                              ? 'bg-danger'
                              : 'bg-warning text-dark'
                          }`}
                        >
                          {driver.status}
                        </span>
                      </Card.Text>

                      {driver.status === 'Pending' && (
                        <div className="d-flex gap-2 mb-2">
                          <Button variant="success" size="sm" onClick={() => updateDriverStatus(driver.id, 'verify')}>
                            Verify
                          </Button>
                          <Button variant="danger" size="sm" onClick={() => updateDriverStatus(driver.id, 'reject')}>
                            Reject
                          </Button>
                        </div>
                      )}

                      <Button variant="outline-danger" size="sm" onClick={() => handleDeleteConfirmation(driver)}>
                        Delete
                      </Button>
                    </Card.Body>
                  </Col>
                </Row>
              </Card>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete{' '}
          <strong>{driverToDelete?.name}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Yes, Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
