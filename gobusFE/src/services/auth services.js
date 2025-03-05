import { store } from "../store/store";

export const AuthService = {
  getTokens: () => {
    if (store.getState().busOwner.info.token) {
      return store.getState().busOwner.info.token;
    } else if (store.getState().passenger.info.token) {
      return store.getState().passenger.info.token;
    } else {
      return null;
    }
  },
  setTokens: (token) => {
    sessionStorage.setItem("tk", JSON.stringify({ token }));
  },
  logout: () => {
    sessionStorage.removeItem("tk");
  },
};
