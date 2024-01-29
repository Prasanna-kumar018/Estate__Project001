import { combineReducers, configureStore } from "@reduxjs/toolkit";
import user from "../slice/user";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
const persistConfig = {
  key: "root",
  storage,
  version: 1,
};

const combineReducer = combineReducers({
  user: user,
});

const persistreducer = persistReducer(persistConfig, combineReducer);
const store = configureStore({
  reducer: persistreducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
