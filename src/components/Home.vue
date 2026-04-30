
<script setup lang="ts">
import HTMLSphere from '@/components/HTMLSphere.vue'

const isMobile = () => {
  return window.matchMedia('(max-width: 767px)').matches
}
</script>
<template>
  <div class="full-screen" :class="isMobile() ? 'mobile' : ''">
    <div class="inner">
      <HTMLSphere />
    </div>
  </div>
</template>

<style scoped type="scss">
.full-screen {
  width: 100%;
  overflow: hidden;
  .inner {
    position: relative;
    width: 80%;
    height: 100%;
    margin: 0 auto;
  }
}
.call-out {
  text-align: center;
  position: absolute;
  top: 0;
  left: 0;
  padding: 25px;
  z-index: 1000;
}
.mobile-call-out {
  margin: 0 auto;
  text-align: center;
  width: 50%;
}
.mobile {
  overflow: hidden;
  .inner {
    overflow: hidden;
  }
}
</style>
