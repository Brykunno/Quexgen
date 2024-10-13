import {useState,useEffect} from 'react'
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

function Tableofspecs(props) {


  return (
    <div>
      
       <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {props.columns.map((column) => (
                  <TableCell key={column.id} align={column.align}>
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {props.rows.map((row,index) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={index}  className="cursor-pointer ">
                  {props.columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}  >
                        {column.format && typeof value === "number"
                          ? column.format(value)
                          : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
                        <TableRow >
                <TableCell style={{textAlign:'center',fontWeight:'bold'}}>
                  Total
                </TableCell>
                <TableCell style={{textAlign:'center',fontWeight:'bold'}}>
                  {props.configTotalHours}
                </TableCell>
                <TableCell style={{textAlign:'center',fontWeight:'bold'}}>
                {Number.isInteger(props.configTotalAllocation) ? props.configTotalAllocation : props.configTotalAllocation.toFixed(2)
                }
                </TableCell>
                <TableCell style={{textAlign:'center',fontWeight:'bold'}}>
                {Number.isInteger(props.configTotal) ? props.configTotal : props.configTotal.toFixed(2)
                }
                </TableCell>
                <TableCell style={{textAlign:'center',fontWeight:'bold'}}>
                {Number.isInteger(props.configTotalRemember) ? props.configTotalRemember : props.configTotalRemember.toFixed(2)
                }
                </TableCell>
                <TableCell style={{textAlign:'center',fontWeight:'bold'}}>
                {Number.isInteger(props.configTotalunderstand) ? props.configTotalunderstand : props.configTotalunderstand.toFixed(2)
                }
                </TableCell>
                <TableCell style={{textAlign:'center',fontWeight:'bold'}}>
                {Number.isInteger(props.configTotalapply) ? props.configTotalapply : props.configTotalapply.toFixed(2)
                }
                </TableCell>
                <TableCell style={{textAlign:'center',fontWeight:'bold'}}>
                {Number.isInteger(props.configTotalanalyze) ? props.configTotalanalyze : props.configTotalanalyze.toFixed(2)
                }
                
                </TableCell>
                <TableCell style={{textAlign:'center',fontWeight:'bold'}}>
                {Number.isInteger(props.configTotalevaluate) ? props.configTotalevaluate : props.configTotalevaluate.toFixed(2)
                }
                </TableCell>
                <TableCell style={{textAlign:'center',fontWeight:'bold'}}>
                {Number.isInteger(props.configTotalcreate) ? props.configTotalcreate : props.configTotalcreate.toFixed(2)
                }
                </TableCell>
                <TableCell style={{textAlign:'center',fontWeight:'bold'}}>
                  {Number.isInteger(props.configTotalTaxonomy) ? props.configTotalTaxonomy : props.configTotalTaxonomy.toFixed(2)
                  }
                  
                </TableCell>
                <TableCell style={{textAlign:'center',fontWeight:'bold'}}>
                 
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
   
      </Paper>
    </div>
  )
}

export default Tableofspecs
