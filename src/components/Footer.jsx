import React from 'react'
import { Footer as GrommetFooter, Box, Text } from 'grommet'
import pkg from '../../package.json'

export default function Footer() {
  return (
    <GrommetFooter
      background="background-contrast"
      pad={{ horizontal: 'medium', vertical: 'small' }}
      border={{ side: 'top', color: 'border', size: 'xsmall' }}
    >
      <Box fill direction="row" align="center" justify="between">
        <Box>
          <Text size="small" color="text-weak">
            © {new Date().getFullYear()} Hewlett Packard Enterprise. All rights reserved.
          </Text>
        </Box>
        <Box>
          <Text size="small" color="text-weak">
            v{pkg.version} • {import.meta.env.MODE} • {new Date().toLocaleDateString()}
          </Text>
        </Box>
      </Box>
    </GrommetFooter>
  )
}
