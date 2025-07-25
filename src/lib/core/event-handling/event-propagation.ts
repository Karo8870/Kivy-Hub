import { RefObject } from 'react';
import { HandEvent } from '@/lib/core/hand-tracking/hand-tracking-types';

const handEvents = {
  [-1]: 'no-touch',
  [0]: 'primary-touch',
  [1]: 'secondary-touch',
  [2]: 'tertiary-touch'
};

function sortByStacking(elements: any[]) {
  function getContextChain(el: any) {
    const chain = [];
    while (el) {
      const style = getComputedStyle(el);
      if (
        el === document.documentElement ||
        (/(absolute|relative|fixed|sticky)/.test(style.position) &&
          style.zIndex !== 'auto') ||
        parseFloat(style.opacity) < 1 ||
        style.transform !== 'none' ||
        style.mixBlendMode !== 'normal' ||
        style.filter !== 'none'
      ) {
        chain.unshift(el);
      }
      el = el.parentElement;
    }
    return chain;
  }

  function zIndexValue(el: any) {
    const z = getComputedStyle(el).zIndex;
    return isNaN(parseInt(z, 10)) ? 0 : parseInt(z, 10);
  }

  function compareContexts(aCtx: any[], bCtx: any[]) {
    for (let i = 0; i < Math.min(aCtx.length, bCtx.length); i++) {
      if (aCtx[i] !== bCtx[i]) {
        const aZ = zIndexValue(aCtx[i]),
          bZ = zIndexValue(bCtx[i]);
        if (aZ !== bZ) return aZ - bZ;
        return aCtx[i].compareDocumentPosition(bCtx[i]) &
          Node.DOCUMENT_POSITION_PRECEDING
          ? 1
          : -1;
      }
    }

    return aCtx.length - bCtx.length;
  }

  function stackingComparator(a: Element, b: Element) {
    const aChain = getContextChain(a).concat(a);
    const bChain = getContextChain(b).concat(b);

    const result = compareContexts(aChain, bChain);
    if (result !== 0) return result;

    const aZ = zIndexValue(a),
      bZ = zIndexValue(b);
    if (aZ !== bZ) return aZ - bZ;
    return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_PRECEDING
      ? 1
      : -1;
  }

  return Array.from(elements).sort(stackingComparator);
}

export function dispatchEvent(
  element: Element,
  x: number,
  y: number,
  eventType: string,
  handIndex: number,
  type = 'hand'
) {
  element.dispatchEvent(
    new CustomEvent(eventType, {
      bubbles: true,
      cancelable: true,
      detail: {
        clientX: x,
        clientY: y,
        type,
        handIndex
      }
    })
  );
}

export function eventPropagation(
  hoveredElements: RefObject<Set<Element>>,
  hoveredElementEvents: RefObject<Map<Element, HandEvent>>,
  x: number,
  y: number,
  eventType: HandEvent,
  handIndex: number,
  newlyHovered?: Element[]
) {
  const elementsAtPoint = newlyHovered ?? [
    sortByStacking(
      document
        .elementsFromPoint(x, y)
        .filter(
          (el) => el.getAttribute('data-can-interact')?.[eventType] === '1'
        )
    )[0]
  ];

  const currentElementsSet = new Set(elementsAtPoint);

  elementsAtPoint.forEach((element) => {
    if (!element) return;

    if (!hoveredElements.current.has(element)) {
      hoveredElementEvents.current.set(element, eventType);
      dispatchEvent(element, x, y, handEvents[eventType] + '-down', handIndex);
    }
  });

  hoveredElements.current.forEach((element) => {
    if (!element) return;

    if (!currentElementsSet.has(element)) {
      dispatchEvent(
        element,
        x,
        y,
        handEvents[hoveredElementEvents.current.get(element)!] + '-up',
        handIndex
      );
    } else if (hoveredElementEvents.current.get(element) !== eventType) {
      dispatchEvent(
        element,
        x,
        y,
        handEvents[hoveredElementEvents.current.get(element)!] + '-up',
        handIndex
      );
      hoveredElementEvents.current.delete(element);
    }
  });

  hoveredElements.current = currentElementsSet;
}
