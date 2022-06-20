<template>
  <div></div>
</template>

<script>
export default {
  name: "Home",
  created() {
    this.$router.push({ name: "Editor", query: { encoded: btoa("box") } });
  }
};
</script>
