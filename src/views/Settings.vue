<template>
  <div v-if="!loading">
    <div class="p-2" v-if="!fatalError">
      <!-- Page title -->
      <h1
        class="mt-2 mb-4 bg-gradient-to-br text-transparent from-violet-700 to-fuchsia-500 bg-clip-text text-3xl font-bold text-center"
      >
        Settings
      </h1>
      <!-- Navigation -->
      <div class="mx-auto flex w-24 justify-evenly mb-4">
        <router-link to="/dashboard"> <Back /> </router-link>
      </div>

      <!-- Error message -->
      <p
        v-if="error"
        class="text-center font-medium p-1 text-white bg-red-400 mb-4 text-sm rounded-md max-w-sm"
      >
        {{ error }}
      </p>

      <!-- Settings card -->
      <div
        class="max-w-sm rounded border-t-4 border-violet-700 shadow-md mx-auto p-4 grid grid-cols-2 gap-2 mb-8"
      >
        <!-- Profile picture -->
        <div class="col-span-1">
          <div v-if="user.photoURL">
            <img :src="user.photoURL" alt="profile picture" />
          </div>
          <div v-else>
            <div
              class="rounded-full h-24 md:h-32 aspect-square bg-violet-700 text-white font-bold text-6xl flex justify-center items-center"
            >
              {{ user.email[0].toUpperCase() }}
            </div>
          </div>
        </div>
        <!-- Email and verified status -->
        <div class="col-span-1 mr-auto self-center">
          <h3 class="font-medium text-violet-600">Email</h3>
          <p class="w-32 md:w-48 mb-4 truncate">{{ user.email }}</p>
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
              v-for="subject in Object.keys(userData)"
            >
              {{ userData[subject].name }}
            </li>
          </ul>
          <!-- New subject -->
          <div class="flex flex-col items-center">
            <label class="block font-medium mb-2" for="newSubject"
              >Add a subject</label
            >
            <input
              class="border-violet-700 p-2 rounded border outline-none focus:shadow-lg"
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

            <datalist id="subjects">
              <option
                v-for="subject in availableSubjects"
                :value="subject.code + '/' + subject.name"
              ></option>
            </datalist>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-col items-center p-2" v-else>
      <p
        class="p-2 font-bold bg-red-400 rounded-md mx-auto max-w-sm text-white text-center w-full mb-4"
      >
        If you're seeing this error, wRight had some problems fetching your
        data. Please try again later.
      </p>
      <p class="underline text-violet-600 font-medium">
        <router-link to="/dashboard"> Go back to your dashboard. </router-link>
      </p>
    </div>
  </div>

  <div class="w-4/5 mx-auto h-96 flex items-center justify-center" v-else>
    <div
      class="rounded-full w-32 aspect-square animate-ping bg-violet-400"
    ></div>
  </div>
</template>

<script setup>
import { useStore } from "vuex";
import { db } from "../firebase/config";
import { collection, doc, setDoc, getDocs, query } from "firebase/firestore";
import { ref, computed, onMounted } from "vue";
import Check from "../components/icons/Check.vue";
import Cross from "../components/icons/Cross.vue";
import subjectsList from "../firebase/subjects.json";
import Back from "../components/icons/Back.vue";

const error = ref("");
const fatalError = ref("");
const userData = ref({});
const store = useStore();
const user = ref(null);
const newSubject = ref(null);
const loading = ref(true);

let availableSubjects = computed(() => {
  if (userData) {
    let chosenSubs = Object.keys(userData.value);
    let subs = [];
    for (let code of Object.keys(subjectsList)) {
      if (!chosenSubs.includes(code)) {
        subs.push({ code, name: subjectsList[code].name });
      }
    }
    return subs;
  }
  return [];
});

onMounted(async () => {
  try {
    user.value = store.state.user;
    // fetch user data
    const subCollection = collection(db, "users", user.value.uid, "subjects");
    let snap = await getDocs(query(subCollection));

    snap.forEach((sub) => {
      userData.value[sub.id] = sub.data();
    });
    loading.value = false;
  } catch (err) {
    loading.value = false;
    fatalError.value = err;
  }
});

const addNewSubject = async () => {
  try {
    let code = newSubject.value.slice(0, 4);
    let newSubData = {
      name: newSubject.value.slice(5),
      components: subjectsList[code].components,
      completedPapers: [],
      completed: {},
      goal: 20,
    };
    error.value = "";
    await setDoc(
      doc(db, "users", user.value.uid, "subjects", code),
      newSubData
    );
    userData.value[code] = newSubData;
    newSubject.value = "";
  } catch (err) {
    error.value = err;
  }
};
</script>
