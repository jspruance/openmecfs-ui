/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Minimal type declaration for react-plotly.js
 * to silence TypeScript until an official type package exists.
 */

declare module "react-plotly.js" {
  import { Component } from "react";

  export interface PlotParams {
    data: any[];
    layout?: Record<string, any>;
    config?: Record<string, any>;
    style?: Record<string, any>;
    onClick?: (event: any) => void;
  }

  export default class Plot extends Component<PlotParams> {}
}
