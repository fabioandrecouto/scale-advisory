exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

  let body;
  try { body = JSON.parse(event.body); } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const { nome, email, instagram, telefone, faturamento, negocio, porque } = body;

  if (!nome || !email) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Nome e e-mail são obrigatórios.' }) };
  }

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'noreply@scaleco.ai',
        to: 'fabio@scaleco.ai',
        subject: `📋 Nova aplicação — Scale Advisory · ${nome}`,
        html: `
          <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a">
            <h2 style="font-size:22px;font-weight:400;border-bottom:2px solid #c8a76a;padding-bottom:12px;margin-bottom:24px">
              Nova aplicação — Scale Advisory
            </h2>

            <table style="width:100%;border-collapse:collapse">
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #eee;width:140px;color:#888;font-size:13px;vertical-align:top">Nome</td>
                <td style="padding:10px 0;border-bottom:1px solid #eee;font-size:14px"><strong>${nome}</strong></td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #eee;color:#888;font-size:13px;vertical-align:top">E-mail</td>
                <td style="padding:10px 0;border-bottom:1px solid #eee;font-size:14px"><a href="mailto:${email}" style="color:#c8a76a">${email}</a></td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #eee;color:#888;font-size:13px;vertical-align:top">Instagram</td>
                <td style="padding:10px 0;border-bottom:1px solid #eee;font-size:14px">${instagram || '—'}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #eee;color:#888;font-size:13px;vertical-align:top">Telefone</td>
                <td style="padding:10px 0;border-bottom:1px solid #eee;font-size:14px">
                  <a href="https://wa.me/55${(telefone||'').replace(/\D/g,'')}" style="color:#c8a76a">${telefone || '—'}</a>
                </td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #eee;color:#888;font-size:13px;vertical-align:top">Faturamento</td>
                <td style="padding:10px 0;border-bottom:1px solid #eee;font-size:14px"><strong>${faturamento || '—'}</strong></td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #eee;color:#888;font-size:13px;vertical-align:top">Negócio</td>
                <td style="padding:10px 0;border-bottom:1px solid #eee;font-size:14px">${negocio || '—'}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;color:#888;font-size:13px;vertical-align:top">Por que faz sentido</td>
                <td style="padding:10px 0;font-size:14px;font-style:italic">"${porque || '—'}"</td>
              </tr>
            </table>

            <div style="margin-top:32px;padding:16px 20px;background:#f9f6f0;border-left:3px solid #c8a76a;border-radius:2px">
              <p style="margin:0;font-size:13px;color:#666">
                Aplicação recebida em ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}
              </p>
            </div>

            <p style="margin-top:24px;font-size:11px;color:#bbb">
              Scale Advisory · ScaleCo · scaleco.ai
            </p>
          </div>
        `
      })
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: true })
    };
  } catch (e) {
    console.error('Resend error:', e.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erro ao enviar.' })
    };
  }
};
