import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { Label, Textarea, TextInput } from "flowbite-react";


function createData(
  topic,
  learning_outcomes,
  teaching_hours,
  allocation,
  numofitems,
  remembering,
  understanding,
  applying,
  analyzing,
  evaluating,
  creating,
  total,
  placement
) {
  return {
    topic,
    learning_outcomes,
    teaching_hours,
    allocation,
    numofitems,
    remembering,
    understanding,
    applying,
    analyzing,
    evaluating,
    creating,
    total,
    placement,
  };
}



export default function TOS() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [lesson, setLesson] = React.useState(0);
  const [totalItems, setTotalItems] = React.useState(0);
  const [lessonsData, setLessonsData] = React.useState([]);

  const [Remembering, setRemembering] = React.useState(0);
  const [Understanding, setUnderstanding] = React.useState(0);
  const [Applying, setApplying] = React.useState(0);
  const [Analyzing, setAnalyzing] = React.useState(0);
  const [Evaluating, setEvaluating] = React.useState(0);
  const [Creating, setCreating] = React.useState(0);

  
const columns = [
  { id: "topic", label: "Lesson/Topic", minWidth: 170 },
  { id: "learning_outcomes", label: "Learning Outcomes", minWidth: 170 },
  {
    id: "teaching_hours",
    label: "No. of teaching hours",
    minWidth: 100,
    align: "right",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "allocation",
    label: "% of allocation",
    minWidth: 100,
    align: "right",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "numofitems",
    label: "No. of items",
    minWidth: 100,
    align: "right",
    format: (value) => value.toFixed(2),
  },
  {
    id: "remembering",
    label: (
      <span>
        KNOWLEDGE/REMEMBERING <br />
        {Remembering}%
      </span>
    ),
    minWidth: 100,
    align: "center", 
    type: "number",
  },
  {
    id: "understanding",
    label: (
    <span>
      COMPREHENSION/UNSERSTANDING <br />
      {Understanding}%
    </span>
  ),
    minWidth: 100,
    align: "center",
    type: "number",
  },
  {
    id: "applying",
    label: (
      <span>
        APPLICATION/APPLYING <br />
        {Applying}%
      </span>
    ),
    minWidth: 100,
    align: "center",
    type: "number",
  },
  {
    id: "analyzing",
    label: (
    <span>
      ANALYSIS/ANALYZING <br />
      {Analyzing}%
    </span>
  ),
    minWidth: 100,
    align: "center",
    type: "number",
  },
  {
    id: "evaluating",
    label: (
      <span>
        SYNTHESIS/EVALUATING <br />
        {Evaluating}%
      </span>
    ),
    minWidth: 100,
    align: "center",
    type: "number",
  },
  {
    id: "creating",
    label: (
      <span>
        EVALUATION/CREATING <br />
        {Creating}%
      </span>
    ),
    minWidth: 100,
    align: "center",
    type: "number",
  },
  {
    id: "total",
    label: "TOTAL",
    minWidth: 100,
    align: "center",
    type: "number",
  },
  {
    id: "placement",
    label: "ITEM PLACEMENT",
    minWidth: 170,
    align: "right",
    format: (value) => value.toFixed(2),
  },
];

  React.useEffect(() => {
    const initialData = Array.from({ length: lesson }, () => ({
      teachingHours: 0,
      allocation: 0,
      items: 0,
      remembering: 0,
      understanding: 0,
      applying: 0,
      analyzing: 0,
      evaluating: 0,
      creating: 0,
      total: 0,
      placement: '',
    }));
    setLessonsData(initialData);
  }, [lesson]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleLessonChange = (event) => {
    setLesson(event.target.value);
  };

  const handleTotalItemsChange = (event) => {
    setTotalItems(event.target.value);
  };

  const handleRememberingChange = (event) => {

    setRemembering(event.target.value);
  };


  function updateTable(){
    const newData = [...lessonsData];
    for(let i = 0; i<newData.length; i++){
      newData[i]['allocation'] = newData[i]['allocation'];
      newData[i]['items'] =newData[i]['items'] ;
      newData[i]['remembering'] = newData[i]['remembering'];
    }
  }

  const handleUnderstandingChange = (event) => {
    setUnderstanding(event.target.value);
  };

  const handleApplyingChange = (event) => {
    setApplying(event.target.value);
  };

  const handleAnalyzingChange = (event) => {
    setAnalyzing(event.target.value);
  };

  const handleEvaluatingChange = (event) => {
    setEvaluating(event.target.value);
  };

  const handleCreatingChange = (event) => {
    setCreating(event.target.value);
  };

  function getAllocation(hours,totalHours){

    return (hours/totalHours)*100
  }

// let getTotalHours = lessonsData.reduce((acc, data) => {
//   return acc + Number(data.teachingHours);
// }, 0);


function getTotalHours(){
 let hours= lessonsData.reduce((acc, data) => {
    return acc + Number(data.teachingHours);
  }, 0);



  return hours
}


function getNumItems(totalItems,allocation){
  const allocationDecimal = allocation / 100;
  return totalItems * allocationDecimal;
 

}

function getRemembering(remembering,items){

  return (remembering/100)*items
}

function getUnderstanding(Understanding,items){

  return (Understanding/100)*items
}

function getApplying(Applying,items){

  return (Applying/100)*items
}
function getAnalyzing(Analyzing,items){

  return (Analyzing/100)*items
}
function getEvaluating(Evaluating,items){

  return (Evaluating/100)*items
}
function getCreating(Creating,items){

  return (Creating/100)*items
}

function getTotal(remembering,understanding,applying,analyzing,evaluating,creating){

  return remembering+understanding+applying+analyzing+evaluating+creating
}

let placements = [];

for(let i = 1; i<=totalItems; i++){
  placements.push(i);
}



function getPlacement(total,placements){

  let start=0;
  let end =0;

  start = placements.splice(0,total-1)[0];
  end = placements.splice(0,1);
  if(start === undefined || end === undefined){
    return "0 - 0"
  }
  else{
    return `${start} - ${end}`;
  }
    
  

}

 
const handleLessonDataChange = (index, field, value) => {
  const newData = [...lessonsData];
  newData[index][field] = value;

  if (field === 'teachingHours') {
 

    for (let i = 0; i < newData.length; i++) {

      

      newData[i]['allocation'] = getAllocation(Number(newData[i][field]), getTotalHours());
      newData[i]['items'] = getNumItems(totalItems, newData[i]['allocation']);
      newData[i]['remembering'] = getRemembering(Remembering, newData[i]['items']);
      newData[i]['understanding'] = getUnderstanding(Understanding, newData[i]['items']);
      newData[i]['applying'] = getApplying(Applying, newData[i]['items']);
      newData[i]['analyzing'] = getAnalyzing(Analyzing, newData[i]['items']);
      newData[i]['evaluating'] = getEvaluating(Evaluating, newData[i]['items']);
      newData[i]['creating'] = getCreating(Creating, newData[i]['items']);
      newData[i]['total'] = getTotal(
        newData[i]['remembering'],
        newData[i]['understanding'],
        newData[i]['applying'],
        newData[i]['analyzing'],
        newData[i]['evaluating'],
        newData[i]['creating']
      );

      newData[i]['placement'] = getPlacement(newData[i]['total'],placements);
    }
  }

  setLessonsData(newData);
};

 

  const handleLessonHoursDataChange = (index, field, value) => {
    const newData = [...lessonsData];
    newData[index][field] = value;
  
    setLessonsData(newData);
  };




  const rows = lessonsData.map((data, index) =>
    createData(
      <Textarea
        id={`topic-${index}`}
        value={data.topic}
        onChange={(e) => handleLessonDataChange(index, 'topic', e.target.value)}
        required
      />,
      <Textarea
        id={`learning_outcomes-${index}`}
        value={data.learning_outcomes}
        onChange={(e) => handleLessonDataChange(index, 'learning_outcomes', e.target.value)}
        required
      />,
      <TextInput
        id={`teaching_hours-${index}`}
        type="number"
        value={data.teachingHours}
        onChange={(e) => handleLessonDataChange(index, 'teachingHours', e.target.value)}
        required
      />,
     
     data.allocation,
     data.items,
     data.remembering,
     data.understanding,
     data.applying,
     data.analyzing,
     data.evaluating,
     data.creating,
     data.total,
     data.placement


    
    )
  );

  return (
    <div>
      <h1 className="text-3xl">Course content</h1>
      <hr />
      <br />
      <div>
        <div className="mb-2 block">
          <Label htmlFor="totalItems" value="Total of Items" />
        </div>
        <TextInput id="totalItems" type="number" required value={totalItems} onChange={handleTotalItemsChange} />
      </div>
      {placements}

      <div className="mb-3">
        <div className="mb-2 block">
          <Label htmlFor="numLesson" value="Number of Lesson" />
        </div>
        <TextInput id="numLesson" type="number" required value={lesson} onChange={handleLessonChange} />
      </div>

      <div className="flex gap-4 ">
      <div>
        <div className="mb-2 block">
          <Label htmlFor="Remembering" value="Remembering" />
        </div>
        <TextInput id="Remembering" type="number" required value={Remembering} onChange={handleRememberingChange} />
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="Understanding" value="Understanding" />
        </div>
        <TextInput id="Understanding" type="number" required value={Understanding} onChange={handleUnderstandingChange} />
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="Applying" value="Applying" />
        </div>
        <TextInput id="Applying" type="number" required value={Applying} onChange={handleApplyingChange} />
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="Analyzing" value="Analyzing" />
        </div>
        <TextInput id="Analyzing" type="number" required value={Analyzing} onChange={handleAnalyzingChange} />
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="Evaluating" value="Evaluating" />
        </div>
        <TextInput id="Evaluating" type="number" required value={Evaluating} onChange={handleEvaluatingChange} />
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="Creating" value="Creating" />
        </div>
        <TextInput id="Creating" type="number" required value={Creating} onChange={handleCreatingChange} />
      </div>
      </div>

      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.id} align={column.align}>
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.format && typeof value === "number"
                          ? column.format(value)
                          : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}
