"use client";

import { useEffect, useState } from "react";
import { NODE_TO_ARTBOARD_MAP } from "../config/ArtboardMapping";``

// Custom hook to get artboard name from node ID
export const useNodeToArtboardMapping = () => {

    const [artboardName, setArtboardName] = useState<string>("");

    const getArtboardName = (nodeId: string): string => {
      const artboardName = NODE_TO_ARTBOARD_MAP[nodeId];
      if (!artboardName) {
        console.warn(`No artboard mapping found for node ID: ${nodeId}`);
        return "Unknown Artboard";
      }
      return artboardName;
    };

    const handleNodeChange = (nodeId: string) => {
        setArtboardName(getArtboardName(nodeId));
    };
  
    return { getArtboardName, artboardName, handleNodeChange };
};