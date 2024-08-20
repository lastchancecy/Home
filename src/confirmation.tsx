import React from 'react';
import { Container, Typography, Button, Box, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Layout from './Layout'; // Import Layout

const Confirmation = () => {
  const navigate = useNavigate();

  const handleReturnHome = () => {
    navigate('/orders'); // Navigate back to the home page or another route
  };

  return (
    <div className="signin-container"> {/* Apply the new CSS class here */}
    <Layout>
<Container component="main" maxWidth="xs" sx={{ mt: 8, mb: 8 }}>
  
      <Paper elevation={3} sx={{ padding: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          Thank You for Your Order!
        </Typography>
        <Typography variant="h6" color="text.primary" sx={{ mt: 2 }}>
          Your order has been successfully placed.
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
          We are currently processing your order. You will receive a confirmation email shortly.
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleReturnHome}
          >
            Return to Orders
          </Button>
        </Box>
      </Paper>
    </Container>
</Layout>
</div>  

  );
};

export default Confirmation;
