<template>
  <b-container>
    <h3>Recipe Search</h3>
    <b-form @submit.prevent="searchRecipes">
      <b-row>
        <b-col cols="10" md="11">
          <b-input-group>
            <b-form-input
              v-model="searchQuery"
              placeholder="Search for recipes..."
            ></b-form-input>
          </b-input-group>
        </b-col>
        <b-col cols="2" md="1">
          <b-button type="submit" variant="primary">Search</b-button>
        </b-col>
      </b-row>
      <b-row class="mt-3">
        <b-col>
          <b-form-group label="Number:">
            <b-form-select v-model="number" :options="resultsOptions"></b-form-select>
          </b-form-group>
        </b-col>
        <b-col>
          <b-form-group label="Cuisine:">
            <b-form-select v-model="selectedCuisine" :options="cuisineOptions"></b-form-select>
          </b-form-group>
        </b-col>
        <b-col>
          <b-form-group label="Diet:">
            <b-form-select v-model="selectedDiet" :options="dietOptions"></b-form-select>
          </b-form-group>
        </b-col>
        <b-col>
          <b-form-group label="Intolerance:">
            <b-form-select v-model="selectedIntolerance" :options="intoleranceOptions"></b-form-select>
          </b-form-group>
        </b-col>
      </b-row>
    </b-form>
    <div class="mt-3">
      <b-row>
        <b-col cols="6">
          <b-form-group label="Sort by:">
            <b-form-select v-model="sortBy" :options="sortOptions"></b-form-select>
          </b-form-group>
        </b-col>
      </b-row>
      <Spinner :loading="loading" />
      <RecipePreviewList v-if="!loading && recipes.length > 0" :recipes="recipes" title="Search Results:" routeName="recipe" />
      <b-alert v-else-if="!loading && searchPerformed && recipes.length === 0" variant="warning">No results found</b-alert>
    </div>
  </b-container>
</template>

<script>
import RecipePreviewList from '../components/RecipePreviewList';
import Spinner from "../components/Spinner.vue"; // Import the Spinner component
import { mockGetRecipesPreview } from '../services/recipes.js';

export default {
  components: {
    RecipePreviewList,
    Spinner // Register the Spinner component
  },
  data() {
    return {
      searchQuery: '',
      number: 5,
      selectedCuisine: null,
      selectedDiet: null,
      selectedIntolerance: null,
      sortBy: null,
      recipes: [],
      searchPerformed: false,
      loading: false, // Loading state
      resultsOptions: [
        { value: 5, text: '5' },
        { value: 10, text: '10' },
        { value: 15, text: '15' }
      ],
      cuisineOptions: [
        { value: null, text: 'No Filter' },
        { value: 'italian', text: 'Italian' },
        { value: 'chinese', text: 'Chinese' }
      ],
      dietOptions: [
        { value: null, text: 'No Filter' },
        { value: 'vegetarian', text: 'Vegetarian' },
        { value: 'vegan', text: 'Vegan' }
      ],
      intoleranceOptions: [
        { value: null, text: 'No Filter' },
        { value: 'dairy', text: 'Dairy' },
        { value: 'gluten', text: 'Gluten' }
      ],
      sortOptions: [
        { value: null, text: 'No Sort' },
        { value: 'time', text: 'Preparation Time' },
        { value: 'popularity', text: 'Popularity' }
      ]
    };
  },
  methods: {
    async searchRecipes() {
      this.loading = true; // Start loading
      this.searchPerformed = true;

      try {
        const response = await this.axios.post(`${this.$root.store.server_domain}/recipes/search`, {
          params: {
            query: this.searchQuery,
            number: this.number,
            cuisine: this.selectedCuisine,
            diet: this.selectedDiet,
            intolerance: this.selectedIntolerance,
            sort: this.sortBy
          }
        });
        console.log(response)
        let recipes = response.data;
        this.recipes = recipes;
      } catch (error) {
        console.error("Error searching recipes:", error);
      } finally {
        this.loading = false; // Stop loading once the data is fetched
      }
    }
  }
};
</script>
