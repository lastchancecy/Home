import React, { useEffect, useState } from 'react';
import { Grid, Card, CardContent, CardMedia, Typography, CardActionArea,Box } from '@mui/material';
import SearchBar from './SearchBar';
import Layout from './Layout'; // Import Layout
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import CircularWithValueLabel from './LoadingIndicator'; // Import the loading component

interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  price: string;
  available: number;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate(); // Declare navigate using useNavigate

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API}products`);
        if (!response.ok) {
          throw new Error('Error fetching products');
        }
        const data = await response.json();
        console.log('Fetched products:', data); // Check fetched products
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleBuyNow = (product: Product) => {
    console.log('Navigating to checkout with product ID:', product.id); // Check product ID
    navigate(`/checkout/${product.id}`); // Use navigate for redirection
  };

  const handleSearch = () => {
    setSearchTerm(searchTerm.trim().toLowerCase());
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout> {/* Wrap content with Layout */}
 <div className="home-container"> {/* Apply the new CSS class here */}
 <SearchBar
        value={searchTerm}
        onChange={(newValue) => setSearchTerm(newValue)}
        onRequestSearch={handleSearch}
      />
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
        <Grid container spacing={4} padding={4}>
          {filteredProducts.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={4}>
              <Card
                sx={{
                  height: '250px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 2,
                  boxShadow: 'none',
                  border: '10px solid rgba(255, 255, 255, 0.5)',
                  pointerEvents: product.available === 0 ? 'none' : 'auto',
                  cursor: product.available === 0 ? 'not-allowed' : 'pointer',
                }}
              >
                <CardActionArea
                  sx={{ height: '100%' }}
                  onClick={() => {
                    if (product.available > 0) {
                      handleBuyNow(product);
                    }
                  }}
                  disabled={product.available === 0}
                >
                  <CardMedia
                    component="img"
                    height="140"
                    image={product.image}
                    alt={product.name}
                    sx={{
                      objectFit: 'cover',
                      filter: product.available === 0 ? 'grayscale(100%)' : 'none',
                    }}
                  />
                  <CardContent
                    sx={{
                      padding: '8px',
                      height: 'calc(100% - 140px)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Typography gutterBottom variant="h6" component="div">
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {product.available === 0 ? 'Not Available' : product.description}
                    </Typography>
                    <Typography
                      variant="h6"
                      color="text.primary"
                      sx={{ marginTop: 'auto' }}
                    >
                      €{product.price}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
</div>
      
    </Layout>
  );
}
