import { getGitHubData } from '../../lib/github'
import { GITHUB_USER } from '../../lib/site'
import GitHubView from './GitHubView'

// Server component: fetches real GitHub data (cached for an hour), then hands it to the animated client view.
export default async function GitHubSection() {
  const data = await getGitHubData(GITHUB_USER)
  return <GitHubView data={data} user={GITHUB_USER} />
}
