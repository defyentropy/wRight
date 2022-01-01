import { createStore } from "vuex";
import { auth } from "../firebase/config";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

const store = createStore({
  state: {
    user: null,
    authIsReady: false,
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload;
    },
    setAuthIsReady(state, payload) {
      state.authIsReady = payload;
    },
  },
  actions: {
    // Signup functionality
    async signup(context, { email, password }) {
      const authRes = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (authRes) {
        context.commit("setUser", authRes.user);
      } else {
        throw new Error("Could not sign user up");
      }
    },
    // Login functionality
    async login(context, { email, password }) {
      const res = await signInWithEmailAndPassword(auth, email, password);

      if (res) {
        context.commit("setUser", res.user);
      } else {
        throw new Error("Could not log user in.");
      }
    },
    // Logout functionality
    async logout(context) {
      await signOut(auth);
      context.commit("setUser", null);
    },
  },
});

export const getUser = () => {
  return new Promise((resolve, reject) => {
    const unsub = onAuthStateChanged(
      auth,
      (user) => {
        unsub();
        store.commit("setUser", user);
        store.commit("setAuthIsReady", true);
        resolve(user);
      },
      reject
    );
  });
};

export default store;
