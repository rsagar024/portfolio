import { getRepoStats } from '../../lib/github'
import { GITHUB_USER } from '../../lib/site'
import ProjectsView from './ProjectsView'

// Server component: fetches live star/fork counts (cached hourly), then renders the interactive client view.
export default async function Projects() {
  const repoStats = await getRepoStats(GITHUB_USER)
  return <ProjectsView repoStats={repoStats} user={GITHUB_USER} />
}
