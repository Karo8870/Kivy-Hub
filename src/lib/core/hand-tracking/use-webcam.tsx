import { RefObject, useEffect } from 'react';

export function useWebcam(
  videoRef: RefObject<HTMLVideoElement | null>,
  isTracking: boolean,
  webcamRunning: boolean,
  setWebcamRunning: (value: boolean) => void,
  predictHandMarks: () => void
) {
  useEffect(() => {
    if (!videoRef.current) return;

    const constraints = {
      video: { width: 640, height: 480 }
    };

    async function enableWebcam() {
      try {
        // @ts-ignore
        videoRef.current!.srcObject =
          await navigator.mediaDevices.getUserMedia(constraints);
        // @ts-ignore
        videoRef.current!.addEventListener('loadeddata', predictHandMarks);
      } catch (error) {
        console.error('Error accessing webcam:', error);
      }
    }

    if (isTracking && !webcamRunning) {
      void enableWebcam();
      setWebcamRunning(true);
    } else if (!isTracking && webcamRunning) {
      // @ts-ignore
      const tracks = videoRef.current.srcObject?.getTracks();
      tracks?.forEach((track: any) => track.stop());
      // @ts-ignore
      videoRef.current.srcObject = null;
      setWebcamRunning(false);
    }

    return () => {
      // @ts-ignore
      const tracks = videoRef.current?.srcObject?.getTracks();
      tracks?.forEach((track: any) => track.stop());
    };
  }, [isTracking, webcamRunning]);
}
