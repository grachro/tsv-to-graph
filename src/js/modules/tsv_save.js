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