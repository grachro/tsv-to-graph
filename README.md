# tsv-to-graph 

## 起動方法
```
git clone git@github.com:grachro/tsv-to-graph.git
cd tsv-to-graph/release
docker run --rm -p 80:80 -v $(pwd):/usr/share/nginx/html:ro nginx
```
ブラウザで http://localhost にアクセス


## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


## project info

### dependencies
- "cytoscape": "^3.20.0"  ([Repo](https://github.com/cytoscape/cytoscape.js))
- "cytoscape-fcose": "^2.1.0"  ([Repo](https://github.com/iVis-at-Bilkent/cytoscape.js-fcose))
- "cytoscape-context-menus": "^4.1.0"  ([Repo](https://github.com/iVis-at-Bilkent/cytoscape.js-context-menus))
- "cytoscape-svg": "^0.3.1"  ([Repo](https://github.com/kinimesi/cytoscape-svg))

### devDependencies
- "webpack": "^5.64.0",
- "webpack-cli": "^4.9.1"
- "webpack-dev-server": "^4.4.0"

### install history
```
npm init -y
npm install webpack webpack-cli --save-dev
npm install webpack-dev-server --save-dev
npm install cytoscape
npm install cytoscape-fcose
npm install cytoscape-context-menus
npm install cytoscape-svg
```