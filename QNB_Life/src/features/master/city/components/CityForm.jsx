import { useState } from 'react'
import Box from '@/components/layout/Box/Box'
import Form from '@/components/layout/Form/Form'
import { UIButton, UIDropdown, UIInput } from '@/components/ui'
import { t } from '@/core/i18n/t'
import './CityForm.css'

const empty = {
  cityCode: '',
  cityName: '',
  country: 'Qatar',
  status: 'Y',
}

function CityForm({ mode = 'add', initial, onSubmit, onClose }) {
  const [form, setForm] = useState({ ...empty, ...initial })
  const [errors, setErrors] = useState({})
  const readOnly = mode === 'view'

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: '' }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (readOnly) return
    const nextErrors = {}
    if (!String(form.cityCode || '').trim()) {
      nextErrors.cityCode = t('Required_Field', 'This field is required')
    }
    if (!String(form.cityName || '').trim()) {
      nextErrors.cityName = t('Required_Field', 'This field is required')
    }
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors)
      return
    }
    onSubmit?.(form)
  }

  return (
    <Box className="city-form-panel">
      <Form className="city-form" onSubmit={handleSubmit}>
        <UIInput
          label={t('City_Code', 'City Code')}
          value={form.cityCode}
          readOnly={readOnly || mode === 'edit'}
          disabled={mode === 'edit'}
          error={errors.cityCode}
          onChange={(e) => setField('cityCode', e.target.value)}
          required
        />
        <UIInput
          label={t('City_Name', 'City Name')}
          value={form.cityName}
          readOnly={readOnly}
          error={errors.cityName}
          onChange={(e) => setField('cityName', e.target.value)}
          required
        />
        <UIInput
          label={t('Country', 'Country')}
          value={form.country}
          readOnly={readOnly}
          onChange={(e) => setField('country', e.target.value)}
        />
        <UIDropdown
          label={t('Status', 'Status')}
          value={form.status}
          disabled={readOnly}
          readOnly={readOnly}
          onChange={(v) => setField('status', v)}
          options={[
            { value: 'Y', label: t('Active', 'Active') },
            { value: 'N', label: t('Inactive', 'Inactive') },
          ]}
        />
        <Box className="city-form-actions">
          <UIButton type="button" variant="outline" onClick={onClose}>
            {t('Close', 'Close')}
          </UIButton>
          {!readOnly ? (
            <UIButton type="submit" variant="primary">
              {t('Save', 'Save')}
            </UIButton>
          ) : null}
        </Box>
      </Form>
    </Box>
  )
}

export default CityForm
