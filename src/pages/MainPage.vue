<template>
  <div class="container">
    <h1 class="title">Main Page</h1>
    <Spinner :loading="loading" />
    <RecipePreviewList 
      v-if="!loading" 
      title="Random Recipes:" 
      routeName="recipe" 
      :recipes="recipes" 
      class="RandomRecipes center mt-3" 
    />
    <router-link v-if="!$root.store.username" to="/login" tag="button">You need to Login to view this</router-link>
    <!-- {{ !$root.store.username }} -->
    <RecipePreviewList 
      v-if="!loading" 
      title="Last Viewed Recipes:" 
      routeName="recipe"
      :recipes="last_viewed_recipes"
      :class="{
        RandomRecipes: true,
        blur: !$root.store.username,
        center: true
      }" 
      :disabled="true"
    />
  </div>
</template>

<script>
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
      last_viewed_recipes: [],
      loading: true // Loading state
    };
  },
  async mounted() {
    try {
      const amountToFetch = 6;
      const response = await this.axios.get(`${this.$root.store.server_domain}/recipes/randomRecipes`, {
        params: {
          number: amountToFetch
        },
      });
      // const response = mockGetRecipesPreview(amountToFetch);
      const recipes = response.data;

      this.recipes = recipes;

      if (!this.$root.store.username){
        this.last_viewed_recipes = recipes;
      } else {
        this.last_viewed_recipes = JSON.parse(sessionStorage.getItem('lastViewedRecipes')) || [];
      }
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
