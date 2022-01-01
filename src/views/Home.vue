<template>
  <button @click="writeDoc">Write papersList</button>
</template>

<script setup>
import papersList from "../firebase/papers.json";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/config";

const writeDoc = async () => {
  try {
    const docRef = doc(db, "public", "papersList");
    await setDoc(docRef, papersList);
    console.log("Success");
  } catch (err) {
    console.log(err);
  }
};
</script>
