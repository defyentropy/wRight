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
    <div class="mb-8">
      <p class="text-white font-medium mb-2">Password</p>
      <input
        class="p-4 rounded-md outline-none w-full"
        type="password"
        v-model="password"
        autocomplete="new-password"
      />
    </div>

    <button
      class="p-2 mb-8 bg-white text-purple-600 font-medium text-lg rounded w-full"
      type="submit"
      @click.prevent="handleSignUp"
      :disabled="loading"
    >
      Get started
    </button>

    <p class="font-medium text-white text-center mb-8">
      Already have an account?
      <span class="underline hover:decoration-wavy"
        ><router-link to="/auth/login">Login</router-link></span
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
const loading = ref(false);
const error = ref("");

const store = useStore();
const router = useRouter();

const handleSignUp = async () => {
  try {
    loading.value = true;
    await store.dispatch("signup", {
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
