import { Component } from 'vue';

export interface CustomTooltip {
  id: string;
  content: string | Component;
  trigger: string | string[];
  appearance?: {
    theme?: 'light' | 'dark' | 'custom';
    position?: 'top' | 'bottom' | 'left' | 'right';
    offset?: number;
    animation?: string;
    customClass?: string;
  };
  portal?: {
    target?: string;
    strategy?: 'fixed' | 'absolute';
  };
}
