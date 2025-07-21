import { ModelStatus } from '@/lib/core/hand-tracking/hand-tracking-types';
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';
import { useEffect, useState } from 'react';

export function useHandLandMarker() {
  const [modelStatus, setModelStatus] = useState<ModelStatus>(
    ModelStatus.LOADING
  );

  const [handTracker, setHandTracker] = useState<HandLandmarker | null>(null);

  async function initializeHandLandMarker() {
    setModelStatus(ModelStatus.LOADING);

    try {
      const vision = await FilesetResolver.forVisionTasks('/wasm');

      const landMarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: '/models/hand_landmarker.task',
          delegate: 'GPU'
        },
        numHands: 2,
        runningMode: 'VIDEO'
      });

      setHandTracker(landMarker);
      setModelStatus(ModelStatus.READY);
    } catch (error) {
      console.error('Error initializing HandLandMarker:', error);
      setModelStatus(ModelStatus.ERROR);
    }
  }

  useEffect(() => {
    void initializeHandLandMarker();
  }, []);

  return {
    modelStatus,
    handTracker
  };
}
