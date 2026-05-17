import React, { useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setItemsInMyCity, setShopsInMyCity } from "../redux/userSlice";

function useGetItemByCity() {
  const dispatch = useDispatch();
  const { currentCity } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/item/get-by-city/${currentCity}`,
          { withCredentials: true }
        );

        dispatch(setItemsInMyCity(result.data));
        console.log("Shops in city:", result.data);
      } catch (error) {
        console.error("Error fetching shops:", error);
      }
    };

    if (currentCity) {
      fetchItems();
    }
  }, [currentCity, dispatch]);
}

export default useGetItemByCity;
