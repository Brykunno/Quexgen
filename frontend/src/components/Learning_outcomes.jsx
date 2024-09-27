import React, { useEffect, useState } from 'react';
import { Textarea, Button, TextInput } from 'flowbite-react';
import api from '../api';

function Learning_outcomes({
  setRemembering,
  setUnderstanding,
  setAnalyzing,
  setApplying,
  setEvaluating,
  setCreating,
  setTotalTaxonomy,
  getTotalTaxonomy,
}) {
  // State to manage input data
  const [lessons, setLessons] = useState([{ lesson: '', outcomes: '' }]);
  const [allocations, setAllocations] = useState([]);
  
  // Handle adding a new lesson
  const handleAddLesson = () => {
    setLessons([...lessons, { lesson: '', outcomes: '' }]);
  };

  // Handle changes to lesson textareas
  const handleLessonChange = (index, value) => {
    const newLessons = [...lessons];
    newLessons[index].lesson = value;
    setLessons(newLessons);
  };

  // Handle changes to outcomes textareas
  const handleOutcomesChange = (index, value) => {
    const newLessons = [...lessons];
    newLessons[index].outcomes = value;
    setLessons(newLessons);
  };

  // Handle the form submission
  const handleSubmit = async () => {
    try {
      const promises = lessons.map(async (l) => {
        const response = await api.post('/api/taxonomy-allocation/', {
          objectives: l.outcomes,
        });
        return response.data.allocation; // Return the allocation data
      });

      const allocationsArray = await Promise.all(promises);
      console.log('Processed responses:', allocationsArray);

      // Flatten the array if you have nested arrays in allocations
      setAllocations((previous) => [...previous, ...allocationsArray.flat()]);
      
    } catch (error) {
      console.error('Error processing the file and data:', error);
    }
  };

  // Calculate the total allocations
  const tax_alloc = allocations.reduce((acc, data) => {
    acc.Remembering = (acc.Remembering || 0) + (data.Remembering || 0);
    acc.Understanding = (acc.Understanding || 0) + (data.Understanding || 0);
    acc.Analyzing = (acc.Analyzing || 0) + (data.Analyzing || 0);
    acc.Applying = (acc.Applying || 0) + (data.Applying || 0);
    acc.Evaluating = (acc.Evaluating || 0) + (data.Evaluating || 0);
    acc.Creating = (acc.Creating || 0) + (data.Creating || 0);
    return acc;
  }, {});

  // Calculate the percentage of allocations
  const calculatePercentages = (allocations) => {
    const total = Object.values(allocations).reduce((sum, value) => sum + value, 0);
    const percentages = {};

    for (const key in allocations) {
      percentages[key] = total > 0 ? Math.round((allocations[key] / total) * 100) : 0;
    }
    
    return percentages;
  };

  // Effect to update percentages and store in localStorage
  useEffect(() => {
    const percentages = calculatePercentages(tax_alloc);
    
    // Update state and local storage
    setRemembering(percentages.Remembering);
    localStorage.setItem('Remembering', percentages.Remembering);
    setUnderstanding(percentages.Understanding);
    localStorage.setItem('Understanding', percentages.Understanding);
    setApplying(percentages.Applying);
    localStorage.setItem('Applying', percentages.Applying);
    setAnalyzing(percentages.Analyzing);
    localStorage.setItem('Analyzing', percentages.Analyzing);
    setEvaluating(percentages.Evaluating);
    localStorage.setItem('Evaluating', percentages.Evaluating);
    setCreating(percentages.Creating);
    localStorage.setItem('Creating', percentages.Creating);
    
    // Update total taxonomy
    const totalTaxonomy = Object.values(percentages).reduce((sum, val) => sum + val, 0);
    setTotalTaxonomy(totalTaxonomy);
    
  }, [allocations, setRemembering, setUnderstanding, setApplying, setAnalyzing, setEvaluating, setCreating, setTotalTaxonomy]);

  return (
    <div>
      {lessons.map((item, index) => (
        <div key={index} className='flex gap-5 mb-4'>
          <Textarea 
            value={item.lesson} 
            onChange={(e) => handleLessonChange(index, e.target.value)} 
            placeholder="Enter content for the Lesson" 
          />
          <Textarea 
            value={item.outcomes} 
            onChange={(e) => handleOutcomesChange(index, e.target.value)} 
            placeholder="Enter Learning Outcomes" 
          />
        </div>
      ))}

      {/* Button to add a new lesson entry */}
      <Button color={'primary'} className='mt-3' onClick={handleAddLesson}>Add Another Lesson</Button>

      {/* Submit button */}
      <Button color={'primary'} className='mx-auto mt-3' onClick={handleSubmit}>Submit</Button>
      
      {/* Displaying total tax allocations */}
      <div className="mt-4">
        <h3>Total Tax Allocations:</h3>
        <pre>{JSON.stringify(tax_alloc, null, 2)}</pre>
      </div>
      
      {/* Displaying percentage allocations */}
      <div className="mt-4">
        <h3>Percentage Allocations:</h3>
        <pre>{JSON.stringify(calculatePercentages(tax_alloc), null, 2)}</pre>
      </div>
    </div>
  );
}

export default Learning_outcomes;
