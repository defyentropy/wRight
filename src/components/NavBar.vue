<template>
  <nav
    class="sticky top-0 border-b border-violet-700 p-2 shadow-lg flex items-center bg-white"
  >
    <div>
      <p
        class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-violet-700 to-fuchsia-500"
      >
        wRight
      </p>
    </div>

    <div class="ml-auto flex items-center" v-if="user">
      <div v-if="user.photoURL">
        <img :src="user.photoURL" alt="profile picture" />
      </div>
      <div v-else>
        <div
          class="rounded-full h-10 p-1 aspect-square bg-violet-700 text-white font-bold text-xl flex justify-center items-center"
        >
          {{ user.email[0].toUpperCase() }}
        </div>
      </div>

      <button
        class="bg-white shadow-md hover:shadow-lg text-violet-700 p-2 cursor-pointer font-semibold text-lg ml-4 mr-2"
        @click="handleLogout"
      >
        Log out
      </button>
    </div>
  </nav>
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";

const store = useStore();
const user = computed(() => store.state.user);

const handleLogout = () => {
  store.dispatch("logout");
};
</script>
