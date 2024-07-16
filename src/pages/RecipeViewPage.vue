<template>
  <b-container>
    <Spinner :loading="loading" />
    <div v-if="!loading && recipe">
      <b-card class="mb-3">
        <b-card-header class="mb-3">
          <h1>{{ recipe.title }}</h1>
        </b-card-header>
        <b-card-img v-if="recipe.image" :src="recipe.image" alt="Recipe Image" class="center mb-3 rounded"></b-card-img>
        <b-card-body>
          <b-button
            v-if="$root.store.username && this.routeName !== 'lafamiliaRecipe' && this.routeName !== 'userRecipe'"
            class="center" @click="toggleFavorite" :variant="isFavorite ? 'danger' : 'primary'">
            <b-icon :icon="isFavorite ? 'heart-fill' : 'heart'"></b-icon>
            {{ isFavorite ? 'Unfavorite' : 'Mark as Favorite' }}
          </b-button>

          <div v-if="recipe.owner">
            <h5>Owner</h5>
            <ul>
              <li>{{ recipe.owner }}</li>
            </ul>
            <hr />
          </div>

          <div v-if="recipe.whenToPrepare">
            <h5>When to prepare</h5>
            <ul>
              <li>{{ recipe.whenToPrepare }}</li>
            </ul>
            <hr />
          </div>

          <h5>Details</h5>
          <ul>
            <li>Ready in {{ recipe.readyInMinutes }} minutes <b-icon icon="clock"></b-icon></li>
            <li v-if="recipe.likes"><b-icon icon="heart"></b-icon> Likes: {{ recipe.aggregateLikes }} likes</li>
            <li v-if="recipe.servings"> Servings: {{ recipe.servings }} servings</li>
            <li v-if="recipe.glutenFree == 1">Gluten</li>
            <li v-if="recipe.vegan == 1">Vegan</li>
            <li v-if="recipe.vegetarian == 1">Vegetarian</li>
          </ul>
          <hr />

          <div v-if="recipe.extendedIngredients && recipe.extendedIngredients.length > 0">
            <h5>Ingredients</h5>
            <ul>
              <li v-for="(ingredient, index) in recipe.extendedIngredients" :key="index + '_' + ingredient.id">
                {{ ingredient.original }}
              </li>
            </ul>
            <hr />
          </div>

          <div v-if="recipe._instructions && recipe._instructions.length > 0">
            <h5>Instructions</h5>
            <ol>
              <li v-for="step in recipe._instructions" :key="step.number">
                {{ step.step }}
              </li>
            </ol>
            <hr />
          </div>

          <b-button
            v-if="$root.store.username && (this.routeName === 'lafamiliaRecipe' || this.routeName === 'userRecipe')"
            class="center mt-3" @click="deleteRecipe" variant="danger">
            <b-icon icon="trash"></b-icon>
            Delete Recipe
          </b-button>
        </b-card-body>
      </b-card>
    </div>
    <div v-else>
      <p>Loading...</p>
    </div>
  </b-container>
</template>

<script>
import { mockGetRecipeFullDetails } from "../services/recipes.js";
import Spinner from "../components/Spinner.vue"; // Import the Spinner component

export default {
  components: {
    Spinner // Register the Spinner component
  },
  data() {
    return {
      recipe: null,
      isFavorite: false,
      loading: true // Loading state
    };
  },
  async created() {
    try {
      let response;
      this.routeName = this.$route.params.routeName;
      if (this.routeName === "lafamiliaRecipe") {
        response = await this.axios.get(`${this.$root.store.server_domain}/users/familyRecipes/${this.$route.params.recipe.recipe_id}`, { withCredentials: true });
      } else if (this.routeName === "userRecipe") {
        response = await this.axios.get(`${this.$root.store.server_domain}/users/userRecipes/${this.$route.params.recipe.recipe_id}`, { withCredentials: true });
      } else {
        response = await this.axios.get(
          this.$root.store.server_domain + "/recipes/" + this.$route.params.recipe.id,
          {
            withCredentials: true
          }
        );
        if (response.status === 200) { this.saveRecipeToSessionStorage(this.$route.params.recipe); }
      }
      if (response.status !== 200) { this.$router.replace("/NotFound") };

      let {
        glutenFree,
        vegan,
        vegetarian,
        analyzedInstructions,
        instructions,
        extendedIngredients,
        owner,
        whenToPrepare,
        aggregateLikes,
        readyInMinutes,
        image,
        title,
        servings
      } = response.data;

      let _instructions = [];
      if (analyzedInstructions && analyzedInstructions.length > 0) {
        if (this.routeName === 'recipe') {
          _instructions = analyzedInstructions
            .map((fstep) => {
              fstep.steps[0].step = fstep.name + fstep.steps[0].step;
              return fstep.steps;
            })
            .reduce((a, b) => [...a, ...b], []);
        } else {
          _instructions = analyzedInstructions;
        }
      }

      let _recipe = {
        instructions,
        _instructions,
        analyzedInstructions,
        extendedIngredients,
        aggregateLikes,
        readyInMinutes,
        image,
        title,
        glutenFree,
        vegan,
        vegetarian,
        owner,
        whenToPrepare,
        servings
      };
      this.recipe = _recipe;

      // Check if the recipe is a favorite
      if (this.routeName !== "lafamiliaRecipe" && this.routeName !== "userRecipe") {
        this.isFavorite = await this.checkIfFavorite(this.$route.params.recipe.id);
      }
    } catch (error) {
      console.log(error);
      this.$router.replace("/NotFound");
    } finally {
      this.loading = false; // Stop loading once the data is fetched
    }
  },
  methods: {
    saveRecipeToSessionStorage(recipe) {
      let viewedRecipes = JSON.parse(sessionStorage.getItem('lastViewedRecipes')) || [];
      viewedRecipes = viewedRecipes.filter(r => r.id !== recipe.id);
      viewedRecipes.unshift(recipe);
      if (viewedRecipes.length > 6) {
        viewedRecipes = viewedRecipes.slice(0, 6);
      }
      sessionStorage.setItem('lastViewedRecipes', JSON.stringify(viewedRecipes));
    },
    async checkIfFavorite(recipeId) {
      try {
        const response = await this.axios.get(
          `${this.$root.store.server_domain}/users/favorites/${recipeId}`,
          {
            withCredentials: true
          }
        );
        return response.data;
      } catch (error) {
        console.error("Error checking favorite status:", error);
        return false;
      }
    },
    async toggleFavorite() {
      const recipeId = this.$route.params.recipe.id;
      try {
        if (this.isFavorite) {
          // Unmark as favorite
          await this.axios.delete(
            `${this.$root.store.server_domain}/users/favorites/${recipeId}`,
            {
              withCredentials: true
            }
          );
        } else {
          // Mark as favorite
          await this.axios.post(
            `${this.$root.store.server_domain}/users/favorites/${recipeId}`,
            { recipeId },
            {
              withCredentials: true
            }
          );
        }
        this.isFavorite = !this.isFavorite;
      } catch (error) {
        console.error("Error toggling favorite status:", error);
      }
    },
    async deleteRecipe() {
      try {
        let route;
        let redirect;
        if (this.routeName === "lafamiliaRecipe") {
          route = 'familyRecipes';
          redirect = '/lafamilia';
        } else if (this.routeName === "userRecipe") {
          route = 'userRecipes';
          redirect = '/private';
        } else {
          return;
        }

        const response = await this.axios.delete(
          `${this.$root.store.server_domain}/users/${route}/${this.$route.params.recipe.recipe_id}`,
          {
            withCredentials: true
          }
        );
        if (response.status === 200) {
          setTimeout(() => {
            this.$router.push(redirect);
          }, 150);
        }
      } catch (error) {
        console.error("Error deleting recipe:", error);
      }
    }
  }
};
</script>

<style scoped>
.wrapper {
  display: flex;
}

.wrapped {
  width: 50%;
}

.center {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 50%;
}
</style>
