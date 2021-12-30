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

    <hr class="text-white mt-8 mb-4" />

    <!-- Subjects field -->
    <div class="mb-16">
      <h2 class="text-white font-bold text-center mb-2 text-2xl">
        Chosen subjects
      </h2>
      <ul class="flex flex-col items-center mb-8">
        <li class="m-1 text-white" v-for="subject in subjectChoices">
          {{ subject }}
        </li>
      </ul>

      <p class="text-sm text-white text-center mb-2 w-60 mx-auto">
        Search for your subjects below and click Add to add it to your choices
      </p>
      <input
        class="p-2 rounded block mx-auto mb-4"
        type="text"
        list="subjects"
        v-model="toBeAdded"
      />
      <button
        class="border-2 border-white transition-all p-2 rounded text-white cursor-pointer hover:shadow-lg block mx-auto font-medium w-24"
        @click.prevent="addSubject"
      >
        Add
      </button>
      <datalist id="subjects">
        <option v-for="subject in subjects" :value="subject"></option>
      </datalist>
    </div>

    <button
      class="p-2 mb-4 bg-white text-purple-600 font-medium text-lg rounded w-full"
      type="submit"
      @click.prevent="handleSignUp"
      :disabled="loading"
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
import { subjectsList as subjects } from "../../firebase/subjectsList.json";

const email = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");
const subjectChoices = ref([]);
const toBeAdded = ref("");

const store = useStore();
const router = useRouter();

const handleSignUp = async () => {
  try {
    loading.value = true;
    await store.dispatch("signup", {
      email: email.value,
      password: password.value,
      subjects: subjectChoices.value,
    });
    router.push({ name: "Dashboard" });
  } catch (err) {
    error.value = err.message;
    loading.value = false;
  }
};

const addSubject = () => {
  if (
    toBeAdded.value &&
    !subjectChoices.value.includes(toBeAdded.value) &&
    subjects.includes(toBeAdded.value)
  ) {
    subjectChoices.value.push(toBeAdded.value);
    toBeAdded.value = "";
  }
};
</script>
