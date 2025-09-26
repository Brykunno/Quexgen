import { useState } from "react";

export default function DragAndDrop() {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "application/pdf") {
      setFile(droppedFile);
    } else {
      alert("Only PDF files are allowed!");
    }
  };

  const handleChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    } else {
      alert("Only PDF files are allowed!");
    }
  };

  const handleRemove = () => {
    setFile(null);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-3">Upload PDF</h2>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition ${
          dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
        }`}
      >
        <input
          type="file"
          id="pdfUpload"
          accept="application/pdf"
          onChange={handleChange}
          className="hidden"
        />
        <label htmlFor="pdfUpload" className="cursor-pointer">
          {file ? (
            <div className="flex flex-col items-center">
              <span className="font-medium text-green-600">{file.name}</span>
              <button
                onClick={handleRemove}
                type="button"
                className="mt-2 px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          ) : (
            <span className="text-gray-500">
              Drag & drop a PDF here, or click to select
            </span>
          )}
        </label>
      </div>
    </div>
  );
}
