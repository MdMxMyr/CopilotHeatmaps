"use client";

import React, { useEffect } from "react";
import { useCursorTracking } from "@/contexts/CursorTrackingContext";
import ClickMarker from "./clickMarker";

// Props for the CursorTrackingOverlay component
interface CursorTrackingOverlayProps {
  isActive?: boolean; // Whether the overlay is active
}

// Component to track cursor movement and clicks
const CursorTrackingOverlay: React.FC<CursorTrackingOverlayProps> = ({ isActive = true }) => {
  // Get the context values and methods from the CursorTrackingContext
  const { addCursorPosition, setClickLocation, clickLocation } = useCursorTracking();

  // Effect to add event listeners for mouse movement and click
  useEffect(() => {
    if (!isActive) return;

    // Throttle the mouse movement to 0.1 second interval
    let lastUpdate = Date.now();
    const THROTTLE_MS = 100; // 0.1 second interval

    // Handle mouse movement -> add cursor position to context every 0.1 second
    const handleMouseMove = (e: MouseEvent) => {
        const now = Date.now();
        // If the current time is greater than the last update time plus the throttle interval, add the cursor position
        if (now - lastUpdate >= THROTTLE_MS) {
            addCursorPosition({ x: e.clientX, y: e.clientY, time: now });
            lastUpdate = now;

            // if we're in the dev environment, log the cursor position
            if (process.env.NODE_ENV === "development") {
                //console.log("[CursorTrackingOverlay] Added cursor position:", { x: e.clientX, y: e.clientY });
            }
        }
    };

    // Handle click -> set click location in context
    const handleClick = (e: MouseEvent) => {

        // Set the click location in the context
        setClickLocation({ x: e.clientX, y: e.clientY });
        
        // if we're in the dev environment, log the click location
        if (process.env.NODE_ENV === "development") {
            console.log("[CursorTrackingOverlay] Setting the click location:", { x: e.clientX, y: e.clientY });
        }
    };

    // Add event listeners for mouse movement and click
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);

    // Cleanup event listeners on unmount
    return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("click", handleClick);
    };
    
  }, [isActive, addCursorPosition, setClickLocation]);

  // If the overlay is not active, return null so it doesn't render
  if (!isActive) return null;

  // Transparent overlay to ensure we "see" the mouse on the page
  return (
    <>
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-[9998]">
            <ClickMarker />
        </div>
    </>
  );
};

export default CursorTrackingOverlay;