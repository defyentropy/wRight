<template>
  <button
    class="bg-white shadow-md hover:shadow-lg text-violet-700 p-2 cursor-pointer font-semibold text-lg"
  >
    {{ text }}
  </button>
</template>

<script setup>
import { toRefs } from "vue";

const props = defineProps(["text"]);
const { text } = toRefs(props);
</script>
