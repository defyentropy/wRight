<template>
  <h1
    class="mt-2 mb-4 bg-gradient-to-br text-transparent from-violet-700 to-fuchsia-500 bg-clip-text text-3xl font-bold text-center"
  >
    Dashboard
  </h1>

  <div
    class="p-4 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
  >
    <div
      class="rounded shadow-md border-t-4 border-violet-700 p-4 hover:shadow-lg hover:shadow-violet-300 cursor-default transition-all"
      v-for="subject in docSnap.subjectsList"
      :key="subject.code"
    >
      <p class="text-sm text-gray-500 text-center">{{ subject.code }}</p>

      <h1 class="text-center font-medium text-lg mb-4">
        <router-link :to="`/subject/${subject.code}`">
          <span class="hover:underline decoration-violet-600 decoration-wavy">
            {{ subject.name }}
          </span>
        </router-link>
      </h1>

      <div class="h-2 rounded-full bg-gray-400 w-full mb-4">
        <div
          class="h-2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500"
          :style="{ width: widths[subject.code] }"
        ></div>
      </div>
      <p class="text-sm text-gray-500 text-center">
        {{ subject.completed }} / 35 papers completed
      </p>
    </div>
  </div>
</template>

<script setup>
// import { db } from "../firebase/config";
// import { doc, getDoc } from "firebase/firestore";
// import { useStore } from "vuex";
// import { ref, watchEffect } from "vue";

// const store = useStore();
// const docSnap = ref("");

// const stop = watchEffect(async () => {
//   if (store.state.authIsReady) {
//     const docRef = doc(db, "users", store.state.user.uid);
//     let snap = await getDoc(docRef);
//     docSnap.value = snap.data();
//     stop();
//   }
// });

const docSnap = {
  subjectsList: [
    {
      code: "9709",
      name: "Mathematics",
      completed: 20,
    },
    {
      code: "9701",
      name: "Chemistry",
      completed: 12,
    },
    {
      code: "9702",
      name: "Physics",
      completed: 17,
    },
    {
      code: "9231",
      name: "Mathematics - Further",
      completed: 6,
    },
    {
      code: "9718",
      name: "Computer Science",
      completed: 11,
    },
    {
      code: "8021",
      name: "English General Paper",
      completed: 8,
    },
  ],
};

const widths = {};
docSnap.subjectsList.forEach((subject) => {
  widths[subject.code] = `${Math.round((subject.completed / 35) * 100)}%`;
});
</script>
