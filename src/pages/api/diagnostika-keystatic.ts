export const prerender = false;

const check = (value: string | undefined) => ({
  nastavena: Boolean(value),
  delka: value?.length ?? 0,
});

export function GET() {
  return Response.json({
    zprava: 'Diagnostika Keystaticu — nezobrazuje žádné tajné hodnoty.',
    promenneVeVercelu: {
      githubClientId: check(process.env.KEYSTATIC_GITHUB_CLIENT_ID),
      githubClientSecret: check(process.env.KEYSTATIC_GITHUB_CLIENT_SECRET),
      keystaticSecret: check(process.env.KEYSTATIC_SECRET),
      githubAppSlug: check(process.env.PUBLIC_KEYSTATIC_GITHUB_APP_SLUG),
    },
  });
}
