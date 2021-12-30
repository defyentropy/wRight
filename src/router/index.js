import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Dashboard from "../views/Dashboard.vue";
import Subject from "../views/Subject.vue";
import SubjectSettings from "../views/SubjectSettings.vue";
import Settings from "../views/Settings.vue";
import Login from "../views/auth/Login.vue";
import Signup from "../views/auth/Signup.vue";

const routes = [
  { path: "/", name: "Home", component: Home },
  { path: "/dashboard", name: "Dashboard", component: Dashboard },
  { path: "/auth/login", name: "Login", component: Login },
  { path: "/auth/signup", name: "Signup", component: Signup },
  { path: "/subject/:id", name: "Subject", component: Subject },
  {
    path: "/subject/:id/settings",
    name: "SubjectSettings",
    component: SubjectSettings,
  },
  { path: "/settings", name: "Settings", component: Settings },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
