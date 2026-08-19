'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RecoveryRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/growth');
  }, [router]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-slate-50 dark:bg-[#0B0F17] font-mono text-xs text-slate-500">
      Redirecting to Growth & Recovery Workspace...
    </div>
  );
}
