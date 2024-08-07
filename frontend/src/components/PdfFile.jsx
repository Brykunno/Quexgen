import React from 'react';
import { Page, Text, View, Document, StyleSheet,Image } from '@react-pdf/renderer';




// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: 'white',

  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0
  },
  tableRow: {
    flexDirection: "row"
  },
  tableCol: {
    flex: 1,
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 1,
   
  },
  tableCell: {
    margin: 5,
    padding:2,
    fontSize: 9
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
});

function PdfFile(props) {
  return (
    <Document>
      <Page size={{ width: 1000, height: 612 }} style={styles.page}>
        <View style={styles.section}>
          
          <View style={styles.table}>
            {/* Table Header */}

              {/* Row */}
              <View style={styles.tableRow}>

<View style={[styles.tableCol,{flex:0.9}]}>
<Image
                  style={styles.image}
                  src="images/PSULogo.png" // Provide the path to your image
                />
  </View>

  <View style={[styles.tableCol,{flex:11}]}>
    <Text style={[styles.tableCell,{fontSize:16,margin:'auto',fontWeight: 'ultrabold'}]}>TABLE OF SPECIFICATIONS</Text>
    <Text style={[styles.tableCell,{fontSize:7,margin:'auto',marginTop: '-10'}]}>PANGASINAN STATE UNIVERSITY</Text>
  </View>



</View>
 
              {/* Row */}
              
              {/* Row */}
              <View style={styles.tableRow}>

<View style={[styles.tableCol,{padding:5}]}>
    <Text style={[styles.tableCell,{fontSize:8,margin:'auto',fontWeight: 'extrabold'}]}>{props.formData.Title}</Text>
    <Text style={[styles.tableCell,{fontSize:8,margin:'auto',fontWeight: 'extrabold'}]}>{props.formData.AlumniYear}</Text>
  </View>



</View>
 
              {/* Row */}




              {/* Row */}
              <View style={styles.tableRow}>

<View style={[styles.tableCol,{flex:0.99}]}>
    <Text style={[styles.tableCell,{fontSize:8,margin:'auto'}]}>CAMPUS</Text>
  </View>

  <View style={[styles.tableCol,{flex:5.5}]}>
    <Text style={[styles.tableCell,{fontSize:8,margin:'auto'}]}>{props.formData.Campus}</Text>
  </View>

  <View style={[styles.tableCol,{flex:1.5}]}>
    <Text style={[styles.tableCell,{fontSize:8,margin:'auto'}]}>DEPARTMENT</Text>
  </View>

  <View style={[styles.tableCol,{flex:5}]}>
    <Text style={[styles.tableCell,{fontSize:8,margin:'auto'}]}>{props.formData.Department}</Text>
  </View>

</View>

              {/* Row */}

              {/* Row */}

              <View style={styles.tableRow}>

<View style={[styles.tableCol,{flex:0.99}]}>
    <Text style={[styles.tableCell,{fontSize:8,margin:'auto'}]}>COURSE CODE</Text>
  </View>

  <View style={[styles.tableCol,{flex:5.5}]}>
    <Text style={[styles.tableCell,{fontSize:8,margin:'auto'}]}>{props.formData.CourseCode}</Text>
  </View>

  <View style={[styles.tableCol,{flex:1.5}]}>
    <Text style={[styles.tableCell,{fontSize:8,margin:'auto'}]}>TYPE OF EXAMINATION</Text>
  </View>

  <View style={[styles.tableCol,{flex:5}]}>
    <Text style={[styles.tableCell,{fontSize:8,margin:'auto'}]}>{props.formData.ExaminationType}</Text>
  </View>

</View>
 
              {/* Row */}



              {/* Row */}
            <View style={styles.tableRow}>

            <View style={[styles.tableCol,{flex:0.99}]}>
                <Text style={[styles.tableCell,{fontSize:8,margin:'auto'}]}>COURSE TYPE</Text>
              </View>

              <View style={[styles.tableCol,{flex:5.5}]}>
                <Text style={[styles.tableCell,{fontSize:8,margin:'auto'}]}>{props.formData.CourseType}</Text>
              </View>

              <View style={[styles.tableCol,{flex:1.5}]}>
                <Text style={[styles.tableCell,{fontSize:8,margin:'auto'}]}>DATE OF EXAMINATION</Text>
              </View>

              <View style={[styles.tableCol,{flex:5}]}>
                <Text style={[styles.tableCell,{fontSize:8,margin:'auto'}]}>{props.formData.ExaminationDate}</Text>
              </View>

            </View>

            {/* Row */}



            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={[styles.tableCell,{fontSize:8,margin:'auto'}]}>LESSON /{'\n'} TOPIC</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={[styles.tableCell,{fontSize:8,margin:'auto'}]}>LEARNING {'\n'}OUTCOMES</Text>
              </View>
              <View style={[styles.tableCol,{flex:0.8}]}>
                <Text style={[styles.tableCell,{fontSize:8,margin:'auto'}]}>NO. OF{'\n'}TEACHING{'\n'}HOURS</Text>
              </View>
              <View style={[styles.tableCol,{flex:0.8}]}>
                <Text style={[styles.tableCell,{fontSize:8,margin:'auto'}]}>% OF{'\n'}ALLOCATION</Text>
              </View>
              <View style={[styles.tableCol,{flex:0.5}]}>
                <Text style={[styles.tableCell,{fontSize:8,margin:'auto'}]}>ITEMS</Text>
              </View>
              <View style={[styles.tableCol, { flex: 7.1 }]}>
                <Text style={styles.tableCellCenter}>ITEM SPECIFICATION PER TAXONOMY OF LEARNING</Text>
                <View style={{ flexDirection: 'row' }}>
                  <View style={[styles.tableCol,{borderBottomWidth:0}]}>
                    <Text style={[styles.tableCell,{fontSize:8}]}>KNOWLEDGE /{'\n'} REMEMBERING</Text>
                    <Text style={[styles.tableCellCenter,{marginTop: 'auto'}]}>{props.Remembering}%</Text>
                  </View>
                  <View style={[styles.tableCol,{borderBottomWidth:0,flex:1.2}]}>
                    <Text style={[styles.tableCell,{fontSize:8}]}>COMPREHENSION /{'\n'} UNDERSTANDING</Text>
                    <Text style={[styles.tableCellCenter,{marginTop: 'auto'}]}>{props.Understanding}%</Text>
                  </View>
                  <View style={[styles.tableCol,{borderBottomWidth:0}]}>
                    <Text style={[styles.tableCell,{fontSize:8}]}>APPLICATION /{'\n'} APPLYING</Text>
                    <Text style={[styles.tableCellCenter,{marginTop: 'auto'}]}>{props.Applying}%</Text>
                  </View>
                  <View style={[styles.tableCol,{borderBottomWidth:0}]}>
                    <Text style={[styles.tableCell,{fontSize:8}]}>ANALYSIS /{'\n'} ANALYZING</Text>
                    <Text style={[styles.tableCellCenter,{marginTop: 'auto'}]}>{props.Analyzing}%</Text>
                  </View>
                  <View style={[styles.tableCol,{borderBottomWidth:0}]}>
                    <Text style={[styles.tableCell,{fontSize:8}]}>SYNTHESIS /{'\n'} EVALUATING</Text>
                    <Text style={[styles.tableCellCenter,{marginTop: 'auto'}]}>{props.Evaluating}%</Text>
                  </View>
                  <View style={[styles.tableCol,{borderBottomWidth:0}]}>
                    <Text style={[styles.tableCell,{fontSize:8}]}>EVALUATION /{'\n'} CREATING</Text>
                    <Text style={[styles.tableCellCenter,{marginTop: 'auto'}]}>{props.Creating}%</Text>
                  </View>
                  <View style={[styles.tableCol,{borderBottomWidth:0,borderRightWidth:0,flex:0.8}]}>
                    <Text style={[styles.tableCell,{fontSize:8,margin: 'auto'}]}>TOTAL</Text>
                  </View>
                </View>
              </View>
              <View style={styles.tableCol}>
                <Text style={[styles.tableCell,{fontSize:8,margin: 'auto'}]}>ITEM {'\n'}PLACEMENT</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
            <View style={[styles.tableCol,{height:5,backgroundColor:'grey'}]}>
                
              </View>
            </View>
            {/* Table Rows */}
            {props.lessonsData.map((lesson, index) => (
              <View style={styles.tableRow} key={index}>
                 <View style={[styles.tableCol]}>
                  <Text style={styles.tableCell}>{lesson.topic}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{lesson.learning_outcomes}</Text>
                </View>
                <View style={[styles.tableCol,{flex:0.8}]}>
                  <Text style={styles.tableCell}>{lesson.teachingHours}</Text>
                </View>
                <View style={[styles.tableCol,{flex:0.8}]}>
                  <Text style={styles.tableCell}>{lesson.allocation}%</Text>
                </View>
                <View style={[styles.tableCol,{flex:0.5}]}>
                  <Text style={styles.tableCell}>{lesson.items}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{lesson.remembering}</Text>
                </View>
                <View style={[styles.tableCol,{flex:1.2}]}>
                  <Text style={styles.tableCell}>{lesson.understanding}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{lesson.applying}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{lesson.analyzing}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{lesson.evaluating}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{lesson.creating}</Text>
                </View>
                <View style={[styles.tableCol,{flex:0.8}]}>
                  <Text style={styles.tableCell}>{lesson.total}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{lesson.placement}</Text>
                </View>
              </View>
            ))}
              <View style={styles.tableRow}>
            <View style={[styles.tableCol,{height:5,backgroundColor:'grey'}]}>
                
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}

export default PdfFile;
