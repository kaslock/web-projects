<template>
  <div id="app">
    <div id="nav" class="text-left">
      <router-link to="/">Main</router-link> |
      <router-link to="/search">Search</router-link>
    </div>
    <b-spinner
      v-if="loading"
      class="text-white d-block ml-auto mr-auto"
      label="Spinning"
      ></b-spinner>
    <router-view/>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  computed:{
    ...mapState(["loading"])
  }
};
</script>
<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100;300;400&display=swap');
body{
  font-family: 'Noto Sans KR', sans-serif;
  color: #ffffff;
}
#app {
  background-color: rgb(20, 20 , 20);
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  min-height: 100vh;
}

#nav {
  padding: 20px;
  text-align: center;
  position: relative;
  z-index: 99;
  background-color: black;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: white !important;
}
</style>
