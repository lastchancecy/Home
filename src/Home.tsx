import React from 'react';
import { Grid, Card, CardContent, CardMedia, Typography, CardActionArea, Button, BottomNavigation, BottomNavigationAction } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar'; // Import the SearchBar component
import HomeIcon from '@mui/icons-material/Home';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';

interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  price: string;
  available: number; // Add available property
}

export default function Home() {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = React.useState<string>('');
  const [value, setValue] = React.useState<number>(0); // State for BottomNavigation
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://home-uwa6.onrender.com/products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleBuyNow = (product: Product) => {
    navigate(`/checkout/${product.id}`);
  };

  const handleSearch = () => {
    setSearchTerm(searchTerm.trim().toLowerCase());
  };

  // Filter products based on the search term
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
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
                height: '250px', // Set a reduced height for the card
                backgroundColor: 'rgba(255, 255, 255, 0.1)', // Transparent background
                backdropFilter: 'blur(10px)', // Optional: Apply a blur effect for better visibility
                borderRadius: 2, // Rounded corners for a modern look
                boxShadow: 'none', // Remove shadow to enhance the transparent effect
                border: '10px solid rgba(255, 255, 255, 0.5)', // Add a subtle white outline
                pointerEvents: product.available === 0 ? 'none' : 'auto', // Disable pointer events if not available
                cursor: product.available === 0 ? 'not-allowed' : 'pointer', // Change cursor if not available
              }}
            >
              <div style={{ pointerEvents: product.available === 0 ? 'none' : 'auto', height: '100%' }}>
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
                    height="140" // Adjust the height of the media
                    image={product.image}
                    alt={product.name}
                    sx={{
                      objectFit: 'cover', // Ensure the image covers the space
                      filter: product.available === 0 ? 'grayscale(100%)' : 'none', // Apply grayscale filter if not available
                    }}
                  />
                  <CardContent
                    sx={{
                      padding: '8px', // Adjust padding as needed
                      height: 'calc(100% - 140px)', // Adjust the height to fit within the card
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
                    <Typography variant="h6" color="text.primary" sx={{ marginTop: 'auto' }}>
                      €{product.price}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </div>
            </Card>
          </Grid>
        ))}
      </Grid>
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
          // Handle navigation based on newValue if needed
        }}
        sx={{ width: '100%', position: 'fixed', bottom: 0 }} // Make navigation bar fixed at the bottom
      >
        <BottomNavigationAction label="Home" icon={<HomeIcon />} />
        <BottomNavigationAction label="Orders" icon={<ShoppingCartIcon />} />
        <BottomNavigationAction label="Account" icon={<PersonIcon />} />
      </BottomNavigation>
    </>
  );
}
