"use client";

import { useEffect, useRef } from 'react';

import { MousePressOrReleaseMessage } from '../utils/figmaCursor';
import { useNodeToArtboardMapping } from '../hooks/useNodeToArtboardMapping';

export default function Home() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);

  const { getArtboardName, artboardName, handleNodeChange } = useNodeToArtboardMapping();
  
  // Constants
  const figmaOrigin = "https://www.figma.com";

  console.log('were on page', artboardName)

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin === figmaOrigin) {
        if (event.data.type === "INITIAL_LOAD") {
          // Update button states using React state here
          // You'll need to add state management for button disabled states
          console.log(
            "INITIAL_LOAD"
          );
        }

        if (event.data.type === "PRESENTED_NODE_CHANGED") {
          const nodeId = event.data.data.presentedNodeId;
          // Update button states based on nodeId
          handleNodeChange(nodeId);
          console.log(
            "PRESENTED_NODE_CHANGED", 
            artboardName
          );
        }

        if (event.data.type === "MOUSE_PRESS_OR_RELEASE") {
          const mousePressOrReleaseMessage = event.data as MousePressOrReleaseMessage;
          console.log(
            "MOUSE_PRESS_OR_RELEASE", 
            mousePressOrReleaseMessage
          );
        }
      } else {
        console.warn(
          "Received message from an unexpected origin:",
          event.origin
        );
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <main ref={mainRef} className="h-screen w-screen">
      <iframe 
        ref={iframeRef}
        title="Figma Embed"
        width="100%" 
        height="100%" 
        src="https://embed.figma.com/proto/BInFvH6XwnbgTYPsnuDvpt/CopilotHeatmaps
          ?page-id=0%3A1
          &node-id=1-4
          &p=f
          &viewport=-5913%2C3274%2C3.06
          &scaling=scale-down&content-scaling=fixed
          &starting-point-node-id=1%3A4
          &client-id=IWDTxNhyIysQUiMvH7cu3W
          &embed-host=CopilotHeatmaps
          &hotspot-hints=false&hide-ui=true"
      />
    </main>
  );
}
