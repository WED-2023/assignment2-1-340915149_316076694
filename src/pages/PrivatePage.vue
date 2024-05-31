<template>
  <div class="container">
    <h1 class="title">Private Page</h1>
    <RecipePreviewList title="" class="RandomRecipes center mt-3" />
  </div>
</template>

<script>
import RecipePreviewList from "../components/RecipePreviewList";
export default {
  components: {
    RecipePreviewList
  }
};
</script>

<style lang="scss" scoped>
.RandomRecipes {
  margin: 10px 0 10px;
}
</style>
