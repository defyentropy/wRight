<template>
  <div class="p-2" v-if="store.state.user">
    <!-- Page title -->
    <h1
      class="mt-2 mb-2 bg-gradient-to-br text-transparent from-violet-700 to-fuchsia-500 bg-clip-text text-3xl font-bold text-center"
    >
      {{ id }}
    </h1>
    <p class="text-xl h-8 text-center font-medium text-gray-500 mb-2">
      {{ subData ? subData.name : null }}
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
      class="p-2 font-bold bg-red-500 text-white text-center w-full mb-4"
      v-if="error"
    >
      {{ error }}
    </p>

    <!-- Custom progress bar -->
    <div class="h-2 rounded-full bg-gray-400 max-w-sm mb-2 mx-auto">
      <div
        class="h-2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500"
        :style="{ width: width }"
      ></div>
    </div>
    <p class="text-center text-gray-500 text-sm font-medium mb-8">
      {{ completed }} /
      {{ subData ? subData.components.length * 42 : null }} papers completed
    </p>

    <div class="mx-auto max-w-sm grid grid-cols-1 gap-4 mb-8" v-if="subData">
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
</template>

<script setup>
import { doc, getDoc, runTransaction } from "firebase/firestore";
import { db } from "../firebase/config";
import { useStore } from "vuex";
import { ref, watchEffect, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
// list of papers
import papers from "../firebase/papers.json";
// icons
import Check from "../components/icons/Check.vue";
import Cross from "../components/icons/Cross.vue";
import Cog from "../components/icons/Cog.vue";
import BackIcon from "../components/icons/Back.vue";

const route = useRoute();
const router = useRouter();
const id = route.params.id;
const store = useStore();
const subData = ref(null);
const error = ref("");

const stop = watchEffect(async () => {
  if (store.state.authIsReady) {
    if (store.state.user) {
      try {
        const docRef = doc(db, "users", store.state.user.uid, "subjects", id);
        let snap = await getDoc(docRef);

        if (!snap) {
          throw new Error("Couldn't fetch your data");
        }

        subData.value = snap.data();
        stop();
      } catch (err) {
        error.value = err;
      }
    } else {
      router.push("/auth/login");
    }
  }
});

const width = computed(() => {
  if (subData.value !== null) {
    return `${Math.round(
      (completed.value * 100) / (subData.value.components.length * 42)
    )}%`;
  }
  return "0%";
});

const completed = computed(() => {
  if (subData.value !== null) {
    let sum = 0;
    for (let comp of subData.value.components) {
      sum += subData.value.completed[comp] || 0;
    }
    return sum;
  }
  return 0;
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
    await runTransaction(db, async (transaction) => {
      const docRef = doc(db, "users", store.state.user.uid, "subjects", id);
      let dbSubData = await transaction.get(docRef);

      if (!dbSubData) {
        throw new Error("Unable to fetch data");
      }

      dbSubData = dbSubData.data();
      dbSubData.completedPapers.push(paper);

      if (dbSubData.completed[paper[5]]) {
        dbSubData.completed[paper[5]]++;
      } else {
        dbSubData.completed[paper[5]] = 1;
      }

      transaction.update(docRef, {
        completed: dbSubData.completed,
        completedPapers: dbSubData.completedPapers,
      });
    });
    subData.value.completedPapers.push(paper);

    if (subData.value.completed[paper[5]]) {
      subData.value.completed[paper[5]]++;
    } else {
      subData.value.completed[paper[5]] = 1;
    }
  } catch (err) {
    error.value = err;
  }
};

const unCompletePaper = async (paper) => {
  let index;
  try {
    await runTransaction(db, async (transaction) => {
      const docRef = doc(db, "users", store.state.user.uid, "subjects", id);
      let dbSubData = await transaction.get(docRef);

      if (!dbSubData) {
        throw new Error("Unable to fetch data");
      }

      dbSubData = dbSubData.data();
      index = dbSubData.completedPapers.indexOf(paper);
      dbSubData.completedPapers.splice(index, 1);

      if (dbSubData.completed[paper[5]]) {
        dbSubData.completed[paper[5]]--;
      } else {
        dbSubData.completed[paper[5]] = 1;
      }

      transaction.update(docRef, {
        completed: dbSubData.completed,
        completedPapers: dbSubData.completedPapers,
      });
    });

    subData.value.completedPapers.splice(index, 1);

    if (subData.value.completed[paper[5]]) {
      subData.value.completed[paper[5]]--;
    } else {
      subData.value.completed[paper[5]] = 1;
    }
  } catch (err) {
    error.value = err;
  }
};
</script>
