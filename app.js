import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';
import ChartComponent from './chartcomponent';

const App = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, 'houses'));
      const houses = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setData(houses);
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>House Sales in Bulawayo</h1>
      <ChartComponent data={data} />
    </div>
  );
};

export default App;