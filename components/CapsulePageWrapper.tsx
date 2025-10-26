'use client';

import { ReactNode, useState, useEffect } from 'react';
import UnlockAnimation from './UnlockAnimation';

interface CapsulePageWrapperProps {
  children: ReactNode;
  isUnlocked: boolean;
}

export default function CapsulePageWrapper({ children, isUnlocked }: CapsulePageWrapperProps) {
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    if (isUnlocked) {
      // Show animation on every page load for unlocked capsules
      setShowAnimation(true);
    }
  }, [isUnlocked]);

  return (
    <UnlockAnimation show={showAnimation && isUnlocked} onComplete={() => setShowAnimation(false)}>
      {children}
    </UnlockAnimation>
  );
}
