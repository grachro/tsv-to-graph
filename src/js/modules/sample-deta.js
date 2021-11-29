export const sampleData = `#type	id	label	nodeType	parent	x	y
#====
node	n1	node 1	TypeA			
node	n2	node 2	TypeA			
node	n3	node 3	TypeA			
node	n4	node 4	TypeA			
node	n5	node 5	TypeB	n10		
node	n6	node 6	TypeB	n10		
node	n7	node 7		n11		
node	n8	node 8	TypeC	n11		
node	n9	node 9		n12		
node	n10	node 10				
node	n11	node 11		n13		
node	n12	node 12		n13		
node	n13	node 13				

#type	source	target	targetType
#====
edge	n1	n2
edge	n1	n3	TypeO
edge	n3	n4	
edge	n2	n4	TypeP
edge	n4	n5
edge	n5	n6
edge	n7	n8
edge	n6	n7	TypeQ
edge	n11	n12	TypeR
edge	n2	n12

#type	selector	background-color	shape	label	padding	width	height	text-halign	text-valign	background-opacity	border-color	border-style	border-width
#====													
node-style	node	#ddd	round-rectangle	data(label)	10px	label	label	center	center				
node-style	node.normalNode	#ff7f7f											
node-style	node:parent	#7f7fff		data(label)	10px			center	top	0.1			
node-style	node.__position-locked__										#000	solid	2px
node-style	node:selected										#ff0a0a	solid	3px
node-style	node.TypeA	#7fbfff	
node-style	node.TypeB		round-octagon
node-style	node.TypeC	#ff7f7f	ellipse

#type	selector	line-color	line-style
#====
edge-style	edge.TypeO	#bf7fff	solid
edge-style	edge.TypeP		dotted
edge-style	edge.TypeQ	#ffbf7f
edge-style	edge.TypeR	#ffbf7f	dashed
`;