export function loadTsv(tsv) {
	const nodes = [];
	const edges = [];
	const lockNodes = [];
	const nodeStyles = [];
	const lineStyles = [];

	const _tsvNodeIds = new Set();

	const tsvLines = tsv.split('\n');
	for (const line of tsvLines) {
		if(!line || line.empty || line.startsWith('#') || line.startsWith('\t')) {
			continue;
		}
		const array = line.split('\t');
		if(array[0] == 'node' && array.length >= 3) {
			const newNode =  createNode(lockNodes, array);
			nodes.push(newNode);
			_tsvNodeIds.add(newNode.data.id);
		} else if(array[0] == 'edge' && array.length >= 2) {
			const newEdge = createEdge(array);
			edges.push(newEdge);
		} else if(array[0] == 'node-style' && array.length >= 3) {
			const selector = array[1];
			const backgroundColor = array.length >= 3 ? array[2] : null;
			const shape = array.length >= 4 ? array[3] : null;
			const label = array.length >= 5 ? array[4] : null;
			const	padding = array.length >= 6 ? array[5] : null;
			const	width = array.length >= 7 ? array[6] : null;
			const	height = array.length >= 8 ? array[7] : null;
			const	text_halign = array.length >= 9 ? array[8] : null;
			const	text_valign = array.length >= 10 ? array[9] : null;
			const	background_opacity = array.length >= 11 ? array[10] : null;
			const	border_color = array.length >= 12 ? array[11] : null;
			const	border_style = array.length >= 13 ? array[12] : null;
			const	border_width = array.length >= 14 ? array[13] : null;

			nodeStyles.push({
				selector: selector, 
				backgroundColor: backgroundColor,
				shape: shape,
				label:label,
				padding:padding,
				width:width,
				height:height,
				text_halign:text_halign,
				text_valign:text_valign,
				background_opacity:background_opacity,
				border_color:border_color,
				border_style:border_style,
				border_width:border_width,
			});

		} else if(array[0] == 'edge-style' && array.length >= 2) {
			const selector = array[1];
			const lineColor = array.length >= 3 ? array[2] : null;
			const lineStyle = array.length >= 4 ? array[3] : null;
			const curveStyle = array.length >= 5 ? array[4] : null;
			const targetArrowShape = array.length >= 6 ? array[5] : null;
			lineStyles.push({
				selector: selector, 
				lineColor: lineColor,
				lineStyle: lineStyle,
				curveStyle: curveStyle,
				targetArrowShape: targetArrowShape,
			});

		} else {
			console.error("tsv err line:" + line);
		}
	}

	// for (const _tsvNodeId of _tsvNodeIds) {
	// 	console.log("_tsvNodeId:" + _tsvNodeId);
	// }

	//edge???????????????????????????????????????node????????????????????????NodeId?????????
	const unregisteredNodeIds  = new Set();
	for (const edge of edges) {
		if(!_tsvNodeIds.has(edge.data.source)) {
			unregisteredNodeIds.add(edge.data.source);
		}

		if(!_tsvNodeIds.has(edge.data.target)) {
			unregisteredNodeIds.add(edge.data.target);
		}
	}
	for(const nodeId of unregisteredNodeIds) {
		const newElm = {data: {id: nodeId, label: nodeId}};
		nodes.push(newElm);
	}


	return {nodes:nodes, edges:edges, lockNodes:lockNodes, nodeStyles:nodeStyles, lineStyles:lineStyles};

}


function createNode(lockNodes, array) {
	const id = array[1];
	const label = array[2];
	const nodeType = array.length >= 4 ? array[3] : null;
	const parent = array.length >= 5 ? (array[4] ? array[4]: null) : null;
	const x = array.length >= 6 ? array[5] : null;
	const y = array.length >= 7 ? array[6] : null;

	const newElm = {data: {id: id, label: label}};
	
	var classArray = nodeType ? nodeType.split(" ") : [];
	if(x && y) {
		classArray.push('__position-locked__');
	}
	newElm["classes"] = classArray;
	
	newElm.data["parent"] = parent;
	
	if(x && y) {
		lockNodes.push({
			nodeId:id,
			position: {x:parseInt(x) , y:parseInt(y)}
		});
	}

	return newElm;
}


function createEdge(array) {
	const source = array[1];
	const target = array[2];
	const edgeType = array.length >= 4 ? array[3] : null;

	const newElm = {
		data: {id: source + "_" + target, source: source, target: target}
	};

	var classArray = edgeType ? edgeType.split(" ") : [];
	newElm["classes"] = classArray;

	return newElm;
}