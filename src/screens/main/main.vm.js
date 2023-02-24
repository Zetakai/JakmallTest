import React, {useCallback, useEffect, useState} from 'react';
import {API, API_CATEGORIES} from '../../api';

export default function MainVM() {
  const [DATA, setDATA] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isLoading,setIsLoading]=useState(false)
  

  const fetchCategories = async () => {
    setIsLoading(true)
    try {
      let data;
      await fetch(API_CATEGORIES)
        .then(res => res.json())
        .then(json => {
          setCategories(json.categories);
          data = json.categories.map((x, i) => ({
            title: x,
            data: [],
            index: i,
          }));
        });
      Promise.all(data).then(results => {
        results.forEach(x => {
          fetchCategory(data, x.title, 2);
          console.log(x);
        });
      });
    } catch (er) {
      console.log('error', er);
    }
  };

  const fetchCategory = async (data, category, amount) => {
    setIsLoading(true)
    try {
      let objIndex = data.findIndex(obj => obj.title == category);
      await fetch(`${API}/joke/${category}?type=single&amount=${amount}`)
        .then(res => res.json())
        .then(json => {
          if (!json.error) {
            let Items = [...data];
            Items[objIndex].data = json.jokes;
            console.log(Items);
            setDATA(Items);
          } else {
            let Items = [...data];
            Items[objIndex].data = [{joke: 'No Data'}];
            console.log(Items);
            setDATA(Items);
          }
        });
    } catch (er) {
      console.log('error', er);
    }
    finally{setIsLoading(false)}
  };
  return {fetchCategories, fetchCategory, categories, DATA,isLoading};
}
