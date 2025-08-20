import { useEffect, useState } from 'react';

export function useDeviceSupport() {
  /**
   * Check if the device is a touch device but exclude devices that have a fine pointer (mouse or track-pad)
   * - `fine` will check for an accurate pointing device. Examples include mice, touch-pads, and drawing styluses
   * - `coarse` will check for a pointing device of limited accuracy. Examples include touchscreens and motion-detection sensors
   * - `any-pointer` will check for the presence of any pointing device, if there are multiple of them
   */
  const [isTouchDevice, setIsTouchDevice] = useState<boolean>(false);
  const [userAgent, setUserAgent] = useState<string>('');
  const [isIOs, setIsIOs] = useState<boolean>(false);
  const [isAndroidOs, setIsAndroidOs] = useState<boolean>(false);
  const [isMacOs, setIsMacOs] = useState<boolean>(false);
  const [isMobileDevice, setIsMobileDevice] = useState<boolean>(false);
  const [controlKeyCode, setControlKeyCode] = useState<'Meta' | 'Control'>('Control');

  useEffect(() => {
    // Only run on client-side
    if (typeof window === 'undefined') return;

    // Set initial values
    const userAgentStr = navigator.userAgent.toLowerCase();
    const isIOsDevice = /iphone|ipad|ipod/.test(userAgentStr);
    const isAndroidOsDevice = /android/.test(userAgentStr);
    const isMacOsDevice = /macintosh/.test(userAgentStr) || isIOsDevice;
    const isMobile = isIOsDevice || isAndroidOsDevice;
    const isTouch = 
      window.matchMedia('(any-pointer: coarse)').matches &&
      !window.matchMedia('(any-pointer: fine)').matches;

    setUserAgent(userAgentStr);
    setIsIOs(isIOsDevice);
    setIsAndroidOs(isAndroidOsDevice);
    setIsMacOs(isMacOsDevice);
    setIsMobileDevice(isMobile);
    setIsTouchDevice(isTouch);
    setControlKeyCode(isMacOsDevice ? 'Meta' : 'Control');

    // Handle window resize for touch device detection
    const handleResize = () => {
      setIsTouchDevice(
        window.matchMedia('(any-pointer: coarse)').matches &&
        !window.matchMedia('(any-pointer: fine)').matches
      );
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  function isCtrlKeyPressed(e: MouseEvent | KeyboardEvent): boolean {
    if (isMacOs) {
      return (e as KeyboardEvent).metaKey;
    }
    return (e as KeyboardEvent).ctrlKey;
  }

  return {
    userAgent,
    isTouchDevice,
    isAndroidOs,
    isIOs,
    isMacOs,
    isMobileDevice,
    controlKeyCode,
    isCtrlKeyPressed,
  };
}
