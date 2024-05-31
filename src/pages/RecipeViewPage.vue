<template>
  <b-container>
    <div v-if="recipe">
      <b-card class="mb-3">
        <b-card-header class="mb-3">
          <h1>{{ recipe.title }}</h1>
        </b-card-header>
        <b-card-img :src="recipe.image" alt="Recipe Image" class="center mb-3 rounded"></b-card-img>
        <b-card-body>
          <hr />
          <h5>Details:</h5>
          <p><b-icon icon="clock"></b-icon> Ready in {{ recipe.readyInMinutes }} minutes</p>
          <p><b-icon icon="heart"></b-icon> Likes: {{ recipe.aggregateLikes }} likes</p>
          <hr />
          <h5>Ingredients:</h5>
          <ul>
            <li v-for="(ingredient, index) in recipe.extendedIngredients" :key="index + '_' + ingredient.id">
              {{ ingredient.original }}
            </li>
          </ul>
          <div v-if="recipe._instructions.length > 0">
            <h5 >Instructions</h5>
          <hr />
          <ol>
            <li v-for="step in recipe._instructions" :key="step.number">
              {{ step.step }}
            </li>
          </ol>
          </div>
          
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
export default {
  data() {
    return {
      recipe: null
    };
  },
  async created() {
    try {
      let response;
      // response = this.$route.params.response;

      try {
        // response = await this.axios.get(
        //   this.$root.store.server_domain + "/recipes/" + this.$route.params.recipeId,
        //   {
        //     withCredentials: true
        //   }
        // );
        console.log(this.$route.params.recipeId)
        response = mockGetRecipeFullDetails(this.$route.params.recipeId);

        // console.log("response.status", response.status);
        if (response.status !== 200) this.$router.replace("/NotFound");
      } catch (error) {
        console.log("error.response.status", error.response.status);
        this.$router.replace("/NotFound");
        return;
      }

      let {
        analyzedInstructions,
        instructions,
        extendedIngredients,
        aggregateLikes,
        readyInMinutes,
        image,
        title
      } = response.data.recipe;

      let _instructions = analyzedInstructions
        .map((fstep) => {
          fstep.steps[0].step = fstep.name + fstep.steps[0].step;
          return fstep.steps;
        })
        .reduce((a, b) => [...a, ...b], []);

      let _recipe = {
        instructions,
        _instructions,
        analyzedInstructions,
        extendedIngredients,
        aggregateLikes,
        readyInMinutes,
        image,
        title
      };

      this.recipe = _recipe;
    } catch (error) {
      console.log(error);
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
/* .recipe-header{

} */
</style>
