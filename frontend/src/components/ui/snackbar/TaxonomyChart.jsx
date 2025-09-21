import * as React from 'react';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';


export default function TaxonomyChart({Remembering,Understanding,Applying,Analyzing,Evaluating,Creating}) {
    
    const valueFormatter = (item) => `${item.value}%`;
 const desktopOS = [
  {
    label: `Remembering`,
    value: Remembering,
  },
  {
    label: `Understanding`,
    value: Understanding,
  },
  {
    label: `Applying`,
    value: Applying,
  },
  {
    label: `Analyzing`,
    value: Analyzing,
  },
  {
    label: `Evaluating`,
    value: Evaluating,
  },
  {
    label: `Creating`,
    value: Creating,
  },
];

  return (
    <PieChart

    colors={[ 'red',
       'orange',
         '#ffe66d',
        'green',
      'blue',
       'purple']}
      series={[
        {
          data: desktopOS,
          highlightScope: { fade: 'global', highlight: 'item' },
          faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
          valueFormatter,
           arcLabel: (item) => `${item.value}%`,
      arcLabelMinAngle: 35,
      arcLabelRadius: '60%',
           
        },
        
      ]}

        sx={{
    [`& .${pieArcLabelClasses.root}`]: {
      fontWeight: 'bold',
      fill:"white"
    },
  }}

  
      height={300}

    />
  );
}
