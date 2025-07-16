import React, { useState } from 'react';
import { Autocomplete, TextField } from '@mui/material';

const SearchBar = ({ options }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (event, value) => {
    setSearchTerm(value);
  };

  return (
    <Autocomplete
      freeSolo
      options={options}
      value={searchTerm}
      onInputChange={handleSearch}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Search"
          variant="outlined"
          fullWidth
        />
      )}
    />
  );
};

export default SearchBar;