<template>
  <form
    class="sm:mx-auto mx-4 mt-4 mb-8 max-w-sm rounded-md p-4 bg-gradient-to-br from-violet-700 to-fuchsia-700"
  >
    <h1 class="text-center font-bold text-3xl text-white mb-4">Sign Up</h1>

    <!-- Email field -->
    <div class="mb-4">
      <p class="text-white font-medium mb-2">Email</p>
      <input
        class="p-4 rounded-md outline-none w-full"
        type="text"
        v-model="email"
        autocomplete="email"
      />
    </div>

    <!-- Password field -->
    <div class="mb-4">
      <p class="text-white font-medium mb-2">Password</p>
      <input
        class="p-4 rounded-md outline-none w-full"
        type="password"
        v-model="password"
        autocomplete="new-password"
      />
    </div>

    <!-- First subject field -->
    <div class="flex flex-col items-center mb-8" v-if="subjects">
      <p class="text-white font-medium mb-2 w-full text-left">Subjects</p>
      <p class="text-sm mb-2 text-white">
        Choose a subject to get started. You can always add more later.
      </p>
      <input
        class="p-4 rounded-md outline-none w-full"
        list="subjects"
        name="firstSub"
        id="firstSubt"
        v-model="firstSub"
      />

      <datalist id="subjects">
        <option v-for="subject in subjects" :value="subject"></option>
      </datalist>

      {{ firstSub }}
    </div>

    <button
      class="p-2 mb-4 bg-white text-purple-600 font-medium text-lg rounded w-full"
      type="submit"
      @click.prevent="handleSignUp"
      :disabled="loading || dbError"
    >
      Get started
    </button>

    <p
      class="bg-red-500 rounded p-1 text-sm text-white font-medium text-center"
      v-if="error"
    >
      {{ error }}
    </p>
  </form>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/config";

const email = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");
const dbError = ref(null);
const firstSub = ref("");
let subjects = ref([]);

const store = useStore();
const router = useRouter();

onMounted(async () => {
  try {
    let snap = await getDoc(doc(db, "public", "subjectsList"));

    if (!(snap && snap.data())) {
      throw new Error("Couldn't fetch data");
    }

    snap = snap.data();

    for (let sub of Object.keys(snap)) {
      subjects.value.push(`${sub}/${snap[sub].name}`);
    }
  } catch (err) {
    dbError.value = err;
  }
});

const handleSignUp = async () => {
  try {
    loading.value = true;
    await store.dispatch("signup", {
      email: email.value,
      password: password.value,
      firstSub: firstSub.value,
    });
    router.push({ name: "Dashboard" });
  } catch (err) {
    if (err.code === "unavailable") {
      error.value = "No internet connection.";
    } else {
      error.value = err.message;
    }
    loading.value = false;
  }
};
</script>
