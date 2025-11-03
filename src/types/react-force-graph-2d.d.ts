declare module "react-force-graph-2d" {
  import { ComponentType } from "react";

  export interface ForceGraphProps {
    graphData: any;
    width?: number;
    height?: number;
    backgroundColor?: string;
    nodeRelSize?: number;
    cooldownTicks?: number;
    nodeCanvasObject?: (
      node: any,
      ctx: CanvasRenderingContext2D,
      scale: number
    ) => void;
    onNodeClick?: (node: any) => void;
  }

  const ForceGraph2D: ComponentType<ForceGraphProps>;
  export default ForceGraph2D;
}
