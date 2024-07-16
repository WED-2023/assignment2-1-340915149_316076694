<template>
  <div class="container">
    <h1 class="title">Your LaFamilia Page</h1>
    <router-link v-if="!$root.store.username" to="/login" tag="button">You need to Login to view this</router-link>
    <Spinner :loading="loading" />
    <RecipePreviewList v-if="!loading" title="Your LaFamilia Recipes:" routeName="lafamiliaRecipe" :recipes="recipes" :class="{
      RandomRecipes: true,
      blur: !$root.store.username,
      center: true
    }" :disabled="true" />
  </div>
</template>

<script>
import { mockGetRecipesPreview } from "../services/recipes.js";
import RecipePreviewList from "../components/RecipePreviewList";
import Spinner from "../components/Spinner.vue"; // Import the Spinner component

export default {
  components: {
    RecipePreviewList,
    Spinner // Register the Spinner component
  },
  data() {
    return {
      recipes: [],
      loading: true // Loading state
    };
  },
  async mounted() {
    try {
      let recipes;
      if (!this.$root.store.username) {
        const amountToFetch = 6;
        const response = mockGetRecipesPreview(amountToFetch);
        recipes = response.data.recipes;
      } else {
        const response = await this.axios.get(`${this.$root.store.server_domain}/users/familyRecipes`, { withCredentials: true });
        recipes = response.data;
      }
      this.recipes = recipes;
    } catch (error) {
      console.log('Error fetching recipes:', error);
    } finally {
      this.loading = false; // Stop loading once the data is fetched
    }
  }
};
</script>

<style lang="scss" scoped>
.RandomRecipes {
  margin: 10px 0 10px;
}

.blur {
  -webkit-filter: blur(5px);
  filter: blur(2px);
}

::v-deep .blur .recipe-preview {
  pointer-events: none;
  cursor: default;
}
</style>
