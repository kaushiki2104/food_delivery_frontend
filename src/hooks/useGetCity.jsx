import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentAddress,
  setCurrentCity,
  setCurrentState,
  setUserData,
} from "../redux/userSlice";
import { setLocation } from "../redux/mapSlice";

// new 


function useGetCity() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  const apiKey = import.meta.env.VITE_GEOAPIKEY;

  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation not supported by this browser.");
      return;
    }

    const options = {
      enableHighAccuracy: true, 
      timeout: 15000,           
      maximumAge: 0,            
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;

        console.log("📍 Coordinates:", latitude, longitude);
        console.log("🎯 Accuracy (meters):", accuracy);

        dispatch(setLocation({ lat: latitude, lon: longitude }));

        if (accuracy > 1000) {
          console.warn("⚠️ Low accuracy detected — using fallback location (Dehradun)");
          return useFallback();
        }

        try {
          const response = await axios.get(
            `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${apiKey}`
          );

          const result = response?.data?.results?.[0];
          const city = result?.city || "Dehradun";
          const state = result?.state || "Uttarakhand";
          const address =
            result?.address_line2 ||
            result?.address_line1 ||
            `${city}, ${state}`;

          dispatch(setCurrentCity(city));
          dispatch(setCurrentState(state));
          dispatch(setCurrentAddress(address));

          //  dispatch(setAddress(result?.address_line2));

          console.log("✅ Location set:", { city, state, address });
        } catch (error) {
          console.error(" Error fetching location details:", error);
          useFallback();
        }
      },
      (error) => {
        console.error(" Geolocation error:", error.message);
        useFallback();
      },
      options
    );

    
    function useFallback() {
      const fallbackCity = "Dehradun";
      const fallbackState = "Uttarakhand";
      const fallbackAddress = "Dehradun, Uttarakhand";

      dispatch(setCurrentCity(fallbackCity));
      dispatch(setCurrentState(fallbackState));
      dispatch(setCurrentAddress(fallbackAddress));

      console.log("🔁 Using fallback location:", fallbackAddress);
    }
  }, [userData]);
}




// old 
// function useGetCity() {
//   const dispatch = useDispatch();
//   const { userData } = useSelector((state) => state.user);
//   const apiKey = import.meta.env.VITE_GEOAPIKEY;

//   useEffect(() => {
//     navigator.geolocation.getCurrentPosition(async (position) => {
//       const latitude = position.coords.latitude;
//       const longitude = position.coords.longitude;

//          console.log("Your detected coordinates:", latitude, longitude);

//       const result = await axios.get(
//         `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${apiKey}`
//       );
//       // console.log("result", result)

//       const city = result?.data?.results[0]?.city || "Dehradun"; // ✅ fallback
//       const state = result?.data?.results[0]?.state || "Uttarakhand";
//       const address =
//         result?.data?.results[0]?.address_line2 ||
//         result?.data?.results[0]?.address_line1 ||
//         "Dehradun, Uttarakhand";

//       dispatch(setCurrentCity(city));
//       dispatch(setCurrentState(state));
//       dispatch(setCurrentAddress(address));
//     });
//   }, [userData]);
  

// }




export default useGetCity;
