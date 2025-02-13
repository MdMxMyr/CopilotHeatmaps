"use client";

import React, {
  createContext,
  useContext,
  useRef,
  useCallback,
  RefObject,
  useState,
} from "react";

import { ArtboardTaskConfig, StudySetup } from "@/config/ArtboardConfig";

// Defines the navigation history based on the artboard index and node id
interface NavigationHistory {
  artboardIndex: number;
  artboardTaskConfig: ArtboardTaskConfig;
}[]

// Define the context value type
interface FigmaEmbedContextValue {
  studySetup: StudySetup | null;
  iframeRef: RefObject<HTMLIFrameElement>; // Reference to the iframe
  currentArtboardTaskConfig: ArtboardTaskConfig | null; // The current artboard task config
  setArtboardNodeId: (nodeId: string) => void; // Method to set the artboard node id
  navigateForward: () => void; // Method to navigate forward
  navigateBackward: () => void; // Method to navigate backward
  navigateToFrame: (nodeId: string) => void; // Method to navigate to a specific frame
  handleNavigationEvent: (nodeId: string) => void; // Method to handle the navigation event
  restart: () => void; // Method to restart the iframe
  setStudySetup: (studySetup: StudySetup) => void; // Method to set the study setup
}

// Create the context, but default to undefined so we can error if used incorrectly
const FigmaEmbedContext = createContext<FigmaEmbedContextValue | undefined>(undefined);

interface Props {
  figmaOrigin?: string;
  children: React.ReactNode;
}

// This provider holds the reference to the iframe AND the methods.
// You can override figmaOrigin if needed, but default is 'https://www.figma.com'.
export function FigmaEmbedProvider({ figmaOrigin = "https://www.figma.com", children }: Props) {

  // Getters and setters for the study setup
  const [studySetup, setStudySetup] = useState<StudySetup | null>(null);

  // Getters and setters for the current ArtboardTaskConfig
  const [currentArtboardTaskConfig, setCurrentArtboardTaskConfig] = useState<ArtboardTaskConfig | null>(null);

  // Getters and setters for the artboard node id
  const [artboardNodeId, setArtboardNodeId] = useState<string | null>(null);

  // This tracks the number of artboards the user has navigated through
  const [artBoardIndex, setArtBoardIndex] = useState<number | null>(null);

  // This tracks the history of the user's navigation
  const [navigationHistory, setNavigationHistory] = useState<NavigationHistory[]>([]);

  // Create a ref for the iframe
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Method to navigate to the next frame in the Figma prototype
  const navigateForward = useCallback(() => {
    iframeRef.current?.contentWindow?.postMessage(
      { type: "NAVIGATE_FORWARD" },
      figmaOrigin
    );
  }, [figmaOrigin]);

  // Method to navigate to the previous frame in the Figma prototype
  const navigateBackward = useCallback(() => {
    iframeRef.current?.contentWindow?.postMessage(
      { type: "NAVIGATE_BACKWARD" },
      figmaOrigin
    );
  }, [figmaOrigin]);

  // Method to handle the navigation event from the Figma prototype
  const handleNavigationEvent = (nodeId: string) => {

    // Check if the study setup has been set already
    if (!studySetup) {
      console.warn('[handleNavigationEvent] studySetup is not set');
      return;
    }

    // Check if the nodeId is different from the current artboard node id
    if (nodeId === artboardNodeId) return;

    // Update the nodeId
    setArtboardNodeId(nodeId);

    // Update the artboard index and task config
    setArtBoardIndex((prevIndex) => {
      const newIndex = prevIndex !== null ? prevIndex + 1 : 0;
      const newTaskConfig = studySetup[newIndex];
      setCurrentArtboardTaskConfig(newTaskConfig);

      // Add the new navigation history
      setNavigationHistory((prevHistory) => [
        ...prevHistory,
        {
          artboardIndex: newIndex,
          artboardTaskConfig: newTaskConfig,
        },
      ]);

      return newIndex;
    });
  }

  // Method to navigate to a specific frame in the Figma prototype
  const navigateToFrame = useCallback((nodeId: string) => {
    iframeRef.current?.contentWindow?.postMessage(
      {
        type: "NAVIGATE_TO_FRAME_AND_CLOSE_OVERLAYS",
        data: { nodeId },
      },
      figmaOrigin
    );
  }, [figmaOrigin]);

  // Method to restart the Figma prototype
  const restart = useCallback(() => {
    iframeRef.current?.contentWindow?.postMessage(
      { type: "RESTART" },
      figmaOrigin
    );
  }, [figmaOrigin]);

  // Provide the ref and the helper methods
  const value: FigmaEmbedContextValue = {
    studySetup,
    iframeRef: iframeRef as RefObject<HTMLIFrameElement>,
    currentArtboardTaskConfig,
    setArtboardNodeId,
    navigateForward,
    navigateBackward,
    navigateToFrame,
    handleNavigationEvent,
    restart,
    setStudySetup
  };

  // Provide the context value to the children
  return (
    <FigmaEmbedContext.Provider value={value}>
      {children}
    </FigmaEmbedContext.Provider>
  );
}

// Custom hook to use the FigmaEmbedContext
// This hook allows you to access the FigmaEmbedContext value in your components
export function useFigmaEmbed() {
  const context = useContext(FigmaEmbedContext);

  // If the context is not found, throw an error
  if (!context) {
    throw new Error("useFigmaEmbed must be used within a FigmaEmbedProvider");
  }

  // Return the context value
  return context;
}