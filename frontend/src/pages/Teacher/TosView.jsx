import React, { useState, useEffect } from 'react';
import api from "../../api";

function TosView( tosInfo ) {  // Destructure tosInfo from props

  const [TOS, setTOS] = useState([]);

  useEffect(() => {
    if (tosInfo && tosInfo.id) { // Ensure tosInfo.id is available before making the API call
      getTOS();
    }
  }, [tosInfo]);  // Re-run effect when tosInfo changes

  const getTOS = () => {
    api
      .get(`/api/tos-content/${tosInfo.id}/detail/`)
      .then((res) => res.data)
      .then((data) => {
        setTOS(data);
      })
      .catch((err) => alert(err));
  };

  console.log("tosdata", TOS);

  return (
    <div>
      <p>TOS View</p>
      <p>{tosInfo.id}</p>
      
      {/* Ensure TOS has data before rendering */}
      {TOS.length > 0 && (
        <p>{TOS[0].topic}</p>
      )}
    </div>
  );
}

export default TosView;
