import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Dashboard from "../views/Dashboard.vue";
import Subject from "../views/Subject.vue";
import SubjectSettings from "../views/SubjectSettings.vue";
import Settings from "../views/Settings.vue";
import Login from "../views/auth/Login.vue";
import { getUser } from "../store";

const routes = [
  { path: "/", name: "Home", component: Home, meta: { requiresNoAuth: true } },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    meta: { requiresAuth: true },
  },
  {
    path: "/auth/login",
    name: "Login",
    component: Login,
    meta: { requiresNoAuth: true },
  },
  {
    path: "/auth/signup",
    redirect: "/auth/login",
  },
  {
    path: "/subject/:id",
    name: "Subject",
    component: Subject,
    meta: { requiresAuth: true },
  },
  {
    path: "/subject/:id/settings",
    name: "SubjectSettings",
    component: SubjectSettings,
    meta: { requiresAuth: true },
  },
  {
    path: "/settings",
    name: "Settings",
    component: Settings,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const user = await getUser();
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const requiresNoAuth = to.matched.some(
    (record) => record.meta.requiresNoAuth
  );

  if (requiresAuth) {
    if (user) {
      next();
    } else {
      next("/auth/login");
    }
  } else if (requiresNoAuth) {
    if (user) {
      next("/dashboard");
    } else {
      next();
    }
  }
});

export default router;
