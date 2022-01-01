<template>
  <div v-if="!loading">
    <!-- If a data fetching error has occurred, render an error -->
    <div class="p-2" v-if="!fatalError">
      <!-- Page title -->
      <h1
        class="mt-2 mb-2 bg-gradient-to-br text-transparent from-violet-700 to-fuchsia-500 bg-clip-text text-3xl font-bold text-center"
      >
        {{ id }}
      </h1>
      <p class="text-xl h-8 text-center font-medium text-gray-500 mb-2">
        {{ subData.name }}
      </p>
      <!-- Navigation -->
      <div class="mx-auto flex w-24 justify-evenly mb-8">
        <router-link to="/dashboard"> <BackIcon /> </router-link>

        <router-link :to="`/subject/${id}/settings`">
          <Cog />
        </router-link>
      </div>

      <!-- Error message -->
      <p
        class="p-2 font-bold bg-red-400 rounded-md mx-auto max-w-sm text-white text-center w-full mb-4"
        v-if="error"
      >
        {{ error }}
      </p>

      <!-- Custom progress bar -->
      <div
        class="col-span-1 h-2 rounded-full bg-gray-400 max-w-xs mb-2 mx-auto overflow-hidden"
      >
        <div
          class="h-2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500"
          :style="{ width: subData.width }"
        ></div>
      </div>
      <p class="text-center text-gray-500 text-sm font-medium mb-8">
        {{ subData.completedCount }} /
        {{ subData.components.length * 42 }} papers completed
      </p>

      <div class="mx-auto max-w-sm grid grid-cols-1 gap-4 mb-8 p-2">
        <div
          class="w-full rounded-md font-medium fill-white border-2 p-4 flex justify-between items-center"
          :class="{ paperDone: subData.completedPapers.includes(paper) }"
          v-for="paper in papersList"
        >
          <h2>{{ paper }}</h2>
          <!-- Check button -->
          <div
            v-if="subData.completedPapers.includes(paper)"
            class="fill-inherit cursor-pointer"
          >
            <Check @click="unCompletePaper(paper)" />
          </div>
          <div v-else class="text-violet-600 cursor-pointer">
            <Cross @click="completePaper(paper)" />
          </div>
        </div>
      </div>
    </div>

    <!-- Data-fetching error component -->
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
  <div v-else class="w-4/5 mx-auto h-96 flex items-center justify-center">
    <div
      class="rounded-full w-32 aspect-square animate-ping bg-violet-400"
    ></div>
  </div>
</template>

<script setup>
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { useStore } from "vuex";
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
// list of papers
import papers from "../firebase/papers.json";
// icons
import Check from "../components/icons/Check.vue";
import Cross from "../components/icons/Cross.vue";
import Cog from "../components/icons/Cog.vue";
import BackIcon from "../components/icons/Back.vue";

const route = useRoute();
const id = route.params.id;
const store = useStore();
const subData = ref(null);
const error = ref("");
const fatalError = ref("");
const loading = ref(true);

onMounted(async () => {
  try {
    let snap = await getDoc(
      doc(db, "users", store.state.user.uid, "subjects", id)
    );

    if (!(snap && snap.data())) {
      throw new Error("Couldn't fetch your data");
    }

    let data = snap.data();
    let sum = 0;
    for (let comp of data.components) {
      sum += data.completed[comp] || 0;
    }
    let width = `${Math.round((sum * 100) / (data.components.length * 42))}%`;

    subData.value = {
      ...data,
      completedCount: sum,
      width,
    };
    loading.value = false;
  } catch (err) {
    loading.value = false;
    fatalError.value = err;
  }
});

const papersList = computed(() => {
  if (subData.value !== null) {
    return papers.papers
      .filter((paper) => subData.value.components.includes(paper[1]))
      .map((paper) => id + paper);
  }
  return [];
});

const completePaper = async (paper) => {
  try {
    const docRef = doc(db, "users", store.state.user.uid, "subjects", id);
    let { completed, completedPapers, completedCount } = subData.value;
    completedPapers.push(paper);
    subData.value.completedCount++;

    if (completed[paper[5]] !== undefined) {
      completed[paper[5]]++;
    } else {
      completed[paper[5]] = 1;
    }

    await setDoc(docRef, { completed, completedPapers }, { merge: true });
  } catch (err) {
    error.value = err;
  }
};

const unCompletePaper = async (paper) => {
  try {
    const docRef = doc(db, "users", store.state.user.uid, "subjects", id);
    let { completed, completedPapers } = subData.value;
    completedPapers.splice(completedPapers.indexOf(paper), 1);
    subData.value.completedCount--;
    completed[paper[5]]--;

    await setDoc(docRef, { completed, completedPapers }, { merge: true });
  } catch (err) {
    error.value = err;
  }
};
</script>
