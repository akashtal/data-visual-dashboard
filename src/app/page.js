"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import StatCard from "@/components/StatCard";
import ChartBar from "@/components/ChartBar";
import ChartDonut from "@/components/ChartDonut";
import ChartMap from "@/components/ChartMap";
import FilterPanel from "@/components/FilterPanel";
import ChartBarRace from "@/components/ChartBarRace";
import DataTable from "@/components/DataTable";
import { Zap, Target, TrendingUp, BarChart3 } from "lucide-react";

export default function DashboardPage() {
  const [filters, setFilters] = useState({});
  const [options, setOptions] = useState({});
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // Load filter options once (from entire dataset)
  useEffect(() => {
    async function fetchOptions() {
      try {
        const res = await fetch("/api/data");
        if (!res.ok) throw new Error("Failed to fetch data");
        const allData = await res.json();

        const fields = [
          "end_year",
          "topic",
          "sector",
          "region",
          "pestle",
          "source",
          "swot",
          "country",
          "city",
        ];
        const opts = {};

        fields.forEach((field) => {
          opts[field] = Array.from(
            new Set(
              allData
                .map((d) => d[field])
                .filter(
                  (val) => val !== null && val !== undefined && val !== ""
                )
            )
          ).sort();
        });

        setOptions(opts);
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    }
    fetchOptions();
  }, []);

  // Fetch filtered data from API
  useEffect(() => {
    async function fetchFilteredData() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, val]) => {
          if (val) params.append(key, val);
        });

        const res = await fetch(`/api/data?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to fetch filtered data");
        const result = await res.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching filtered data:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    }
    fetchFilteredData();
  }, [filters]);

  const average = (data, field) => {
    if (!data || data.length === 0) return "0.0";
    const valid = data
      .map((d) => +d[field])
      .filter((val) => !isNaN(val) && val !== 0);
    const avg = valid.length
      ? valid.reduce((a, b) => a + b, 0) / valid.length
      : 0;
    return avg.toFixed(1);
  };

  if (loading && data.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex min-h-screen ${darkMode ? "dark" : ""}`}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className="flex-1 flex flex-col bg-gradient-to-br from-gray-50 to-blue-50">
        <Topbar
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />

        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <FilterPanel
              filters={filters}
              setFilters={setFilters}
              options={options}
            />

            {loading && (
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                  <span className="text-blue-700">Updating data...</span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Average Intensity"
                value={average(data, "intensity")}
                icon={Zap}
                color="from-blue-500 to-blue-600"
                trend={5.2}
                change="vs last month"
              />
              <StatCard
                title="Average Likelihood"
                value={average(data, "likelihood")}
                icon={Target}
                color="from-purple-500 to-purple-600"
                trend={-2.1}
                change="vs last month"
              />
              <StatCard
                title="Average Relevance"
                value={average(data, "relevance")}
                icon={TrendingUp}
                color="from-green-500 to-green-600"
                trend={8.3}
                change="vs last month"
              />
              <StatCard
                title="Total Records"
                value={data.length.toLocaleString()}
                icon={BarChart3}
                color="from-orange-500 to-orange-600"
                trend={12.5}
                change="vs last month"
              />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
              <ChartBar
                data={data}
                groupBy="country"
                metric="intensity"
                title="Intensity by Country"
              />
              <ChartMap data={data} field="region" title="Distribution by Region" />

            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
              <ChartBarRace
                data={data}
                groupBy="sector"
                metric="likelihood"
                title="Likelihood by Sector"
              />
              <ChartDonut
                data={data}
                field="topic"
                title="Distribution by Topic"
              />
            </div>

            <DataTable data={data} />
          </div>
        </main>
      </div>
    </div>
  );
}
