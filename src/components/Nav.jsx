import React from 'react'
import { Header, Nav as GrommetNav, Anchor, Box, Text, Image } from 'grommet'
import { Link } from 'react-router-dom'
import hpeLogo from '../../hpe2.png'

export default function Nav() {
  return (
    <Header pad={{ horizontal: 'medium', vertical: 'small' }} background="background-contrast">
      <Box direction="row" gap="small" align="center">
        <Image src={hpeLogo} alt="HPE" style={{ height: 28, width: 'auto' }} fit="contain" />
        <Text weight="bold">OPSFLOW</Text>
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
