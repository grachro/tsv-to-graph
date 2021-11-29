export function getDefaultStyle() {
	const map = new Map();

 
 
 
	map.set('edge', {
		'target-arrow-shape': 'triangle',
		'curve-style': 'bezier',
	});

	map.set('edge:selected', {
		'line-color': '#ff0a0a',
	});
	return map;
}