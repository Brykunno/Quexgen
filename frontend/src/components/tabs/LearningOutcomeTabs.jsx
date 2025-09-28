import * as React from 'react';
import Box from '@mui/material/Box';
import Tabs, { tabsClasses } from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import PropTypes from 'prop-types';
import { Button, CardContent, CardHeader, Divider, LinearProgress, Skeleton } from '@mui/material';

import { Textarea, TextInput,Card,Pagination,FileInput,Label,Spinner,Modal } from 'flowbite-react';
import ClearIcon from '@mui/icons-material/Clear';
import VisibilityIcon from '@mui/icons-material/Visibility';
import InvalidFileError from './../InvalidFileError';
import api from '../../api';
import { useSnackbar } from 'notistack';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DragAndDrop from '../ui/snackbar/DragAndDrop';
import { useRef } from "react";

function CustomTabPanel(props) {



  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function ScrollableTabsButtonVisible({
  addLesson,
  previewTOS,
  handleinnertaxlevelChange,
  totalOfItems,
  checkMaxMin,
  handleMaximum,
  handleInnerLessonDataChange,
  handleReadOneFile,
  handleValidateFile,
  setMaximum,
  handleLessonDataChange,
  removeFile,
  removeLesson,
  lessonsData,
  fileStatus,
  getFileStatus,
  lessonsDataInitial,
  taxonomyRange,
  fileLoading
}) {


function totalTeachingHours(index) {
  return lessonsData[index].teachingHours.reduce((sum, hour) => sum + hour, 0);
}

  const [openModals,setOpenModals] = React.useState(0);
  const [value, setValue] = React.useState(0);
  const [innerValue, setInnerValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setInnerValue(0);
    
  };


  
  const handleChangeInner = (event, newValue) => {
    setInnerValue(newValue);
  };

  const [uploads, setUploads] = React.useState([]);
  const fileInputRefs = useRef([]);

  // Drag and drop handlers
  const handleDrop = (event, index) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      handleLessonDataChange(index, 'study_guide', file);
      handleValidateFile(file, index);
      handleReadOneFile(file, index);
      handleUpload({ target: { files: [file] } }, index);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleUpload = (event, index) => {
    const file = event.target.files[0];
    if (file) {
      const info = {
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2), // MB
      };
      setUploads((prev) => {
        const updated = [...prev];
        updated[index] = info;
        return updated;
      });
    }
  };

  const handleRemoveUpload = (index) => {
    setUploads((prev) => prev.filter((_, i) => i !== index));
    handleLessonDataChange(index, 'study_guide', null);
    removeFile(index);
    if (fileInputRefs.current[index]) {
      fileInputRefs.current[index].value = "";
    }
  };



  return (
    <Box
      sx={{
        flexGrow: 1,
        maxWidth: "100%",
        bgcolor: 'background.paper',
      }}
    >

      {/* Make Tabs horizontally scrollable on small screens */}
    
      <div className="overflow-x-auto">
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons
          aria-label="visible arrows tabs example"
          sx={{
            [`& .${tabsClasses.scrollButtons}`]: {
              '&.Mui-disabled': { opacity: 0.3 },
            },
          }}
        >
          {lessonsData.map((data, index) => (
            <Tab
              key={index}
              label={`Lesson ${index + 1}`}
              {...a11yProps(index)}
            />
          ))}
          <div className='mt-2 ml-3'>
            {addLesson}
          </div>
        </Tabs>
      </div>

      {lessonsData.map((data, index) => (
        <CustomTabPanel value={value} index={index} key={index}>
          <Card className="relative">
            {/* Delete button */}
            <div className="absolute top-2 right-2">
              <Button
                size={'xs'}
                color={'error'}
              >
                <ClearIcon
                  className="hover:scale-110 transition-transform duration-200"
                  onClick={() => {
                    setValue((prev) => {
                      const newLength = lessonsData.length - 1;
                      if (newLength <= 0) return 0;
                      if (prev >= newLength) return newLength - 1;
                      return prev;
                    });
                    removeLesson(lessonsData, index);
                    removeFile(index);
                    handleRemoveUpload(index);
                    setMaximum((prevMaximum) => prevMaximum.slice(0, prevMaximum.length - 1));
                  }}
                />
              </Button>
            </div>

            {/* Drag and Drop File Upload */}
            <div className="mb-3">
              <div className="mb-2 block">
                <Label htmlFor={`file-upload-${index}`}>
                  Upload study guide for lesson {index + 1}
                </Label>
              </div>
              <div
                className="flex w-full flex-col items-center justify-center"
                onDrop={(e) => handleDrop(e, index)}
                onDragOver={handleDragOver}
                style={{
                  border: "2px dashed #3b82f6",
                  borderRadius: "0.5rem",
                  background: "#f3f4f6",
                  padding: "1.5rem",
                  position: "relative"
                }}
              >
                <div className="flex flex-col items-center justify-center pb-6 pt-5">
                  <svg
                    className="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                  {uploads[index] ? (
                    <div>
                      <div className='flex flex-col gap-2 items-center'>
                        <div className='text-center flex gap-3 items-center'>

                        
                        <p className=" text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">{uploads[index].name}</span>
                        </p>
                        <Button
                          size="small"
                          color="error"
                          variant="outlined"
                          onClick={() => handleRemoveUpload(index)}
                        >
                          Remove
                        </Button>
                        </div>
                        
                        <div className='text-center'>
                          {fileStatus[index] ? (
                            <div><Spinner color="primary" /> Validating file...</div>
                          ) : (
                            <span>{getFileStatus(lessonsDataInitial[index]?.file_status)}</span>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                        {uploads[index].size} MB
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Drag & drop PDF here or click to upload</span>
                      </p>
                      <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                        PDF only
                      </p>
                    </div>
                  )}
                </div>
                <FileInput
                  id={`file-upload-${index}`}
                  ref={el => fileInputRefs.current[index] = el}
                  className="hidden"
                  accept="application/pdf"
                  sizing="sm"
                  onChange={(e) => {
                    handleLessonDataChange(index, 'study_guide', e.target.files[0]);
                    handleValidateFile(e.target.files[0], index);
                    handleReadOneFile(e.target.files[0], index);
                    handleUpload(e, index);
                  }}
                />
                {/* Clickable overlay to trigger file input */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    cursor: "pointer",
                    zIndex: 1,
                    background: "transparent"
                  }}
                  onClick={() => fileInputRefs.current[index]?.click()}
                />
              </div>
            </div>

            {/* Lesson summary */}
            <div className={lessonsDataInitial[index]?.file_status.status !== "Valid" ? 'hidden' : 'flex-1'}>
              <div className="ms-2 font-bold mb-2 text-blue-500">MODULE TITLE</div>

              {
                fileLoading?( <Skeleton variant="rectangular"  height={100} />):(<Textarea
                value={lessonsData[index]['topic']}
                style={{ height: '100px' }}
                onChange={(e) => handleLessonDataChange(index, 'topic', e.target.value)}
                placeholder="Enter the summary of the lesson"
                className="w-full"
              />)
              }
              
             
              {/* <LinearProgress size="lg" /> */}
            </div>

            {/* Main content: Responsive flex layout */}
            <div className={lessonsDataInitial[index]?.file_status.status !== "Valid" ? 'hidden' : 'flex flex-col xl:flex-row gap-4'}>
              {/* Left side */}
              <div className='flex-1 min-w-0'>
            
                <div>
                  {taxonomyRange}
                  {/* <div className='text-center mb-3'>
                    {previewTOS}
                  </div> */}
                </div>
              </div>

              {/* Right side: Learning Outcomes Tabs */}
              <Card className='flex-1 min-w-0 '>
                <Card className='bg-yellow-50' >
                  <div className="flex flex-col sm:flex-row gap-2 justify-between px-5">
                    <div className="mt-3">
                      <Label htmlFor="totalItems" className="font-bold text-blue-500">
                        MAXIMUM TEACHING HOURS FOR LESSON {index + 1}
                      </Label>
                    </div>
                    <TextInput
                      id="totalItems"
                      type="number"
                      className="max-w-32 w-full"
                      required
                      value={lessonsData[index]['max']}
                      min={'0'}
                      onChange={(e) => handleMaximum([index], e.target.value)}
                    />
                  </div>
                     </Card>
                <div className="overflow-x-auto">
                  <Tabs
                    value={innerValue}
                    onChange={handleChangeInner}
                    variant="scrollable"
                    scrollButtons
                    aria-label="visible arrows tabs example"
                    sx={{
                      [`& .${tabsClasses.scrollButtons}`]: {
                        '&.Mui-disabled': { opacity: 0.3 },
                      },
                    }}
                  >
                    {lessonsData[index]['learning_outcomes'].map((line, lineIndex) => (
                      <Tab
                        key={lineIndex}
                        label={`Learning Outcome ${lineIndex + 1}`}
                        sx={lessonsData[index]['teachingHours'][lineIndex] === 0 ? { color: 'red' } : { color: 'green' }}
                        {...a11yProps(lineIndex)}
                        icon={lessonsData[index]['teachingHours'][lineIndex] === 0
                          ? <ErrorIcon className={`text-red-600`} />
                          : <CheckCircleIcon className={`text-green-600`} />}
                        iconPosition='end'
                      />
                    ))}
                  </Tabs>
                </div>
                {lessonsData[index]['learning_outcomes'].map((line, lineIndex) => (
                  <CustomTabPanel value={innerValue} index={lineIndex} key={lineIndex}>
                    <div>
                      <div className="ms-2 font-bold mb-2">Learning Outcome</div>
                      <div key={lineIndex} style={{ marginBottom: '20px' }}>
                        {
                          fileLoading?( <Skeleton variant="rectangular"  height={50}/>):(<Textarea
                          key={lineIndex}
                          value={line}
                          onChange={(e) => handleInnerLessonDataChange(index, lineIndex, 'learning_outcomes', e.target.value)}
                          placeholder={`Enter value for line ${lineIndex}`}
                          className="w-full"
                        />)
                        }
                        
                       
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 mb-3 justify-between">
                      <div className="ms-2 font-bold mb-2">
                        Teaching hours ( {totalTeachingHours(index)}/{lessonsData[index]['max']} )
                      </div>
                      <div key={lineIndex} className="justify-end">
                        <TextInput
                          key={lineIndex}
                          name={`teachingHours-${index}-${lineIndex}`}
                          onChange={(e) => {
                            handleInnerLessonDataChange(index, lineIndex, 'teachingHours', Number(e.target.value));
                            checkMaxMin(index, lessonsData[index]['max']);
                          }}
                          value={lessonsData[index]['teachingHours'][lineIndex]}
                          type='number'
                          min={0}
                          max={Number(line) + Number(lessonsData[index]['max'][index]) - (lessonsData[index]?.teachingHours || []).reduce((acc, data) => acc + (typeof data === 'number' ? data : 0), 0)}
                          placeholder={`Enter value for line ${lineIndex}`}
                          className="w-full max-w-xs"
                        />
                      </div>
                    </div>
                    <Card>
                      <h5 className="text-center text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                        Bloom's Taxonomy Distribution
                      </h5>
                      <CardContent>
                        {/* Taxonomy fields */}
                        {["Remembering", "Understanding", "Applying", "Analyzing", "Evaluating", "Creating"].map((level) => (
                          <div className="flex flex-col sm:flex-row gap-2 mb-3 justify-between" key={level}>
                            <div className="ms-2 font-bold mb-2">{level}</div>
                            <div className='justify-end'>
                              {
                          fileLoading?( <Skeleton variant="rectangular"  height={50}/>):(<TextInput
                                type="number"
                                name={`taxonomy-${index}-${lineIndex}-${level}`}
                                onChange={(e) => handleinnertaxlevelChange(index, 'taxonomy_levels', level, lineIndex, e.target.value)}
                                value={lessonsData[index]?.taxonomy_levels?.[lineIndex]?.[level]}
                                min={'0'}
                                placeholder={`Enter value for line ${lineIndex}`}
                                className="w-full max-w-xs"
                              />)
                        }
                              


                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </CustomTabPanel>
                ))}
              </Card>
            </div>
          </Card>
        </CustomTabPanel>
      ))}
    </Box>
  );
}