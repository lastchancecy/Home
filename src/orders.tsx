import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Card, CardContent, CardMedia, Button, Box } from '@mui/material';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import Layout from './Layout';
import CircularWithValueLabel from './LoadingIndicator'; // Import the loading component

interface Order {
  order_time: string;
  name: string;
  description: string;
  image: string;
  price: string;
  time: string;
  id: number;
  active: boolean; // Assuming there's an active field to track order status
}

export default function Order() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      const userId = Cookies.get('userId');
      if (!userId) {
        navigate('/signin');
        return;
      }

      try {
        const ordersResponse = await fetch(`${process.env.REACT_APP_API}orders/user/${userId}`, {
          headers: {
            'Authorization': `Bearer ${Cookies.get('authToken')}`
          }
        });

        if (!ordersResponse.ok) {
          throw new Error('Error fetching orders');
        }

        const ordersData = await ordersResponse.json();
        setOrders(ordersData);

        const activeOrderResponse = await fetch(`${process.env.REACT_APP_API}orders/active/${userId}`, {
          headers: {
            'Authorization': `Bearer ${Cookies.get('authToken')}`
          }
        });

        if (activeOrderResponse.ok) {
          const activeOrderData = await activeOrderResponse.json();
          setActiveOrder(activeOrderData);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const handleDelete = async () => {
    if (!activeOrder || !activeOrder.id) {
      console.error("Active Order ID is missing.");
      return;
    }

    console.log("Active Order ID:", activeOrder.id);

    try {
      const deleteResponse = await fetch(`${process.env.REACT_APP_API}orders/${activeOrder.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${Cookies.get('authToken')}`
        }
      });

      if (deleteResponse.ok) {
        setActiveOrder(null);

        const userId = Cookies.get('userId');
        const updatedOrdersResponse = await fetch(`${process.env.REACT_APP_API}orders/user/${userId}`, {
          headers: {
            'Authorization': `Bearer ${Cookies.get('authToken')}`
          }
        });

        const updatedOrdersData = await updatedOrdersResponse.json();
        setOrders(updatedOrdersData);
      } else {
        console.error('Failed to delete the order');
      }
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  const handleReceived = async () => {
    if (!activeOrder || !activeOrder.id) {
      console.error("Active Order ID is missing.");
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API}orders/${activeOrder.id}/receive`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${Cookies.get('authToken')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setActiveOrder(null); // Clear the active order once it's marked as received

        const userId = Cookies.get('userId');
        const updatedOrdersResponse = await fetch(`${process.env.REACT_APP_API}orders/user/${userId}`, {
          headers: {
            'Authorization': `Bearer ${Cookies.get('authToken')}`
          }
        });

        const updatedOrdersData = await updatedOrdersResponse.json();
        setOrders(updatedOrdersData);
      } else {
        console.error('Failed to update the order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  return (
    <Layout>
      {loading ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 'calc(100vh - 64px)', // Adjust the height to account for the layout
          }}
        >
          <CircularWithValueLabel />
        </Box>
      ) : (
        <>
          {activeOrder && (
            <Card sx={{ mb: 4 }}>
              <CardMedia
                component="img"
                height="140"
                image={activeOrder.image}
                alt={activeOrder.name}
              />
              <CardContent>
                <Typography variant="h5">{activeOrder.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {activeOrder.description}
                </Typography>
                <Typography variant="h6">€{activeOrder.price}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Order Time: {activeOrder.order_time}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Receive Time: {activeOrder.time}
                </Typography>
                <Button variant="contained" fullWidth color="secondary" onClick={handleDelete}>
                  ❌Cancel Order
                </Button>
                <Button variant="contained" fullWidth color="primary" onClick={handleReceived} sx={{ ml: 0 }}>
                  ✔️ Click When Received
                </Button>
              </CardContent>
            </Card>
          )}

          <TableContainer component={Paper} style={{ maxWidth: '100%', overflowX: 'auto' }}>
            <h3>Complited Orders</h3>
            <Table style={{ width: '100%', tableLayout: 'fixed' }}>
              <TableHead>
                <TableRow>
                  <TableCell style={{ padding: '8px', fontSize: '14px' }}>Image</TableCell>
                  <TableCell style={{ padding: '8px', fontSize: '14px' }}>Name</TableCell>
                  <TableCell style={{ padding: '8px', fontSize: '14px' }}>Description</TableCell>
                  <TableCell style={{ padding: '8px', fontSize: '14px' }}>Price</TableCell>
                  <TableCell style={{ padding: '8px', fontSize: '14px' }}>Order Time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell style={{ padding: '8px' }}>
                        <img src={order.image} alt={order.name} style={{ width: '50px', height: '30px' }} />
                      </TableCell>
                      <TableCell style={{ padding: '8px', fontSize: '14px' }}>{order.name}</TableCell>
                      <TableCell style={{ padding: '8px', fontSize: '14px' }}>{order.description}</TableCell>
                      <TableCell style={{ padding: '8px', fontSize: '14px' }}>€{order.price}</TableCell>
                      <TableCell style={{ padding: '8px', fontSize: '14px' }}>{order.order_time}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} style={{ padding: '16px', textAlign: 'center' }}>
                      <Typography variant="h6">No completed orders</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Layout>
  );
}
