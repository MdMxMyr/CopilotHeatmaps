import { z } from 'zod';

// Click data structure
export type ClickData = {
    x: number;
    y: number;
    timestamp: string;
    nodeId: string;
    sessionId: string;
    studyId: string;
}[];

// Cursor data structure
export type CursorData = {
    x: number;
    y: number;
    timestamp: string;
    nodeId: string;
    sessionId: string;
    studyId: string;
}[];

// Click data schema
export const ClickDataSchema = z.array(z.object({
    x: z.number(),
    y: z.number(),
    timestamp: z.string(),
    nodeId: z.string(),
    sessionId: z.string(),
    studyId: z.string(),
}));

// Cursor data schema
export const CursorDataSchema = z.array(z.object({
    x: z.number(),
    y: z.number(),
    timestamp: z.string(),
    nodeId: z.string(),
    sessionId: z.string(),
    studyId: z.string(),
}));