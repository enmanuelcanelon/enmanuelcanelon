export async function onRequestGet(context) {
  const { env, request } = context;
  
  const siteURL = new URL(request.url).origin;
  const params = new URLSearchParams({
    client_id: env.GITHUB_CLIENT_ID,
    redirect_uri: `${siteURL}/api/callback`,
    scope: 'repo,user',
    state: crypto.randomUUID()
  });

  return Response.redirect(
    `https://github.com/login/oauth/authorize?${params.toString()}`,
    302
  );
}
