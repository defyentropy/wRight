<template>
  <form
    class="mx-4 sm:mx-auto mt-4 max-w-sm rounded-md p-4 bg-gradient-to-br from-violet-700 to-fuchsia-700"
  >
    <h1 class="text-center font-bold text-3xl text-white mb-4">Login</h1>

    <!-- Email field -->
    <div class="mb-4">
      <p class="text-white font-medium mb-2">Email</p>
      <input
        class="p-4 rounded-md outline-none w-full"
        type="text"
        v-model="email"
        autocomplete="username"
      />
    </div>

    <!-- Password field -->
    <div class="mb-8">
      <p class="text-white font-medium mb-2">Password</p>
      <input
        class="p-4 rounded-md outline-none w-full"
        type="password"
        autocomplete="current-password"
        v-model="password"
      />
    </div>

    <button
      class="disabled:text-gray-500 disabled:cursor-default p-2 mb-8 bg-white text-purple-600 font-medium text-lg rounded w-full"
      type="submit"
      @click.prevent="handleLogin"
      :disabled="loading"
    >
      Login
    </button>

    <p class="font-medium mb-8 text-white text-center">
      Don't have an account?
      <span class="underline hover:decoration-wavy"
        ><router-link to="/auth/signup">Sign up</router-link></span
      >
    </p>

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
const error = ref("");
const loading = ref(false);

const store = useStore();
const router = useRouter();

const handleLogin = async () => {
  try {
    loading.value = true;
    error.value = "";
    await store.dispatch("login", {
      email: email.value,
      password: password.value,
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
