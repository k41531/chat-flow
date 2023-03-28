import React from 'react';

export default () => {
  const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className='sidebar'>
      <h2>Node</h2>
      <div className="dndnode" onDragStart={(event) => onDragStart(event, 'system')} draggable>
        System
      </div>
      <div className="dndnode input" onDragStart={(event) => onDragStart(event, 'user')} draggable>
        User
      </div>
      <div className="dndnode output" onDragStart={(event) => onDragStart(event, 'assistant')} draggable>
        Assistant
      </div>
    </aside>
  );
};
