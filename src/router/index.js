import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Editor from "../views/Editor.vue";
import Diagram from "../views/Diagram.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/editor/:encoded?",
    name: "Editor",
    component: Editor
  },
  {
    path: "/diagram",
    name: "Diagram",
    component: Diagram
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
