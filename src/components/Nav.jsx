import React from 'react'
import { Header, Nav as GrommetNav, Anchor, Box, Text } from 'grommet'
import { Link } from 'react-router-dom'

export default function Nav() {
  return (
    <Header pad={{ horizontal: 'medium', vertical: 'small' }} background="background-contrast">
      <Box direction="row" gap="small" align="center">
        <Box round background="brand" pad={{ vertical: 'xsmall', horizontal: 'small' }}>
          <Text weight="bold" color="white">HPE</Text>
        </Box>
        <Text weight="bold">Opsflow (Mock)</Text>
      </Box>
      <GrommetNav direction="row">
        <Anchor as={Link} label="Projects" to="/projects" />
        <Anchor as={Link} label="Analyze" to="/analyze" />
        <Anchor as={Link} label="Architectures" to="/architectures" />
        <Anchor as={Link} label="Staffing" to="/staffing" />
      </GrommetNav>
    </Header>
  )
}
