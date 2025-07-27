import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import fs from 'fs';
import path from 'path';

const DB_NAME = 'data-visual-dashboard';
const COLLECTION_NAME = 'dashboard_data';

async function initializeData(db) {
  const count = await db.collection(COLLECTION_NAME).countDocuments();
  if (count === 0) {
    try {
      const filePath = path.join(process.cwd(), 'jsondata.json');
      const fileData = fs.readFileSync(filePath, 'utf-8');
      const jsonData = JSON.parse(fileData);
      if (Array.isArray(jsonData) && jsonData.length > 0) {
        await db.collection(COLLECTION_NAME).insertMany(jsonData);
        console.log(`Initialized database with ${jsonData.length} records`);
      }
    } catch (error) {
      console.error('Error initializing data:', error);
    }
  }
}

function buildFilters(params) {
  const filters = {};
  
  // Handle exact matches
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
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    await initializeData(db);

    const params = request.nextUrl.searchParams;
    const filters = buildFilters(params);

    const data = await db.collection(COLLECTION_NAME).find(filters).toArray();
    
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, max-age=60', // Cache for 1 minute
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
