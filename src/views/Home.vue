<template>
  <div
    class="flex flex-col-reverse justify-between md:flex-row min-w-full w-full min-h-screen h-full p-4"
  >
    <div
      class="w-full h-1/2 md:w-1/2 md:h-full border border-gray-500 rounded-lg overflow-hidden"
    >
      <div
        class="bg-gray-200 border-b border-gray-500 font-bold p-2 flex justify-between"
      >
        <div>
          Pikchr Editor
        </div>
        <div>
          <button class="text-blue-800 hover:text-blue-900 mr-4" @click="reset">
            Reset
          </button>
          <button class="text-blue-800 hover:text-blue-900" @click="download">
            Download SVG
          </button>
        </div>
      </div>
      <textarea
        class="w-full h-1/2 p-2 focus:outline-none overflow-auto whitespace-no-wrap font-mono"
        cols="30"
        rows="20"
        v-model="markup"
      ></textarea>
      <div
        class="w-full h-1/2 p-2 border-t border-gray-500 overflow-auto font-mono"
        style="min-height: 8rem"
      >
        <div class="text-green-700" v-if="error === ''">
          &gt;&gt;&gt; Success
        </div>
        <div class="text-red-700" v-html="error"></div>
      </div>
    </div>
    <div
      class="w-full h-1/2 md:w-1/2 pt-4 pb-4 md:pt-16 px-2"
      v-html="output"
    ></div>
  </div>
</template>

<script>
import loadPikchr from "pikchr-js";

const initialMarkup = `arrow; box "Hello" "World"; arrow`;

function saveMarkup(markup) {
  sessionStorage.setItem("markup", markup);
}

function loadMarkup() {
  return sessionStorage.getItem("markup");
}

export default {
  name: "Home",
  data() {
    return {
      pikchr: null,
      markup: loadMarkup() || initialMarkup,
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
    reset() {
      const confirmedReset = confirm(
        "Do you want to reset the editor and clear the current figure?"
      );
      if (!confirmedReset) {
        return;
      }
      this.markup = initialMarkup;
      this.update();
    },
    update() {
      if (!this.pikchr) {
        return;
      }
      const output = this.pikchr(this.markup, "", 0, 400, 400);
      if (!output.startsWith("<svg")) {
        this.error = output;
        return;
      }
      saveMarkup(this.markup);
      this.output = output;
      this.error = "";
    },
    download() {
      const timestamp = Math.floor(Date.now() / 1000);
      const source = this.output;
      const url =
        "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);
      const filename = `pikchr-${timestamp}.svg`;

      var element = document.createElement("a");
      element.setAttribute("href", url);
      element.setAttribute("download", filename);

      element.style.display = "none";
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);
    }
  }
};
</script>
