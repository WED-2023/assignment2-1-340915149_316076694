<template>
  <div id="app">
    <b-navbar toggleable="lg" type="dark" variant="primary" class="mb-4">
      <b-navbar-brand :to="{ name: 'main' }">Mock Recipes</b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item :to="{ name: 'main' }">Home</b-nav-item>
          <b-nav-item :to="{ name: 'search' }">Search</b-nav-item>
          <b-nav-item :to="{ name: 'about' }">About</b-nav-item>
          
          <b-nav-item-dropdown v-if="$root.store.username" right>
            <template #button-content>
              <em>Personal</em>
            </template>
            <b-dropdown-item :to="{ name: 'favorites' }">Favorites <b-icon icon="heart"></b-icon></b-dropdown-item>
            <b-dropdown-item :to="{ name: 'private' }">Private <b-icon icon="lock"></b-icon></b-dropdown-item>
            <b-dropdown-item :to="{ name: 'lafamilia' }">La Familia <b-icon icon="people"></b-icon></b-dropdown-item>
          </b-nav-item-dropdown>

          <b-nav-item-dropdown v-if="$root.store.username" right>
            <template #button-content>
              <em>Recipe Workshop</em>
            </template>
            <b-dropdown-item :to="{ name: 'recipeCreate' }">Create your recipe</b-dropdown-item>
            <b-dropdown-item :to="{ name: 'lafamiliaCreate' }">Create La Familia Recipe</b-dropdown-item>
          </b-nav-item-dropdown>


        </b-navbar-nav>
        <b-navbar-nav class="ml-auto">
          <!-- <b-nav-form>
            <b-form-input size="sm" class="mr-sm-2" placeholder="Search"></b-form-input>
            <b-button size="sm" class="my-2 my-sm-0" type="submit">Search</b-button>
          </b-nav-form> -->

          <b-nav-item-dropdown v-if="$root.store.username" right>
            <template #button-content>
              <em>Logged as: {{$root.store.username }}</em>
            </template>
            <!-- TODO add profile route and page -->
            <b-dropdown-item>Profile</b-dropdown-item>
            <b-dropdown-item @click="Logout">Sign Out</b-dropdown-item>
          </b-nav-item-dropdown>

          <b-nav-item-dropdown v-else right>
            <template #button-content>
              <em>Guest</em>
            </template>
            <b-dropdown-item :to="{ name: 'login' }">Login</b-dropdown-item>
            <b-dropdown-item :to="{ name: 'register' }">Register</b-dropdown-item>
          </b-nav-item-dropdown>


        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
  methods: {
    async Logout() {
      this.$root.store.logout();
      sessionStorage.clear();
      this.$root.toast("Logout", "User logged out successfully", "success");
      const response = await this.axios.post(
          this.$root.store.server_domain +"/Logout",
      );
      this.$router.push("/").catch(() => {
        this.$forceUpdate();
      });
    }
  }
};
</script>

<style lang="scss">
@import "@/scss/form-style.scss";

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  min-height: 100vh;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
