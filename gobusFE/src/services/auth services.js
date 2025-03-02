import { store } from "../store/store";

export const AuthService = {
  getTokens: () => {
    const { token } = store.getState().passenger.info;
    return token;
  },
  setTokens: (token) => {
    sessionStorage.setItem("tk", JSON.stringify({ token }));
  },
  logout: () => {
    sessionStorage.removeItem("tk");
  },
};
