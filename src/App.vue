<template>
  <div class="app">
    <header>
      <Menu />
    </header>
    <div class="main">
      <Home />
    </div>
    <footer>
      <a href="https://jamiegilmartin.com">© 2026 Jamie Gilmartin</a>
    </footer>
  </div>
</template>

<script setup lang="ts">
import Home from "@/components/Home.vue";
import Menu from "@/components/Menu.vue";
import ReqForm from "@/components/ReqForm.vue";
</script>

<style scoped type="scss">
.app {
  position: relative;
  height: 100%;
  .main {
    position: relative;
    top: 200px;
    min-height: 1000px;
    z-index: 0;
  }
  header {
    position: fixed;
    top: 0;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.1);
    z-index: 1;
  }
  footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    text-align: center;
    padding: 2px 0 3px 0;
    color: #ccc;
    background-color: rgba(0, 0, 0, 0.1);
    z-index: 1;
    p {
      padding: 0;
      margin: 0;
    }
  }
}
</style>
