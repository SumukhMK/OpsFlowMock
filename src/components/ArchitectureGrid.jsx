import React, { useState, useCallback } from 'react'
import { Box, Card, CardBody, CardHeader, Grid, Heading, Image, Layer, Text } from 'grommet'

export default function ArchitectureGrid({ pairs = [], selected, onSelect, imageMap = {} }) {
  const [zoomOpen, setZoomOpen] = useState(false)
  const [zoomSrc, setZoomSrc] = useState('')
  const [zoomAlt, setZoomAlt] = useState('')
  const [scale, setScale] = useState(1)
  const [translate, setTranslate] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 })

  const openZoom = useCallback((src, alt) => {
    setZoomSrc(src)
    setZoomAlt(alt)
    setScale(1)
    setTranslate({ x: 0, y: 0 })
    setZoomOpen(true)
  }, [])

  const onWheel = useCallback((e) => {
    e.preventDefault()
    const delta = -Math.sign(e.deltaY) * 0.1
    setScale(prev => Math.min(5, Math.max(0.5, prev + delta)))
  }, [])

  const onMouseDown = useCallback((e) => {
    e.preventDefault()
    setDragging(true)
    setLastPos({ x: e.clientX, y: e.clientY })
  }, [])

  const onMouseMove = useCallback((e) => {
    if (!dragging) return
    setTranslate(prev => ({ x: prev.x + (e.clientX - lastPos.x), y: prev.y + (e.clientY - lastPos.y) }))
    setLastPos({ x: e.clientX, y: e.clientY })
  }, [dragging, lastPos])

  const onMouseUp = useCallback(() => setDragging(false), [])

  return (
    <>
      <Grid columns={{ count: 'fit', size: 'medium' }} gap="medium">
        {pairs.map(pair => {
          const pairImages = imageMap[pair.id] || {}
          const asIsSrc = pairImages.as_is || pair.as_is?.image || ''
          const toBeSrc = pairImages.to_be || pair.to_be?.image || ''
          return (
            <Card
              key={pair.id}
              background={selected === pair.id ? 'background-back' : 'background'}
              border={selected === pair.id ? { color: '#01A982', size: '2px' } : undefined}
              onClick={() => onSelect?.(pair.id)}
              hoverIndicator
              pad="xsmall"
              round="xsmall"
            >
              <CardHeader pad="small"><Text weight="bold">{pair.title}</Text></CardHeader>
              <CardBody pad="small">
                <Box direction="row" gap="small">
                  <Box width="small">
                    <Image
                      fit="contain"
                      src={asIsSrc}
                      alt={pair.as_is?.title || ''}
                      fallback=""
                      onClick={(e) => { e.stopPropagation(); openZoom(asIsSrc, pair.as_is?.title || '') }}
                      style={{ cursor: 'zoom-in' }}
                    />
                  </Box>
                  <Box fill>
                    <Heading level={4} margin={{ top: 'none', bottom: 'xsmall' }}>{pair.as_is?.title}</Heading>
                    <Text size="small">{pair.as_is?.description}</Text>
                  </Box>
                </Box>
                <Box margin={{ vertical: 'small' }} border={{ side: 'top', color: 'border' }} />
                <Box direction="row" gap="small" margin={{ top: 'small' }}>
                  <Box width="small">
                    <Image
                      fit="contain"
                      src={toBeSrc}
                      alt={pair.to_be?.title || ''}
                      fallback=""
                      onClick={(e) => { e.stopPropagation(); openZoom(toBeSrc, pair.to_be?.title || '') }}
                      style={{ cursor: 'zoom-in' }}
                    />
                  </Box>
                  <Box fill>
                    <Heading level={4} margin={{ top: 'none', bottom: 'xsmall' }}>{pair.to_be?.title}</Heading>
                    <Text size="small">{pair.to_be?.description}</Text>
                  </Box>
                </Box>
              </CardBody>
            </Card>
          )
        })}
      </Grid>

      {zoomOpen && (
        <Layer onEsc={() => setZoomOpen(false)} onClickOutside={() => setZoomOpen(false)} responsive={false}>
          <Box pad="small" gap="small" width="xlarge" height="large" background="background-contrast">
            <Heading level={3} margin={{ top: 'none', bottom: 'small' }}>{zoomAlt}</Heading>
            <Box
              flex
              overflow="auto"
              background="dark-1"
              onWheel={onWheel}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseUp}
              style={{ cursor: dragging ? 'grabbing' : 'grab' }}
            >
              <Box
                justify="center"
                align="center"
                style={{ transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`, transformOrigin: 'center center' }}
              >
                <Image src={zoomSrc} alt={zoomAlt} fit="contain" />
              </Box>
            </Box>
          </Box>
        </Layer>
      )}
    </>
  )
}
