/**
 * Material outlined icons matching Flutter dashboard Row1–Row4 widgets.
 */
function IconSvg({ children, size = 22, className = 'home-mat-icon' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      {children}
    </svg>
  )
}

function path(d) {
  return <path d={d} fill="currentColor" stroke="none" />
}

export function PhoneAndroidIcon({ size = 22 }) {
  return (
    <IconSvg size={size}>
      {path(
        'M16 1H8C6.34 1 5 2.34 5 4v16c0 1.66 1.34 3 3 3h8c1.66 0 3-1.34 3-3V4c0-1.66-1.34-3-3-3zm-2 20h-4v-1h4v1zm3.25-3H6.75V4h10.5v14z',
      )}
    </IconSvg>
  )
}

export function LanguageIcon({ size = 22 }) {
  return (
    <IconSvg size={size}>
      {path(
        'M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.9 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2s.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56zm2.95-8H5.08c.96-1.66 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2s.07-1.35.16-2h4.68c.09.65.16 1.32.16 2s-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2s-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z',
      )}
    </IconSvg>
  )
}

export function AutorenewIcon({ size = 18 }) {
  return (
    <IconSvg size={size}>
      {path(
        'M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8C6.25 13.97 6 13.01 6 12c0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2C17.75 10.03 18 10.99 18 12c0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z',
      )}
    </IconSvg>
  )
}

export function NorthEastIcon({ size = 14 }) {
  return (
    <IconSvg size={size}>
      {path('M9 5v2h6.59L4 18.59 5.41 20 17 8.41V15h2V5H9z')}
    </IconSvg>
  )
}

export function SouthEastIcon({ size = 14 }) {
  return (
    <IconSvg size={size}>
      {path('M19 9h-2v6.59L5.41 4 4 5.41 15.59 17H9v2h10V9z')}
    </IconSvg>
  )
}

export function TrendingUpIcon({ size = 18 }) {
  return (
    <IconSvg size={size}>
      {path('M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6h-6z')}
    </IconSvg>
  )
}

export function ChatBubbleOutlineIcon({ size = 22 }) {
  return (
    <IconSvg size={size}>
      {path(
        'M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z',
      )}
    </IconSvg>
  )
}

export function ShoppingBagOutlinedIcon({ size = 22 }) {
  return (
    <IconSvg size={size}>
      {path(
        'M18 6h-2c0-2.21-1.79-4-4-4S8 3.79 8 6H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6-2c1.1 0 2 .9 2 2h-4c0-1.1.9-2 2-2zm6 16H6V8h2v2c0 .55.45 1 1 1s1-.45 1-1V8h4v2c0 .55.45 1 1 1s1-.45 1-1V8h2v12z',
      )}
    </IconSvg>
  )
}

export function Inventory2OutlinedIcon({ size = 22 }) {
  return (
    <IconSvg size={size}>
      {path(
        'M20 2H4c-1 0-2 .9-2 2v3.01c0 .72.43 1.34 1 1.69V20c0 1.1 1.1 2 2 2h14c.9 0 2-.9 2-2V8.7c.57-.35 1-.97 1-1.69V4c0-1.1-1-2-2-2zm-1 18H5V9h14v11zm1-13H4V4h16v3z',
      )}
      {path('M9 12h6v2H9z')}
    </IconSvg>
  )
}

export function LocalOfferOutlinedIcon({ size = 22 }) {
  return (
    <IconSvg size={size}>
      {path(
        'M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58s1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41s-.23-1.06-.59-1.42zM13 20.01L4 11V4h7v-.01l9 9-7 7.02z',
      )}
      <circle cx="6.5" cy="6.5" r="1.5" fill="currentColor" />
    </IconSvg>
  )
}

export function ShieldOutlinedIcon({ size = 22 }) {
  return (
    <IconSvg size={size}>
      {path(
        'M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm6 9.09c0 4-2.55 7.7-6 8.83-3.45-1.13-6-4.82-6-8.83V6.31l6-2.12 6 2.12v4.78z',
      )}
    </IconSvg>
  )
}

export function ShowChartIcon({ size = 22 }) {
  return (
    <IconSvg size={size}>
      {path('M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99l1.5 1.5z')}
    </IconSvg>
  )
}

export function GroupOutlinedIcon({ size = 22 }) {
  return (
    <IconSvg size={size}>
      {path(
        'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z',
      )}
    </IconSvg>
  )
}

export function HistoryIcon({ size = 20 }) {
  return (
    <IconSvg size={size}>
      {path(
        'M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z',
      )}
    </IconSvg>
  )
}

export function CheckIcon({ size = 18 }) {
  return (
    <IconSvg size={size}>
      {path('M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z')}
    </IconSvg>
  )
}

export function CloseIcon({ size = 18 }) {
  return (
    <IconSvg size={size}>
      {path(
        'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z',
      )}
    </IconSvg>
  )
}

export function PriorityHighIcon({ size = 18 }) {
  return (
    <IconSvg size={size}>
      {path('M12 19c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0-14c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2s2-.9 2-2V7c0-1.1-.9-2-2-2z')}
    </IconSvg>
  )
}

export const homeMetricIcons = {
  faqs: ChatBubbleOutlineIcon,
  products: ShoppingBagOutlinedIcon,
  subProducts: Inventory2OutlinedIcon,
  offers: LocalOfferOutlinedIcon,
}

export const QUICK_ACTION_ICONS = {
  faq: { Icon: ChatBubbleOutlineIcon, color: '#0EA5E9' },
  mfa: { Icon: ShieldOutlinedIcon, color: '#8B5CF6' },
  product: { Icon: ShowChartIcon, color: '#0D59F2' },
  user: { Icon: GroupOutlinedIcon, color: '#10B981' },
}

export default homeMetricIcons
