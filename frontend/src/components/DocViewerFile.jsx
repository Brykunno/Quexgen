import React, { useState } from 'react';
import { Autocomplete, TextField, Chip } from '@mui/material';

function DocViewerFile() {
  const [selectedOptions, setSelectedOptions] = useState([]);

  // Options to choose from
  const options = ['Multiple Choice' , 'Identification', 'True of False'];

  return (
    <div>
    <Autocomplete
      multiple
      id="chip-selection"
      options={options} // List of options
      value={selectedOptions}
      onChange={(event, newValue) => {
        setSelectedOptions(newValue);
      }}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip
            variant="outlined"
            label={option}
            {...getTagProps({ index })}
            key={index}
          />
        ))
      }
      renderInput={(params) => (
        <TextField {...params} variant="outlined" label="Select Options" />
      )}
    />
    {selectedOptions}
    </div>
  );
}

export default DocViewerFile



