export function getDefaultStyle() {
	const map = new Map();

	map.set('node', {
		'shape': 'round-rectangle',
		'background-color': '#ddd',
		'label': 'data(label)',
		'padding': '10px',
		'width': 'label',
		'height': 'label',
		'text-halign': 'center',
		'text-valign': 'center',
	});

	map.set('node.normalNode', {
		'background-color': '#ff7f7f',
	});

	map.set(':parent', {
		'background-color': '#7f7fff',
		'label': 'data(label)',
		'padding': '10px',
		'text-halign': 'center',
		'text-valign': 'top',
		'background-opacity': 0.1
	});

	map.set('node.__position-locked__', {
		'border-width': '2px',
		'border-style': 'solid',
		'border-color': 'black',
	});

	map.set('node:selected', {
		'border-width': '3px',
		'border-style': 'solid',
		'border-color': '#ff0a0a',
	});

	map.set('edge', {
		'target-arrow-shape': 'triangle',
		'curve-style': 'bezier',
	});

	map.set('edge:selected', {
		'line-color': '#ff0a0a',
	});
	return map;
}