import React, { memo, MouseEventHandler } from 'react';
import { Handle, Position } from 'reactflow';
import { NodeResizer } from '@reactflow/node-resizer';
import '@reactflow/node-resizer/dist/style.css';

type SystemNodeProps = {
  id: string,
  data: {
    onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    content: string;
    label: string;
  };
};

export default memo(({ id, data } : SystemNodeProps)  => {
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    data.content = e.target.value;
    data.onChange(e);
  };

  const onClick : MouseEventHandler<HTMLDivElement> = (e) => {
    data.onClick(e);
  };

  return (
    <>
      <NodeResizer minWidth={100} minHeight={30} />
      <div className='node' role="button" tabIndex={0} onClick={onClick}>
        <label>System Prompt</label>
        <textarea id={id} name={data.label} onChange={onChange} defaultValue={data.content}>
        </textarea>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        id="a"
        style={{ background: '#555' }}
      />
    </>
  );
});