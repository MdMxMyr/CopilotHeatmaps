"use client";

import React, { useMemo } from "react";
import { useCursorTracking } from "@/contexts/CursorTrackingContext";

// Component to render a click marker on the screen when a click is detected
const ClickMarker: React.FC = () => {
    // Get the click location from the cursor tracking context
    const { clickLocation } = useCursorTracking();
  
    // Memoize the component to prevent unnecessary re-renders due to cursor tracking context changes
    return useMemo(() => {
        // If we're in the dev environment, log the click location
        if (process.env.NODE_ENV === "development") {
            console.log("[clickMarker] Rendering with clickLocation:", clickLocation);
        }
  
        // If there's no click location, don't render anything
        if (!clickLocation) return null;

        // Render the click marker
        return (
            <div
                key={`${clickLocation.x}-${clickLocation.y}`}
                style={{
                    position: 'fixed',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: 'rgb(59, 130, 246)', // blue-500 color
                    pointerEvents: 'none',
                    zIndex: 45,
                    transform: 'translate(-50%, -50%)',
                    opacity: 1,
                    left: `${clickLocation.x}px`,
                    top: `${clickLocation.y}px`,
                    boxShadow: '0 0 0 4px white, 0 0 0 6px rgb(59, 130, 246)',
                    animation: 'clickBounce 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards'
                }}
            >
                <style>
                    {`
                    @keyframes clickBounce {
                        0% {
                            transform: translate(-50%, -50%) scale(0);
                        }
                        50% {
                            transform: translate(-50%, -50%) scale(1.2);
                        }
                        100% {
                            transform: translate(-50%, -50%) scale(1);
                        }
                    }
                    `}
                </style>
            </div>
        );
    }, [clickLocation]); // Only re-render when clickLocation changes
};

export default ClickMarker;