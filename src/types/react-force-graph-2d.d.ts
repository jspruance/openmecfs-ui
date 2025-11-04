/* eslint-disable @typescript-eslint/no-explicit-any */
declare module "react-force-graph-2d" {
  import { ComponentType } from "react";

  export interface ForceGraphProps {
    graphData: any;
    width?: number;
    height?: number;
    backgroundColor?: string;
    nodeRelSize?: number;
    cooldownTicks?: number;
    linkColor?: string | ((link: any) => string);
    linkOpacity?: number;
    linkWidth?: number | ((link: any) => number);
    d3Force?: string;
    d3AlphaDecay?: number;
    d3VelocityDecay?: number;
    nodeCanvasObject?: (
      node: any,
      ctx: CanvasRenderingContext2D,
      scale: number
    ) => void;
    onNodeClick?: (node: any) => void;
    onNodeHover?: (node: any | null) => void;
  }

  const ForceGraph2D: ComponentType<ForceGraphProps>;
  export default ForceGraph2D;
}
