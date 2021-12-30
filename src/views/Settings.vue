<template>
  <div v-if="user">
    <!-- Page title -->
    <h1
      class="mt-2 mb-4 bg-gradient-to-br text-transparent from-violet-700 to-fuchsia-500 bg-clip-text text-3xl font-bold text-center"
    >
      Settings
    </h1>
    <div class="mx-auto flex w-24 justify-evenly mb-4">
      <router-link to="/dashboard"> <Back /> </router-link>
    </div>

    <!-- Settinsg card -->
    <div
      class="max-w-sm rounded border-t-4 border-violet-700 shadow-md mx-auto p-4 grid grid-cols-2 gap-2"
    >
      <!-- Profile picture -->
      <div class="col-span-1">
        <div v-if="user.photoURL">
          <img :src="user.photoURL" alt="profile picture" />
        </div>
        <div v-else>
          <div
            class="rounded-full h-32 p-1 aspect-square bg-violet-700 text-white font-bold text-6xl flex justify-center items-center"
          >
            {{ user.email[0].toUpperCase() }}
          </div>
        </div>
      </div>
      <!-- Email and verified status -->
      <div class="col-span-1 mr-auto self-center">
        <h3 class="font-medium text-violet-600">Email</h3>
        <p class="mb-4">{{ user.email }}</p>
        <h3 class="font-medium text-violet-600">Email verified?</h3>
        <p>
          <Check class="fill-green-500" v-if="user.emailVerified"></Check>
          <Cross class="fill-red-500" v-else></Cross>
        </p>
      </div>
      <!-- Subject choice -->
      <div class="col-span-2" v-if="userData">
        <h3 class="font-medium text-violet-600 text-xl text-center mb-4">
          Subjects
        </h3>
        <!-- Chosen subjects -->
        <ul class="mb-8">
          <li
            class="p-1 rounded-md text-center border border-violet-700 w-48 mx-auto mb-2"
            v-for="subject in Object.keys(userData.subjects)"
          >
            {{ userData.subjects[subject].name }}
          </li>
        </ul>
        <!-- New subject -->
        <div class="flex flex-col items-center">
          <label class="block font-medium mb-2" for="newSubject"
            >Add a subject</label
          >
          <input
            class="border-violet-700 p-2 rounded border"
            list="subjects"
            name="newSubject"
            id="newSubject"
            v-model="newSubject"
          />

          <button
            class="p-2 mt-2 shadow-md hover:shadow-lg font-medium text-violet-600 mx-auto w-32 rounded"
            :disabled="!newSubject"
            @click="addNewSubject"
          >
            Add subject
          </button>

          <p>{{ error }}</p>

          <datalist id="subjects">
            <option
              v-for="subject in availableSubjects"
              :value="subject"
            ></option>
          </datalist>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useStore } from "vuex";
import { db } from "../firebase/config";
import { doc, getDoc, runTransaction } from "firebase/firestore";
import { watchEffect, ref, computed } from "vue";
import Check from "../components/icons/Check.vue";
import Cross from "../components/icons/Cross.vue";
import { subjectsList } from "../firebase/subjectsList.json";
import subjectComps from "../firebase/subjects.json";
import Back from "../components/icons/Back.vue";

const error = ref(null);
const userData = ref(null);
const store = useStore();
const user = ref(null);
let availableSubjects = computed(() => {
  if (userData) {
    return subjectsList.filter(
      (subject) =>
        !Object.keys(userData.value.subjects).includes(subject.slice(0, 4))
    );
  }
});
const newSubject = ref(null);

const stop = watchEffect(async () => {
  if (store.state.authIsReady) {
    user.value = store.state.user;
    // fetch user data
    const docRef = doc(db, "users", store.state.user.uid);
    const snap = await getDoc(docRef);

    if (!snap) {
      error.value = "Something went wrong while fetching your data.";
    }

    userData.value = snap.data();

    stop();
  }
});

const addNewSubject = async () => {
  let code = newSubject.value.slice(0, 4);
  try {
    await runTransaction(db, async (transaction) => {
      const docRef = doc(db, "users", store.state.user.uid);
      let currentDoc = await transaction.get(docRef);

      if (!currentDoc) {
        error.value = "Something went wrong";
      }

      currentDoc = currentDoc.data().subjects;
      currentDoc[code] = {
        name: newSubject.value.slice(5),
        components: subjectComps[code],
        completedPapers: [],
        completed: {},
      };
      transaction.update(docRef, { subjects: currentDoc });
    });
    // update application state
    userData.value.subjects[code] = {
      name: newSubject.value.slice(5),
      components: subjectComps[code],
      completedPapers: [],
      completed: {},
    };
  } catch (err) {
    error.value = err;
  }
};
</script>
