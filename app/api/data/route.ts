import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js'

import { ClickData, CursorData, ClickDataSchema, CursorDataSchema } from './dataTypes';

// Create Supabase client using environment variables
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!
)

/**
 * @description POST request to store cursor and click data in the database
 * @param request - The request object containing the data to be stored
 * @returns A JSON response indicating the success or failure of the operation
 */
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { type, payload } = data as { type: string; payload: ClickData | CursorData };

    if (type === 'cursor') {
      const cursorData = CursorDataSchema.parse(payload);
      if (cursorData.length > 0) {
        const { error } = await supabase
          .from('cursor_movements')
          .insert(cursorData);
        if (error) throw error;
      }
    }

    if (type === 'click') {
      const clickData = ClickDataSchema.parse(payload);
      if (clickData.length > 0) {
        const { error } = await supabase
          .from('click_events')
          .insert(clickData);
        if (error) throw error;
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to store tracking data' },
      { status: 500 }
    );
  }
}
  
  // export async function GET() {
  //   try {
  //     // Your database fetch logic here
  //     // Example: const data = await db.cursorTracking.findMany()
      
  //     return NextResponse.json({ data: [] }, { status: 200 });
  //   } catch (error) {
  //     return NextResponse.json(
  //       { error: 'Failed to fetch cursor tracking data' },
  //       { status: 500 }
  //     );
  //   }
  // }