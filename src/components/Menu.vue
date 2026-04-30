<template>
  <div class="menu">
    <p class="title">Reqwired</p>
    <ul>
      <li>
        <ReqForm />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import ReqForm from "@/components/ReqForm.vue";
import { useDark } from "@vueuse/core";
// vars
const isDark = useDark();
const darkMode = ref(isDark);

</script>

<style scoped type="scss">
.menu {
  position: relative;
  padding: 0 1rem 0 1rem;
  z-index: 1;
  text-align: center;
  p.title {
    display: block;
    font-family: monospace;
    text-transform: lowercase;
    margin: 0;
    padding: 0;
  }
  ul {
    margin: 0;
    padding: 0;
    list-style-type: none;
    display: inline-block;
    li {
      margin: 0;
      padding: 0;
      display: inline-block;
      .el-text {
        margin-left: 10px;
      }
      a {
        display: flex;
        align-items: center;
        padding: 1rem;
        text-decoration: none;
        color: white;
        el-icon {
          margin-right: 10rem;
        }
      }
    }
  }
}
</style>
