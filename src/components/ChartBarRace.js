'use client';
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const ChartBarRace = ({ data, groupBy = 'sector', metric = 'likelihood', title = 'Likelihood by Sector' }) => {
  const ref = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const validData = data
      .filter(d => d[groupBy] && !isNaN(+d[metric]))
      .map(d => ({ group: d[groupBy], value: +d[metric] }));

    const grouped = d3.rollups(validData, v => d3.mean(v, d => d.value), d => d.group)
      .map(([group, value]) => ({ group, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);

    const svg = d3.select(ref.current);
    svg.selectAll('*').remove();

    const width = 500, height = 300, margin = { top: 20, right: 20, bottom: 50, left: 100 };
    svg.attr('width', width).attr('height', height);

    const x = d3.scaleLinear()
      .domain([0, d3.max(grouped, d => d.value) || 1])
      .range([margin.left, width - margin.right]);

    const y = d3.scaleBand()
      .domain(grouped.map(d => d.group))
      .range([margin.top, height - margin.bottom])
      .padding(0.2);

    svg.append('g')
      .selectAll('rect')
      .data(grouped)
      .join('rect')
      .attr('x', margin.left)
      .attr('y', d => y(d.group))
      .attr('height', y.bandwidth())
      .attr('width', 0)
      .attr('fill', '#3b82f6')
      .transition()
      .duration(800)
      .delay((d, i) => i * 100)
      .attr('width', d => x(d.value) - margin.left);

    svg.append('g')
      .call(d3.axisLeft(y).tickSize(0))
      .attr('transform', `translate(${margin.left},0)`)
      .selectAll('text')
      .style('font-size', '12px')
      .style('fill', '#4b5563');

    svg.append('g')
      .call(d3.axisBottom(x).ticks(5))
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .selectAll('text')
      .style('font-size', '12px')
      .style('fill', '#4b5563');
  }, [data]);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <svg ref={ref} />
    </div>
  );
};

export default ChartBarRace;
