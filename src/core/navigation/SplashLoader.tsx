import { Box } from '@/components/ui/box';
import { Spinner } from '@/components/ui/spinner';

export function SplashLoader() {
  return (
    <Box className="flex-1 items-center justify-center bg-background-0">
      <Spinner />
    </Box>
  );
}
