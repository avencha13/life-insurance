import { useLocation } from 'react-router-dom'
import Box from '@/components/layout/Box/Box'
import { UICard, UIText } from '@/components/ui'
import { t } from '@/core/i18n/t'
import './ComingSoonPage.css'

function ComingSoonPage() {
  const location = useLocation()

  return (
    <Box className="coming-soon-page">
      <UICard className="coming-soon-card">
        <UIText as="h2" variant="h24SemiBold">
          {t('Coming_Soon', 'Coming Soon')}
        </UIText>
        <UIText variant="b14Regular" className="coming-soon-message">
          {t(
            'Coming_Soon_Message',
            'This screen is stubbed for migration. Feature will be ported next.',
          )}
        </UIText>
        <UIText variant="b12Regular" className="coming-soon-path">
          {location.pathname}
        </UIText>
      </UICard>
    </Box>
  )
}

export default ComingSoonPage
