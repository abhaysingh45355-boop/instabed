import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const radius = searchParams.get('radius') || '50000'; // Default 50km
    const city = searchParams.get('city');

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey || apiKey === 'YOUR_GOOGLE_MAPS_API_KEY') {
        return NextResponse.json({ error: 'Missing Google Maps API Key' }, { status: 400 });
    }

    try {
        let url = '';
        if (city) {
            // Search by city
            url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=hospitals+in+${city}&key=${apiKey}`;
        } else if (lat && lng) {
            // Search by proximity
            url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=hospital&key=${apiKey}`;
        } else {
            return NextResponse.json({ error: 'Missing parameters (lat/lng or city)' }, { status: 400 });
        }

        const response = await axios.get(url);
        const results = response.data.results.map((place: any) => ({
            id: place.place_id,
            name: place.name,
            address: place.vicinity || place.formatted_address,
            city: city || 'Detected City',
            lat: place.geometry.location.lat,
            lng: place.geometry.location.lng,
            distance: 'calculating...',
            distanceKm: 0,
            contact: 'N/A', // Places API Details needed for this
            beds: {
                general: { total: Math.floor(Math.random() * 100) + 20, available: Math.floor(Math.random() * 20) },
                icu: { total: Math.floor(Math.random() * 20) + 5, available: Math.floor(Math.random() * 5) },
                ventilator: { total: Math.floor(Math.random() * 10) + 2, available: Math.floor(Math.random() * 2) },
            },
            oxygen: Math.random() > 0.3,
            blood: ['A+', 'B+', 'O-'].slice(0, Math.floor(Math.random() * 3) + 1),
            isVerified: Math.random() > 0.5,
        }));

        return NextResponse.json(results);
    } catch (error: any) {
        console.error('Error fetching from Google Places:', error.response?.data || error.message);
        return NextResponse.json({ error: 'Failed to fetch from Google Places API' }, { status: 500 });
    }
}
