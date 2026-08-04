import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export function PlatformCardSkeleton() {
  return (
    <SkeletonTheme baseColor="#182238" highlightColor="#243252">
      <div className="card p-5">
        <Skeleton height={20} width="40%" />
        <div className="mt-4 flex items-center gap-4">
          <Skeleton circle height={64} width={64} />
          <div className="flex-1">
            <Skeleton height={14} width="70%" />
            <Skeleton height={14} width="50%" style={{ marginTop: 8 }} />
          </div>
        </div>
        <Skeleton height={12} count={3} style={{ marginTop: 16 }} />
      </div>
    </SkeletonTheme>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {[0, 1, 2, 3].map((i) => (
        <PlatformCardSkeleton key={i} />
      ))}
    </div>
  );
}
