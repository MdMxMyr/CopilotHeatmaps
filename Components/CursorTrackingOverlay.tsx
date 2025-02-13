"use client";

import React, { useEffect } from "react";
import { useCursorTracking } from "@/contexts/CursorTrackingContext";
import ClickMarker from "./clickMarker";
import { useFigmaEmbed } from "@/contexts/FigmaEmbedContext";
import { isCursorMovementTask, isCalibrationTask, isClickTask } from "@/config/ArtboardConfig";

// Props for the CursorTrackingOverlay component
interface CursorTrackingOverlayProps {
  isActive?: boolean; // Whether the overlay is active
}

// Component to track cursor movement and clicks
const CursorTrackingOverlay: React.FC<CursorTrackingOverlayProps> = () => {

  // Get the current task configuration
  const { currentArtboardTaskConfig } = useFigmaEmbed();
  if (!currentArtboardTaskConfig) return null;

  // Get the measurement types for this task so we can determine what to measure
  const measureCursorMovement = isCursorMovementTask(currentArtboardTaskConfig?.measurementType);
  const measureCalibration = isCalibrationTask(currentArtboardTaskConfig?.measurementType);
  const measureClick = isClickTask(currentArtboardTaskConfig?.measurementType);
  
  // If the task does not involve cursor movement or calibration, return null so it doesn't render
  if (!measureCursorMovement && !measureCalibration) return null;

  // Get the context values and methods from the CursorTrackingContext
  const { addCursorPosition, setClickLocation, clickLocation } = useCursorTracking();

  // Effect to add event listeners for mouse movement and click
  useEffect(() => {
    // Throttle the mouse movement to 0.1 second interval
    let lastUpdate = Date.now();
    const THROTTLE_MS = 100; // 0.1 second interval

    // Handle mouse movement -> add cursor position to context every 0.1 second
    const handleMouseMove = (e: MouseEvent) => {
      if (!measureCursorMovement) return;

      // Get the current time
      const now = Date.now();

      // If the current time is greater than the last update time plus the throttle interval, add the cursor position
      if (now - lastUpdate >= THROTTLE_MS) {
        addCursorPosition({ x: e.clientX, y: e.clientY, time: now });
        lastUpdate = now;
      }
    };

    // Handle click -> set click location in context
    const handleClick = (e: MouseEvent) => {
      if (!measureClick) return;
      // Set the click location in the context
      setClickLocation({ x: e.clientX, y: e.clientY, time: Date.now() });
    };

    // Add event listeners for mouse movement and click
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);

    // Cleanup event listeners on unmount
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
    };
    
  }, [measureCursorMovement, measureCalibration, addCursorPosition, setClickLocation]);

  // Transparent overlay to ensure we "see" the mouse on the page
  return (
    <>
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-[40]">
        <ClickMarker />
      </div>
    </>
  );
};

export default CursorTrackingOverlay;