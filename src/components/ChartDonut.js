'use client';
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { RefreshCw } from 'lucide-react';

const ChartDonut = ({ data, field, title }) => {
  const ref = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const validData = data.filter(d => d[field] && d[field] !== '');
    const grouped = d3.rollups(
      validData, 
      v => v.length, 
      d => d[field]
    ).sort((a, b) => d3.descending(a[1], b[1])).slice(0, 6);

    const width = 300;
    const height = 300;
    const radius = Math.min(width, height) / 2 - 20;

    const svg = d3.select(ref.current);
    svg.selectAll('*').remove();
    svg.attr('width', width).attr('height', height);

    if (grouped.length === 0) {
      svg.append('text')
        .attr('x', width / 2)
        .attr('y', height / 2)
        .attr('text-anchor', 'middle')
        .attr('fill', '#9ca3af')
        .text('No data available');
      return;
    }

    const color = d3.scaleOrdinal()
      .domain(grouped.map(d => d[0]))
      .range(['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899']);

    const g = svg.append('g').attr('transform', `translate(${width / 2},${height / 2})`);

    const pie = d3.pie().value(d => d[1]).sort(null);
    const arc = d3.arc().innerRadius(60).outerRadius(radius);

    const arcs = g.selectAll('path')
      .data(pie(grouped))
      .join('path')
      .attr('fill', d => color(d.data[0]))
      .attr('stroke', 'white')
      .attr('stroke-width', 2)
      .style('filter', 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))')
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        d3.select(this).transition().duration(200).attr('transform', 'scale(1.05)');
      })
      .on('mouseout', function() {
        d3.select(this).transition().duration(200).attr('transform', 'scale(1)');
      });

    arcs.transition()
      .duration(1000)
      .attrTween('d', function(d) {
        const i = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return function(t) { return arc(i(t)); };
      });

    // Add labels
    g.selectAll('text')
      .data(pie(grouped))
      .join('text')
      .attr('transform', d => `translate(${arc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .attr('font-size', 11)
      .attr('font-weight', 'bold')
      .attr('fill', '#374151')
      .text(d => d.data[1] > 2 ? d.data[0] : '');

  }, [data, field]);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <RefreshCw size={16} className="text-gray-600" />
        </button>
      </div>
      <div className="flex justify-center">
        <svg ref={ref} />
      </div>
    </div>
  );
};

export default ChartDonut;
