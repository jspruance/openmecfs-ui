/* eslint-disable @typescript-eslint/no-explicit-any */
declare module "react-force-graph-2d" {
  import { ComponentType, Ref } from "react";

  export interface ForceGraphInstance {
    zoomToFit: (duration?: number) => void;
    d3ReheatSimulation: () => void;
  }

  export interface ForceGraphProps {
    ref?: Ref<ForceGraphInstance>;
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
    d3ForceCharge?: number | ((node: any) => number);
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
