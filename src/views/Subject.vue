<template>
  <div v-if="store.state.user">
    <h1
      class="mt-2 mb-2 bg-gradient-to-br text-transparent from-violet-700 to-fuchsia-500 bg-clip-text text-3xl font-bold text-center"
    >
      {{ id }}
    </h1>
    <p class="text-xl h-8 text-center font-medium text-gray-500 mb-2">
      {{ docSnap ? docSnap.name : null }}
    </p>
    <div class="mx-auto flex w-24 justify-evenly mb-4">
      <router-link to="/dashboard"> <BackIcon /> </router-link>

      <router-link :to="`/subject/${id}/settings`">
        <Cog />
      </router-link>
    </div>

    <p
      class="p-2 font-bold bg-red-500 text-white text-center w-full my-4"
      v-if="error"
    >
      {{ error }}
    </p>

    <div class="mx-auto max-w-sm p-4 grid grid-cols-1 gap-4" v-if="docSnap">
      <div
        class="w-full rounded-md font-medium fill-white border-2 p-4 flex justify-between items-center"
        :class="{ paperDone: docSnap.completedPapers.includes(paper) }"
        v-for="paper in papersList"
      >
        <h2>{{ paper }}</h2>
        <!-- Check button -->
        <div
          v-if="docSnap.completedPapers.includes(paper)"
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
</template>

<script setup>
import { doc, getDoc, runTransaction } from "firebase/firestore";
import { db } from "../firebase/config";
import { useStore } from "vuex";
import { ref, watchEffect, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import papers from "../firebase/papers.json";
import Check from "../components/icons/Check.vue";
import Cross from "../components/icons/Cross.vue";
import Cog from "../components/icons/Cog.vue";
import BackIcon from "../components/icons/Back.vue";

const route = useRoute();
const router = useRouter();
const id = route.params.id;
const store = useStore();
const docSnap = ref(null);
const error = ref(null);

const redirect = () => {
  router.push("/auth/login");
};

const stop = watchEffect(async () => {
  if (store.state.authIsReady) {
    if (store.state.user) {
      const docRef = doc(db, "users", store.state.user.uid);
      const snap = await getDoc(docRef);

      if (!snap) {
        error.value = "Oh snap! Something went wrong while fetching your data.";
      } else {
        docSnap.value = snap.data().subjects[id];
      }
      stop();
    } else {
      redirect();
    }
  }
});

const papersList = computed(() => {
  return papers.papers
    .filter((paper) => docSnap.value.components.includes(paper[1]))
    .map((paper) => id + paper);
});

const completePaper = async (paper) => {
  try {
    await runTransaction(db, async (transaction) => {
      const docRef = doc(db, "users", store.state.user.uid);
      let currentSub = await transaction.get(docRef);

      if (!currentSub) {
        throw new Error("Unable to fetch data");
      }

      currentSub = currentSub.data().subjects;
      currentSub[id].completedPapers.push(paper);

      if (currentSub[id].completed[paper[5]]) {
        currentSub[id].completed[paper[5]]++;
      } else {
        currentSub[id].completed[paper[5]] = 1;
      }

      transaction.update(docRef, { subjects: currentSub });
    });
    docSnap.value.completedPapers.push(paper);

    if (docSnap.value.completed[paper[5]]) {
      docSnap.value.completed[paper[5]]++;
    } else {
      docSnap.value.completed[paper[5]] = 1;
    }
  } catch (err) {
    error.value = err;
  }
};

const unCompletePaper = async (paper) => {
  let index;
  try {
    await runTransaction(db, async (transaction) => {
      const docRef = doc(db, "users", store.state.user.uid);
      let currentSub = await transaction.get(docRef);

      if (!currentSub) {
        throw new Error("Unable to fetch data");
      }

      currentSub = currentSub.data().subjects;
      index = currentSub[id].completedPapers.indexOf(paper);
      currentSub[id].completedPapers.splice(index, 1);

      if (currentSub[id].completed[paper[5]]) {
        currentSub[id].completed[paper[5]]--;
      } else {
        currentSub[id].completed[paper[5]] = 1;
      }

      transaction.update(docRef, { subjects: currentSub });
    });

    docSnap.value.completedPapers.splice(index, 1);

    if (docSnap.value.completed[paper[5]]) {
      docSnap.value.completed[paper[5]]--;
    } else {
      docSnap.value.completed[paper[5]] = 1;
    }
  } catch (err) {
    error.value = err;
  }
};

// const docSnap = reactive({
//   name: "Mathematics",
//   components: ["1", "5"],
//   completedPapers: ["9709/11/M/J/2021", "9709/12/M/J/2019"],
// });

// const togglePaper = (paper) => {
//   docSnap.value.completedPapers.push(paper);
// };
</script>
