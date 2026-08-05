const check = (value: string | undefined) => ({
  nastavena: Boolean(value),
  delka: value?.length ?? 0,
});

export function GET() {
  return Response.json({
    zprava: 'Diagnostika Keystaticu — nezobrazuje žádné tajné hodnoty.',
    promenne: {
      githubClientId: check(import.meta.env.KEYSTATIC_GITHUB_CLIENT_ID),
      githubClientSecret: check(import.meta.env.KEYSTATIC_GITHUB_CLIENT_SECRET),
      keystaticSecret: check(import.meta.env.KEYSTATIC_SECRET),
      githubAppSlug: check(import.meta.env.PUBLIC_KEYSTATIC_GITHUB_APP_SLUG),
    },
  });
}
