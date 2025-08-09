import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

function buildFilters(params) {
  const filters = {};

  if (params.get('end_year')) {
    const year = parseInt(params.get('end_year'));
    if (!isNaN(year)) filters.end_year = year;
  }
  if (params.get('topic')) filters.topic = params.get('topic');
  if (params.get('sector')) filters.sector = params.get('sector');
  if (params.get('region')) filters.region = params.get('region');
  if (params.get('pestle')) filters.pestle = params.get('pestle');
  if (params.get('source')) filters.source = params.get('source');
  if (params.get('swot')) filters.swot = params.get('swot');
  if (params.get('country')) filters.country = params.get('country');
  if (params.get('city')) filters.city = params.get('city');

  return filters;
}

export async function GET(request) {
  try {
    // Read the JSON file
    const filePath = path.join(process.cwd(), 'jsondata.json');
    const fileData = fs.readFileSync(filePath, 'utf-8');
    let jsonData = JSON.parse(fileData);

    const params = request.nextUrl.searchParams;
    const filters = buildFilters(params);

    // Apply filters
    const filteredData = jsonData.filter(item => {
      return Object.entries(filters).every(([key, value]) => {
        return String(item[key]).toLowerCase() === String(value).toLowerCase();
      });
    });

    return NextResponse.json(filteredData, {
      headers: {
        'Cache-Control': 'public, max-age=60',
      },
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
