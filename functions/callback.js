// Cloudflare Function - Callback de GitHub OAuth
export async function onRequest(context) {
  const url = new URL(context.request.url);
  const code = url.searchParams.get('code');
  
  if (!code) {
    return new Response('Código no proporcionado', { status: 400 });
  }
  
  const clientId = context.env.GITHUB_CLIENT_ID;
  const clientSecret = context.env.GITHUB_CLIENT_SECRET;
  
  if (!clientId || !clientSecret) {
    return new Response('Variables de entorno no configuradas', { status: 500 });
  }
  
  try {
    // Intercambiar código por token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
      }),
    });
    
    const data = await tokenResponse.json();
    
    if (data.error) {
      return new Response(`Error: ${data.error_description}`, { status: 400 });
    }
    
    // Devolver HTML que envía el token a Decap CMS
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Autenticación exitosa</title>
</head>
<body>
  <script>
    (function() {
      const token = "${data.access_token}";
      const provider = "github";
      
      // Enviar mensaje a la ventana padre (Decap CMS)
      if (window.opener) {
        window.opener.postMessage(
          "authorization:github:success:" + JSON.stringify({ token: token, provider: provider }),
          window.location.origin
        );
        window.close();
      } else {
        document.body.innerHTML = '<p>Autenticación exitosa. Puedes cerrar esta ventana.</p>';
      }
    })();
  </script>
  <p>Procesando autenticación...</p>
</body>
</html>
    `;
    
    return new Response(html, {
      headers: { 'Content-Type': 'text/html' },
    });
    
  } catch (error) {
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
}
