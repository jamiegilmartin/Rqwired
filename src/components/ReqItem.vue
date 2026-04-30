<template>
  <article class="item">
    <header>
      <p class="title">{{ req.title }}</p>
    </header>
    
    <p class="description">{{ req.description }}</p>


    <footer>
      <el-rate v-model="rating" @change="updateReq()"/>
      <el-button
        type="danger"
        :icon="Delete"
        circle
        size="small"
        @click="store.removeReq(req.id)"
      />
    </footer>
  </article>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useReqStore } from "../stores/ReqStore";

import { type Req } from "@/models/Req";
import {
  Delete,
} from "@element-plus/icons-vue";

// store
const store = useReqStore();

// props
const props = defineProps<{
  req: Req;
}>();

const rating = ref(props.req.rating || 0);


const updateReq = () => {
  const newReq = {
    ...props.req,
    rating: rating.value
  }
  store.updateReq(props.req.id, newReq)
}
</script>

<style scoped type="scss">
.item {
  min-width: 111px;
  color: #fff;
  background: var(--bg-transparent);
  padding: 10px;
  p.title {
    text-align: center;
    font-weight: bold;
  }
  p.description {
    text-align: left;
    font-family: monospace;
    overflow-wrap: break-word;
  }
  footer {
    padding: 10px 0 0 0;
    border-top: 1px solid var(--bg);
  }
}
</style>
