import { combineReducers, configureStore } from "@reduxjs/toolkit";
import session from "redux-persist/lib/storage/session";
import { persistReducer, persistStore } from "redux-persist";
import passengerReducer from "./passengerSlice";
import busOwnerReducer from "./busOwnerSlice"

const passengerConfig = {
  key: "passenger",
  storage: session,
  version: 1,
};
const busOwnerConfig = {
  key: "busOwner",
  storage: session,
  version: 1,
};
const createRootReducer = () =>
  combineReducers({
    passenger: persistReducer(passengerConfig, passengerReducer),
    busOwner:persistReducer(busOwnerConfig,busOwnerReducer)
  });

const configureAppStore = () => {
  const rootReducer = createRootReducer();

  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
};
export const store = configureAppStore();
export let persistor = persistStore(store);
