'use client';
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { RefreshCw, Download } from 'lucide-react';

const ChartBar = ({ data, groupBy = 'country', metric = 'intensity', title = 'Intensity by Country' }) => {
  const ref = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const validData = data.filter(d => d[groupBy] && d[metric] !== undefined && d[metric] !== null && d[metric] !== '');
    const grouped = d3.rollups(
      validData,
      v => d3.mean(v, d => +d[metric]),
      d => d[groupBy]
    ).sort((a, b) => d3.descending(a[1], b[1])).slice(0, 10);

    const margin = { top: 20, right: 30, bottom: 80, left: 60 };
    const width = 500;
    const height = 300;

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

    const x = d3.scaleBand()
      .domain(grouped.map(d => d[0]))
      .range([margin.left, width - margin.right])
      .padding(0.3);

    const y = d3.scaleLinear()
      .domain([0, d3.max(grouped, d => d[1]) || 1])
      .range([height - margin.bottom, margin.top]);

    const colorScale = d3.scaleSequential(d3.interpolateViridis)
      .domain([0, grouped.length - 1]);

    // Add bars with tooltip
    svg.append('g')
      .selectAll('rect')
      .data(grouped)
      .join('rect')
      .attr('x', d => x(d[0]))
      .attr('y', height - margin.bottom)
      .attr('width', x.bandwidth())
      .attr('height', 0)
      .attr('fill', (d, i) => colorScale(i))
      .attr('rx', 4)
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        d3.select(this).style('opacity', 0.8);
        // Add tooltip logic here if needed
      })
      .on('mouseout', function() {
        d3.select(this).style('opacity', 1);
      })
      .transition()
      .duration(1000)
      .delay((d, i) => i * 100)
      .attr('y', d => y(d[1]))
      .attr('height', d => height - margin.bottom - y(d[1]));

    // Add x-axis
    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .style('font-size', '11px')
      .style('fill', '#6b7280')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end');

    // Add y-axis
    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(5))
      .selectAll('text')
      .style('font-size', '12px')
      .style('fill', '#6b7280');

  }, [data, groupBy, metric]);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <div className="flex gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <RefreshCw size={16} className="text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Download size={16} className="text-gray-600" />
          </button>
        </div>
      </div>
      <svg ref={ref} className="w-full" />
    </div>
  );
};

export default ChartBar;
