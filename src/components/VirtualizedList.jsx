import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';

/**
 * Enterprise React Virtualized List Component
 * 
 * Renders large datasets (10 to 100,000+ items) with buttery-smooth 60fps scrolling
 * by maintaining a constant, tiny DOM footprint (<30 rendered nodes).
 * 
 * @param {Array} items - Full dataset array
 * @param {number} itemHeight - Height of each individual row in pixels (default: 56)
 * @param {number|string} height - Height of scroll viewport (default: 500)
 * @param {Function} renderItem - Render prop: (item, index, style) => ReactNode
 * @param {number} overscan - Extra items to render above & below viewport (default: 5)
 * @param {ReactNode} emptyMessage - Content displayed when items array is empty
 */
export const VirtualizedList = ({
  items = [],
  itemHeight = 56,
  height = 500,
  renderItem,
  overscan = 5,
  className = '',
  emptyMessage = 'No records found.'
}) => {
  const containerRef = useRef(null);
  const [scrollTop, setScrollTop] = useState(0);

  // Throttled scroll listener using requestAnimationFrame for GPU performance
  const onScroll = useCallback((e) => {
    const currentScrollTop = e.currentTarget.scrollTop;
    requestAnimationFrame(() => {
      setScrollTop(currentScrollTop);
    });
  }, []);

  const totalHeight = items.length * itemHeight;

  // Calculate visible slice range based on scroll offset
  const { startIndex, endIndex } = useMemo(() => {
    const parsedHeight = typeof height === 'number' ? height : 500;
    const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const end = Math.min(
      items.length - 1,
      Math.floor((scrollTop + parsedHeight) / itemHeight) + overscan
    );
    return { startIndex: start, endIndex: end };
  }, [scrollTop, itemHeight, height, items.length, overscan]);

  // Generate virtualized items with translation coordinates
  const visibleItems = useMemo(() => {
    if (items.length === 0) return [];
    const result = [];
    for (let i = startIndex; i <= endIndex; i++) {
      const item = items[i];
      if (item !== undefined) {
        result.push({
          item,
          index: i,
          style: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: `${itemHeight}px`,
            transform: `translate3d(0, ${i * itemHeight}px, 0)`,
            willChange: 'transform'
          }
        });
      }
    }
    return result;
  }, [items, startIndex, endIndex, itemHeight]);

  if (items.length === 0) {
    return (
      <div
        className={`flex items-center justify-center p-8 text-slate-400 font-mono text-sm border border-slate-700/50 rounded-xl bg-slate-800/30 ${className}`}
        style={{ height }}
      >
        {emptyMessage}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onScroll={onScroll}
      className={`relative overflow-y-auto overflow-x-hidden rounded-xl border border-[#334155] bg-slate-900/60 custom-scrollbar ${className}`}
      style={{ height, contain: 'strict' }}
    >
      {/* Phantom spacer div providing total native scroll height */}
      <div style={{ height: `${totalHeight}px`, width: '100%', position: 'relative' }}>
        {visibleItems.map(({ item, index, style }) => (
          <div key={item.id || item._id || index} style={style}>
            {renderItem(item, index, style)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VirtualizedList;
