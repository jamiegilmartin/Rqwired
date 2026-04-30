<template>
  <div class="form-wrap">
    <el-text size="small">Add Req</el-text>
    &nbsp;
    <button @click="show = !show" class="toggle-btn">
      <span v-if="show">&#9651;</span>
      <span v-else>&#9661;</span>
    </button>
    <el-collapse-transition>
      <div v-if="show">
        <form @submit.prevent="handleSubmit" @reset="handleReset">
          <fieldset>
            <label for="title">Title</label>
            <input
              type="text"
              name="title"
              id="title"
              required
              v-model="formData.title"
            />
          </fieldset>
          <fieldset>
            <label for="description">Description</label>
            <textarea
              type="text"
              name="description"
              id="description"
              required
              v-model="formData.description"
              maxlength="200"
            ></textarea>
          </fieldset>


          <fieldset class="btns">
            <button type="reset">Reset</button>
            <button type="submit">Submit</button>
          </fieldset>
        </form>
      </div>
    </el-collapse-transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useReqStore } from "../stores/ReqStore";

const store = useReqStore();
const show = ref(false);

// Form data
const formData = ref({
  title: "",
  description: ""
});


const handleSubmit = () => {
  if (!formData.value.title || !formData.value.description) {
    alert("Name and Description are required");
    return;
  }

  // Add requirement to store
  store.addReq({
    title: formData.value.title,
    description: formData.value.description,
    rating: 0
  });

  // Reset form
  handleReset();
  show.value = false;
};

const handleReset = () => {
  formData.value = {
    title: "",
    description: ""
  };
};

</script>

<style scoped>
.form-wrap {
  padding: 10px;
  background: var(--bg-transparent);
}

.form-wrap .close-btn:hover {
  opacity: 0.4;
}

form fieldset {
  padding-bottom: 10px;
  border: 0;
}
form fieldset label {
  display: inline-block;
  width: 110px;
  font-size: 12px;
  vertical-align: top;
}
form fieldset label::after {
  content: ":";
}
form fieldset textarea {
  height: 50px;
}
form fieldset.btns {
  padding-top: 20px;
  text-align: center;
}
form fieldset.btns button {
  height: 25px;
  width: 45%;
  cursor: pointer;
}
form span.clear-target {
  padding-left: 10px;
  font-size: 14px;
  cursor: pointer;
}
</style>
