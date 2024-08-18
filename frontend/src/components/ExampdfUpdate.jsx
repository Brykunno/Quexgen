import React from 'react';
import { Page, Text, View, Document, StyleSheet,Image,Font } from '@react-pdf/renderer';

import Arial_Bold from './Arial_Bold.ttf'
import Arial from './Arial.ttf'





Font.register({
  family: 'Arial-sec',
  fonts: [
    {
      src: Arial,
      
    },
    {
      src: Arial_Bold,
      fontWeight: 'bold'
    }

  ]
})

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: 'white',
    fontFamily: 'Arial-sec'

  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  },
  table: {
    display: "table",
    width: "auto",
    // borderStyle: "solid",
    // borderWidth: 1,
    // borderRightWidth: 0,
    // borderBottomWidth: 0
  },
  tableRow: {
    flexDirection: "row"
  },
  tableCol: {
    flex: 1,
    // borderStyle: "solid",
    // borderWidth: 1,
    // borderLeftWidth: 0,
    // borderTopWidth: 1,
   
  },
  tableCell: {
    margin: 5,
    padding:2,
    fontSize: 9,
    wordWrap: 'break-word', // Ensure text wraps within the cell
    wordBreak: 'break-all', // Allow breaking long words or URLs
    whiteSpace: 'normal', // Allow text to wrap normally
  },
  
  tableCellCenter: {
   
    textAlign: 'center',
    margin: 2,
    fontSize: 9,
  
 
  },image: {
    width: '89%',
    height: 'auto',
    padding: 5,
    alignSelf: 'center'
   
    
  },
  letterBold: {
    fontWeight: 'bold'
  }
});

function ExampdfUpdate(props) {
  return (
    <Document>
      <Page  style={styles.page}>
        <View style={styles.section}>
          
          <View style={styles.table}>
            {/* Table Header */}

            <View style={[styles.tableRow]} >
                        
                        <View style={[styles.tableCol]}>
                        <Text style={styles.tableCell}>Name:_________________________</Text>
                      </View>
                      <View style={[styles.tableCol]}>
                        <Text style={[styles.tableCell,{textAlign:'center'}]}>Year and Section:________________</Text>
                      </View>
                      <View style={[styles.tableCol]}>
                        <Text style={[styles.tableCell,{textAlign:'center'}]}>Date:_____________________</Text>
                      </View>

              </View>

      
            {/* Table Rows */}
          

            {props.TestPart.map((lesson, index) => {
              let test = ''
              if(lesson.test_type === 'mcq'){
                test = 'Multiple Choice'
              }
              else if(lesson.test_type === 'identification'){
                test = 'Identification'
              }
              else{
                test = 'True or False'
              }

              let part = ''

              switch(index+1){
                case 1:
                  part='I'
                  break
                case 2:
                  part='II'
                  break
                case 3:
                  part='III'
                  break
                default:
                  part = ''

              }
              
              
              return(
                <View>
              <View style={styles.tableRow} key={index}>
              
                 <View style={[styles.tableCol,{fontWeight:'bold'}]}>
                  <Text style={styles.tableCell}>{part}. {test}. {lesson.test_instruction} </Text>
                </View>
             
              </View>



              {

                props.examStates.map((question,idx) => {

                  const test1 = props.examStates.filter(q => q.test_part_num === 1).length;
                  const test2 = props.examStates.filter(q => q.test_part_num === 2).length;
                  const test3 = props.examStates.filter(q => q.test_part_num === 3).length;

                  const filteredQuestions = props.examStates.filter(q => q.test_part_num === lesson.test_part_num);

                  let item_num = filteredQuestions.indexOf(question) + 1;

                  switch(question.test_part_num){
                    case 2:
                        item_num = item_num + test1
                      break
                    case 3:
                       item_num = item_num + test1 + test2
                      break
                    default:
                      item_num = item_num
                      break
                  }
               
                 


                  if(question.question_type === 'mcq' && question.test_part_num === lesson.test_part_num){
                    return(<View>

                   

                      <View style={[styles.tableRow,{marginLeft:'10px'}]} key={index}>
                        
                        <View style={[styles.tableCol]}>
                        <Text style={styles.tableCell}> <Text style={[styles.tableCell,{fontWeight:'bold'}]}>____________ {item_num}. </Text>  <Text>
                        {question.question}</Text></Text>
                      </View>

                    </View>

                    <View style={[styles.tableRow,{width:'80%', margin:'auto'}]} key={index}>
                        
                        <View style={[styles.tableCol]}>
                        <Text style={styles.tableCell}>A. {question.choices[0]}</Text>
                      </View>

                      <View style={[styles.tableCol]}>
                        <Text style={styles.tableCell}>B. {question.choices[1]}</Text>
                      </View>

                    </View>

                    <View style={[styles.tableRow,{width:'80%', margin:'auto'}]} key={index}>
                        
                        <View style={[styles.tableCol]}>
                        <Text style={styles.tableCell}>C. {question.choices[2]}</Text>
                      </View>

                      <View style={[styles.tableCol]}>
                        <Text style={styles.tableCell}>D. {question.choices[3]}</Text>
                      </View>

                    </View>

                     
                    
                      </View>);
                  
                  }

                  else if (question.question_type === 'identification' && question.test_part_num === lesson.test_part_num){
                    return(<View>

                   

                        <View style={[styles.tableRow,{marginLeft:'10px'}]} key={index}>
                        
                        <View style={[styles.tableCol]}>
                      

                        <Text style={styles.tableCell}> <Text style={[styles.tableCell,{fontWeight:'bold'}]}>____________ {item_num}. </Text>  <Text>
                        {question.question}</Text></Text>
                      </View>

                    </View>

                     
                    
                      </View>);
                  }
                  else if (question.question_type === 'trueOrFalse' && question.test_part_num === lesson.test_part_num){
                    return(<View>

                   

                    <View style={[styles.tableRow,{marginLeft:'10px'}]} key={index}>
                        
                        <View style={[styles.tableCol]}>
                        <Text style={styles.tableCell}> <Text style={[styles.tableCell,{fontWeight:'bold'}]}>____________ {item_num}. </Text>  <Text>
                        {question.question}</Text></Text>
                      </View>

                    </View>

                     
                    
                      </View>);
                  }

                 
                })

                }

              </View>
              
            )})}
          </View>
        </View>
      </Page>
    </Document>
  );
}

export default ExampdfUpdate;
