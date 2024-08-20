import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, TextField, Button, Box, Paper } from '@mui/material';
import Cookies from 'js-cookie'; // Import js-cookie for handling cookies
import moment from 'moment';
import Layout from './Layout'; // Import Layout


interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  price: string;
  available: number;
  time: string;
}

export default function Checkout() {
  const { id } = useParams<{ id: string }>(); // Get product ID from URL
  const [product, setProduct] = useState<Product | null>(null);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return; // Guard clause for undefined id

      try {
        const response = await fetch(`${process.env.REACT_APP_API}products/${id}`);
        const data = await response.json();
        console.log('Fetched product in Checkout:', data); // Check product data

        setProduct(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const checkPendingOrders = async (userId: string) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API}orders/pending/${userId}`, {
        headers: {
          'Authorization': `Bearer ${Cookies.get('authToken')}`
        }
      });
  
      if (!response.ok) {
        throw new Error('Error checking pending orders');
      }
  
      const data = await response.json();
      return data.hasPendingOrders; // Return the value from the JSON response
    } catch (error) {
      console.error('Error checking pending orders:', error);
      return false; // Default to no pending orders in case of error
    }
  };
  
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
  
    const userId = Cookies.get('userId');
    if (!userId) {
      navigate('/signin');
      return;
    }
  
    const hasPendingOrders = await checkPendingOrders(userId);
    if (hasPendingOrders) {
      alert('You have other pending orders.');
      return;
    }
  
    const orderData = {
      user_id: userId,
      product_id: id,
      time: moment().format('YYYY-MM-DD HH:mm:ss'),
      comments: address
    };
  
    console.log('Order data:', orderData); // Add this line to log the order data
  
    try {
      const response = await fetch(`${process.env.REACT_APP_API}orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('authToken')}`
        },
        body: JSON.stringify(orderData)
      });
  
      if (response.ok) {
        navigate('/confirmation');
      } else {
        const errorText = await response.text();
        console.error('Error placing order:', errorText);
        alert('Failed to place order. Please try again.');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('An error occurred while placing the order. Please try again.');
    }
  };
  if (loading) {
    return <Typography variant="h6">Loading...</Typography>;
  }

  if (!product) {
    return <Typography variant="h6">Product not found</Typography>;
  }

  return (
    <Layout>   
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ padding: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          Checkout
        </Typography>
        <img src={product.image} alt={product.name} style={{ width: '100%', height: 'auto', marginBottom: 16 }} />

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            {product.name}
          </Typography>
          <Typography variant="h6" color="text.primary">
            €{product.price}
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            {product.description}
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            {"Take Away Time: " + product.time}
          </Typography>
       
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            label="Comments"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
          >
            Place Order
          </Button>
        </Box>
      </Paper>
    </Container>
    </Layout> 
  );
}
