<template>
  <div id='top-panel'>
    <h1>tsv-to-graph</h1>
    <span id="top-tsv-span">tsv --&gt;|</span><span id="top-graph-span">&lt;-- graph</span>
    <id id='top-left-panel'>
      <input id="search-input"><button id="search-btn">find by id</button>
      <span style="display: inline-block;width: 10px;" />
      <span>pan&zoom</span>
      <button id="pan-zoom-fit-btn">fit</button>
      <button id="pan-zoom-reset-btn">100%</button>
      <span style="display: inline-block;width: 10px;" />
      <button id="refresh-btn">refresh layout</button>
    </id>
  </div>
  
  <div id='side-panel'>
    <div id='side-panel_contents'>
      <span>{{ importedFileName }}</span>
      <br>
      <input id="import-file" type="file" v-on:change="changeImportFileTag">
      <br>
      <button id="import-btn" onclick="document.getElementById('import-file').click();">import from tsv</button>
      <br>
      <br>
      <button v-on:click="clickExportTsvBtn">export to tsv</button>
      <br>
      <br>
      input tsv
      <button id="replace-form-tsv-btn">replace all</button>
      <button id="tsv-merge-btn">nodes merge</button>
      <br>
      <textarea id="import-tsv-textarea" cols="30" rows="2" style="width: 350px;max-width: 350px;"></textarea>
      <br>
      output tsv<br>
      <textarea id="export-tsv-textarea" cols="30" rows="6" style="width: 350px;max-width: 350px;"></textarea>
      <br>
      selected node: 
      <span id="selected-node-span"></span>
      
      <br>
      <br>
      <button v-on:click="clickExportSvgBtn">export svg</button>
      <span>{{svgFileName}}</span>
      <br>
      <button id="export-meta-btn">export Cytoscape.js json</button>
      <br>
      <br>
      powered by Cytoscape.js
    </div>
  </div>
  <div id="cy"></div>
</template>

<script>
import {appInit, readTsv, exportTsv, exportSvg} from './js/app.js'



export default {
  name: 'App',
  data: function () {
    return {
      importedFileName:"no tilte",
      svgFileName:"graph.svg",
    }
  },
  components: {
  },
  
  methods: {
    changeImportFileTag: function(event) {
      var inputFile = event.target.files[0];
      var reader = new FileReader();

      reader.addEventListener('load', function (e) {
        const tsv = e.target.result;
        readTsv(tsv);
        
      });
      reader.readAsText(inputFile);

      this.importedFileName = inputFile.name
      if(this.importedFileName.endsWith(".tsv")) {
        this.svgFileName = this.importedFileName.substring(0, this.importedFileName.length -4) + ".svg"
      } else {
        this.svgFileName = this.importedFileName + ".svg"
      }
    },
    clickExportTsvBtn: function() {
      exportTsv(this.importedFileName);
    },
    clickExportSvgBtn: function() {
      exportSvg(this.svgFileName);
    },
  },
  mounted: function () {
    appInit();
  }
}
</script>

<style>
body {
	padding: 0;
	margin: 0;

}
h1 {
	font-size: 20px;
	margin: 0;
	padding: 0;
}
#top-panel {
	position: absolute;
	height: 50px;
	background-color: #ddd;
	left: 0;
	right: 0;
}

#top-tsv-span {
	position: absolute;
	left: 323px;
	bottom: 1px;
}

#top-graph-span {
	position: absolute;
	left: 375px;
	bottom: 1px;
}

#side-panel {
	position: absolute;
	top: 50px;
	bottom: 0;
	width: 375px;
	background-color: #eee;
}

#side-panel_contents {
	padding: 5px 0 5px 5px;
}

#cy {
	position: absolute;
	left: 375px;
	top: 50px;
	bottom: 0;
	right: 0;
	z-index: 999;
}

#top-left-panel {
	position: absolute;
	right: 0;
	bottom: 5px;
}
</style>
