"use client";

import { ArtboardDimensions } from "@/config/ArtboardConfig";
import { studyArtboardDimensions } from "@/studies/BInFvH6XwnbgTYPsnuDvpt";
import React, { createContext, useState, useContext, FC } from "react";

// Defines the structure for cursor position data, including timestamp
interface CursorPosition {
    x: number;      // X coordinate of cursor
    y: number;      // Y coordinate of cursor
    time: number;   // Timestamp of when position was recorded
}

// Defines the structure for the first click event data
interface ClickLocation {
    x: number;                  // X coordinate of first click
    y: number;                  // Y coordinate of first click
    time: number;               // Timestamp of when click was recorded
}

// Defines the structure for calibration points
interface CalibrationPoint {
    topLeft: ClickLocation | null;
    bottomRight: ClickLocation | null;
}

// Defines the shape of the context data and its methods
interface CursorTrackingContextType {
    cursorData: CursorPosition[];                            // Array to store cursor movement history
    clickLocation: ClickLocation | null;                     // Stores data about the click location
    calibrationPoints: CalibrationPoint | null;              // Stores data about the calibration points
    addCursorPosition: (pos: CursorPosition) => void;        // Method to add new cursor positions
    setClickLocation: (click: ClickLocation) => void;        // Method to set click location
    setCalibrationPoint: (position: ClickLocation, side: 'topLeft' | 'bottomRight') => void; // Method to set calibration points
    resetClickLocation: () => void;                           // Method to reset the click location
}

// Creates the context with undefined as initial value
const CursorTrackingContext = createContext<CursorTrackingContextType | undefined>(undefined);

// Provider component that wraps parts of the app that need cursor tracking
export const CursorTrackingProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
    
    // State for storing cursor movement history
    const [cursorData, setCursorData] = useState<CursorPosition[]>([]);
    // State for storing the click locations
    const [clickData, setClickData] = useState<ClickLocation[]>([]);

    // State for storing click location for the marker
    const [clickLocation, setClickLocationState] = useState<ClickLocation | null>(null);
    // State for storing calibration points
    const [calibrationPoints, setCalibrationPoints] = useState<CalibrationPoint | null>({
        topLeft: null,
        bottomRight: null
    });

    // Check if calibration points are set
    const isCalibrated = calibrationPoints?.topLeft && calibrationPoints?.bottomRight;

    // Method to add new cursor position to the history, takes into account calibration points
    const addCursorPosition = (pos: CursorPosition) => {
        // If calibration points are set, log the cursor position if it is within the calibration points
        if (!isCalibrated) return;
        
        // Get the cursor position
        const { x, y } = pos;

        // Get the calibration points
        const { topLeft, bottomRight } = calibrationPoints!;

        // Check if the cursor position is within the calibration points
        if (topLeft && bottomRight) {
            if (x >= topLeft.x && x <= bottomRight.x && y >= topLeft.y && y <= bottomRight.y) {
                // Map the cursor position to the artboard dimensions
                const mappedCursorPosition = mapCursorPositionToArtboard(pos, studyArtboardDimensions);

                // Add the cursor position to the history if it is within the calibration points
                setCursorData((prev) => [...prev, mappedCursorPosition]);

                // If we're in the dev environment, log the cursor position
                if (process.env.NODE_ENV === "development") {
                    console.log("[CursorTrackingContext] Added cursor position:", mappedCursorPosition);
                }
            }
        }
    };

    // Method to set click location, if the calibration points are not set, set the click location directly
    // If the calibration points are set, check if the click location is within the calibration points
    const setClickLocation = (click: ClickLocation) => {
        if (!isCalibrated) {
            setClickLocationState(click);
        } else {
            // Get the click location
            const { x, y } = click;

            // Get the calibration points
            const { topLeft, bottomRight } = calibrationPoints!;

            // Check if the click location is within the calibration points
            if (x >= topLeft!.x && x <= bottomRight!.x && y >= topLeft!.y && y <= bottomRight!.y) {

                // Add the click location to the history
                setClickLocationState(click);

                // Map the click location to the artboard dimensions
                const mappedClickLocation = mapCursorPositionToArtboard(click, studyArtboardDimensions);

                // Add the click location to the history
                setClickData((prev) => [...prev, mappedClickLocation]);

                // If we're in the dev environment, log the click location
                if (process.env.NODE_ENV === "development") {
                    console.log("[CursorTrackingContext] Set click location:", mappedClickLocation);
                }
            }
        }
    };

    // Method to set calibration points
    const setCalibrationPoint = (position: ClickLocation, side: 'topLeft' | 'bottomRight') => {
        // Set the calibration point
        setCalibrationPoints((prev) => ({
            ...prev!,
            [side]: position
        }));
    };

    // Method to reset the click location 
    const resetClickLocation = () => {
        setClickLocationState(null);
    }

    // Method to map a cursor position to the artboard dimensions
    const mapCursorPositionToArtboard = (
        pos: CursorPosition, 
        artboardDimensions: ArtboardDimensions
    ): CursorPosition => {
        if (!calibrationPoints?.topLeft || !calibrationPoints?.bottomRight) {
            return pos; // Return unchanged if not calibrated
        }
    
        const { topLeft, bottomRight } = calibrationPoints;
        
        // Calculate the scale factors based on calibration points
        const scaleX = artboardDimensions.width / (bottomRight.x - topLeft.x);
        const scaleY = artboardDimensions.height / (bottomRight.y - topLeft.y);
    
        // Transform the coordinates:
        // 1. Subtract topLeft to make coordinates relative to calibration area
        // 2. Apply scaling to map to artboard dimensions
        const mappedX = (pos.x - topLeft.x) * scaleX;
        const mappedY = (pos.y - topLeft.y) * scaleY;
    
        return { 
            x: Math.max(0, Math.min(Math.round(mappedX), artboardDimensions.width)),
            y: Math.max(0, Math.min(Math.round(mappedY), artboardDimensions.height)),
            time: pos.time 
        };
    }

    // Provides the context values to all children components
    return (
        <CursorTrackingContext.Provider
            value={{ 
                cursorData, 
                clickLocation, 
                calibrationPoints, 
                addCursorPosition, 
                setClickLocation, 
                setCalibrationPoint,
                resetClickLocation 
            }}
        >
            {children}
        </CursorTrackingContext.Provider>
    );
};

// Custom hook to use the CursorTrackingContext
export const useCursorTracking = (): CursorTrackingContextType => {
    const context = useContext(CursorTrackingContext);
    if (!context) {
        throw new Error("useCursorTracking must be used within CursorTrackingProvider");
    }
    return context;
};