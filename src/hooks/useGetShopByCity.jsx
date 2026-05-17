import React, { useEffect } from 'react'
import axios from 'axios';
import { serverUrl } from '../App';
import { useDispatch, useSelector } from 'react-redux';
import { setShopsInMyCity } from '../redux/userSlice';

function useGetShopByCity() {
  const dispatch = useDispatch();
  const { currentCity } = useSelector((state) => state.user);
  const [preCity, setPreCity] = React.useState(null);
  useEffect(() => {
    const fetchShop = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/shop/get-by-city/${currentCity}`,
          { withCredentials: true }
        );

        dispatch(setShopsInMyCity(result.data));
        console.log("Shops in city:", result.data);
      } catch (error) {
        console.error("Error fetching shops:", error);
      }
    };

    if (currentCity!==preCity) {
      fetchShop();
      setPreCity(currentCity);
      console.log("Fetching shops for city:", currentCity, preCity);
    }
  }, [currentCity, dispatch]);
}

export default useGetShopByCity;
