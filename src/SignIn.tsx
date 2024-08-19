import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Cookies from 'js-cookie'; // Import Cookies


function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const defaultTheme = createTheme();

export default function SignIn() {
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const credentials = {
      email: data.get('email') as string,
      password: data.get('password') as string,
    };

    try {
      const response = await fetch('http://localhost:5000/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const result = await response.json();
        Cookies.set('userId', result.userId); // Save user ID in cookies
        console.log('User ID saved in cookies:', Cookies.get('userId'));
        navigate('/profile'); // Navigate to the profile page
      } else {
        alert('Invalid email or password');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred during sign-in');
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <div className="signin-container"> {/* Apply the new CSS class here */}
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {/* Link to the right side */}
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              
            <Button
                component="a"
                href="/Home"
                variant="text"
                color="primary"
                style={{ textTransform: 'none', fontSize: 'inherit', padding: 0, minWidth: 'auto',color: 'gray'  }}
                >{"Skip"}
                </Button>
            </Box>
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                <Button
                component="a"
                href="/signup"
                variant="text"
                color="primary"
                style={{ textTransform: 'none', fontSize: 'inherit', padding: 0, minWidth: 'auto' }}
                >{"Don't have an account? Sign Up"}
                </Button>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Copyright sx={{ mt: 8, mb: 4 }} />
        </Container>
      </div>
    </ThemeProvider>
  );
}
