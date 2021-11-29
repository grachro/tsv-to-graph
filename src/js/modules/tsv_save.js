
const BOADER = "#====\n";

export function editSaveTsv(cy, lockedNodeIds) {
 
	const cyJson = cy.json();

	let result = "";
	result += nodesToTsv(cy.nodes(), lockedNodeIds);

	result += "\n"
	result += edgesToTsv(cy.edges());
 
	const nodeStyles = [];
	const edgeStyles = [];
	if (cyJson.style) {
		for (const sty of cyJson.style) {
			const selector = sty.selector;
			if(selector.startsWith("node")) {
				nodeStyles.push(sty);
			} else if(selector.startsWith("edge")) {
				edgeStyles.push(sty);
			} else {
				console.warn("skip selector::" + selector);
			}
		}
	}

	result += "\n"
	const NODE_STYLE_HEAD = "#type\tselector\tbackground-color\tshape\tlabel\tpadding\twidth\theight\ttext-halign\ttext-valign\tbackground-opacity\tborder-color\tborder-style\tborder-width\n";
	result += NODE_STYLE_HEAD
	result += BOADER
	if (nodeStyles.length > 0) {
		for (const sty of nodeStyles) {
			const selector = sty.selector;
			const backgroundColor = sty.style["background-color"] || "";
			const shape = sty.style["shape"] || "";

			const label = sty.style["label"] || "";
			const padding = sty.style["padding"] || "";
			const width = sty.style["width"] || "";
			const height = sty.style["height"] || "";
			const text_halign = sty.style["text-halign"] || "";
			const text_valign = sty.style["text-valign"] || "";
			const background_opacity = sty.style["background-opacity"] || "";
			const border_color = sty.style["border-color"] || "";
			const border_style = sty.style["border-style"] || "";
			const border_width = sty.style["border-width"] || "";

			let s = "node-style\t";
			s += selector + "\t";
			s += backgroundColor + "\t"
			s += shape + "\t"
			s += label + "\t"
			s += padding + "\t"
			s += width + "\t"
			s += height + "\t"
			s += text_halign + "\t"
			s += text_valign + "\t"
			s += background_opacity + "\t"
			s += border_color + "\t"
			s += border_style + "\t"
			s += border_width + "\n"
			result += s;
		}

	} else {
		result += "#empty node-styles\n";
	}

	result += "\n"
	const EDGE_STYLE_HEAD = "#type\tselector\tline-color\tline-style\tcurve-style\ttarget-arrow-shape\n";
	result += EDGE_STYLE_HEAD
	result += BOADER
	if (edgeStyles.length > 0) {
		for (const sty of edgeStyles) {
			const selector = sty.selector;
			const lineColor = sty.style["line-color"] || "";
			const lineStyle = sty.style["line-style"] || "";
			const curveStyle = sty.style["curve-style"] || "";
			const targetArrowShape = sty.style["target-arrow-shape"] || "";

			let s = "edge-style\t" 
			s += selector + "\t"
			s += lineColor + "\t"
			s += lineStyle + "\t"
			s += curveStyle + "\t"
			s += targetArrowShape + "\n"
			result += s;
		}

	} else {
		result += "#empty edge-styles\n";
	}

	return result;
}

function nodesToTsv(nodes, lockedNodeIds) {

	const NODE_HEAD = "#type\tnodeId\tlabel\tnodeType\tparentNodeId\tx\ty\n";
	let result = NODE_HEAD;
	result += BOADER

	if (!nodes || nodes.length == 0) {
		result += "#empty nodes\n";
		return result;
	}

	for (const cyNode of nodes.jsons()) {
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

	return result;
 
}


function edgesToTsv(edges) {

	const EDGE_HEAD = "#type\tsourceNodeId\ttargetNodeId\n";
	let result = EDGE_HEAD;
	result += BOADER

	if (!edges || edges.length == 0) {
		result += "#empty edges\n";
		return result;
	}

	
	for (const cyEdge of edges.jsons()) {
		const source = cyEdge.data.source;
		const target = cyEdge.data.target;
		const classes = cyEdge.classes || "";

		let s = "edge\t" + source + "\t" + target + "\t" + classes;
		result += s + "\n";
	}
 
	return result;
}


export function editSeclectedTsv(cy, lockedNodeIds) {
	let result = "";

	
	var nodeList =  cy.collection();
	cy.nodes( ":selected" ).forEach(node => {
		console.log("node=" + node.id())
		nodeList = nodeList.union(node);
	});
	console.log("nodeList=" + nodeList.length)

	result += nodesToTsv(nodeList, lockedNodeIds);
 

	result += "\n"
	result += edgesToTsv(cy.edges(":selected"));
	return result;
}