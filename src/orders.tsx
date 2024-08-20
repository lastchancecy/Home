import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Card, CardContent, CardMedia, Button } from '@mui/material';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

interface Order {
  order_time: string;
  name: string;
  description: string;
  image: string;
  price: string;
  time: string;
  id: number; // Include the order ID in the interface
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
        // Fetch orders for the table
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

        // Fetch active order
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
    if (!activeOrder || !activeOrder.id) {  // Check for both activeOrder and its id
      console.error("Active Order ID is missing.");
      return;
    }
  
    console.log("Active Order ID:", activeOrder.id); // Should log the correct ID
  
    try {
      const deleteResponse = await fetch(`${process.env.REACT_APP_API}orders/${activeOrder.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${Cookies.get('authToken')}`
        }
      });
  
      if (deleteResponse.ok) {
        setActiveOrder(null); // Remove the active order from state
        // Optionally, refresh the orders list
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

  if (loading) {
    return <Typography variant="h6">Loading...</Typography>;
  }

  if (orders.length === 0) {
    return <Typography variant="h6">No orders found</Typography>;
  }

  return (
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
              Product Time: {activeOrder.time}
            </Typography>
            <Button variant="contained" color="secondary" onClick={handleDelete}>
              Delete Order
            </Button>
          </CardContent>
        </Card>
      )}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Order Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order, index) => (
              <TableRow key={index}>
                <TableCell>{order.name}</TableCell>
                <TableCell>{order.description}</TableCell>
                <TableCell>
                  <img
                    src={order.image}
                    alt={order.name}
                    style={{ width: '50px', height: 'auto' }}
                  />
                </TableCell>
                <TableCell>{order.price}</TableCell>
                <TableCell>{order.order_time}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
