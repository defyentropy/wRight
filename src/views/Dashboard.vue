<template>
  <!-- Display only if there is a logged in user -->
  <div class="p-2" v-if="store.state.user">
    <!-- Page title -->
    <h1
      class="mt-2 mb-4 bg-gradient-to-br text-transparent from-violet-700 to-fuchsia-500 bg-clip-text text-3xl font-bold text-center"
    >
      Dashboard
    </h1>
    <!-- Navigation -->
    <div class="mx-auto flex w-24 justify-evenly mb-4">
      <router-link to="/settings">
        <Cog />
      </router-link>
    </div>

    <!-- Subject list -->
    <div
      class="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8"
      v-if="userData"
    >
      <!-- Subject card -->
      <div
        class="rounded shadow-md border-t-4 border-violet-700 p-4 hover:shadow-lg hover:shadow-violet-300 cursor-default transition-all duration-300"
        v-for="subject in Object.keys(userData)"
        :key="userData[subject].code"
      >
        <p class="text-sm text-gray-500 text-center">
          {{ userData[subject].code }}
        </p>

        <h1 class="text-center font-medium text-lg mb-4">
          <router-link :to="`/subject/${subject}`">
            <span class="hover:underline decoration-violet-600 decoration-wavy">
              {{ userData[subject].name }}
            </span>
          </router-link>
        </h1>

        <!-- Custom gradient progress bar -->
        <div class="h-2 rounded-full bg-gray-400 w-full mb-4">
          <div
            class="h-2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500"
            :style="{ width: widths[subject] }"
          ></div>
        </div>
        <p class="text-sm text-gray-500 text-center">
          {{ completed[subject] }} /
          {{ userData[subject].components.length * 42 }} papers completed
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { db } from "../firebase/config";
import { collection, getDocs, query } from "firebase/firestore";
import { useStore } from "vuex";
import { ref, watchEffect, computed } from "vue";
import Cog from "../components/icons/Cog.vue";
import { useRouter } from "vue-router";

const store = useStore();
const userData = ref({});
const widths = {};
const router = useRouter();

// Find number of valid papers completed for each subject
const completed = computed(() => {
  let sums = {};
  for (let subject of Object.keys(userData.value)) {
    let sum = 0;
    for (let comp of userData.value[subject].components) {
      sum += userData.value[subject].completed[comp] || 0;
    }
    sums[subject] = sum;
  }
  return sums;
});

const stop = watchEffect(async () => {
  if (store.state.authIsReady) {
    if (store.state.user) {
      // Fetch all subjects
      const subCollection = collection(
        db,
        "users",
        store.state.user.uid,
        "subjects"
      );
      let snap = await getDocs(query(subCollection));
      snap.forEach((sub) => {
        userData.value[sub.id] = sub.data();
      });
      // Assign widths
      for (let sub of Object.keys(userData.value)) {
        widths[sub] = `${Math.round(
          (completed.value[sub] * 100) /
            (userData.value[sub].components.length * 42)
        )}%`;
      }
      // stop watcheffect
      stop();
    } else {
      router.push("/auth/login");
    }
  }
});
</script>
