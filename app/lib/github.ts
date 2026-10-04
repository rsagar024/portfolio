// Server-only GitHub data loader, run at build time (the deploy workflow rebuilds daily),
// so the public GitHub API's 60 req/hour unauthenticated limit is never an issue.
// Set GITHUB_TOKEN (no scopes needed) to raise the limit if you ever need to.

const REVALIDATE_SECONDS = 60 * 60

export type GitHubRepo = {
  name: string
  description: string | null
  url: string
  language: string | null
  stars: number
  forks: number
}

export type ContributionDay = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 }

export type GitHubData = {
  user: string
  profileUrl: string
  publicRepos: number
  /** Own repos: excludes forks and the profile-README repo. */
  ownRepos: number
  followers: number
  totalStars: number
  contributionsLastYear: number | null
  contributions: ContributionDay[]
  topRepos: GitHubRepo[]
  languages: { name: string; count: number }[]
}

async function getJson<T>(url: string, headers: Record<string, string> = {}): Promise<T> {
  const res = await fetch(url, { headers, next: { revalidate: REVALIDATE_SECONDS } })
  if (!res.ok) throw new Error(`${url} -> ${res.status}`)
  return res.json() as Promise<T>
}

type ApiUser = { html_url: string; public_repos: number; followers: number }
type ApiRepo = {
  name: string
  description: string | null
  html_url: string
  language: string | null
  stargazers_count: number
  forks_count: number
  fork: boolean
}
type ApiContributions = { total: { lastYear?: number }; contributions: ContributionDay[] }

function githubHeaders() {
  const headers: Record<string, string> = { Accept: 'application/vnd.github+json' }
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  return headers
}

// Same URL + options as in getGitHubData, so Next serves both from one cached request.
function getRepos(user: string) {
  return getJson<ApiRepo[]>(`https://api.github.com/users/${user}/repos?per_page=100&type=owner`, githubHeaders())
}

export type RepoStats = Record<string, { stars: number; forks: number }>

/** Live star/fork counts keyed by repo name, or null if GitHub is unreachable. */
export async function getRepoStats(user: string): Promise<RepoStats | null> {
  try {
    const repos = await getRepos(user)
    return Object.fromEntries(repos.map(r => [r.name, { stars: r.stargazers_count, forks: r.forks_count }]))
  } catch (err) {
    console.error('GitHub repo stats fetch failed:', err)
    return null
  }
}

export async function getGitHubData(user: string): Promise<GitHubData | null> {
  try {
    const [profile, repos] = await Promise.all([
      getJson<ApiUser>(`https://api.github.com/users/${user}`, githubHeaders()),
      getRepos(user),
    ])

    // Skip forks and the profile-README repo (same name as the user).
    const own = repos.filter(r => !r.fork && r.name.toLowerCase() !== user.toLowerCase())

    const langCounts = new Map<string, number>()
    for (const r of own) if (r.language) langCounts.set(r.language, (langCounts.get(r.language) ?? 0) + 1)

    // Contribution calendar comes from a separate public API; the section still renders without it.
    let contributions: ContributionDay[] = []
    let contributionsLastYear: number | null = null
    try {
      const c = await getJson<ApiContributions>(`https://github-contributions-api.jogruber.de/v4/${user}?y=last`)
      contributions = c.contributions
      contributionsLastYear = c.total.lastYear ?? null
    } catch (err) {
      console.error('GitHub contributions fetch failed:', err)
    }

    return {
      user,
      profileUrl: profile.html_url,
      publicRepos: profile.public_repos,
      ownRepos: own.length,
      followers: profile.followers,
      totalStars: own.reduce((sum, r) => sum + r.stargazers_count, 0),
      contributionsLastYear,
      contributions,
      topRepos: [...own]
        .sort((a, b) => b.stargazers_count - a.stargazers_count || b.forks_count - a.forks_count)
        .slice(0, 6)
        .map(r => ({
          name: r.name,
          description: r.description,
          url: r.html_url,
          language: r.language,
          stars: r.stargazers_count,
          forks: r.forks_count,
        })),
      languages: [...langCounts.entries()]
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count),
    }
  } catch (err) {
    console.error('GitHub data fetch failed:', err)
    return null
  }
}
