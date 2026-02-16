/**
 * React Integration
 * 
 * Provides a "React-like" experience for defining tables.
 * This file re-exports the JSX factory as 'h' and 'React'.
 */

import * as JSXFactory from './jsx';

export const h = JSXFactory.createElement;
export const React = { createElement: JSXFactory.createElement };
export const render = JSXFactory.render;

// Re-export types if needed
export { JSX } from './jsx';
