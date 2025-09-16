import React, { useEffect, useMemo, useState } from 'react'
import { Box, Button, FileInput, Heading, Layer, Notification, Table, TableBody, TableCell, TableHeader, TableRow, Text, TextInput } from 'grommet'
import { fetchJson } from '../utils/fetchJson'

function flattenResults(results) {
  // Convert nested keys to a flat list of field/value pairs for simple table rendering
  const entries = []
  const push = (field, value) => entries.push({ field, value })

  const asis = results.as_is || {}
  const tobe = results.to_be || {}

  Object.entries(asis).forEach(([k, v]) => {
    const val = typeof v === 'object' ? JSON.stringify(v) : String(v)
    push(k, val)
  })
  const asIsRows = entries.map(e => ({ field: e.field, value: e.value }))

  const toEntries = []
  Object.entries(tobe).forEach(([k, v]) => {
    const val = typeof v === 'object' ? JSON.stringify(v) : String(v)
    toEntries.push({ field: k, value: val, status: 'Pending', locked: false, editValue: val })
  })
  return { asIsRows, toBeRows: toEntries }
}

export default function Analyze() {
  const [uploadCfg, setUploadCfg] = useState(null)
  const [tablesCfg, setTablesCfg] = useState(null)
  const [uploaded, setUploaded] = useState(false)
  const [file, setFile] = useState(null)
  const [toast, setToast] = useState(null)

  const [asIsRows, setAsIsRows] = useState([])
  const [toBeRows, setToBeRows] = useState([])

  useEffect(() => {
    async function load() {
      const [up, tbl] = await Promise.all([
        fetchJson('/json/analyze/upload.json'),
        fetchJson('/json/analyze/tables.json'),
      ])
      setUploadCfg(up)
      setTablesCfg(tbl)
    }
    load().catch(err => setToast({ message: err.message, status: 'critical' }))
  }, [])

  const onUpload = (event) => {
    const files = event?.target?.files || []
    if (!files.length) return
    const f = files[0]
    const accept = new Set((uploadCfg?.accept || []).map(x => x.toLowerCase()))
    const okType = accept.size === 0 || accept.has('.' + f.name.split('.').pop().toLowerCase())
    const okSize = !uploadCfg?.maxSizeMB || (f.size <= uploadCfg.maxSizeMB * 1024 * 1024)
    if (!okType) {
      setToast({ message: 'Unsupported file type', status: 'warning' })
      return
    }
    if (!okSize) {
      setToast({ message: 'File is too large', status: 'warning' })
      return
    }
    setFile(f)
    setUploaded(true)
    setToast({ message: 'File uploaded', status: 'normal' })
  }

  const onAnalyze = async () => {
    try {
      const results = await fetchJson('/json/analyze/example-results.json')
      const { asIsRows, toBeRows } = flattenResults(results)
      setAsIsRows(asIsRows)
      setToBeRows(toBeRows)
      setToast({ message: 'Analysis complete', status: 'normal' })
    } catch (e) {
      setToast({ message: e.message, status: 'critical' })
    }
  }

  const onEditRow = (idx, val) => {
    setToBeRows(prev => prev.map((r, i) => i === idx ? { ...r, editValue: val } : r))
  }

  const onConfirmRow = (idx) => {
    setToBeRows(prev => prev.map((r, i) => i === idx ? { ...r, value: r.editValue, status: 'Confirmed', locked: true } : r))
  }

  const onBulkConfirm = () => {
    setToBeRows(prev => prev.map(r => ({ ...r, value: r.editValue, status: 'Confirmed', locked: true })))
    setToast({ message: 'All fields confirmed', status: 'normal' })
  }

  const asIsCols = tablesCfg?.tables?.as_is?.columns || []
  const toBeCols = tablesCfg?.tables?.to_be?.columns || []

  return (
    <Box gap="medium">
      <Heading level={2} margin={{ top: 'small', bottom: 'none' }}>{uploadCfg?.title || 'Upload Transcript'}</Heading>
      {uploadCfg?.helperText && <Text>{uploadCfg.helperText}</Text>}
      <Box direction="row" gap="small" align="center">
        <FileInput onChange={onUpload} name="file" />
        <Button label={(uploadCfg?.buttons?.analyzeLabel) || 'Analyze'} primary disabled={!uploaded} onClick={onAnalyze} />
      </Box>

      {asIsRows.length > 0 && (
        <Box direction={tablesCfg?.layout?.sideBySide ? 'row' : 'column'} gap="medium" wrap>
          <Box flex>
            <Heading level={3} margin={{ vertical: 'small' }}>{tablesCfg?.tables?.as_is?.title || 'As Is'}</Heading>
            <Box overflow="auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {asIsCols.map(c => (<TableCell key={c.field}><strong>{c.label}</strong></TableCell>))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {asIsRows.map((r, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{r.field}</TableCell>
                      <TableCell>{r.value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Box>
          <Box flex>
            <Box direction="row" align="center" justify="between">
              <Heading level={3} margin={{ vertical: 'small' }}>{tablesCfg?.tables?.to_be?.title || 'To Be'}</Heading>
              {tablesCfg?.bulkActions?.enableBulkConfirm && (
                <Button onClick={onBulkConfirm} label={tablesCfg?.bulkActions?.bulkConfirmLabel || 'Confirm All'} />
              )}
            </Box>
            <Box overflow="auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {toBeCols.map(c => (<TableCell key={c.field}><strong>{c.label}</strong></TableCell>))}
                    <TableCell />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {toBeRows.map((r, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{r.field}</TableCell>
                      <TableCell>
                        <Box
                          round="xsmall"
                          pad="xxsmall"
                          border={r.status === 'Confirmed' ? { color: '#01A982', size: '2px' } : undefined}
                        >
                          <TextInput value={r.editValue} onChange={(e) => onEditRow(idx, e.target.value)} disabled={r.locked} />
                        </Box>
                      </TableCell>
                      <TableCell>{r.status}</TableCell>
                      <TableCell>
                        <Button label="Confirm" onClick={() => onConfirmRow(idx)} disabled={r.locked} size="small" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Box>
        </Box>
      )}

      {toast && (
        <Layer position="bottom" modal={false} margin={{ bottom: 'small' }} onEsc={() => setToast(null)} onClickOutside={() => setToast(null)}>
          <Notification toast status={toast.status} message={toast.message} onClose={() => setToast(null)} />
        </Layer>
      )}
    </Box>
  )
}
