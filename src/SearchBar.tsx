// src/SearchBar.tsx
import React from 'react';
import { TextField, IconButton, InputAdornment, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface SearchBarProps {
  value: string;
  onChange: (newValue: string) => void;
  onRequestSearch: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, onRequestSearch }) => {
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      onRequestSearch();
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 600, margin: '0 auto' }}> {/* Center and limit max width */}
      <TextField
        fullWidth
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Search by name"
        variant="outlined"
        size="small"
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'transparent', // Transparent background for the input
            '& fieldset': {
              borderColor: 'black', // Black border color
            },
          },
          '& .MuiInputBase-input': {
            color: 'black', // Black text color
          },
          '& .MuiInputAdornment-root': {
            color: 'black', // Black color for the search icon
          },
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={onRequestSearch}>
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};

export default SearchBar;
