import { useState, useRef, useCallback } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Connection,
  Edge,
  Background,
  useReactFlow
} from 'reactflow';
import 'reactflow/dist/style.css';
import Sidebar from './components/Sidebar';
import AssistanNode from './components/nodes/AssistanNode';
import SystemNode from './components/nodes/SystemNode';
import UserNode from './components/nodes/UserNode';
import ChatWindow from './components/ChatWindow';

import { chatResponse } from "./chat";
import { getSelectedNodes } from "./utility";

import './index.css';
type Message = {
  role: string;
  content: string;
};

const nodeTypes = {
  system: SystemNode,
  user: UserNode,
  assistant: AssistanNode
};

const flowKey = 'flow-data';

const getId = () => `${Date.now().toString(36)}`;

const DnDFlow = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);;
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const { setViewport } = useReactFlow();

  const onConnect = useCallback((params: Edge<any> | Connection) => setEdges((eds) => addEdge(params, eds)), []);

  const onDragOver = useCallback((event: { preventDefault: () => void; dataTransfer: { dropEffect: string; }; }) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const handleNodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (reactFlowInstance) {
      const flow = reactFlowInstance.toObject();
      setMessages(getSelectedNodes(JSON.stringify(flow)));
    }
  };

  const handleNodeClick = (e: React.ChangeEvent<HTMLDivElement>) => {
    if (reactFlowInstance) {
      const flow = reactFlowInstance.toObject();
      setMessages(getSelectedNodes(JSON.stringify(flow)));
    }
  };

  const onDrop = useCallback(
    (event: { preventDefault: () => void; dataTransfer: { getData: (arg0: string) => any; }; clientX: number; clientY: number; }) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      if (!reactFlowBounds) {
        return;
      }

      const type = event.dataTransfer.getData('application/reactflow');
      if (typeof type === 'undefined' || !type) {
        return;
      }

      if (!reactFlowInstance) {
        return;
      }
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode = {
        id: getId(),
        type,
        position,
        data: {
          label: `${type}`,
          content: '',
          onChange: handleNodeChange,
          onClick: handleNodeClick,
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );

  const sendMessage = async () => {
    const response = await chatResponse(messages);
    const message = response.response.choices[0].message;
    console.log(message);

    const newNode = {
      id: getId(),
      type: message.role,
      position: { x: 0, y: 0 },
      data: {
        label: `${message.role}`,
        content: message.content,
        onChange: handleNodeChange,
        onClick: handleNodeClick
      },
    };
    setNodes((nds) => nds.concat(newNode));
  }

  const onSave = useCallback(() => {
    if (reactFlowInstance) {
      const flow = reactFlowInstance.toObject();
      localStorage.setItem(flowKey, JSON.stringify(flow));
    }
  }, [reactFlowInstance]);

  const onRestore = useCallback(() => {
    const restoreFlow = async () => {
      const loadData = localStorage.getItem(flowKey);
      if (!loadData) return;

      const flow = JSON.parse(loadData);
      if (flow) {
        const { x = 0, y = 0, zoom = 1 } = flow.viewport;
        setNodes(flow.nodes || []);
        setNodes((nds) =>
          nds.map((node) => {
            return {
              ...node,
              data: {
                ...node.data,
                onChange: handleNodeChange,
                onClick: handleNodeClick,
              },
            };
          })
        );
        setEdges(flow.edges || []);
        setViewport({ x, y, zoom });
      }
    };

    restoreFlow();
  }, [setNodes, setViewport, reactFlowInstance]);

  return (
    <>
      <Sidebar />
      <div className="reactflow-wrapper" style={{background:'#f5f5ff'}}ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          snapToGrid={true}
          fitView
        >
          <div className="save__controls">
            <button className='react-flow__controls-button' onClick={onSave}>
            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-device-floppy" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="#000" fill="none" stroke-linecap="round" stroke-linejoin="round">
               <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
               <path d="M6 4h10l4 4v10a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2"></path>
               <path d="M12 14m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
               <path d="M14 4l0 4l-6 0l0 -4"></path>
            </svg> 
            </button>
            <button className='react-flow__controls-button' onClick={onRestore}>
            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-upload" width="24" height="24" viewBox="0 0 24 24" stroke-width="3" stroke="#000" fill="none" stroke-linecap="round" stroke-linejoin="round">
               <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
               <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2"></path>
               <path d="M7 9l5 -5l5 5"></path>
               <path d="M12 4l0 12"></path>
            </svg>
              
            </button>
          </div>
          <Controls />
        </ReactFlow>
      </div>
      <ChatWindow messages={messages} onClickSendButton={sendMessage} />
    </>
  );
};

export default () => (
  <div className="dndflow">
    <ReactFlowProvider>
      <DnDFlow />
    </ReactFlowProvider>
  </div>
);