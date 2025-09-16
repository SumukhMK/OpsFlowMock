import React, { useEffect, useState } from 'react'
import {
  Box, Button, Form, FormField, Heading, Text, TextArea, TextInput,
  Grid, PageHeader, DataTable, Card, CardHeader, CardBody, CardFooter
} from 'grommet'
import { fetchJson } from '../utils/fetchJson'

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [formValue, setFormValue] = useState({ project_name: '', ope_id: '', description: '' })

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const data = await fetchJson('/json/projects/projects.json')
        setProjects(data.projects || [])
        setError(null)
      } catch (err) {
        console.error('Failed to load projects:', err)
        setError('Failed to load projects data')
        setProjects([])
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const handleSubmit = ({ value }) => {
    const name = value.project_name?.trim()
    const ope = value.ope_id?.trim()
    const desc = value.description?.trim()
    if (!name || !ope || !desc) return
    setProjects(prev => [...prev, { project_name: name, ope_id: ope, description: desc }])
    setFormValue({ project_name: '', ope_id: '', description: '' })
  }

  // DataTable columns: align, pin header, and truncate long text
  const columns = [
    { property: 'project_name', header: 'Project Name', primary: true, render: d => <Text truncate>{d.project_name}</Text> },
    { property: 'ope_id', header: 'OPE ID', size: 'small' },
    { property: 'description', header: 'Description', render: d => <Text truncate>{d.description}</Text> },
  ]

  return (
    <Box fill pad={{ horizontal: 'medium', bottom: 'medium' }} gap="medium">
      <PageHeader
        title="Projects"
        subtitle="Create and manage projects"
        actions={<Button primary label="Add Project" type="submit" form="projectForm" />}
      />
      <Grid
        fill
        rows={['auto', 'flex']}
        columns={['flex']}
        areas={[{ name: 'form', start: [0, 0], end: [0, 0] }, { name: 'main', start: [0, 1], end: [0, 1] }]}
        gap="medium"
      >
        <Box gridArea="form">
          <Card background="light-1" round="small" elevation="xsmall">
            <CardHeader pad="medium">
              <Heading level={3} margin="none">Create Project</Heading>
            </CardHeader>
            <CardBody pad="medium">
              <Form
                id="projectForm"
                value={formValue}
                onChange={setFormValue}
                onSubmit={handleSubmit}
                validate="blur"
              >
                <Box gap="small" width="large">
                  <FormField name="project_name" label="Project Name" required>
                    <TextInput name="project_name" placeholder="Enter project name" />
                  </FormField>
                  <FormField name="ope_id" label="OPE ID" required>
                    <TextInput name="ope_id" placeholder="Enter OPE ID" />
                  </FormField>
                  <FormField name="description" label="Project Description" required>
                    <TextArea name="description" resize={false} rows={4} placeholder="Enter project description" />
                  </FormField>
                  <Box direction="row" gap="small">
                    <Button type="submit" primary label="Add Project" />
                    <Button type="reset" label="Reset" onClick={() => setFormValue({ project_name: '', ope_id: '', description: '' })} />
                  </Box>
                </Box>
              </Form>
            </CardBody>
            <CardFooter pad="small" background="background-contrast" />
          </Card>
        </Box>

        <Box gridArea="main" overflow="auto">
          {loading ? (
            <Box pad="medium" align="center" background="light-2" round="small">
              <Text>Loading projects...</Text>
            </Box>
          ) : error ? (
            <Box pad="medium" background="status-critical" round="small">
              <Text color="white">{error}</Text>
            </Box>
          ) : projects.length === 0 ? (
            <Box pad="medium" background="light-2" round="small" align="center">
              <Text>No projects found. Add a project using the form above.</Text>
            </Box>
          ) : (
            <Card background="white" round="small" elevation="xsmall">
              <CardHeader pad={{ horizontal: 'medium', vertical: 'small' }} background="background-contrast">
                <Text weight="bold">Projects ({projects.length})</Text>
              </CardHeader>
              <CardBody pad="none">
                <DataTable
                  data={projects}
                  columns={columns}
                  pin
                  fill
                  step={25}
                  sortable
                  resizeable
                  background={{
                    header: 'background-front',
                    body: ['white', 'light-1'],
                  }}
                  border={{ header: 'bottom', body: 'between' }}
                  pad="small"
                />
              </CardBody>
            </Card>
          )}
        </Box>
      </Grid>
    </Box>
  )
}
