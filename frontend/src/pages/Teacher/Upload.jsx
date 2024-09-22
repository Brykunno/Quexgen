import React, { useState } from 'react';
import { FileInput, Button } from 'flowbite-react';
import api from '../../api';

function Upload() {
  const [files, setFiles] = useState([]); // Manage file state
  const [file, setFile] = useState(null); // For individual file processing

  // Handle file change for a specific input
  const handleFileChange = (event, index) => {
    const newFiles = [...files];
    const selectedFile = event.target.files[0];
    newFiles[index] = selectedFile;  // Update the specific file
    setFiles(newFiles);

    // Optionally set the single file for processing
    setFile(selectedFile);
  };

  // Add a new file input
  const addFileInput = () => {
    setFiles([...files, null]); // Add a new empty input
  };

  // Remove a file input at a specific index
  const removeFileInput = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
  };

  // Process the selected file and send it to Django
  const handleFileProcessing = async () => {
    if (!file) return alert('Please select a file.');

    const formData = new FormData();
    formData.append('file', file); // Append the selected file

    // Add other JSON data to the FormData
    formData.append('index', 0);
    formData.append('test_type', 'Your test type');
    formData.append('context', 'Your context');
    formData.append('taxonomy_level', 'Level');

    try {
      // Make a request to Django to process the file and JSON data
      const response = await api.post('/api/generate-question-module/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Process the response
      console.log('Processed response:', response.data);
    } catch (error) {
      console.error('Error processing the file and data:', error);
    }
  };

  return (
    <div className="content">
      <form onSubmit={(e) => e.preventDefault()}>
        {/* Dynamically create FileInput components */}
        {files.map((_, index) => (
          <div key={index} style={{ marginBottom: '10px' }}>
            <FileInput
              type="file"
              onChange={(event) => handleFileChange(event, index)}
            />
            <Button type="button" onClick={() => removeFileInput(index)} color="red">
              Remove
            </Button>
          </div>
        ))}

        <Button type="button" onClick={addFileInput} color="green">
          Add Another File
        </Button>

        <Button color={'primary'} type="button" onClick={handleFileProcessing}>
          Process File
        </Button>
      </form>
    </div>
  );
}

export default Upload;
