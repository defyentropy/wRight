import { createStore } from "vuex";
import { auth, db } from "../firebase/config";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

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
    async signup(context, { email, password, grade }) {
      const authRes = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (authRes) {
        context.commit("setUser", authRes.user);

        const docData = {
          grade,
        };

        const dbRes = await setDoc(doc(db, "users", authRes.user.uid), docData);

        if (!dbRes) {
          throw new Error("Could not initialize user data");
        }
      } else {
        throw new Error("Could not sign user up");
      }
    },
    async login(context, { email, password }) {
      const res = await signInWithEmailAndPassword(auth, email, password);

      if (res) {
        context.commit("setUser", res.user);
      } else {
        throw new Error("Could not log user in.");
      }
    },
    async logout(context) {
      await signOut(auth);
      context.commit("setUser", null);
    },
  },
});

const unsub = onAuthStateChanged(auth, (user) => {
  store.commit("setUser", user);
  store.commit("setAuthIsReady", true);
  unsub();
});

export default store;
