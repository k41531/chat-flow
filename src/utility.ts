export function getSelectedNodes(json_data:string) {
  let nodes = [];
  const json = JSON.parse(json_data)
  const selectedNode = json.nodes.find((node: { selected: boolean; }) => node.selected) || null;
  
  let currentNode = selectedNode;
  while (currentNode) {
    nodes.push({
      role:currentNode.data.label,
      content:currentNode.data.content
    });
    
    const edge = json.edges.find((edge: { source: string; }) => edge.source === currentNode.id);
    const nextNodeId = edge?.target;
    currentNode = nextNodeId ? json.nodes.find((node: { id: string; }) => node.id === nextNodeId) : null;

  }

  // 巻き戻し
  const edge = json.edges.find((edge: { target: string; }) => edge.target === selectedNode.id);
  if (!edge) return nodes;
  
  let prevNode = json.nodes.find((node: { id: string; }) => node.id === edge.source);
  while (prevNode) {
    nodes.unshift({
      role:prevNode.data.label,
      content:prevNode.data.content
    });
    
    const edge = json.edges.find((edge: { target: string; }) => edge.target === prevNode.id);
    const prevNodeId = edge?.source;
    prevNode = prevNode ? json.nodes.find((node: { id: string; }) => node.id === prevNodeId) : null;
  }

  return nodes;
}