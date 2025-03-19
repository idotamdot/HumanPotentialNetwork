declare module 'react-simple-maps' {
  import React from 'react';
  
  export interface ComposableMapProps {
    projectionConfig?: any;
    projection?: string;
    width?: number;
    height?: number;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
    [key: string]: any;
  }
  
  export interface ZoomableGroupProps {
    center?: [number, number];
    zoom?: number;
    minZoom?: number;
    maxZoom?: number;
    translateExtent?: [[number, number], [number, number]];
    onMoveStart?: (position: any) => void;
    onMove?: (position: any) => void;
    onMoveEnd?: (position: any) => void;
    children?: React.ReactNode;
    [key: string]: any;
  }
  
  export interface GeographiesProps {
    geography: string | object;
    children: (props: { geographies: any[] }) => React.ReactNode;
    [key: string]: any;
  }
  
  export interface GeographyProps {
    geography: any;
    style?: {
      default?: React.CSSProperties;
      hover?: React.CSSProperties;
      pressed?: React.CSSProperties;
    };
    [key: string]: any;
  }
  
  export interface MarkerProps {
    coordinates: [number, number];
    style?: {
      default?: React.CSSProperties;
      hover?: React.CSSProperties;
      pressed?: React.CSSProperties;
    };
    children?: React.ReactNode;
    [key: string]: any;
  }
  
  export const ComposableMap: React.FC<ComposableMapProps>;
  export const ZoomableGroup: React.FC<ZoomableGroupProps>;
  export const Geographies: React.FC<GeographiesProps>;
  export const Geography: React.FC<GeographyProps>;
  export const Marker: React.FC<MarkerProps>;
}