"use client";

import { Suspense, useEffect, useRef } from 'react';

import CursorTrackingOverlay from '@/Components/CursorTrackingOverlay';
import BottomFooter from '@/Components/BottomFooter';
import FigmaEmbed from '@/Components/FigmaEmbed';
import { useFigmaEmbed } from '@/contexts/FigmaEmbedContext';
import { useSearchParams } from 'next/navigation';

// The component that displays the study
function StudyComponent() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);

  const { setStudySetup, studySetup } = useFigmaEmbed();

  const searchParams = useSearchParams();
  const study = searchParams.get('study');

  useEffect(() => {
    if (study) {
      import(`../studies/${study}.ts`)
        .then((module) => {
          console.info('Study setup:', module.studySetup);
          setStudySetup(module.studySetup);
        })
        .catch((error) => {
          console.error('Study file not found:', error);
          // Handle the error, e.g., set an error state or redirect
        });
    }
  }, [study]);

  console.info('[page.tsx] studySetup:', studySetup);

  if (!studySetup) {
    return (
      <div className="flex flex-col h-screen w-screen">
        <div className="text-center text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col h-screen w-screen">
        {/* <iframe 
          ref={iframeRef}
          className="pointer-events-none"  // Add this class
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
        /> */}
        <FigmaEmbed />
        <CursorTrackingOverlay isActive={true} />
      </div>
      <BottomFooter />
    </>
  );
}

// The component wrapped in a suspense boundary
export default function StudyComponentWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StudyComponent />
    </Suspense>
  );
}