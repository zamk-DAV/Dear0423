import { headers } from 'next/headers';
import MobileHome from '@/components/mobile/MobileHome';
import DesktopHome from '@/components/desktop/DesktopHome';

export default async function Home() {
  const headersList = await headers();
  const deviceType = headersList.get('x-device-type');
  const isMobile = deviceType === 'mobile';

  return isMobile ? <MobileHome /> : <DesktopHome />;
}
