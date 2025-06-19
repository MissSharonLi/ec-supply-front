// src/global.d.ts
import type { VNode } from 'vue'

// jsx 语法
declare global {
  namespace JSX {
    interface Element extends VNode {}
    interface IntrinsicElements {
      [elem: string]: any
    }
    interface ElementAttributesProperty {
      $props: any
    }
  }
}
