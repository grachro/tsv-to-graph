<template>
  <div id="cy"></div>
</template>

<script>
import {appInit} from './js/app.js'



export default {
  name: 'App',
  components: {
  },
  mounted: function () {
    appInit();
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
