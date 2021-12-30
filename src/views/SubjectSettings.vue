<template>
  <h1 class="mt-2 mb-4 text-center">
    <span class="text-gray-400 text-sm">Settings for</span> <br />
    <span
      class="bg-gradient-to-br text-transparent from-violet-700 to-fuchsia-500 bg-clip-text text-3xl font-bold"
    >
      {{ id }} {{ docSnap ? docSnap.name : null }}
    </span>
  </h1>

  <div class="mx-auto flex w-24 justify-evenly mb-4">
    <router-link :to="`/subject/${id}`"> <BackIcon /> </router-link>
  </div>

  <div
    v-if="docSnap"
    class="flex flex-col items-center p-4 rounded border-t-4 border-t-violet-700 shadow-md mx-auto max-w-md"
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
</template>

<script setup>
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { ref, watchEffect, computed } from "vue";
import { db } from "../firebase/config";
import { doc, getDoc, runTransaction } from "firebase/firestore";
import subjects from "../firebase/subjects.json";
import BackIcon from "../components/icons/Back.vue";

const route = useRoute();
const id = route.params.id;
const store = useStore();
const docSnap = ref(null);
const error = ref(null);
const availableComponents = subjects[id];
const selectedComponents = ref([]);

const stop = watchEffect(async () => {
  if (store.state.authIsReady) {
    const docRef = doc(db, "users", store.state.user.uid);
    const snap = await getDoc(docRef);

    if (!snap) {
      error.value = "Oh snap! Something went wrong while fetching your data.";
    } else {
      docSnap.value = snap.data().subjects[id];
      selectedComponents.value = docSnap.value.components.slice();
    }
    stop();
  }
});

const changed = computed(() => {
  return (
    selectedComponents.value.sort().toString() !==
    docSnap.value.components.sort().toString()
  );
});

const updateComps = async () => {
  if (changed) {
    try {
      await runTransaction(db, async (transaction) => {
        const docRef = doc(db, "users", store.state.user.uid);
        let currentSub = await transaction.get(docRef);

        if (!currentSub) {
          throw new Error("Couldn't fetch data");
        }

        currentSub = currentSub.data().subjects;
        currentSub[id].components = selectedComponents.value;

        transaction.update(docRef, { subjects: currentSub });
      });
      docSnap.value.components = selectedComponents.value.slice();
    } catch (err) {
      error.value = err;
    }
  }
};
</script>
