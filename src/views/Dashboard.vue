<template>
  <div class="p-2" v-if="store.state.user">
    <div v-if="!fatalError">
      <div v-if="!loading">
        <!-- Page title -->
        <h1
          class="mt-2 mb-4 bg-gradient-to-br text-transparent from-violet-700 to-fuchsia-500 bg-clip-text text-3xl font-bold text-center"
        >
          Your Subjects
        </h1>
        <!-- Navigation -->
        <div class="mx-auto flex w-24 justify-evenly mb-8">
          <router-link to="/settings">
            <Cog />
          </router-link>
        </div>

        <!-- Subject list -->
        <div
          class="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8"
          v-if="userData.length !== 0"
        >
          <!-- Subject card -->
          <div
            class="rounded shadow-md border-t-4 border-violet-700 p-4 hover:shadow-lg hover:shadow-violet-300 cursor-default transition-all duration-300"
            v-for="subject in userData"
            :key="subject.code"
          >
            <p class="text-sm text-gray-500 text-center">
              {{ subject.code }}
            </p>

            <h1 class="text-center font-medium text-lg mb-4">
              <router-link :to="`/subject/${subject.code}`">
                <span
                  class="hover:underline decoration-violet-600 decoration-wavy"
                >
                  {{ subject.name }}
                </span>
              </router-link>
            </h1>

            <!-- Custom gradient progress bar -->
            <div class="h-2 rounded-full bg-gray-400 w-full mb-4">
              <div
                class="h-2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500"
                :style="{ width: subject.width }"
              ></div>
            </div>
            <p class="text-sm text-gray-500 text-center">
              {{ subject.completedCount }} /
              {{ subject.components.length * 42 }} papers completed
            </p>
          </div>
        </div>
        <div class="p-2" v-else>
          <p class="font-medium text-center text-gray-500">
            Looks like you don't have any subjects yet. Click the settings icon
            above to add some.
          </p>
        </div>
      </div>
      <div class="w-4/5 mx-auto h-96 flex items-center justify-center" v-else>
        <div
          class="rounded-full w-32 aspect-square animate-ping bg-violet-400"
        ></div>
      </div>
    </div>
    <div class="flex flex-col items-center p-2" v-else>
      <p
        class="p-2 font-bold bg-red-400 rounded-md mx-auto max-w-sm text-white text-center w-full mb-4"
      >
        If you're seeing this error, wRight had some problems fetching your
        data. Please try again later.
      </p>
    </div>
  </div>
</template>

<script setup>
import { db } from "../firebase/config";
import { collection, getDocsFromServer, query } from "firebase/firestore";
import { useStore } from "vuex";
import { ref, watchEffect } from "vue";
import Cog from "../components/icons/Cog.vue";
import { useRouter } from "vue-router";

const store = useStore();
const userData = ref([]);
const router = useRouter();
const fatalError = ref("");
const loading = ref(true);

const stop = watchEffect(async () => {
  if (store.state.authIsReady) {
    if (store.state.user) {
      try {
        // Fetch all subjects
        const subCollection = collection(
          db,
          "users",
          store.state.user.uid,
          "subjects"
        );
        let snap = await getDocsFromServer(query(subCollection));

        snap.forEach((sub) => {
          let subId = sub.id;
          let data = sub.data();
          let sum = 0;
          for (let comp of data.components) {
            sum += data.completed[comp] || 0;
          }
          userData.value.push({
            code: subId,
            completedCount: sum,
            ...data,
            width: `${Math.round(
              (sum * 100) / (data.components.length * 42)
            )}%`,
          });
        });
        loading.value = false;
        // stop watcheffect
        stop();
      } catch (err) {
        fatalError.value = err;
      }
    } else {
      router.push("/auth/login");
    }
  }
});
</script>
