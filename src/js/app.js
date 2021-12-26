import cytoscape from "cytoscape";
import fcose from "cytoscape-fcose";
import contextMenus from "cytoscape-context-menus";
import svg from 'cytoscape-svg';
import { sampleNodesAndEdges, sampleStyles } from "./modules/sample-deta";
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
		if (!node) {
			console.warn("node is nothing. id=" + lockedNodeId);
		}

		if (defaultLockNodePositions) {

			const nodePosition = defaultLockNodePositions.find(it => it.nodeId == lockedNodeId);

			const id = node.id();
			const x = nodePosition.position.x;
			const y = nodePosition.position.y;

			lockNodesData.push({
				nodeId: id,
				position: { x: parseInt(x), y: parseInt(y) }
			});
		} else {
			const id = node.id();
			const x = node.position().x;
			const y = node.position().y;

			lockNodesData.push({
				nodeId: id,
				position: { x: parseInt(x), y: parseInt(y) }
			});
		}

	}


	cy.layout({
		name: "fcose",
		fixedNodeConstraint: lockNodesData
	})
		.run();

}

export function readTsv(tsv) {
	const newElementsAndLockNodes = loadTsv(tsv);
	const sampleStylesData = loadTsv(sampleStyles);

	cy.elements().remove();
	cy.json({
		elements: {
			nodes: newElementsAndLockNodes.nodes,
			edges: newElementsAndLockNodes.edges
		}
	});

	lockedNodeIds.clear();
	for (const node of newElementsAndLockNodes.lockNodes) {
		lockedNodeIds.add(node.nodeId);
	}
	refreshLayout(newElementsAndLockNodes.lockNodes);
	cy.style().resetToDefault().update();

	const styleArray = [];
	let nStyles = newElementsAndLockNodes.nodeStyles;
	if (nStyles.length == 0) {
		nStyles = sampleStylesData.nodeStyles;
	}
	for (const nodeStyle of nStyles) {

		const currentStyle = {};
		if (nodeStyle.backgroundColor) {
			currentStyle['background-color'] = nodeStyle.backgroundColor;
		}
		if (nodeStyle.shape) {
			currentStyle['shape'] = nodeStyle.shape;
		}
		if (nodeStyle.label) {
			currentStyle['label'] = nodeStyle.label;
		}
		if (nodeStyle.padding) {
			currentStyle['padding'] = nodeStyle.padding;
		}
		if (nodeStyle.width) {
			currentStyle['width'] = nodeStyle.width;
		}
		if (nodeStyle.height) {
			currentStyle['height'] = nodeStyle.height;
		}
		if (nodeStyle.text_halign) {
			currentStyle['text-halign'] = nodeStyle.text_halign;
		}
		if (nodeStyle.text_valign) {
			currentStyle['text-valign'] = nodeStyle.text_valign;
		}
		if (nodeStyle.background_opacity) {
			currentStyle['background-opacity'] = nodeStyle.background_opacity;
		}
		if (nodeStyle.border_color) {
			currentStyle['border-color'] = nodeStyle.border_color;
		}
		if (nodeStyle.border_style) {
			currentStyle['border-style'] = nodeStyle.border_style;
		}
		if (nodeStyle.border_width) {
			currentStyle['border-width'] = nodeStyle.border_width;
		}
 
		styleArray.push(
			{
				selector: nodeStyle.selector,
				style: currentStyle
			}
		);
	}


	let lStyles = newElementsAndLockNodes.lineStyles;
	if (lStyles.length == 0) {
		lStyles = sampleStylesData.lineStyles;
	}
	for (const lineStyle of lStyles) {

		const currentStyle = {};
		if (lineStyle.lineColor) {
			currentStyle['line-color'] = lineStyle.lineColor;
			currentStyle['target-arrow-color'] = lineStyle.lineColor;
		}
		if (lineStyle.lineStyle) {
			currentStyle['line-style'] = lineStyle.lineStyle;
		}
		if (lineStyle.curveStyle) {
			currentStyle['curve-style'] = lineStyle.curveStyle;
		}
		if (lineStyle.targetArrowShape) {
			currentStyle['target-arrow-shape'] = lineStyle.targetArrowShape;
		}
 
		styleArray.push(
			{
				selector: lineStyle.selector,
				style: currentStyle
			}
		);
	}


	cy.style(styleArray).update();
}

export function exportTsv(tsvFileName) {
	const tsv = editSaveTsv(cy, lockedNodeIds);
	download(tsvFileName, tsv);
}

function mergeTsv(tsv) {
	const newElementsAndLockNodes = loadTsv(tsv);

	for (const nodeInfo of newElementsAndLockNodes.nodes) {
		const nodeId = nodeInfo.data.id;
		const currentNode = cy.getElementById(nodeId);

		if (currentNode.data()) {
			currentNode.data("label", nodeInfo.data.label);
			currentNode.data("parent", nodeInfo.data.parent);

			if (lockedNodeIds.has(nodeId)) {
				nodeInfo.classes.push('__position-locked__');
			}
			currentNode.classes(nodeInfo.classes);

			const newParent = nodeInfo.data.parent;
			currentNode.move({ parent: newParent })

		} else {
			cy.add(nodeInfo);
		}
	}

	for(const edgeInfo of newElementsAndLockNodes.edges) {
		const edgeId = edgeInfo.data.id;
	
		const currentEdge = cy.getElementById(edgeId);
		if(currentEdge.data()) {
			const classes = edgeInfo.classes;
			currentEdge.classes(classes);
		} else {
			cy.add(edgeInfo);
		}
	}
}

export function exportSvg(svgFileName) {
	var aTag = document.createElement('a');
	aTag.setAttribute('href', getSvgUrl());
	aTag.setAttribute('download', svgFileName);
	aTag.click();
}

var getSvgUrl = function () {
	var svgContent = cy.svg({ scale: 1, full: true });
	var blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
	var url = URL.createObjectURL(blob);
	return url;
};


const lockNodePosition = function _lockNodePosition(targetNode) {

	if (targetNode.isParent()) {
		return;
	}

	var nodeList = cy.collection();
	nodeList = nodeList.union(targetNode);

	cy.nodes(":selected").forEach(node => {
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

	if (targetNode.isParent()) {
		return;
	}

	targetNode.removeClass('__position-locked__')

	const index = lockedNodeIds.data.findIndex(it => it == targetNode.id());
	lockedNodeIds.data.splice(index, 1)

}

const selectFirstNeighborhood = function _selectFirstNeighborhood(targetNode) {
	const nodes = targetNode.edgesWith('*').connectedNodes();
	nodes.select();
}

const deleteNodes = function _deleteNodes(targetNode) {
	var nodeList = cy.collection();
	nodeList = nodeList.union(targetNode);

	cy.nodes(":selected").forEach(node => {
		nodeList = nodeList.union(node);
	});


	nodeList.remove();
}

let download = function (fileName, text) {
	var aTag = document.createElement('a');
	aTag.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
	aTag.setAttribute('download', fileName);
	aTag.click();
};

export function appInit() {
	cy = cytoscape({
		container: document.getElementById("cy")
	});

	var contextMenu = cy.contextMenus();
	contextMenu.appendMenuItems(createMouseMenuItems(lockNodePosition, unlockNodePosition, selectFirstNeighborhood, deleteNodes));

	document.getElementById("pan-zoom-fit-btn").addEventListener('click', () => {
		cy.fit();
	});

	document.getElementById("pan-zoom-reset-btn").addEventListener('click', () => {
		cy.reset();
	});


	document.getElementById("refresh-btn").addEventListener('click', () => {
		refreshLayout();
	});

	document.getElementById("export-meta-btn").addEventListener('click', () => {
		const json = JSON.stringify(cy.json())
		download("meta.json", json);
	});

	//cy.on('tapend', 'node.__position-locked__' , function(evt){
	//	var node = evt.target;
	//});

	cy.on('click', function (evt) {
		const span = document.getElementById("selected-node-span")
		const elm = utils.getElmFromEvent(cy, evt);
		if (elm) {
			span.innerHTML = '[' + elm.id() + ']:' + elm.data().label;
		} else {
			span.innerHTML = '';
		}

		const tsv = editSeclectedTsv(cy, lockedNodeIds);
		document.getElementById("export-tsv-textarea").value = tsv;


	});

	document.getElementById("replace-form-tsv-btn").addEventListener('click', () => {
		const tsv = document.getElementById("import-tsv-textarea").value
		readTsv(tsv);
	});

	document.getElementById("tsv-merge-btn").addEventListener('click', () => {
		const tsv = document.getElementById("import-tsv-textarea").value
		mergeTsv(tsv);
	});

	document.getElementById("search-btn").addEventListener('click', () => {
		const srachText = document.getElementById("search-input").value
		cy.elements().unselect()
		cy.getElementById(srachText).select()
	});


	readTsv(sampleNodesAndEdges + sampleStyles);
}

