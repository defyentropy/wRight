<template>
  <form
    class="mx-auto mt-4 max-w-sm rounded-md p-4 bg-gradient-to-br from-violet-700 to-fuchsia-700"
  >
    <h1 class="text-center font-bold text-3xl text-white mb-4">Sign Up</h1>

    <!-- Email field -->
    <div class="mb-4">
      <p class="text-white font-medium mb-2">Email</p>
      <input
        class="p-4 rounded-md outline-none w-full"
        type="text"
        v-model="email"
      />
    </div>

    <!-- Password field -->
    <div class="mb-4">
      <p class="text-white font-medium mb-2">Password</p>
      <input
        class="p-4 rounded-md outline-none w-full"
        type="password"
        v-model="password"
      />
    </div>

    <hr class="text-white mt-8 mb-4" />

    <!-- Grade field -->
    <div class="mb-8">
      <p class="text-white font-medium mb-2">Grade</p>
      <input
        class="p-4 rounded-md outline-none w-full"
        list="grades"
        type="text"
        v-model="grade"
      />

      <datalist id="grades">
        <option value="IGCSE"></option>
        <option value="AS Levels"></option>
        <option value="A Levels"></option>
      </datalist>
    </div>

    <button
      class="p-2 mb-4 bg-white text-purple-600 font-medium text-lg rounded w-full"
      type="submit"
      @click.prevent="handleSignUp"
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
import { ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");
const grade = ref("");
const error = ref("");

const store = useStore();
const router = useRouter();

const handleSignUp = async () => {
  try {
    await store.dispatch("signup", {
      email: email.value,
      password: password.value,
      grade: grade.value,
    });
    router.push({ name: "Dashboard" });
  } catch (err) {
    error.value = err.message;
  }
};
</script>
