export function tsvToCyElementsAndLockNodes(tsv) {
	const nodes = [];
	const edges = [];
	const lockNodes = [];

	const tsvLines = tsv.split('\n');
	for (const line of tsvLines) {
		if(!line || line.empty || line.startsWith('#') || line.startsWith('\t')) {
			continue;
		}
		const array = line.split('\t');
		if(array[0] == 'node' && array.length >= 3) {
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
		
		} else if(array[0] == 'edge' && array.length >= 2) {
			const source = array[1];
			const target = array[2];
			edges.push({
				data: {id: source + "_" + target, source: source, target: target}
			});

		} else {
			console.error("tsv err line:" + line);
		}

	}

	return {nodes:nodes, edges:edges, lockNodes:lockNodes};

}

export function editSaveTsv(cy, lockedNodeIds) {
 
	const NODE_HEAD = "#type\tid\tlabel\tnodeType\tparent\tx\ty\n";
	const EDGE_HEAD = "#type\tsource\ttarget\n";

	const cyJson = cy.json();

	let result = NODE_HEAD;
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

	result += EDGE_HEAD
	if (cyJson.elements.edges) {
		for (const cyEdge of cy.json().elements.edges) {
			const source = cyEdge.data.source;
			const target = cyEdge.data.target;

			let s = "edge\t" + source + "\t" + target;
			result += s + "\n";
		}
	} else {
		result += "#empty edges\n";
	}
	return result;
}