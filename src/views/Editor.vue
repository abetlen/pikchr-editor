<template>
  <div
    class="flex flex-col-reverse justify-end md:flex-row min-w-full w-full min-h-screen h-full p-4"
  >
    <div
      class="w-full h-1/2 md:w-1/2 md:h-full border-2 border-gray-300 rounded-lg overflow-hidden"
    >
      <div
        class="bg-gray-100 border-b-2 border-gray-300 font-bold p-2 flex justify-between text-gray-700"
      >
        <div>
          Pikchr Editor
        </div>
        <div>
          <button
            class="text-blue-600 hover:text-blue-700 mr-4"
            @click="diagram"
          >
            Diagram
          </button>
          <button class="text-blue-600 hover:text-blue-700 mr-4" @click="reset">
            Reset
          </button>
          <button class="text-blue-600 hover:text-blue-700" @click="download">
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
        class="w-full h-1/2 p-2 border-t-2 border-gray-300 overflow-auto font-mono"
        style="min-height: 8rem"
      >
        <div class="text-green-700" v-if="error === ''">
          &gt;&gt;&gt; Success
        </div>
        <div class="text-red-700" v-html="error"></div>
      </div>
    </div>
    <div
      class="w-full max-h-screen h-1/2 md:w-1/2 pt-4 pb-4 md:pb-16 md:pt-16 px-2"
      v-html="output"
    ></div>
  </div>
</template>

<script>
import loadPikchr from "pikchr-js";

const initialMarkup = `arrow; box "Hello" "World"; arrow`;

function lzw_encode(s) {
  var dict = {};
  var data = (s + "").split("");
  var out = [];
  var currChar;
  var phrase = data[0];
  var code = 256;
  var i = 0;
  for (i = 1; i < data.length; i++) {
    currChar = data[i];
    if (dict[phrase + currChar] != null) {
      phrase += currChar;
    } else {
      out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
      dict[phrase + currChar] = code;
      code++;
      phrase = currChar;
    }
  }
  out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
  for (i = 0; i < out.length; i++) {
    out[i] = String.fromCharCode(out[i]);
  }
  return out.join("");
}

/*
// Decompress an LZW-encoded string
function lzw_decode(s) {
    var dict = {};
    var data = (s + "").split("");
    var currChar = data[0];
    var oldPhrase = currChar;
    var out = [currChar];
    var code = 256;
    var phrase;
    for (var i=1; i<data.length; i++) {
        var currCode = data[i].charCodeAt(0);
        if (currCode < 256) {
            phrase = data[i];
        }
        else {
           phrase = dict[currCode] ? dict[currCode] : (oldPhrase + currChar);
        }
        out.push(phrase);
        currChar = phrase.charAt(0);
        dict[code] = oldPhrase + currChar;
        code++;
        oldPhrase = phrase;
    }
    return out.join("");
}

function toBinary(string) {
  const codeUnits = new Uint16Array(string.length);
  for (let i = 0; i < codeUnits.length; i++) {
    codeUnits[i] = string.charCodeAt(i);
  }
  return btoa(String.fromCharCode(...new Uint8Array(codeUnits.buffer)));
}
*/

export default {
  name: "Editor",
  props: {
    encoded: {
      type: String,
      required: false
    }
  },
  data() {
    return {
      prefix: "pikchr",
      pikchr: null,
      markup: "",
      output: "",
      error: ""
    };
  },
  watch: {
    markup() {
      this.$router.replace({
        name: "Editor",
        query: { encoded: btoa(this.markup) }
      });
      this.update();
    }
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
      if (this.markup.length < 1) {
        return;
      }
      console.log("Original markup", this.markup.length);
      const compressed = lzw_encode(this.markup);
      console.log("Compressed string", compressed.length);
      console.log(
        "Compressed uri encoded",
        encodeURIComponent(compressed).length
      );
      const output = this.pikchr(
        this.markup,
        "object-contain max-h-full max-w-full",
        0,
        400,
        400
      );
      console.log("Output svg", output.length);
      if (!output.startsWith("<svg")) {
        this.error = output;
        return;
      }
      this.output = output;
      this.error = "";
    },
    download() {
      const now = new Date();
      const source = this.output;
      const url =
        "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);
      const filename = `${
        this.prefix
      }-${now.getFullYear()}-${now.getMonth()}-${now.getDate()}-${now.getHours()}-${now.getMinutes()}-${now.getSeconds()}.svg`;

      console.log(filename);

      var element = document.createElement("a");
      element.setAttribute("href", url);
      element.setAttribute("download", filename);

      element.style.display = "none";
      document.body.appendChild(element);

      // element.click();

      document.body.removeChild(element);
    },
    diagram() {
      // this.$router.push({ name: "Diagram", query: { encoded: btoa(this.markup) }});
      window.location.href = `http://localhost:5050/diagram?encoded=${btoa(
        this.markup
      )}`;
    }
  }
};
</script>
