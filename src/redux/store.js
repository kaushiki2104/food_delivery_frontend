import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer, createTransform } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import ownerSlice from "./ownerSlice";
import mapSlice from "./mapSlice";

// ✅ Transform to remove socket before persisting
const removeSocketTransform = createTransform(
  (inboundState, key) => {
    if (key === "user") {
      const { socket, ...rest } = inboundState;
      return rest; // socket remove ho gaya
    }
    return inboundState;
  },
  (outboundState, key) => {
    return outboundState;
  }
);

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user"], // same as your code
  transforms: [removeSocketTransform], // ✅ ONLY ADD THIS
};

const rootReducer = combineReducers({
  user: userSlice,
  owner: ownerSlice,
  map: mapSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);