export function createMouseMenuItems(lockNodePosition, unlockNodePosition, selectFirstNeighborhood, deleteNodes) {

	const _myMenuItems = [
		{
			id: 'lockPosition',
			content: 'lock position',
			tooltipText: 'lock position',
			selector: 'node[!.__position-locked__]',
			onClickFunction: function (event) {
				var targetNode = event.target || event.cyTarget;
				lockNodePosition(targetNode)
			},
		},
		{
			id: 'unlockPosition',
			content: 'unlock position',
			tooltipText: 'unlock position',
			selector: 'node.__position-locked__',
			onClickFunction: function (event) {
				var targetNode = event.target || event.cyTarget;
				unlockNodePosition(targetNode)
			},
			hasTrailingDivider: true
		}, 
		{
			id: 'selectFirstNeighborhood',
			content: 'select first neighborhood',
			tooltipText: 'select first neighborhood',
			selector: 'node',
			onClickFunction: function (event) {
				var targetNode = event.target || event.cyTarget;
				selectFirstNeighborhood(targetNode)
			},
		}, 
		{
			id: 'deleteNodes',
			content: 'delete nodes',
			tooltipText: 'delete nodes',
			selector: 'node',
			onClickFunction: function (event) {
				var targetNode = event.target || event.cyTarget;
				deleteNodes(targetNode)
			},
		},  
	];

	return _myMenuItems
}
