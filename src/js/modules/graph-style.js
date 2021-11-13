 export const defaultStyle = [
	{
		selector: 'node',
		style: {
			'shape': 'round-rectangle',
			'background-color': '#ddd',
			'label': 'data(label)',
			'padding': '10px',
			'width': 'label',
			'height': 'label',
			'text-halign': 'center',
			'text-valign': 'center',
		}
	},
	{
		selector: 'node.normalNode',
		style: {
			'background-color': '#ff7f7f',
		}
	},
	{
		selector: 'node.back-red',
		style: {
			'background-color': '#ff7f7f',
		}
	},
	{
		selector: 'node.back-green',
		style: {
			'background-color': '#bfff7f',
		}
	},
	{
		selector: ':parent',
		style: {
			'background-color': '#7f7fff',
			'label': 'data(label)',
			'padding': '10px',
			'text-halign': 'center',
			'text-valign': 'top',
			'background-opacity': 0.1
		}
	},
	{
		selector: 'node.__position-locked__',
		style: {
			'border-width': '2px',
			'border-style': 'solid',
			'border-color': 'black',
		}
	},
	{
		selector: 'node:selected',
		style: {
			'border-width': '3px',
			'border-style': 'solid',
			'border-color': '#ff0a0a',
		}
	},
	{
		selector: 'edge',
		style: {
			'target-arrow-shape': 'triangle',
			'curve-style': 'bezier'
		}
	}
];