import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';



import Arial_Bold from './Arial_Bold.ttf';
import Arial from './Arial.ttf';
import Logo from './PSULogo.png'

Font.register({
  family: 'Arial-third',
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
        fontFamily: 'Arial-third',
      },
  section: {
    margin: 10,
    padding: 10,
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

function AnswerKeyUpdate(props) {
  const renderQuestionsByType = (questions, typeLabel, testType) => {
    const filteredQuestions = questions.filter(q => q.question_type === testType);
    
    if (filteredQuestions.length === 0) return null;

    return (
      <View>
        <Text style={{ ...styles.tableCell, fontWeight: 'bold', marginTop: 10 }}>{typeLabel} </Text>
        {filteredQuestions.map((question, idx) => {
          return (
            <View key={idx} >
              {testType === 'identification'?<View style={[styles.tableRow,{paddingLeft:'30px',paddingRight:'50px'}]}>
              <View style={[styles.tableCol,{fontWeight: 'bold',flex:0.07}]}><Text style={[styles.tableCell,{padding:0,marginRight:0}]}>{idx + 1}. </Text></View>
              <View style={[styles.tableCol,{fontWeight: 'bold'}]}><Text style={[styles.tableCell,{padding:0,marginLeft:'-10px'}]}>{question.choices[0]}</Text></View>
            
              </View> : <View style={[styles.tableRow,{paddingLeft:'30px',paddingRight:'50px'}]}>
              <View style={[styles.tableCol,{fontWeight: 'bold',flex:0.07}]}><Text style={[styles.tableCell,{padding:0,marginRight:0}]}>{idx + 1}. </Text></View>
              <View style={[styles.tableCol,{fontWeight: 'bold'}]}><Text style={[styles.tableCell,{padding:0,marginLeft:'-10px'}]}>{question.answer}</Text></View>
            
              </View>}
            
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
              </View>
              <View style={[styles.tableCol]}>
              
              </View>
            </View>
          </View>

          {/* Header */}
          <View style={styles.table}>
            <View style={styles.tableRow}>
              
              <View style={[styles.tableCol]}>
                <Text style={[styles.tableCell, { textAlign: 'center' }]}>{props.exam_title}</Text>
              </View>
            
            </View>
          </View>

          {/* Segregated Questions by Type */}
          <View style={styles.table}>
            {renderQuestionsByType(props.examStates, `I. Multiple Choice.`, 'mcq')}
            {renderQuestionsByType(props.examStates, `II. Identification.`, 'identification')}
            {renderQuestionsByType(props.examStates, `III. True or False.`, 'trueOrFalse')}
            
          </View>
        </View>

        {/* Add INSTRUCTOR/PROFESSOR text at the bottom right */}
        <Text style={styles.professorText}>INSTRUCTOR/PROFESSOR: {props.faculty} </Text>
      </Page>
    </Document>
  );
}

export default AnswerKeyUpdate;
