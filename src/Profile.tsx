import React, { useEffect, useState } from 'react';
import { Container, Card, CardContent, CardHeader, Typography, Avatar, Divider, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Layout from './Layout';
import CircularWithValueLabel from './LoadingIndicator'; // Import the loading component

const Profile: React.FC = () => {
  const [user, setUser] = useState<{ firstname: string; lastname: string; email: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const userId = Cookies.get('userId');

  useEffect(() => {
    if (!userId) {
      navigate('/signin');
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const response = await fetch(process.env.REACT_APP_API + `profile/${userId}`);

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const contentType = response.headers.get('Content-Type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          setUser(data);
        } else {
          throw new Error('Unexpected content type');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setError('Failed to load user profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId, navigate]);

  const handleSignOut = () => {
    Cookies.remove('userId');
    navigate('/signin');
  };

  return (
    <Layout>
      <div className="signin-container">
        <Container component="main" maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
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
          ) : error ? (
            <Typography variant="h6" color="error">{`Error: ${error}`}</Typography>
          ) : !user ? (
            <Typography variant="h6">User not found</Typography>
          ) : (
            <Card elevation={3} sx={{ borderRadius: 2 }}>
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: '#3f51b5' }}>
                    {user.firstname[0]}{user.lastname[0]}
                  </Avatar>
                }
                title={`${user.firstname} ${user.lastname}`}
                subheader={user.email}
                sx={{ textAlign: 'center' }}
              />
              <Divider />
              <CardContent>
                <Typography variant="body1" color="textSecondary">
                  Welcome to your profile! Here you can find and update your personal information.
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                  <Button variant="contained" color="primary" onClick={handleSignOut}>
                    Sign Out
                  </Button>
                </Box>
              </CardContent>
            </Card>
          )}
        </Container>
      </div>
    </Layout>
  );
};

export default Profile;
