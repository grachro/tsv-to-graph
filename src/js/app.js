import cytoscape from "cytoscape";
import fcose from "cytoscape-fcose";
import contextMenus from "cytoscape-context-menus";
import svg from 'cytoscape-svg';
import { sampleData } from "./modules/sample-deta";
import { getDefaultStyle } from "./modules/graph-style";
import { createMouseMenuItems } from "./modules/menuItems";
import { loadTsv } from "./modules/tsv_load";
import { editSaveTsv, editSeclectedTsv } from "./modules/tsv_save";
import { utils } from "./modules/cy_utils";

cytoscape.use(fcose);
cytoscape.use(contextMenus);
cytoscape.use(svg);


let cy = cytoscape();
const lockedNodeIds = new Set();



function refreshLayout(defaultLockNodePositions) {

	const lockNodesData = [];
	for (const lockedNodeId of lockedNodeIds.values()) {
		const node = cy.getElementById(lockedNodeId);
		if(!node) {
			console.warn("node is nothing. id=" + lockedNodeId);
		}

		if(defaultLockNodePositions) {
 
			const nodePosition = defaultLockNodePositions.find(it => it.nodeId == lockedNodeId);
		
			const id = node.id();
			const x = nodePosition.position.x;
			const y = nodePosition.position.y;

			console.log(id + ":" + x + "," + y);
			lockNodesData.push({
				nodeId:id,
				position: {x:parseInt(x) , y:parseInt(y)}
			});
		} else { 
			const id = node.id();
			const x = node.position().x;
			const y = node.position().y;

			lockNodesData.push({
				nodeId:id,
				position: {x:parseInt(x) , y:parseInt(y)}
			});
		}

	}


	cy.layout({
		 name: "fcose",
		 fixedNodeConstraint: lockNodesData
		})
		.run();

}

function readTsv(tsv) {
	const newElementsAndLockNodes = loadTsv(tsv);

	cy.elements().remove();
	cy.json({ elements: {
		nodes:newElementsAndLockNodes.nodes,
		edges:newElementsAndLockNodes.edges} 
	});

	lockedNodeIds.clear();
	for (const node of newElementsAndLockNodes.lockNodes) {
		lockedNodeIds.add(node.nodeId);
	}
	refreshLayout(newElementsAndLockNodes.lockNodes);
	cy.style().resetToDefault().update();

	const styleArray = [];
	for(const [key, value] of getDefaultStyle().entries()) {
		styleArray.push(
			{
				selector: key,
				style: value
			}
		);
	};
	for (const nodeStyle of newElementsAndLockNodes.nodeStyles) {
		styleArray.push(
			{
				selector: nodeStyle.selector,
				style: {
					'background-color': nodeStyle.backgroundColor,
					'shape': nodeStyle.shape,
				}
			}
		);
	}
	for (const lineStyle of newElementsAndLockNodes.lineStyles) {
		styleArray.push(
			{
				selector: lineStyle.selector,
				style: {
					'line-color': lineStyle.lineColor,
					'target-arrow-color': lineStyle.lineColor,
					'line-style': lineStyle.lineStyle,

				}
			}
		);
	}

	
	cy.style(styleArray).update();
 
}

var getSvgUrl = function() {
	var svgContent = cy.svg({scale: 1, full: true});
	var blob = new Blob([svgContent], {type:"image/svg+xml;charset=utf-8"});
	var url = URL.createObjectURL(blob);
	return url;
};


const lockNodePosition = function _lockNodePosition(targetNode) { 

	if(targetNode.isParent()) {
		return;
	}

	var nodeList =  cy.collection();
	nodeList = nodeList.union(targetNode);

	cy.nodes( ":selected" ).forEach(node => {
		nodeList = nodeList.union(node);
	});

	nodeList.forEach(node => {

		//targetNode.lock();
		node.addClass('__position-locked__')
		const id = node.id();
		lockedNodeIds.add(id);
	});

}

const unlockNodePosition = function _unlockNodePosition(targetNode) { 

	if(targetNode.isParent()) {
		return;
	}

	targetNode.removeClass('__position-locked__')

	const index = lockedNodeIds.data.findIndex(it => it == targetNode.id());
	lockedNodeIds.data.splice(index, 1)

}

const selectFirstNeighborhood = function _selectFirstNeighborhood(targetNode) {
	const nodes = targetNode.edgesWith('*').connectedNodes();
	for (const c of nodes) {
		console.log(c.id())
	}

	nodes.select();
}

const deleteNodes = function _deleteNodes(targetNode) {
	var nodeList =  cy.collection();
	nodeList = nodeList.union(targetNode);

	cy.nodes( ":selected" ).forEach(node => {
		nodeList = nodeList.union(node);
	});


	nodeList.remove();
}

function updateLockedNodePosition(node) { 
	//refreshLayout();
}


let download = function(fileName, text) {
	var aTag = document.createElement('a');
	aTag.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
	aTag.setAttribute('download', fileName);
 	aTag.click();
};



document.addEventListener("DOMContentLoaded", function () {
  cy = cytoscape({
    container: document.getElementById("cy")
  });

	var contextMenu = cy.contextMenus();
  contextMenu.appendMenuItems(createMouseMenuItems(lockNodePosition, unlockNodePosition, selectFirstNeighborhood, deleteNodes));

	document.getElementById("refresh-btn").addEventListener('click', event => {
		refreshLayout();
	});

	document.getElementById("import-file").addEventListener('change', (event, fileObject) => {
		var inputFile = event.target.files[0];
		var reader = new FileReader();
			
		reader.addEventListener('load', function(e) {
			const tsv = e.target.result;         
			readTsv(tsv);
		});
		reader.readAsText(inputFile);   
	});

	document.getElementById("export-btn").addEventListener('click', event => {
		const arr =  Array.from(getDefaultStyle().keys());
		var defaultStyleSelections = new Set(arr);
		
		const tsv = editSaveTsv(cy, lockedNodeIds, defaultStyleSelections);
		download("graph.tsv", tsv);
  });

	document.getElementById("export-meta-btn").addEventListener('click', event => {
 		const json = JSON.stringify(cy.json())
		download("meta.json", json);
  });

	cy.on('tapend', 'node.__position-locked__' , function(evt){
		var node = evt.target;
		updateLockedNodePosition(node);
	});

	cy.on('tapend', function(evt){
		const span = document.getElementById("selected-node-span")
		const elm = utils.getElmFromEvent(cy, evt); 
		if(elm) {
			span.innerHTML = '[' + elm.id() + ']:' + elm.data().label;
		} else {
			span.innerHTML = '';
		}

		const tsv = editSeclectedTsv(cy, lockedNodeIds);
		document.getElementById("export-tsv-textarea").value = tsv; 
		
		
	});


	document.getElementById("svg-btn").addEventListener('click', event => {
		var aTag = document.createElement('a');
		aTag.setAttribute('href', getSvgUrl());
		aTag.setAttribute('download', 'graph.svg');
		aTag.click();
  });
	
	document.getElementById("replace-form-tsv-btn").addEventListener('click', event => {
		const tsv = document.getElementById("import-tsv-textarea").value 
		readTsv(tsv);
  });
	

	document.getElementById("search-btn").addEventListener('click', event => {
		const srachText = document.getElementById("search-input").value 
		cy.elements().unselect()
		cy.getElementById(srachText).select()
  });

 
	readTsv(sampleData);
});

