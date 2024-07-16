<template>
  <b-container>
    <h3>
      {{ title }}
      <slot></slot>
    </h3>
    <b-row>
      <b-col v-for="r in recipes" :key="r.id" cols="12" md="6" lg="4" class="mb-4">
        <RecipePreview :recipe="r" :routeName="routeName" />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import RecipePreview from "./RecipePreview.vue";
import { mockGetRecipesPreview } from "../services/recipes.js";
export default {
  name: "RecipePreviewList",
  components: {
    RecipePreview
  },
  props: {
    title: {
      type: String,
      required: true
    },
    recipes: {
      type: Array,
      required: true
    },
    routeName: {
      type: String,
      required: true
    }
  },
  // data() {
  //   return {
  //     fetchedRecipes: []
  //   };
  // },
  // computed: {
  //   displayRecipes() {
  //     return this.recipes !== null ? this.recipes : this.fetchedRecipes;
  //   }
  // },
  // mounted() {
  //   if (this.recipes === null) {
  //     this.updateRecipes();
  //   }
  // },
  // methods: {
    // async updateRecipes() {
    //   try {
        // const amountToFetch = 6;
        // const response = await this.axios.get(`${this.$root.store.server_domain}/recipes/randomRecipes`, {
        //   params: {
        //     number: amountToFetch
        //   },
        // });
    //     // const response = mockGetRecipesPreview(amountToFetch);
    //     // TODO add recipes
    //     const recipes = response.data;

    //     this.fetchedRecipes = recipes;
    //   } catch (error) {
    //     console.log('Error fetching recipes:', error);
    //   }
    // }
  // }
};
</script>

<style lang="scss" scoped>
.container {
  min-height: 400px;
}
</style>
