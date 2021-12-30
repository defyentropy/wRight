<template>
  <h1
    class="mt-2 mb-4 bg-gradient-to-br text-transparent from-violet-700 to-fuchsia-500 bg-clip-text text-3xl font-bold text-center"
  >
    Dashboard
  </h1>
  <div class="mx-auto flex w-24 justify-evenly mb-4">
    <router-link to="/settings">
      <Cog />
    </router-link>
  </div>

  <div
    class="p-4 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
    v-if="docSnap"
  >
    <div
      class="rounded shadow-md border-t-4 border-violet-700 p-4 hover:shadow-lg hover:shadow-violet-300 cursor-default transition-all duration-300"
      v-for="subject in Object.keys(docSnap.subjects)"
      :key="docSnap.subjects[subject].code"
    >
      <p class="text-sm text-gray-500 text-center">
        {{ docSnap.subjects[subject].code }}
      </p>

      <h1 class="text-center font-medium text-lg mb-4">
        <router-link :to="`/subject/${subject}`">
          <span class="hover:underline decoration-violet-600 decoration-wavy">
            {{ docSnap.subjects[subject].name }}
          </span>
        </router-link>
      </h1>

      <div class="h-2 rounded-full bg-gray-400 w-full mb-4">
        <div
          class="h-2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500"
          :style="{ width: widths[subject] }"
        ></div>
      </div>
      <p class="text-sm text-gray-500 text-center">
        {{ completed[subject] }} /
        {{ docSnap.subjects[subject].components.length * 42 }} papers completed
      </p>
    </div>
  </div>
</template>

<script setup>
import { db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { useStore } from "vuex";
import { ref, watchEffect, computed } from "vue";
import Cog from "../components/icons/Cog.vue";

const store = useStore();
const docSnap = ref("");
const widths = {};

const completed = computed(() => {
  // let sum = 0
  // for (let comp in docSnap.value.components) {
  //   sum += docSnap.value.completed[comp] ? docSnap.value.completed[comp] : 0
  // }
  // return sum

  let sums = {};
  for (let subject of Object.keys(docSnap.value.subjects)) {
    let sum = 0;
    for (let comp of docSnap.value.subjects[subject].components) {
      sum += docSnap.value.subjects[subject].completed[comp] || 0;
    }
    sums[subject] = sum;
  }
  return sums;
});

const stop = watchEffect(async () => {
  if (store.state.authIsReady) {
    const docRef = doc(db, "users", store.state.user.uid);
    let snap = await getDoc(docRef);
    docSnap.value = snap.data();

    for (let subject of Object.keys(docSnap.value.subjects)) {
      widths[subject] = `${Math.round(
        (completed.value[subject] * 100) /
          (docSnap.value.subjects[subject].components.length * 42)
      )}%`;
    }
    stop();
  }
});

// const docSnap = {
//   subjects: {
//     9709: {
//       name: "Mathematics",
//       completed: 20,
//       todo: 35,
//     },
//     9701: {
//       name: "Chemistry",
//       completed: 12,
//       todo: 35,
//     },
//     9702: {
//       name: "Physics",
//       completed: 17,
//       todo: 35,
//     },
//     9231: {
//       name: "Mathematics - Further",
//       completed: 6,
//       todo: 35,
//     },
//     9718: {
//       name: "Computer Science",
//       completed: 11,
//       todo: 35,
//     },
//     8021: {
//       name: "English General Paper",
//       completed: 8,
//       todo: 35,
//     },
//   },
// };

// docSnap.subjects.forEach((subject) => {
//   widths[subject.code] = `${Math.round(
//     (subject.completed / subject.todo) * 100
//   )}%`;
// });
</script>
