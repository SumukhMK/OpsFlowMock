import React, { useEffect, useMemo, useState } from 'react'
import { Box, Heading, Table, TableBody, TableCell, TableHeader, TableRow, Text } from 'grommet'
import { fetchJson } from '../utils/fetchJson'

export default function Staffing() {
  const [teamReq, setTeamReq] = useState([])
  const [mapping, setMapping] = useState([])
  const [finalTeam, setFinalTeam] = useState([])
  const [summary, setSummary] = useState(null)

  useEffect(() => {
    async function load() {
      const [req, map, fin] = await Promise.all([
        fetchJson('/json/staffing/team_requirements.json'),
        fetchJson('/json/staffing/mapping.json'),
        fetchJson('/json/staffing/final_team.json'),
      ])
      setTeamReq(req.team_requirements || [])
      setMapping(map.mapping || [])
      setFinalTeam(fin.final_team || [])
      setSummary(fin.summary || null)
    }
    load().catch(console.error)
  }, [])

  const totalCostInr = useMemo(() => {
    if (summary?.total_cost_inr != null) return summary.total_cost_inr
    // If no summary, approximate from finalTeam using 160 hours per month as placeholder
    const HOURS = 160
    return finalTeam.reduce((acc, r) => acc + (r.rate_inr_hr || 0) * HOURS * (r.count || 0), 0)
  }, [summary, finalTeam])

  return (
    <Box gap="large">
      <Box>
        <Heading level={2} margin={{ top: 'small', bottom: 'small' }}>Team vs Skills</Heading>
        <Box overflow="auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell scope="col"><strong>Role</strong></TableCell>
                <TableCell scope="col"><strong>Skills</strong></TableCell>
                <TableCell scope="col"><strong>Count</strong></TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teamReq.map((r, idx) => (
                <TableRow key={idx}>
                  <TableCell>{r.role}</TableCell>
                  <TableCell>{Array.isArray(r.skills) ? r.skills.join(', ') : r.skills}</TableCell>
                  <TableCell>{r.count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Box>

      <Box>
        <Heading level={2} margin={{ bottom: 'small' }}>Employees mapped to Team</Heading>
        <Box overflow="auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell scope="col"><strong>Role</strong></TableCell>
                <TableCell scope="col"><strong>Employees</strong></TableCell>
                <TableCell scope="col"><strong>Availability</strong></TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mapping.map((m, idx) => (
                <TableRow key={idx}>
                  <TableCell>{m.role}</TableCell>
                  <TableCell>{(m.employees || []).join(', ')}</TableCell>
                  <TableCell>{m.availability}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Box>

      <Box>
        <Heading level={2} margin={{ bottom: 'small' }}>Rate Card & Final Bill Summary</Heading>
        <Box overflow="auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell scope="col"><strong>Role</strong></TableCell>
                <TableCell scope="col"><strong>Count</strong></TableCell>
                <TableCell scope="col"><strong>JL</strong></TableCell>
                <TableCell scope="col"><strong>Rate (INR/hr)</strong></TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {finalTeam.map((r, idx) => (
                <TableRow key={idx}>
                  <TableCell>{r.role}</TableCell>
                  <TableCell>{r.count}</TableCell>
                  <TableCell>{Array.isArray(r.jl) ? r.jl.join(', ') : r.jl}</TableCell>
                  <TableCell>{r.rate_inr_hr}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
        <Box margin={{ top: 'small' }}>
          <Text size="small">Members: {summary?.total_members ?? finalTeam.reduce((a, r) => a + (r.count || 0), 0)}</Text>
          <Text size="small">Allocation: {summary?.allocation ?? '—'}</Text>
          <Text size="small">Average Rate (INR/hr): {summary?.average_rate_inr_hr ?? '—'}</Text>
          <Text size="small">Effective Hours: {summary?.effective_hours ?? '—'}</Text>
          <Text size="small">Total Cost (INR): {summary?.total_cost_inr ?? totalCostInr}</Text>
          <Text size="small">Total Cost (USD): {summary?.total_cost_usd ?? '—'}</Text>
        </Box>
      </Box>
    </Box>
  )
}
