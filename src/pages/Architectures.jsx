import React, { useEffect, useState } from 'react'
import { Box, Button, Heading, Layer, Notification, RadioButtonGroup, Text } from 'grommet'
import { fetchJson } from '../utils/fetchJson'
import { useNavigate } from 'react-router-dom'
import ArchitectureGrid from '../components/ArchitectureGrid'

export default function Architectures() {
  const [cfg, setCfg] = useState(null)
  const [selected, setSelected] = useState(null)
  const [toast, setToast] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchJson('/json/architectures/architectures.json')
      .then(setCfg)
      .catch(err => setToast({ status: 'critical', message: err.message }))
  }, [])

  const onConfirm = () => {
    if (!selected && cfg?.selection?.requireSelection) {
      setToast({ status: 'warning', message: 'Please select a pair before confirming.' })
      return
    }
    setToast({ status: 'normal', message: 'Architecture pair confirmed.' })
    navigate('/staffing')
  }

  return (
    <Box gap="medium">
      <Heading level={2} margin={{ top: 'small', bottom: 'none' }}>{cfg?.page?.title || 'Architecture Selection'}</Heading>
      {cfg?.page?.intro && <Text>{cfg.page.intro}</Text>}

      <RadioButtonGroup
        name="arch-pair"
        options={(cfg?.pairs || []).map(p => ({ label: p.title, value: p.id }))}
        value={selected}
        onChange={event => setSelected(event.target.value)}
      />

      <ArchitectureGrid
        pairs={cfg?.pairs || []}
        selected={selected}
        onSelect={setSelected}
        imageMap={{
          v1: { as_is: '/assets/architectures/v1asis.png', to_be: '/assets/architectures/v1tobe.png' },
          v2: { as_is: '/assets/architectures/v2asis.png', to_be: '/assets/architectures/v2tobe.png' },
          v3: { as_is: '/assets/architectures/v3asis.png', to_be: '/assets/architectures/v3tobe.png' },
        }}
      />

      <Box>
        <Button primary label={cfg?.actions?.confirmLabel || 'Confirm Selection'} onClick={onConfirm} />
      </Box>

      {toast && (
        <Layer position="bottom" modal={false} margin={{ bottom: 'small' }} onEsc={() => setToast(null)} onClickOutside={() => setToast(null)}>
          <Notification toast status={toast.status} message={toast.message} onClose={() => setToast(null)} />
        </Layer>
      )}
    </Box>
  )
}
