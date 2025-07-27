'use client';
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { RefreshCw, Globe } from 'lucide-react';

const ChartMap = ({ data, field, title }) => {
  const ref = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const validData = data.filter(d => d[field] && d[field] !== '');
    const grouped = d3.rollups(
      validData, 
      v => v.length, 
      d => d[field]
    ).sort((a, b) => d3.descending(a[1], b[1]));

    const dataMap = new Map(grouped);
    const maxValue = d3.max(grouped, d => d[1]) || 1;

    // Compact chart size
    const width = 380;
    const height = 220;

    const svg = d3.select(ref.current);
    svg.selectAll('*').remove();
    svg.attr('width', width).attr('height', height);

    // Clean background
    svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', '#ffffff')
      .attr('rx', 6);

    // Create world outline
    svg.append('ellipse')
      .attr('cx', width / 2)
      .attr('cy', height / 2)
      .attr('rx', width / 2 - 20)
      .attr('ry', height / 2 - 20)
      .attr('fill', '#e5e7eb')
      .attr('stroke', '#d1d5db')
      .attr('stroke-width', 1);

    // Color scale
    const colorScale = d3.scaleOrdinal()
      .domain(grouped.map(d => d[0]))
      .range([
        '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', 
        '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1',
        '#14b8a6', '#f43f5e', '#8b5cf6', '#22c55e', '#eab308'
      ]);

    // Calculate positions for data points in a circular/world layout
    const positions = grouped.map((d, i) => {
      const angle = (i / grouped.length) * 2 * Math.PI;
      const radius = Math.min(width, height) / 3;
      const x = width / 2 + Math.cos(angle) * radius;
      const y = height / 2 + Math.sin(angle) * radius;
      return { location: d[0], count: d[1], x, y, angle };
    });

    // Create tooltip
    const tooltip = d3.select('body').append('div')
      .attr('class', 'world-map-tooltip')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background', 'rgba(0, 0, 0, 0.9)')
      .style('color', 'white')
      .style('padding', '8px 12px')
      .style('border-radius', '6px')
      .style('font-size', '12px')
      .style('font-weight', 'bold')
      .style('pointer-events', 'none')
      .style('z-index', '1000')
      .style('box-shadow', '0 4px 12px rgba(0,0,0,0.3)');

    // Draw location points
    positions.forEach((pos, i) => {
      const radius = Math.sqrt(pos.count) * 2 + 8;
      
      // Connection line to center
      svg.append('line')
        .attr('x1', width / 2)
        .attr('y1', height / 2)
        .attr('x2', pos.x)
        .attr('y2', pos.y)
        .attr('stroke', colorScale(pos.location))
        .attr('stroke-width', 1)
        .attr('opacity', 0.3)
        .attr('stroke-dasharray', '2,2');

      // Location circle
      const circle = svg.append('circle')
        .attr('cx', pos.x)
        .attr('cy', pos.y)
        .attr('r', radius)
        .attr('fill', colorScale(pos.location))
        .attr('stroke', '#ffffff')
        .attr('stroke-width', 2)
        .style('cursor', 'pointer')
        .style('filter', 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))')
        .on('mouseover', function(event) {
          d3.select(this)
            .transition()
            .duration(200)
            .attr('r', radius * 1.2)
            .style('filter', 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))');

          tooltip.style('visibility', 'visible')
            .html(`<div style="text-align: center;">
                     <div style="font-size: 13px; font-weight: bold; color: ${colorScale(pos.location)};">${pos.location}</div>
                     <div style="font-size: 11px; margin-top: 2px;">Count: ${pos.count}</div>
                   </div>`)
            .style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY - 10) + 'px');
        })
        .on('mousemove', function(event) {
          tooltip.style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY - 10) + 'px');
        })
        .on('mouseout', function() {
          d3.select(this)
            .transition()
            .duration(200)
            .attr('r', radius)
            .style('filter', 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))');
          
          tooltip.style('visibility', 'hidden');
        });

      // Animate circle appearance
      circle.attr('r', 0)
        .transition()
        .delay(i * 100)
        .duration(500)
        .attr('r', radius);

      // Add count text for larger circles
      if (pos.count > 2) {
        svg.append('text')
          .attr('x', pos.x)
          .attr('y', pos.y + 3)
          .attr('text-anchor', 'middle')
          .attr('fill', '#ffffff')
          .attr('font-size', radius > 15 ? '11px' : '9px')
          .attr('font-weight', 'bold')
          .style('pointer-events', 'none')
          .text(pos.count > 999 ? `${Math.round(pos.count/1000)}k` : pos.count)
          .style('opacity', 0)
          .transition()
          .delay(i * 100 + 300)
          .duration(300)
          .style('opacity', 1);
      }
    });

    // Add center globe icon
    svg.append('circle')
      .attr('cx', width / 2)
      .attr('cy', height / 2)
      .attr('r', 20)
      .attr('fill', '#1f2937')
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 2)
      .style('filter', 'drop-shadow(0 2px 6px rgba(0,0,0,0.2))');

    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height / 2 + 4)
      .attr('text-anchor', 'middle')
      .attr('fill', '#ffffff')
      .attr('font-size', '16px')
      .attr('font-weight', 'bold')
      .text('🌍');

    // Add total count at bottom
    const totalCount = grouped.reduce((sum, d) => sum + d[1], 0);
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height - 10)
      .attr('text-anchor', 'middle')
      .attr('fill', '#6b7280')
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .text(`Total: ${totalCount} entries`);

    // Cleanup function
    return () => {
      d3.select('body').selectAll('.world-map-tooltip').remove();
    };

  }, [data, field]);

  return (
    <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Globe size={18} className="text-blue-600" />
          <h3 className="text-base font-semibold text-gray-800">{title}</h3>
        </div>
        <button className="p-1.5 hover:bg-gray-100 rounded-md transition-colors">
          <RefreshCw size={14} className="text-gray-600" />
        </button>
      </div>
      
      <div className="flex justify-center">
        <svg ref={ref} className="rounded-md" />
      </div>

      {data && data.length > 0 && (
        <div className="mt-2 text-xs text-gray-500 text-center">
          Hover over locations for details
        </div>
      )}

      {(!data || data.length === 0) && (
        <div className="flex items-center justify-center h-48">
          <div className="text-center text-gray-400">
            <Globe size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">No data available</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChartMap;