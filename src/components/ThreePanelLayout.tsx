'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

interface ThreePanelLayoutProps {
  top: React.ReactNode;
  left: React.ReactNode;
  right: React.ReactNode;
  defaultTopHeight?: number;
  defaultLeftWidth?: number;
  minTopHeight?: number;
  minLeftWidth?: number;
  minRightWidth?: number;
  maxTopHeight?: number;
  showTop?: boolean;
}

export function ThreePanelLayout({
  top,
  left,
  right,
  defaultTopHeight = 300,
  defaultLeftWidth = 50,
  minTopHeight = 150,
  minLeftWidth = 25,
  minRightWidth = 25,
  maxTopHeight = 500,
  showTop = true,
}: ThreePanelLayoutProps) {
  const [topHeight, setTopHeight] = useState(defaultTopHeight);
  const [leftWidth, setLeftWidth] = useState(defaultLeftWidth);
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const draggingDivider = useRef<'horizontal' | 'vertical' | null>(null);

  const handleMouseDown = useCallback((divider: 'horizontal' | 'vertical') => (e: React.MouseEvent) => {
    e.preventDefault();
    draggingDivider.current = divider;
    document.body.style.cursor = divider === 'horizontal' ? 'row-resize' : 'col-resize';
    document.body.style.userSelect = 'none';
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!draggingDivider.current || !containerRef.current) return;

      const container = containerRef.current;
      const rect = container.getBoundingClientRect();

      if (draggingDivider.current === 'horizontal' && showTop) {
        const y = e.clientY - rect.top;
        const newTopHeight = Math.max(minTopHeight, Math.min(maxTopHeight, y));
        setTopHeight(newTopHeight);
      } else if (draggingDivider.current === 'vertical' && bottomRef.current) {
        const bottomRect = bottomRef.current.getBoundingClientRect();
        const x = e.clientX - bottomRect.left;
        const percentage = (x / bottomRect.width) * 100;
        const clampedPercentage = Math.max(minLeftWidth, Math.min(100 - minRightWidth, percentage));
        setLeftWidth(clampedPercentage);
      }
    };

    const handleMouseUp = () => {
      draggingDivider.current = null;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [showTop, minTopHeight, minLeftWidth, minRightWidth, maxTopHeight]);

  return (
    <div ref={containerRef} className="flex flex-col h-full">
      {/* Top Panel - Media */}
      {showTop && (
        <>
          <div
            className="overflow-hidden flex-shrink-0"
            style={{ height: `${topHeight}px` }}
          >
            {top}
          </div>
          <div
            className="h-1 bg-gray-700 hover:bg-blue-500 cursor-row-resize flex-shrink-0 transition-colors"
            onMouseDown={handleMouseDown('horizontal')}
          />
        </>
      )}

      {/* Bottom Section - Transcript and Annotations side by side */}
      <div ref={bottomRef} className="flex flex-1 overflow-hidden">
        {/* Left Panel - Transcript */}
        <div
          className="overflow-hidden"
          style={{ width: `${leftWidth}%` }}
        >
          {left}
        </div>

        {/* Vertical Divider */}
        <div
          className="w-1 bg-gray-700 hover:bg-blue-500 cursor-col-resize flex-shrink-0 transition-colors"
          onMouseDown={handleMouseDown('vertical')}
        />

        {/* Right Panel - Annotations */}
        <div
          className="overflow-hidden"
          style={{ width: `${100 - leftWidth}%` }}
        >
          {right}
        </div>
      </div>
    </div>
  );
}
