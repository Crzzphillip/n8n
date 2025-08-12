import dynamic from 'next/dynamic';

const NodeViewNew = dynamic(() => import('../../../../components/editor/NodeViewNew'), {
  ssr: false,
});

export default function NewWorkflowPage() {
  return <NodeViewNew />;
}