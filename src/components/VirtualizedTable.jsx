import React, { useState, useRef, useCallback, useMemo } from 'react';

/**
 * Enterprise Virtualized Data Table Component
 * 
 * Specifically optimized for high-volume tabular records (CRM leads, bookings, invoices).
 * Keeps sticky table headers anchored while virtualizing tbody row rendering.
 * 
 * @param {Array} columns - Header definitions: [{ header: string, width?: string, className?: string }]
 * @param {Array} data - Array of record objects
 * @param {number} rowHeight - Fixed row height in pixels (default: 48)
 * @param {number|string} height - Table scroll viewport height (default: 550)
 * @param {Function} renderRow - Render prop: (item, index, style) => ReactNode table row (tr or divs)
 */
export const VirtualizedTable = ({
  columns = [],
  data = [],
  rowHeight = 48,
  height = 550,
  renderRow,
  overscan = 6,
  className = '',
  emptyMessage = 'No records match the filter criteria.'
}) => {
  const containerRef = useRef(null);
  const [scrollTop, setScrollTop] = useState(0);

  const onScroll = useCallback((e) => {
    const currentScroll = e.currentTarget.scrollTop;
    requestAnimationFrame(() => {
      setScrollTop(currentScroll);
    });
  }, []);

  const totalHeight = data.length * rowHeight;
  const parsedHeight = typeof height === 'number' ? height : 550;

  const { startIndex, endIndex } = useMemo(() => {
    const start = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
    const end = Math.min(
      data.length - 1,
      Math.floor((scrollTop + parsedHeight) / rowHeight) + overscan
    );
    return { startIndex: start, endIndex: end };
  }, [scrollTop, rowHeight, parsedHeight, data.length, overscan]);

  const visibleRows = useMemo(() => {
    if (data.length === 0) return [];
    const rows = [];
    for (let i = startIndex; i <= endIndex; i++) {
      const item = data[i];
      if (item !== undefined) {
        rows.push({
          item,
          index: i,
          topOffset: i * rowHeight
        });
      }
    }
    return rows;
  }, [data, startIndex, endIndex, rowHeight]);

  return (
    <div className={`border border-[#334155] rounded-xl overflow-hidden bg-[#1e293b] shadow-sm ${className}`}>
      {/* Sticky Table Header */}
      <div className="w-full bg-slate-800/90 backdrop-blur-sm border-b border-[#334155] sticky top-0 z-20">
        <div className="flex items-center text-xs font-mono font-semibold text-slate-300 py-3 px-4">
          {columns.map((col, idx) => (
            <div
              key={idx}
              style={{ width: col.width || 'auto', flex: col.width ? 'none' : '1' }}
              className={`truncate ${col.className || ''}`}
            >
              {col.header}
            </div>
          ))}
        </div>
      </div>

      {/* Virtualized Scrollable Body */}
      {data.length === 0 ? (
        <div className="py-16 text-center text-slate-400 font-mono text-xs">
          {emptyMessage}
        </div>
      ) : (
        <div
          ref={containerRef}
          onScroll={onScroll}
          className="relative overflow-y-auto overflow-x-hidden custom-scrollbar"
          style={{ height: `${parsedHeight}px`, contain: 'strict' }}
        >
          <div style={{ height: `${totalHeight}px`, width: '100%', position: 'relative' }}>
            {visibleRows.map(({ item, index, topOffset }) => (
              <div
                key={item.id || item._id || index}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${rowHeight}px`,
                  transform: `translate3d(0, ${topOffset}px, 0)`,
                  willChange: 'transform'
                }}
                className="flex items-center text-xs text-slate-200 border-b border-slate-800/60 hover:bg-slate-800/40 transition-colors px-4"
              >
                {renderRow(item, index)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VirtualizedTable;
