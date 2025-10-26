'use client';

import { ReactNode, useState, useEffect, useRef } from 'react';
import UnlockAnimation from './UnlockAnimation';
import { useRouter } from 'next/navigation';

interface CapsulePageWrapperProps {
  children: ReactNode;
  isUnlocked: boolean;
  unlockDate: Date;
  capsuleId: string;
}

export default function CapsulePageWrapper({ children, isUnlocked, unlockDate, capsuleId }: CapsulePageWrapperProps) {
  const [showAnimation, setShowAnimation] = useState(false);
  const [localIsUnlocked, setLocalIsUnlocked] = useState(isUnlocked);
  const router = useRouter();
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasCheckedRef = useRef(false);

  useEffect(() => {
    if (localIsUnlocked) {
      // Show animation on every page load for unlocked capsules
      setShowAnimation(true);
    } else {
      // For locked capsules, check periodically if unlock time has passed
      const checkUnlockStatus = () => {
        const now = new Date();
        const unlock = new Date(unlockDate);
        
        if (now >= unlock && !hasCheckedRef.current) {
          hasCheckedRef.current = true;
          // Capsule should be unlocked now - refresh the page to get new data
          router.refresh();
          setLocalIsUnlocked(true);
          setShowAnimation(true);
        }
      };

      // Check immediately
      checkUnlockStatus();

      // Then check every 5 seconds (debounced)
      checkIntervalRef.current = setInterval(checkUnlockStatus, 5000);

      return () => {
        if (checkIntervalRef.current) {
          clearInterval(checkIntervalRef.current);
        }
      };
    }
  }, [localIsUnlocked, unlockDate, router]);

  return (
    <UnlockAnimation show={showAnimation && localIsUnlocked} onComplete={() => setShowAnimation(false)}>
      {children}
    </UnlockAnimation>
  );
}
