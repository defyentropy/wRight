<template>
  <div v-if="!loading">
    <div class="p-2" v-if="!fatalError">
      <h1 class="mt-2 mb-4 text-center">
        <span class="text-gray-400 text-sm">Settings for</span> <br />
        <span
          class="bg-gradient-to-br text-transparent from-violet-700 to-fuchsia-500 bg-clip-text text-3xl font-bold"
        >
          {{ id }} {{ subData.name }}
        </span>
      </h1>

      <div class="mx-auto flex w-24 justify-evenly mb-4">
        <router-link :to="`/subject/${id}`"> <BackIcon /> </router-link>
      </div>

      <p
        v-if="error"
        class="text-center font-medium p-1 text-white bg-red-400 rounded mb-4 text-sm"
      >
        {{ error }}
      </p>

      <div
        class="flex flex-col items-center p-4 rounded border-t-4 border-t-violet-700 shadow-md mx-auto max-w-md mb-8"
      >
        <h2 class="text-violet-700 font-semibold text-2xl mb-4 text-center">
          Components
        </h2>
        <div class="flex justify-evenly items-center w-full">
          <div class="flex items-center" v-for="comp in availableComponents">
            <input
              class="appearance-none mx-2 p-2 border-2 border-violet-700 text-white bg-white rounded-full cursor-pointer checked:border-gray-300 checked:bg-violet-700"
              type="checkbox"
              :key="comp"
              :id="comp"
              :value="comp"
              v-model="selectedComponents"
            />
            <label :for="comp">{{ comp }}</label>
          </div>
        </div>

        <button
          class="transition-all disabled:text-gray-400 disabled:border-gray-300 disabled:cursor-default bg-white mt-8 mb-2 w-24 border-violet-700 border rounded text-violet-700 p-1 cursor-pointer font-semibold text-lg"
          :disabled="!changed"
          @click="updateComps"
        >
          Update
        </button>
      </div>
      <!-- Delete component -->
      <div>
        <h2 class="text-2xl font-semibold text-red-600 text-center">Danger</h2>
        <p class="text-center text-sm mb-4">
          To delete this subject and all of its associated data, type in the
          subject code below and click "Delete subject".
        </p>
        <input
          class="border border-red-500 p-2 block mx-auto mb-4 rounded outline-none focus:shadow-lg text-center"
          v-model="keyphrase"
          type="text"
          placeholder="Subject code"
        />
        <button
          class="mb-8 transition-all disabled:text-gray-400 disabled:border-gray-300 disabled:cursor-default bg-white block mx-auto w-32 border-red-500 border rounded text-red-600 p-1 cursor-pointer font-semibold text-lg"
          @click="deleteSubject"
          :disabled="keyphrase !== id"
        >
          Delete subject
        </button>
      </div>
    </div>

    <!-- Alert if there is an error while initially fetching data -->
    <div class="flex flex-col items-center p-2" v-else>
      <p
        class="p-2 font-bold bg-red-400 rounded-md mx-auto max-w-sm text-white text-center w-full mb-4"
      >
        If you're seeing this error, you either don't have an internet
        connection, haven't added this subject yet or it doesn't exist at all.
      </p>
      <p class="underline text-violet-600 font-medium">
        <router-link to="/dashboard"> Go back to your dashboard. </router-link>
      </p>
    </div>
  </div>
  <!-- Loading component -->
  <div class="w-4/5 mx-auto h-96 flex items-center justify-center" v-else>
    <div
      class="rounded-full w-32 aspect-square animate-ping bg-violet-400"
    ></div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { ref, computed, onMounted } from "vue";
import { db } from "../firebase/config";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import BackIcon from "../components/icons/Back.vue";
import subjects from "../firebase/subjects.json";

const route = useRoute();
const id = route.params.id;
const store = useStore();
const router = useRouter();
// app state
const subData = ref(null);
const error = ref(null);
const fatalError = ref(null);
const availableComponents = ref([]);
const selectedComponents = ref([]);
const keyphrase = ref("");
const loading = ref(true);

onMounted(async () => {
  try {
    const docRef = doc(db, "users", store.state.user.uid, "subjects", id);
    let snap = await getDoc(docRef);

    if (!snap) {
      throw new Error(
        "Oh snap! Something went wrong while fetching your data."
      );
    }

    subData.value = snap.data();
    selectedComponents.value = subData.value.components.slice();
    availableComponents.value = subjects[id].components;
    loading.value = false;
  } catch (err) {
    loading.value = false;
    fatalError.value = err;
  }
});

const changed = computed(() => {
  return (
    selectedComponents.value.sort().toString() !==
    subData.value.components.sort().toString()
  );
});

const updateComps = async () => {
  try {
    error.value = "";
    const docRef = doc(db, "users", store.state.user.uid, "subjects", id);
    await setDoc(
      docRef,
      { components: selectedComponents.value },
      { merge: true }
    );
    subData.value.components = selectedComponents.value;
  } catch (err) {
    error.value = err.message;
  }
};

const deleteSubject = async () => {
  try {
    error.value = "";
    await deleteDoc(doc(db, "users", store.state.user.uid, "subjects", id));
    router.push("/dashboard");
  } catch (err) {
    error.value = err.message;
  }
};
</script>
