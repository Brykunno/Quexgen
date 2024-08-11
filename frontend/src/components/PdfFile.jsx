import React from 'react';
import { Page, Text, View, Document, StyleSheet,Image,Font } from '@react-pdf/renderer';


Font.register({
  family: 'Arial',
  fonts: [
    {
      src: `fonts/Arial.ttf`,
      
    },
    {
      src: 'fonts/Arial_Bold.ttf',
      fontWeight: 'bold'
    }

  ]
})

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: 'white',
    fontFamily: 'Arial'

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
});

function PdfFile(props) {
  return (
    <Document>
      <Page size={{ width: 963, height: 612 }} style={styles.page}>
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
    <Text style={[styles.tableCell,{fontSize:'16px',margin:'auto',fontWeight:'bold'}]}>TABLE OF SPECIFICATIONS</Text>
    <Text style={[styles.tableCell,{fontSize:7,margin:'auto',marginTop: '-10'}]}>PANGASINAN STATE UNIVERSITY</Text>
  </View>



</View>
 
              {/* Row */}
              
              {/* Row */}
              <View style={styles.tableRow}>

<View style={[styles.tableCol,{padding:5}]}>
    <Text style={[styles.tableCell,{fontSize:10,margin:'auto',fontWeight: 'extrabold'}]}>{props.formData.Title}</Text>
    <Text style={[styles.tableCell,{fontSize:10,margin:'auto',fontWeight: 'extrabold'}]}>{props.formData.Semester} AY {props.formData.AcademicYear}</Text>
  </View>



</View>
 
              {/* Row */}




              {/* Row */}
              <View style={styles.tableRow}>

<View style={[styles.tableCol,{flex:1.07}]}>
    <Text style={[styles.tableCell,{fontSize:8,margin:'auto',fontWeight:'bold'}]}>CAMPUS</Text>
  </View>

  <View style={[styles.tableCol,{flex:5.5}]}>
    <Text style={[styles.tableCell,{fontSize:8,margin:'auto'}]}>{props.formData.Campus}</Text>
  </View>

  <View style={[styles.tableCol,{flex:1.5}]}>
    <Text style={[styles.tableCell,{fontSize:8,margin:'auto',fontWeight:'bold'}]}>DEPARTMENT</Text>
  </View>

  <View style={[styles.tableCol,{flex:5}]}>
    <Text style={[styles.tableCell,{fontSize:8,margin:'auto'}]}>{props.formData.Department}</Text>
  </View>

</View>

              {/* Row */}

              {/* Row */}

              <View style={styles.tableRow}>

<View style={[styles.tableCol,{flex:1.07}]}>
    <Text style={[styles.tableCell,{fontSize:8,margin:'auto',fontWeight:'bold'}]}>COURSE CODE</Text>
  </View>

  <View style={[styles.tableCol,{flex:5.5}]}>
    <Text style={[styles.tableCell,{fontSize:8,margin:'auto'}]}>{props.formData.CourseCode}</Text>
  </View>

  <View style={[styles.tableCol,{flex:1.5}]}>
    <Text style={[styles.tableCell,{fontSize:8,margin:'auto',fontWeight:'bold'}]}>TYPE OF EXAMINATION</Text>
  </View>

  <View style={[styles.tableCol,{flex:5}]}>
    <Text style={[styles.tableCell,{fontSize:8,margin:'auto'}]}>{props.formData.ExaminationType}</Text>
  </View>

</View>
 
              {/* Row */}



              {/* Row */}
            <View style={styles.tableRow}>

            <View style={[styles.tableCol,{flex:1.07}]}>
                <Text style={[styles.tableCell,{fontSize:8,margin:'auto',fontWeight:'bold'}]}>COURSE TYPE</Text>
              </View>

              <View style={[styles.tableCol,{flex:5.5}]}>
                <Text style={[styles.tableCell,{fontSize:8,margin:'auto'}]}>{props.formData.CourseType}</Text>
              </View>

              <View style={[styles.tableCol,{flex:1.5}]}>
                <Text style={[styles.tableCell,{fontSize:8,margin:'auto',fontWeight:'bold'}]}>DATE OF EXAMINATION</Text>
              </View>

              <View style={[styles.tableCol,{flex:5}]}>
                <Text style={[styles.tableCell,{fontSize:8,margin:'auto'}]}>{props.formData.ExaminationDate}</Text>
              </View>

            </View>

            {/* Row */}



            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={[styles.tableCell,{fontSize:8,margin:'auto'}]}>LESSON /{'\n'}TOPIC</Text>
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
                    <Text style={[styles.tableCell,{fontSize:8}]}>KNOWLEDGE /{'\n'}REMEMBERING</Text>
                    <Text style={[styles.tableCellCenter,{marginTop: 'auto'}]}>{props.Remembering}%</Text>
                  </View>
                  <View style={[styles.tableCol,{borderBottomWidth:0,flex:1.2}]}>
                    <Text style={[styles.tableCell,{fontSize:8}]}>COMPREHENSION /{'\n'}UNDERSTANDING</Text>
                    <Text style={[styles.tableCellCenter,{marginTop: 'auto'}]}>{props.Understanding}%</Text>
                  </View>
                  <View style={[styles.tableCol,{borderBottomWidth:0}]}>
                    <Text style={[styles.tableCell,{fontSize:8}]}>APPLICATION /{'\n'}APPLYING</Text>
                    <Text style={[styles.tableCellCenter,{marginTop: 'auto'}]}>{props.Applying}%</Text>
                  </View>
                  <View style={[styles.tableCol,{borderBottomWidth:0}]}>
                    <Text style={[styles.tableCell,{fontSize:8}]}>ANALYSIS /{'\n'}ANALYZING</Text>
                    <Text style={[styles.tableCellCenter,{marginTop: 'auto'}]}>{props.Analyzing}%</Text>
                  </View>
                  <View style={[styles.tableCol,{borderBottomWidth:0}]}>
                    <Text style={[styles.tableCell,{fontSize:8}]}>SYNTHESIS /{'\n'}EVALUATING</Text>
                    <Text style={[styles.tableCellCenter,{marginTop: 'auto'}]}>{props.Evaluating}%</Text>
                  </View>
                  <View style={[styles.tableCol,{borderBottomWidth:0}]}>
                    <Text style={[styles.tableCell,{fontSize:8}]}>EVALUATION /{'\n'}CREATING</Text>
                    <Text style={[styles.tableCellCenter,{marginTop: 'auto'}]}>{props.Creating}%</Text>
                  </View>
                  <View style={[styles.tableCol,{borderBottomWidth:0,borderRightWidth:0,flex:0.8}]}>
                    <Text style={[styles.tableCell,{fontSize:8,margin: 'auto', padding:0}]}>TOTAL</Text>
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

            <View style={styles.tableRow}>
            <View style={[styles.tableCol]}>
            <Text style={[styles.tableCell,{padding:0,margin:0,marginLeft:'20px',fontSize:'10px',marginTop:'5px'}]}>Prepared by:</Text>
            <Text style={[styles.tableCellCenter,{fontSize:'9px',marginHorizontal:'auto', width:'190px',borderBottomStyle:'solid',borderBottomWidth:1,fontWeight:'bold'}]}>{props.formData.Faculty}</Text>
            <Text style={[styles.tableCellCenter,{fontSize:'9px',marginHorizontal:'auto', width:'190px',margin:'5px'}]}>Faculty</Text>
              </View>

              <View style={[styles.tableCol]}>
            <Text style={[styles.tableCell,{padding:0,margin:0,marginLeft:'20px',fontSize:'10px',marginTop:'5px'}]}>Reviewed by:</Text>
            <Text style={[styles.tableCellCenter,{fontSize:'9px',marginHorizontal:'auto', width:'190px',borderBottomStyle:'solid',borderBottomWidth:1,fontWeight:'bold'}]}>{props.formData.Chairperson}</Text>
            <Text style={[styles.tableCellCenter,{fontSize:'9px',marginHorizontal:'auto', width:'190px',margin:'5px'}]}>Department Chairperson</Text>
              </View>

              <View style={[styles.tableCol]}>
            <Text style={[styles.tableCell,{padding:0,margin:0,marginLeft:'20px',fontSize:'10px',marginTop:'5px',height:'10px' }]}></Text>
            <Text style={[styles.tableCellCenter,{fontSize:'9px',marginHorizontal:'auto', width:'190px',borderBottomStyle:'solid',borderBottomWidth:1,fontWeight:'bold'}]}>{props.formData.Dean}</Text>
            <Text style={[styles.tableCellCenter,{fontSize:'9px',marginHorizontal:'auto', width:'190px',margin:'5px'}]}>College Dean</Text>
              </View>

              <View style={[styles.tableCol]}>
            <Text style={[styles.tableCell,{padding:0,margin:0,marginLeft:'20px',fontSize:'10px',marginTop:'5px'}]}>Approved by:</Text>
            <Text style={[styles.tableCellCenter,{fontSize:'9px',marginHorizontal:'auto', width:'190px',borderBottomStyle:'solid',borderBottomWidth:1,fontWeight:'bold'}]}>{props.formData.Director}</Text>
            <Text style={[styles.tableCellCenter,{fontSize:'9px',marginHorizontal:'auto', width:'190px',margin:'5px'}]}>Campus Executive Director</Text>
              </View>

              </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}

export default PdfFile;
