import React, { useEffect, useState } from 'react'
import { Box, Button, Card, CardBody, CardHeader, Grid, Heading, Image, Layer, Notification, RadioButtonGroup, Text } from 'grommet'
import { fetchJson } from '../utils/fetchJson'

export default function Architectures() {
  const [cfg, setCfg] = useState(null)
  const [selected, setSelected] = useState(null)
  const [toast, setToast] = useState(null)

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

      <Grid columns={{ count: 'fit', size: 'medium' }} gap="medium">
        {(cfg?.pairs || []).map(pair => (
          <Card
            key={pair.id}
            background={selected === pair.id ? 'background-back' : 'background'}
            border={selected === pair.id ? { color: '#01A982', size: '2px' } : undefined}
            onClick={() => setSelected(pair.id)}
            hoverIndicator
            pad="xsmall"
            round="xsmall"
          >
            <CardHeader pad="small"><Text weight="bold">{pair.title}</Text></CardHeader>
            <CardBody pad="small">
              <Box direction="row" gap="small">
                <Box width="small">
                  {/* Placeholder image; replace when assets added */}
                  <Image fit="contain" src={pair.as_is.image} alt={pair.as_is.title} fallback="" />
                </Box>
                <Box fill>
                  <Heading level={4} margin={{ top: 'none', bottom: 'xsmall' }}>{pair.as_is.title}</Heading>
                  <Text size="small">{pair.as_is.description}</Text>
                </Box>
              </Box>
              <Box direction="row" gap="small" margin={{ top: 'small' }}>
                <Box width="small">
                  <Image fit="contain" src={pair.to_be.image} alt={pair.to_be.title} fallback="" />
                </Box>
                <Box fill>
                  <Heading level={4} margin={{ top: 'none', bottom: 'xsmall' }}>{pair.to_be.title}</Heading>
                  <Text size="small">{pair.to_be.description}</Text>
                </Box>
              </Box>
            </CardBody>
          </Card>
        ))}
      </Grid>

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
