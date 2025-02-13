"use client";

import React, { useMemo } from "react";
import { useCursorTracking } from "@/contexts/CursorTrackingContext";
import { useFigmaEmbed } from "@/contexts/FigmaEmbedContext";

// This component is the bottom footer of the page
// It displays a message and a button to proceed to the next step
// It also handles the calibration of the CursorTrackingOverlay
const BottomFooter: React.FC = () => {

    // Grab the current artboard task config and the navigation methods
    const { currentArtboardTaskConfig, navigateForward, navigateBackward } = useFigmaEmbed();

    // For now we assume that we can move forward if a click location has been set
    const { clickLocation, resetClickLocation, setCalibrationPoint } = useCursorTracking();

    // Method to handle the proceed click
    const handleProceedClick = () => {
        // If we are in a calibration phase, we need to navigate to the instruction screen
        if (currentArtboardTaskConfig?.measurementType === 'topLeftCalibration' || currentArtboardTaskConfig?.measurementType === 'bottomRightCalibration') {
            // Check if we were in a calibration phase
            const calibrationCorner  = currentArtboardTaskConfig.measurementType === 'topLeftCalibration' ? 'topLeft' : 'bottomRight';
  
            // Get the current click position
            const { x, y } = clickLocation!;
  
            // If the calibration corner is the top left, we need to navigate to the instruction screen
            if (calibrationCorner === 'topLeft') {
                // Set the calibration points
                setCalibrationPoint({ x, y, time: clickLocation!.time }, 'topLeft');
            } else {
                // Set the calibration points
                setCalibrationPoint({ x, y, time: clickLocation!.time }, 'bottomRight');
            }
        }

        // Move forward
        resetClickLocation();
        navigateForward();
    }

    return useMemo(() => {
        return (
            <footer
                className="fixed bottom-0 left-0 w-full h-65 z-50 bg-gray-800 text-white flex items-center justify-center px-4"
            >
                {!clickLocation ? (
                    <div className="flex items-center justify-center w-full">
                        <span className="text-center">
                            {currentArtboardTaskConfig?.initialMessage}
                        </span>
                    </div>
                ) : (
                    <div className="flex items-center justify-center w-full">
                        <span className="flex-grow text-center">
                            {
                                currentArtboardTaskConfig?.confirmationMessage 
                                    ? currentArtboardTaskConfig?.confirmationMessage
                                    : currentArtboardTaskConfig?.initialMessage
                            }
                        </span>
                        <button
                            onClick={() => {
                                // Define what the button should do when clicked
                                console.log("Button clicked!");
                                handleProceedClick();
                            }}
                            className="ml-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded flex items-center"
                        >
                            Proceed <span className="ml-2">→</span>
                        </button>
                    </div>
                )}
            </footer>
        );
    }, [clickLocation, currentArtboardTaskConfig]);
};

export default BottomFooter;