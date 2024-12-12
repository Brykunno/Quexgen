import React, { useState } from "react";
import { Document, Page } from "react-pdf";
import {Button} from "@mui/material";
import PropTypes from "prop-types";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css"
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { pdfjs } from 'react-pdf';



pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;


function PdfViewer({ path }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [error, setError] = useState(null);

  // Build the full path to the PDF file
  const pdfPath = new URL(`../../../backend/media/syllabus/${path}`, import.meta.url).toString();

  // Handle successful document load
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1); // Reset to the first page on load
    setError(null);
  };

  // Handle errors during document load
  const onDocumentLoadError = (error) => {
    console.error("Error loading PDF:", error);
    setError("Failed to load PDF. Please check the file path.");
  };

  // Page navigation handlers
  const goToPreviousPage = () => setPageNumber((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () => setPageNumber((prev) => Math.min(prev + 1, numPages));

  return (
    <div className="pdf-viewer-container flex w-full justify-center">

      <div className="flex flex-col justify-center">
      <Button variant={'contained'} onClick={goToPreviousPage} disabled={pageNumber <= 1}>
          <ArrowBackIosIcon/>
        </Button>
      </div>
      <div>

        
     
      {error ? (
        <div className="error-message">{error}</div>
      ) : (
        <Document
          file={pdfPath}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          className='p-0'
          
        >
          
          <Page pageNumber={pageNumber} renderTextLayer={false} /> 
        </Document>
      )}
  <div className="pdf-controls  flex justify-center ">
        
        <span>
          Page {pageNumber} of {numPages || "?"}
        </span>
        
      </div>
    

</div>

<div className="flex flex-col justify-center">
      <Button variant={'contained'} onClick={goToNextPage} disabled={pageNumber >= numPages}>
      <ArrowForwardIosIcon/>
        </Button>
      </div>
    </div>
  );
}

// Default Props
PdfViewer.defaultProps = {
  path: "",
};

// Prop Types
PdfViewer.propTypes = {
  path: PropTypes.string.isRequired,
};

export default PdfViewer;
