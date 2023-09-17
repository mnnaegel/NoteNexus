import dynamic from 'next/dynamic';
import ForceGraph, { GraphProps } from './ForceGraph';

const DynamicComponent = dynamic(
  () => import('./ForceGraph'),
  { ssr: false }
);

const DynamicForceGraph: React.FC<GraphProps> = ({ nodes, links }) => {
  return (
    <div>
      <DynamicComponent nodes={nodes} links={links} />
    </div>
  );
};

export default DynamicForceGraph;
