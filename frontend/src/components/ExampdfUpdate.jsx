import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font,Image } from '@react-pdf/renderer';

import Arial_Bold from './Arial_Bold.ttf';
import Arial from './Arial.ttf';
import Logo from './PSULogo.png'

Font.register({
  family: 'Arial-sec',
  fonts: [
    {
      src: Arial,
    },
    {
      src: Arial_Bold,
      fontWeight: 'bold',
    },
  ],
});

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: 'white',
    fontFamily: 'Arial-sec',
    paddingTop: '30px',
    paddingBottom: '30px'
  },
  section: {
    margin: 10,
    padding: 10,
    paddingTop: 0,
    flexGrow: 1
  },
  table: {
    display: "table",
    width: "auto",
  },
  tableRow: {
    flexDirection: "row"
  },
  tableCol: {
    flex: 1,
  },
  tableCell: {
    margin: 5,
    padding: 2,
    fontSize: 9,
    wordWrap: 'break-word',
    wordBreak: 'break-all',
    whiteSpace: 'normal',
  },
  letterBold: {
    fontWeight: 'bold'
  },
  professorText: {
    position: 'absolute',
    bottom: 10, // Adjust this value for spacing from the bottom
    left: 10,  // Adjust this value for spacing from the right
    fontSize: 10,
    fontWeight: 'bold',
  },
});

function ExampdfUpdate(props) {
  let numbering = 0
  const renderQuestionsByType = (questions, typeLabel, testType) => {
    const filteredQuestions = questions.filter(q => q.question_type === testType);
    
    if (filteredQuestions.length === 0) return null;

    return (
      <View>
        <Text style={{ ...styles.tableCell, fontWeight: 'bold', marginTop: 10 }}>{typeLabel} </Text>
        {filteredQuestions.map((question, idx) => {
          return (
            <View key={idx} >
              {testType === 'subjective'?<View style={[styles.tableRow,{paddingLeft:'30px',paddingRight:'50px'}]}>
              <View style={[styles.tableCol,{fontWeight: 'bold',flex:0.07}]}><Text style={[styles.tableCell,{padding:0,marginRight:0}]}>{++numbering}. </Text></View>
              <View style={[styles.tableCol,{fontWeight: 'bold'}]}><Text style={[styles.tableCell,{padding:0,marginLeft:'-10px'}]}>{question.question}</Text></View>
            
              </View> : <View style={[styles.tableRow,{paddingRight:'50px'}]}>
              <View style={[styles.tableCol,{fontWeight: 'bold',flex:0.22}]}><Text style={[styles.tableCell,{padding:0,marginRight:0}]}>____________ {++numbering}. </Text></View>
              <View style={[styles.tableCol,{fontWeight: 'bold'}]}><Text style={[styles.tableCell,{padding:0,marginLeft:'-10px'}]}>{question.question}</Text></View>
            
              </View>}
              

              {testType === 'mcq' && (
                <View>
  {/* First row (A and B options) */}
  <View style={[styles.tableRow,{paddingLeft:'60px',paddingRight:'60px'}]}>
    {/* Column for Choice A */}
    <View style={[styles.tableCol, { flexDirection: 'row', alignItems: 'center' }]}>
      <Text style={[styles.tableCell, { marginRight: 0, flex: 0.1 }]}>A.</Text>
      <Text style={[styles.tableCell, { marginLeft: '-8px', flex: 0.9 }]}>{question.choices[0]}</Text>
    </View>
    
    {/* Column for Choice B */}
    <View style={[styles.tableCol, { flexDirection: 'row', alignItems: 'center' }]}>
      <Text style={[styles.tableCell, { marginRight: 0, flex: 0.1 }]}>B.</Text>
      <Text style={[styles.tableCell, { marginLeft: '-8px', flex: 0.9 }]}>{question.choices[1]}</Text>
    </View>
  </View>

  {/* Second row (C and D options) */}
  <View style={[styles.tableRow,{paddingLeft:'60px',paddingRight:'60px'}]}>
    {/* Column for Choice C */}
    <View style={[styles.tableCol, { flexDirection: 'row', alignItems: 'center' }]}>
      <Text style={[styles.tableCell, { marginRight: 0, flex: 0.1 }]}>C.</Text>
      <Text style={[styles.tableCell, { marginLeft: '-8px', flex: 0.9 }]}>{question.choices[2]}</Text>
    </View>
    
    {/* Column for Choice D */}
    <View style={[styles.tableCol, { flexDirection: 'row', alignItems: 'center' }]}>
      <Text style={[styles.tableCell, { marginRight: 0, flex: 0.1 }]}>D.</Text>
      <Text style={[styles.tableCell, { marginLeft: '-8px', flex: 0.9 }]}>{question.choices[3]}</Text>
    </View>
  </View>
</View>

              )}
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <Document>
      <Page style={styles.page}>
        <View style={styles.section}>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={[styles.tableCol]}>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginTop: '-5px' }}>
                  <View style={{ marginRight: '-10px' }}>
                    <Image
                      style={[styles.image,{height:'30px',width:'30px'}]}
                      src={Logo} // Provide the path to your image
                    />
                  </View>
                </View>
              </View>

              <View style={[styles.tableCol]}>
              <Text style={[styles.tableCell, { textAlign: 'center',fontWeight: 'bold',marginTop:'-5px' }]}>PANGASINAN STATE UNIVERSITY</Text>
                <Text style={[styles.tableCell, { textAlign: 'center',fontWeight: 'bold',marginTop:'-5px' }]}>SAN CARLOS CAMPUS</Text>
                <Text style={[styles.tableCell, { textAlign: 'center',fontWeight: 'bold',marginTop:'-5px' }]}>IT DEPARTMENT</Text>
                <Text style={[styles.tableCell, { textAlign: 'center',fontWeight: 'bold',marginTop:'-5px' }]}>AY {props.formData.AcademicYear}</Text>

                <Text style={[styles.tableCell, { textAlign: 'center',fontWeight: 'bold',marginTop:'2px'  }]}>{props.formData.Term} Examination in {props.formData.Title}</Text>

     
              </View>
              <View style={[styles.tableCol]}>
              
              </View>
            </View>
          </View>

          {/* Header */}
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={[styles.tableCol]}>
                <Text style={styles.tableCell}>Name:_________________________</Text>
              </View>
              <View style={[styles.tableCol]}>
                <Text style={[styles.tableCell, { textAlign: 'center' }]}>Year and Section:________________</Text>
              </View>
              <View style={[styles.tableCol]}>
                <Text style={[styles.tableCell, { textAlign: 'center' }]}>Date:_____________________</Text>
              </View>
            </View>
          </View>

          {/* Segregated Questions by Type */}
          <View style={styles.table}>
          {renderQuestionsByType(props.examStates, `I. Multiple Choice.  ${props.TestPart[0]===undefined?'':props.TestPart[0].test_instruction}`, 'mcq')}
            {renderQuestionsByType(props.examStates, `II. Identification.  ${props.TestPart[1]===undefined?'':props.TestPart[1].test_instruction}`, 'identification')}
            {renderQuestionsByType(props.examStates, `III. True or False.  ${props.TestPart[2]===undefined?'':props.TestPart[2].test_instruction}`, 'trueOrFalse')}
            {renderQuestionsByType(props.examStates, `IV. Subjective.  ${props.TestPart[3]===undefined?'':props.TestPart[3].test_instruction}`, 'subjective')}
          </View>
        </View>

        {/* Add INSTRUCTOR/PROFESSOR text at the bottom right */}
        <Text style={styles.professorText}>INSTRUCTOR/PROFESSOR: {props.faculty} </Text>
      </Page>
    </Document>
  );
}

export default ExampdfUpdate;
