import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';

import Arial_Bold from './Arial_Bold.ttf';
import Arial from './Arial.ttf';

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
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  table: {
    display: 'table',
    width: 'auto',
  },
  tableRow: {
    flexDirection: 'row',
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
    fontWeight: 'bold',
  },
});

function ExampdfUpdate(props) {
  const renderQuestionsByType = (questions, typeLabel, testType) => {
    const filteredQuestions = questions.filter(q => q.question_type === testType);

    if (filteredQuestions.length === 0) return null;

    return (
      <View>
        <Text style={{ ...styles.tableCell, fontWeight: 'bold', marginTop: 10 }}>{typeLabel}</Text>
        {filteredQuestions.map((question, idx) => {
          let item_num = idx + 1;
          return (
            <View key={idx}>
              {testType === 'subjective'?<View style={styles.tableRow}>
                <Text style={styles.tableCell}>
                  <Text style={{ fontWeight: 'bold' }}>{idx + 1}. </Text>
                  {question.question}
                </Text>
              </View> : <View style={styles.tableRow}>
                <Text style={styles.tableCell}>
                  <Text style={{ fontWeight: 'bold' }}>____________ {idx + 1}. </Text>
                  {question.question}
                </Text>
              </View>}
              {testType === 'mcq' && (
                <View>
                  <View style={styles.tableRow}>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>A. {question.choices[0]}</Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>B. {question.choices[1]}</Text>
                    </View>
                  </View>
                  <View style={styles.tableRow}>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>C. {question.choices[2]}</Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>D. {question.choices[3]}</Text>
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
          {/* Table Header */}
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Name:_________________________</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={[styles.tableCell, { textAlign: 'center' }]}>Year and Section:________________</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={[styles.tableCell, { textAlign: 'center' }]}>Date:_____________________</Text>
              </View>
            </View>
          </View>

          {/* Segregated Questions by Type */}
          <View style={styles.table}>
            {renderQuestionsByType(props.examStates, 'I. Multiple Choice', 'mcq')}
            {renderQuestionsByType(props.examStates, 'II. Identification', 'identification')}
            {renderQuestionsByType(props.examStates, 'III. True or False', 'trueOrFalse')}
            {renderQuestionsByType(props.examStates, 'IV. Subjective', 'subjective')}
          </View>
        </View>
      </Page>
    </Document>
  );
}

export default ExampdfUpdate;
