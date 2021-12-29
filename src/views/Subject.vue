<template>
  <h1
    class="mt-2 mb-4 bg-gradient-to-br text-transparent from-violet-700 to-fuchsia-500 bg-clip-text text-3xl font-bold text-center"
  >
    {{ id }} {{ docSnap ? docSnap.name : null }}
  </h1>

  <div v-if="docSnap">
    <ul class="mx-auto max-w-sm p-4 grid grid-cols-1 gap-4">
      <li
        class="w-full rounded border border-gray-400 p-4 flex justify-between items-center"
        v-for="paper in docSnap.papers"
      >
        <span>{{ paper.code }}</span>
        <div v-if="paper.completed" class="text-violet-600">
          <Check />
        </div>
        <div v-else class="text-violet-600">
          <Cross />
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
// import { doc, getDoc } from "firebase/firestore";
// import { db } from "../firebase/config";
// import { useStore } from "vuex";
// import { ref, watchEffect } from "vue";
import { useRoute } from "vue-router";

import Check from "../components/icons/Check.vue";
import Cross from "../components/icons/Cross.vue";

const route = useRoute();
const id = route.params.id;
// const store = useStore();
// const docSnap = ref("");
// const error = ref("");

// const stop = watchEffect(async () => {
//   if (store.state.authIsReady) {
//     const docRef = doc(db, "users", store.state.user.uid, "subjects", id);
//     const snap = await getDoc(docRef);

//     if (!snap) {
//       error.value = "Oh snap! Something went wrong while fetching your data.";
//     } else {
//       docSnap.value = snap.data();
//     }
//     stop();
//   }
// });

const docSnap = {
  name: "Mathematics",
  papers: [
    { code: "9709/11/M/J/2021", completed: false },
    { code: "9709/12/M/J/2021", completed: false },
    { code: "9709/13/M/J/2021", completed: false },
  ],
};
</script>
