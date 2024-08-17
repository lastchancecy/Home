import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const sessionToken = Cookies.get('sessionToken');

      if (!sessionToken) {
        navigate('/signup');
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Ensure cookies are sent with the request
        });

        if (response.ok) {
          const data = await response.json();
          setProfile(data);
        } else {
          navigate('/signup');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        navigate('/signup');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleSignOut = () => {
    Cookies.remove('sessionToken'); // Remove session token
    navigate('/home'); // Redirect to home page
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      {profile ? (
        <div>
          <h1>Profile Page</h1>
          <p>Name: {profile.firstName} {profile.lastName}</p>
          <p>Email: {profile.email}</p>
          <button onClick={handleSignOut}>Sign Out</button>
        </div>
      ) : (
        <p>No profile information available.</p>
      )}
    </div>
  );
}
