import CouplePhotoWidget from '@/components/shared/widgets/CouplePhotoWidget';
import HeartTouchWidget from '@/components/shared/widgets/HeartTouchWidget';
import StatusWidget from '@/components/shared/widgets/StatusWidget';
import FeedPreviewWidget from '@/components/shared/widgets/FeedPreviewWidget';
import NotificationToggleWidget from '@/components/shared/widgets/NotificationToggleWidget';

export const WIDGET_REGISTRY: Record<string, React.ReactNode> = {
  'couple-photo': <CouplePhotoWidget />,
  'heart': <HeartTouchWidget />,
  'status': <StatusWidget />,
  'feed-preview': <FeedPreviewWidget />,
  'notification': <NotificationToggleWidget />,
  // 'd-day': 아까 couple-photo에 합쳐졌으므로 제외
};

export const AVAILABLE_WIDGETS = Object.keys(WIDGET_REGISTRY);
