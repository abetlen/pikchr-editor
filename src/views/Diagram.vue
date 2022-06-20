<template>
  <div
    class="flex flex-col-reverse justify-end md:flex-row min-w-full w-full min-h-screen h-full p-4"
  >
    <div class="w-full max-h-screen font-mono" v-html="output"></div>
  </div>
</template>

<script>
import loadPikchr from "pikchr-js";

export default {
  name: "Diagram",
  data() {
    return {
      prefix: "pikchr",
      pikchr: null,
      markup: "",
      output: "",
      error: ""
    };
  },
  created() {
    const encoded = this.$route.query.encoded;
    if (encoded) {
      this.markup = atob(encoded);
    }
    loadPikchr().then(pikchr => {
      this.pikchr = pikchr;
      this.update();
    });
  },
  methods: {
    update() {
      if (!this.pikchr) {
        return;
      }
      const output = this.pikchr(
        this.markup,
        "object-contain max-h-full max-w-full",
        0,
        400,
        400
      );
      if (!output.startsWith("<svg")) {
        this.error = output;
        return;
      }
      this.output = output;
      this.error = "";
    }
  }
};
</script>
