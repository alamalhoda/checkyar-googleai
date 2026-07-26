export type ChartType =
  | 'line'
  | 'bar'
  | 'area'
  | 'donut'
  | 'pie'
  | 'scatter'
  | 'heatmap'
  | 'treemap'
  | 'rangeBar';

export interface ChartSeriesItem {
  name: string;
  data: Array<number | { x: any; y: any; z?: any }>;
  type?: string;
}

export interface ChartClickEventData {
  seriesIndex: number;
  dataPointIndex: number;
  config: any;
  selectedX?: any;
  selectedY?: any;
}
