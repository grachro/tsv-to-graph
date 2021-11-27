<template>
  <div id='top-panel'>
    <h1>tsv-to-graph</h1>
    <span id="top-tsv-span">tsv --&gt;|</span><span id="top-graph-span">&lt;-- graph</span>
    <id id='top-left-panel'>
      <input id="search-input"><button id="search-btn">find by id</button> 
      <button id="refresh-btn">refresh</button>
    </id>
  </div>
  
  <div id='side-panel'>
    <div id='side-panel_contents'>

      <button id="import-btn" onclick="document.getElementById('import-file').click();">import from tsv</button>
      <input id="import-file" type="file" style="display: none;">
      <button id="export-btn">export to tsv</button>
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
      <button id="export-svg-btn">export svg</button>
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
import {appInit} from './js/app.js'



export default {
  name: 'App',
  components: {
  },
  mounted: function () {
    appInit();
  }
}
</script>

<style>
</style>
