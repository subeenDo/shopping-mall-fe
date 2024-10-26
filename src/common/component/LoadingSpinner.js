import React from 'react';
import '../style/LoadingSpinner.css';
import { Container, Spinner } from 'react-bootstrap';

const LoadingSpinner = () => {
  return (
    <Container className="spinner-container">
      <Spinner animation="border" role="status" className="spinner" />
    </Container>
  );
};

export default LoadingSpinner;
