import { createStore } from "vuex";
import { auth, db } from "../firebase/config";
import subjectComps from "../firebase/subjects.json";
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
    // Signup functionality
    async signup(context, { email, password, firstSub }) {
      const authRes = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (authRes) {
        context.commit("setUser", authRes.user);

        // Create first document
        const docRef = doc(
          db,
          "users",
          store.state.user.uid,
          "subjects",
          firstSub.slice(0, 4)
        );
        await setDoc(docRef, {
          name: firstSub.slice(5),
          completed: {},
          completedSubjects: [],
          components: subjectComps[firstSub.slice(0, 4)],
        });
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

const unsub = onAuthStateChanged(auth, (user) => {
  store.commit("setUser", user);
  store.commit("setAuthIsReady", true);
  unsub();
});

export default store;
