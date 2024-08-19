import React from 'react';
import { Grid, Card, CardContent, CardMedia, Typography, CardActionArea } from '@mui/material';
import SearchBar from './SearchBar';
import Layout from './Layout'; // Import Layout
import { useNavigate } from 'react-router-dom'; // Import useNavigate

interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  price: string;
  available: number;
}

export default function Home() {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = React.useState<string>('');
  const [value, setValue] = React.useState<number>(0);
  const navigate = useNavigate(); // Declare navigate using useNavigate

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleBuyNow = (product: Product) => {
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
      <SearchBar
        value={searchTerm}
        onChange={(newValue) => setSearchTerm(newValue)}
        onRequestSearch={handleSearch}
      />
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
              <div
                style={{
                  pointerEvents: product.available === 0 ? 'none' : 'auto',
                  height: '100%',
                }}
              >
                <CardActionArea
                  sx={{ height: '100%' }}
                  onClick={() => {
                    if (product.available > 0) {
                      handleBuyNow(product);
                    }
                  }}
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
              </div>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Layout>
  );
}
