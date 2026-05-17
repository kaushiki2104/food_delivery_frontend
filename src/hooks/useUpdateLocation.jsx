import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentAddress,
  setCurrentCity,
  setCurrentState,
} from "../redux/userSlice";
import { setLocation } from "../redux/mapSlice";

function useUpdateLocation() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

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

    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;

        console.log("📍 Coordinates:", latitude, longitude);
        console.log("🎯 Accuracy (meters):", accuracy);

        dispatch(setLocation({ lat: latitude, lon: longitude }));

        // Use fallback only for extreme low accuracy
        if (accuracy > 1000) {
          console.warn(
            "⚠️ Low accuracy detected — using fallback location (Dehradun)"
          );
        useFallback();
        }

        try {
          const res = await axios.post(
            "http://localhost:8000/api/user/update-location",
            { lat: latitude, lon: longitude, accuracy },
            { withCredentials: true }
          );

          console.log("✅ BACKEND RESPONSE:", res.data.message);

          // Update frontend state as before
          dispatch(setCurrentCity("Dehradun"));
          dispatch(setCurrentState("Uttarakhand"));
          dispatch(setCurrentAddress("Dehradun, Uttarakhand"));

          console.log("✅ Location sent to backend");
        } catch (error) {
          console.error("Error updating location:", error);
          useFallback();
        }
      },
      (error) => {
        console.error("Geolocation error:", error.message);
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

    return () => navigator.geolocation.clearWatch(watchId);
  }, [userData]);
}

export default useUpdateLocation;







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


