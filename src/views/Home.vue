<template>
  <div class="flex min-w-full w-full min-h-screen h-full">
    <div class="w-1/2 h-full">
      <textarea
        class="w-full h-1/2 p-2"
        cols="30"
        rows="20"
        v-model="markup"
      ></textarea>
      <div class="w-full h-1/2 p-2" v-html="error"></div>
    </div>
    <div class="w-1/2 p-2" v-html="output"></div>
  </div>
</template>

<script>
import loadPikchr from "pikchr-js";

const initialMarkup = `arrow; box "Hello" "World"; arrow`;

export default {
  name: "Home",
  data() {
    return {
      pikchr: null,
      markup: initialMarkup,
      output: "",
      error: ""
    };
  },
  watch: {
    markup() {
      this.update();
    }
  },
  created() {
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
      const output = this.pikchr(this.markup, "", 0, 400, 400);
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
