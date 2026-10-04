// Apps shipped to Google Play. Single source of truth for the Experience and Projects sections
// and for the live "Projects" count in the hero/about stats.

export const PLAY_APPS = {
  sobhaConcrete: 'com.sobha.concrete',
  sobhaTechConnect: 'com.sobha.technicians',
  gpWorld: 'com.gourmetplanet.gpapplication',
  myweb: 'com.mywebapp.android',
  leadrat: 'com.leadrat.black.mobile.droid.leadrat',
} as const

export const playStoreUrl = (id: string) => `https://play.google.com/store/apps/details?id=${id}`

export type ProjectCount = { total: number; repos: number; apps: number }

const REVALIDATE_SECONDS = 60 * 60 * 24

/**
 * Number of the apps above that are still published on Google Play (server-only, cached daily).
 * Play has no public API, so this checks each listing page: an unpublished app returns 404.
 * A network error counts the app as live, so a Play outage never shrinks the number.
 */
export async function getLivePlayStoreAppCount(): Promise<number> {
  const results = await Promise.all(
    Object.values(PLAY_APPS).map(async (id) => {
      try {
        const res = await fetch(`${playStoreUrl(id)}&hl=en`, { method: 'HEAD', next: { revalidate: REVALIDATE_SECONDS } })
        return res.status !== 404
      } catch (err) {
        console.error(`Play Store check failed for ${id}:`, err)
        return true
      }
    }),
  )
  return results.filter(Boolean).length
}
