export function tsvToCyElementsAndLockNodes(tsv, guardStyleSelections) {
	const nodes = [];
	const edges = [];
	const lockNodes = [];
	const nodeStyles = [];
	const lineStyles = [];

	const tsvLines = tsv.split('\n');
	for (const line of tsvLines) {
		if(!line || line.empty || line.startsWith('#') || line.startsWith('\t')) {
			continue;
		}
		const array = line.split('\t');
		if(array[0] == 'node' && array.length >= 3) {
			addNode(nodes, lockNodes, array);
		
		} else if(array[0] == 'edge' && array.length >= 2) {
			addEdge(edges, array);

		} else if(array[0] == 'node-style' && array.length >= 3) {
			const selector = array[1];
			const backgroundColor = array[2];
			const shape = array.length >= 4 ? array[3] : null;
			nodeStyles.push({
				selector: selector, 
				backgroundColor: backgroundColor,
				shape: shape,
			});

		} else if(array[0] == 'edge-style' && array.length >= 2) {
			const selector = array[1];
			const lineColor = array.length >= 3 ? array[2] : null;
			const lineStyle = array.length >= 4 ? array[3] : null;
			lineStyles.push({
				selector: selector, 
				lineColor: lineColor,
				lineStyle: lineStyle,
			});

		} else {
			console.error("tsv err line:" + line);
		}

	}

	return {nodes:nodes, edges:edges, lockNodes:lockNodes, nodeStyles:nodeStyles, lineStyles:lineStyles};

}

export function editSaveTsv(cy, lockedNodeIds, defaultStyleSelections) {
 
	const cyJson = cy.json();
	const BOADER = "#====\n";

	const NODE_HEAD = "#type\tid\tlabel\tnodeType\tparent\tx\ty\n";

	let result = NODE_HEAD;
	result += BOADER
	if (cyJson.elements.nodes) {
		for (const cyNode of cyJson.elements.nodes) {
			const id = cyNode.data.id;
			const label = cyNode.data.label;
			const classes = cyNode.classes || "";
			const parent = cyNode.data.parent || "";

			const classEx = []
			for (const c of classes.split(' ')) {
				if(c && c != '__position-locked__') {
					classEx.push(c)
				}
			}


			const isLock = lockedNodeIds.has(id);
			const x = isLock ? parseInt(cyNode.position.x) : "";
			const y = isLock ? parseInt(cyNode.position.y) : "";

			let s = "node\t" + id + "\t" + label + "\t" + classEx + "\t" + parent + "\t" + x + "\t" + y;
			result += s + "\n";
		}
	} else {
		result += "#empty nodes\n";
	}

	result += "\n"
	const EDGE_HEAD = "#type\tsource\ttarget\n";
	result += EDGE_HEAD
	result += BOADER
	if (cyJson.elements.edges) {
		for (const cyEdge of cyJson.elements.edges) {
			const source = cyEdge.data.source;
			const target = cyEdge.data.target;
			const classes = cyEdge.classes || "";

			let s = "edge\t" + source + "\t" + target + "\t" + classes;
			result += s + "\n";
		}
	} else {
		result += "#empty edges\n";
	}


	const nodeStyles = [];
	const edgeStyles = [];
	if (cyJson.style) {
		for (const sty of cyJson.style) {
			const selector = sty.selector;
			if(defaultStyleSelections.has(selector)) {
				continue;
			} else if(selector.startsWith("node.")) {
				nodeStyles.push(sty);
			} else if(selector.startsWith("edge.")) {
				edgeStyles.push(sty);
			}
		}
	}

	result += "\n"
	const NODE_STYLE_HEAD = "#type\tselector\tbackground-color\tshape\n";
	result += NODE_STYLE_HEAD
	result += BOADER
	if (nodeStyles.length > 0) {
		for (const sty of nodeStyles) {
			const selector = sty.selector;
			const backgroundColor = sty.style["background-color"] || "";
			const shape = sty.style["shape"] || "";

			let s = "node-style\t" + selector + "\t" +  backgroundColor + "\t" + shape;
			result += s + "\n";
		}

	} else {
		result += "#empty node-styles\n";
	}

	result += "\n"
	const EDGE_STYLE_HEAD = "#type\tselector\tline-color\tline-style\n";
	result += EDGE_STYLE_HEAD
	result += BOADER
	if (edgeStyles.length > 0) {
		for (const sty of edgeStyles) {
			const selector = sty.selector;
			const lineColor = sty.style["line-color"] || "";
			const lineStyle = sty.style["line-style"] || "";

			let s = "edge-style\t" + selector + "\t" +  lineColor + "\t" + lineStyle;
			result += s + "\n";
		}

	} else {
		result += "#empty edge-styles\n";
	}

	return result;
}

function addNode(nodes, lockNodes, array) {
	const id = array[1];
	const label = array[2];
	const nodeType = array.length >= 4 ? array[3] : null;
	const parent = array.length >= 5 ? array[4] : null;
	const x = array.length >= 6 ? array[5] : null;
	const y = array.length >= 7 ? array[6] : null;

	const newElm = {data: {id: id, label: label}};
	
	var classArray = nodeType ? nodeType.split(" ") : [];
	if(x && y) {
		classArray.push('__position-locked__');
	}
	newElm["classes"] = classArray;
	
	if(parent) {
		newElm.data["parent"] = parent;
	}


	nodes.push(newElm);


	if(x && y) {
		lockNodes.push({
			nodeId:id,
			position: {x:parseInt(x) , y:parseInt(y)}
		});
	}
}


function addEdge(edges, array) {
	const source = array[1];
	const target = array[2];
	const edgeType = array.length >= 4 ? array[3] : null;

	const newElm = {
		data: {id: source + "_" + target, source: source, target: target}
	};

	var classArray = edgeType ? edgeType.split(" ") : [];
	newElm["classes"] = classArray;

	edges.push(newElm);
}