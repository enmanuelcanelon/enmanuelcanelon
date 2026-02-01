// Cloudflare Function - Inicia autenticación con GitHub
export async function onRequest(context) {
  const clientId = context.env.GITHUB_CLIENT_ID;
  
  if (!clientId) {
    return new Response('GITHUB_CLIENT_ID no configurado', { status: 500 });
  }
  
  const redirectUri = new URL(context.request.url).origin + '/callback';
  const scope = 'repo,user';
  
  const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}`;
  
  return Response.redirect(authUrl, 302);
}
