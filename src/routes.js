import Main from "./pages/MainPage";
import NotFound from "./pages/NotFoundPage";

const routes = [
  {
    path: "/",
    name: "main",
    component: Main,
  },
  {
    path: "/register",
    name: "register",
    component: () => import("./pages/RegisterPage"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("./pages/LoginPage"),
  },
  {
    path: "/about",
    name: "about",
    component: () => import("./pages/AboutPage"),
  },
  {
    path: "/search",
    name: "search",
    component: () => import("./pages/SearchPage"),
  },
  {
    path: "/favorites",
    name: "favorites",
    component: () => import("./pages/FavoritesPage"),
  },
  {
    path: "/private",
    name: "private",
    component: () => import("./pages/PrivatePage"),
  },
  {
    path: "/lafamilia",
    name: "lafamilia",
    component: () => import("./pages/LafamiliaPage"),
  },
  {
    path: "/recipe/:recipeId",
    name: "recipe",
    component: () => import("./pages/RecipeViewPage"),
  },
  {
    path: "/lafamilia/:recipeId",
    name: "lafamiliaRecipe",
    component: () => import("./pages/RecipeViewPage"),
  },
  {
    path: "/user/:recipeId",
    name: "userRecipe",
    component: () => import("./pages/RecipeViewPage"),
  },
  {
    path: "/lafamilia/create",
    name: "lafamiliaCreate",
    component: () => import("./pages/LafamiliaCreatePage"),
  },
  {
    path: "/recipe/create",
    name: "recipeCreate",
    component: () => import("./pages/RecipeCreatePage"),
  },
  {
    path: "*",
    name: "notFound",
    component: NotFound,
  },
];

export default routes;
