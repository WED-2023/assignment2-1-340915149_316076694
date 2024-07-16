<template>
  <div class="container">
    <h1 class="title mb-4">Create Recipe</h1>
    <b-form @submit.prevent="onSubmit">
      <b-form-group label="Title:" label-for="title">
        <b-form-input id="title" v-model="recipe.title" type="text" required></b-form-input>
        <b-form-invalid-feedback>Title is required</b-form-invalid-feedback>
      </b-form-group>

      <b-form-group label="Ready In Minutes:" label-for="readyInMinutes">
        <b-form-input id="readyInMinutes" v-model="recipe.readyInMinutes" type="number" required></b-form-input>
        <b-form-invalid-feedback>Ready in minutes is required</b-form-invalid-feedback>
      </b-form-group>

      <div class="form-row">
        <div class="col">
          <b-form-group label="Vegetarian:" label-for="vegetarian">
            <b-form-checkbox id="vegetarian" v-model="recipe.vegetarian"></b-form-checkbox>
          </b-form-group>
        </div>
        <div class="col">
          <b-form-group label="Vegan:" label-for="vegan">
            <b-form-checkbox id="vegan" v-model="recipe.vegan"></b-form-checkbox>
          </b-form-group>
        </div>
        <div class="col">
          <b-form-group label="Gluten Free:" label-for="glutenFree">
            <b-form-checkbox id="glutenFree" v-model="recipe.glutenFree"></b-form-checkbox>
          </b-form-group>
        </div>
      </div>

      <b-form-group label="Servings:" label-for="servings">
        <b-form-input id="servings" v-model="recipe.servings" type="number" required></b-form-input>
        <b-form-invalid-feedback>Servings is required</b-form-invalid-feedback>
      </b-form-group>

      <b-form-group label="Ingredients:">
        <ul class="list-group">
          <li v-for="(ingredient, index) in recipe.ingredients" :key="index" class="list-group-item">
            <div class="d-flex justify-content-between align-items-center">
              <b-form-input v-model="ingredient.name" type="text" :placeholder="'Ingredient ' + (index + 1)"
                required></b-form-input>
              <b-button v-if="index > 0" @click="removeIngredient(index)" variant="danger"
                class="ml-2">Remove</b-button>
            </div>
          </li>
        </ul>
        <b-button @click="addIngredient" variant="secondary" class="mt-2">Add One More</b-button>
      </b-form-group>

      <b-form-group label="Instructions:">
        <ul class="list-group">
          <li v-for="(instruction, index) in recipe.instructions" :key="index" class="list-group-item">
            <div class="d-flex justify-content-between align-items-center">
              <b-form-textarea v-model="instruction.step" rows="2" :placeholder="'Step ' + (index + 1)"
                required></b-form-textarea>
              <b-button v-if="index > 0" @click="removeInstruction(index)" variant="danger"
                class="ml-2">Remove</b-button>
            </div>
          </li>
        </ul>
        <b-button @click="addInstruction" variant="secondary" class="mt-2">Add One More</b-button>
      </b-form-group>

      <b-form-group label="Image URL:" label-for="image">
        <b-form-input id="image" v-model="recipe.image" type="text"></b-form-input>
        <b-form-invalid-feedback>Image URL is required</b-form-invalid-feedback>
      </b-form-group>

      <b-button type="submit" variant="primary" class="mx-auto w-100">
        Create Recipe
      </b-button>
    </b-form>

    <b-alert class="mt-2" v-if="form.submitError" variant="warning" dismissible show>
      Creation failed: {{ form.submitError }}
    </b-alert>
    <b-alert class="mt-2" v-if="form.submitSuccess" variant="success" dismissible show>
      Recipe was added successfully!
    </b-alert>
  </div>
</template>

<script>
export default {
  data() {
    return {
      recipe: {
        title: '',
        readyInMinutes: null,
        vegetarian: false,
        vegan: false,
        glutenFree: false,
        servings: null,
        instructions: [{ step: '' }],
        ingredients: [{ name: '' }],
        image: ''
      },
      form: {
        submitError: null,
        submitSuccess: false
      }
    };
  },
  methods: {
    addIngredient() {
      this.recipe.ingredients.push({ name: '' });
    },
    removeIngredient(index) {
      this.recipe.ingredients.splice(index, 1);
    },
    addInstruction() {
      this.recipe.instructions.push({ step: '' });
    },
    removeInstruction(index) {
      this.recipe.instructions.splice(index, 1);
    },
    async onSubmit() {
      try {
        const response = await this.axios.post(
          this.$root.store.server_domain + "/users/userRecipes", this.recipe,
          {
            withCredentials: true
          }
        );
        this.form.submitError = null;
        this.form.submitSuccess = true;
        setTimeout(() => {
          this.$router.push(`/private`);
        }, 300);
      } catch (error) {
        this.form.submitSuccess = false;
        this.form.submitError = error.response.data.message || 'An error occurred';
      }
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: auto;
}
</style>
