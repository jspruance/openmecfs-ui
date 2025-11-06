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
    nodeAutoColorBy?: string;
    cooldownTicks?: number;
    linkColor?: string | ((link: any) => string);
    linkOpacity?: number;
    linkWidth?: number | ((link: any) => number);
    d3Force?: string;
    d3ForceCharge?: number | ((node: any) => number);
    d3ForceLinkDistance?: number | ((link: any) => number);
    d3ForceLinkStrength?: number;
    d3AlphaDecay?: number;
    d3VelocityDecay?: number;
    enableNodeDrag?: boolean;
    nodeCanvasObject?: (
      node: any,
      ctx: CanvasRenderingContext2D,
      scale: number
    ) => void;
    onNodeClick?: (node: any) => void;
    onNodeHover?: (node: any | null) => void;
    onEngineStop?: () => void;
  }

  const ForceGraph2D: ComponentType<ForceGraphProps>;
  export default ForceGraph2D;
}
