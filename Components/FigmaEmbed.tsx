import { useFigmaEmbed } from '@/contexts/FigmaEmbedContext';
import { MousePressOrReleaseMessage } from '@/figmaEmbedEventTypes/figmaCursor';
import { useEffect } from 'react';

// This component is used to embed the Figma prototype into the page
function FigmaEmbed() {
  
    const { handleNavigationEvent, iframeRef } = useFigmaEmbed();

    const figmaOrigin = "https://www.figma.com";

    useEffect(() => {
      const handleMessage = (event: MessageEvent) => {
        if (event.origin === figmaOrigin) {
          if (event.data.type === "INITIAL_LOAD") {
            console.log(
              "INITIAL_LOAD"
            );
          }
  
          if (event.data.type === "PRESENTED_NODE_CHANGED") {
            const nodeId = event.data.data.presentedNodeId;
            handleNavigationEvent(nodeId);
            // Update button states based on nodeId
            console.log(
              "PRESENTED_NODE_CHANGED", 
              nodeId
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
          // console.warn(
          //   "Received message from an unexpected origin:",
          //   event.origin
          // );
        }
      };
  
      window.addEventListener("message", handleMessage);
      return () => window.removeEventListener("message", handleMessage);
    }, []);
  
    return (
      <>
          <iframe 
            ref={iframeRef}
            className="pointer-events-none"  // Add this class
            title="Figma Embed"
            width="100%" 
            height="100%" 
            src="https://embed.figma.com/proto/BInFvH6XwnbgTYPsnuDvpt/CopilotHeatmaps
              ?page-id=0%3A1
              &node-id=212-40550
              &p=f
              &viewport=-5913%2C3274%2C3.06
              &scaling=scale-down&content-scaling=fixed
              &starting-point-node-id=1%3A4
              &client-id=IWDTxNhyIysQUiMvH7cu3W
              &embed-host=CopilotHeatmaps
              &hotspot-hints=false&hide-ui=true"
          />
        <div style={{
          width: '100%',
          height: '100px',
          background: 'black',
          }}>
        </div>
      </>
    );
}

export default FigmaEmbed;