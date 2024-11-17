import React, { useState } from 'react';
import { Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu'; // Burger Icon
import CloseIcon from '@mui/icons-material/Close'; // Close Icon
import VisibilityIcon from '@mui/icons-material/Visibility';
import PreviewIcon from '@mui/icons-material/Preview';
import KeyIcon from '@mui/icons-material/Key';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import SaveIcon from '@mui/icons-material/Save';
import SendIcon from '@mui/icons-material/Send';

const Menu_update = ({
  setShowPart,
  disableShowPart1,
  disableShowPart2,
  disableShowPart3,
  disableShowPart4,

  setPdfModal,
  setPdfModalAnswer,
  
  setSubmit,
  showPart
}) => {
  const [isMenuOpen, setMenuOpen] = useState(false);

  return (
    <div
      className="position: sticky top-0 z-40 rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800 p-3"
    >
      <div className='flex'>
        {/* Example of other content */}
        <div className='md:hidden flex-1 mt-2'>
          {showPart && <p>Currently Viewing: Test Part {showPart}</p>}
        </div>

        {/* Burger Icon */}
        <div className="md:hidden justify-end items-center">
          <Button
            color="primary"
            onClick={() => setMenuOpen(!isMenuOpen)}
            size="small"
            variant="text"
          >
            {isMenuOpen ? (
              <CloseIcon fontSize="large" />
            ) : (
              <MenuIcon fontSize="large" />
            )}
          </Button>
        </div>
      </div>

      {/* Menu Content */}
      <div
        className={`flex flex-col md:flex-row gap-3 transition-all duration-300 ${
          isMenuOpen ? 'block' : 'hidden'
        } md:block`}
      >
        <div className='flex flex-col md:flex-row gap-3'>
          {/* Left Section */}
          <div className="flex flex-col md:flex-row gap-5 justify-start">
            <Button
              color="primary"
              onClick={() => setShowPart(1)}
              disabled={disableShowPart1}
              size="small"
              variant="contained"
            >
              Test 1
            </Button>
            <Button
              color="primary"
              onClick={() => setShowPart(2)}
              disabled={disableShowPart2}
              size="small"
              variant="contained"
            >
              Test 2
            </Button>
            <Button
              color="primary"
              onClick={() => setShowPart(3)}
              disabled={disableShowPart3}
              size="small"
              variant="contained"
            >
              Test 3
            </Button>
            <Button
              color="primary"
              onClick={() => setShowPart(4)}
              disabled={disableShowPart4}
              size="small"
              variant="contained"
            >
              Test 4
            </Button>
          </div>

          {/* Right Section */}
          <div className="flex flex-col md:flex-row flex-1 gap-5 justify-end">
         
            <Button
              color="info"
              onClick={() => setPdfModal(true)}
              size="small"
              variant="contained"
            >
              <PreviewIcon className="mr-2" fontSize="small" />
              Preview
            </Button>
            <Button
              color="info"
              onClick={() => setPdfModalAnswer(true)}
              size="small"
              variant="contained"
            >
              <KeyIcon className="mr-2" fontSize="small" />
              Answer keys
            </Button>
           
            <Button
              type="submit"
              onClick={() => setSubmit(false)}
              color="success"
              size="small"
              variant="contained"
            >
              <SaveIcon className="mr-2" fontSize="small" />
              Save
            </Button>
            <Button
              type="submit"
              onClick={() => setSubmit(true)}
              color="success"
              size="small"
              variant="contained"
            >
              <SendIcon className="mr-2" fontSize="small" />
              Submit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu_update;
