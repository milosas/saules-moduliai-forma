// Email Templates for Solar Energy - LDA Energija
// D0: Solar proposal, D1: Benefits, D3: Discount, D5: Final reminder

// ============================================================
// D0 - Saulės elektrinės pasiūlymas (immediate after form)
// ============================================================
function generateD0Email(data) {
  const {
    vardas = 'Kliente',
    tipas = 'Saulės elektrinė',
    menesinesSanaudos = 0,
    stogoOrientacija = '',
    stogoPlotas = 0,
    rekomenduojamaGalia = 0,
    moduliuSk = 0,
    metineGamyba = 0,
    sutaupymas = 0,
    dominaAPVA = false,
    apvaSubsidija = 0,
    produktai = []
  } = data;

  let produktuEilutes = '';
  produktai.forEach((p, i) => {
    const bgColor = i === 0
      ? 'background: linear-gradient(135deg, #e8f0ff 0%, #dde8ff 100%);'
      : (i % 2 === 0 ? 'background-color: #ffffff;' : 'background-color: #f8f9fa;');
    const rekBadge = i === 0
      ? '<div style="display: inline-block; background-color: #fd6d15; color: #ffffff; font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 4px; margin-left: 8px;">REKOMENDUOJAMA</div>'
      : '';
    produktuEilutes += `
                <tr style="${bgColor}">
                  <td style="padding: 14px 10px; color: #1a1a2e; font-size: 14px; font-weight: 600; border-bottom: 1px solid #e8e8e8; border-right: 1px solid #f0f0f0;">
                    ${p.modulis || p.gamintojas + ' ' + p.modelis}${rekBadge}
                  </td>
                  <td style="padding: 14px 10px; color: #1a1a2e; font-size: 14px; text-align: center; border-bottom: 1px solid #e8e8e8; border-right: 1px solid #f0f0f0;">${p.galia_w || ''} W</td>
                  <td style="padding: 14px 10px; color: #1a1a2e; font-size: 14px; text-align: center; border-bottom: 1px solid #e8e8e8; border-right: 1px solid #f0f0f0;">${p.efektyvumas || ''}%</td>
                  <td style="padding: 14px 10px; color: #1a1a2e; font-size: 14px; text-align: center; border-bottom: 1px solid #e8e8e8; border-right: 1px solid #f0f0f0;">${p.garantija || ''} m.</td>
                  <td style="padding: 14px 10px; color: #fd6d15; font-size: 16px; font-weight: 700; text-align: center; border-bottom: 1px solid #e8e8e8;">${p.kaina_eur || ''} &euro;</td>
                </tr>`;
  });

  // Fallback if no products provided
  if (produktai.length === 0) {
    produktuEilutes = `
                <tr style="background-color: #ffffff;">
                  <td colspan="5" style="padding: 20px; color: #4a4a6a; font-size: 14px; text-align: center;">Produktai bus pateikti netrukus</td>
                </tr>`;
  }

  const apvaSection = dominaAPVA ? `
          <!-- APVA Subsidija -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <table role="presentation" style="width: 100%; background: linear-gradient(135deg, #e8f0ff 0%, #dde8ff 100%); border-radius: 12px; border-left: 4px solid #055d98;">
                <tr>
                  <td style="padding: 24px;">
                    <p style="margin: 0 0 12px 0; color: #001959; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">APVA Subsidija</p>
                    <p style="margin: 0 0 8px 0; color: #1a1a2e; font-size: 15px; line-height: 1.6;">
                      Valstybes parama saulės elektrinėms - iki <strong>255 EUR/kWp</strong>.
                    </p>
                    <p style="margin: 0; color: #1a1a2e; font-size: 15px; line-height: 1.6;">
                      Jūsų sistemai (${rekomenduojamaGalia} kWp) galima subsidija: <strong>${apvaSubsidija} &euro;</strong>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>` : '';

  return `<!DOCTYPE html>
<html lang="lt">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Jūsų saulės elektrinės pasiūlymas</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', 'Open Sans', Arial, sans-serif; background-color: #f4f4f4;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f4f4f4;">
    <tr>
      <td style="padding: 20px 0;">
        <table role="presentation" style="width: 100%; max-width: 700px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #001959 0%, #055d98 100%); padding: 40px 30px; text-align: center;">
              <img src="https://ldaenergia.lt/wp-content/uploads/2025/03/logo-white-2.svg" alt="LDA Energija" style="max-width: 200px; height: auto; margin-bottom: 12px;">
              <p style="margin: 10px 0 0 0; color: #c5d8f0; font-size: 16px;">Saulės energijos sprendimai</p>
            </td>
          </tr>

          <!-- Trust Bar -->
          <tr>
            <td style="background-color: #e8f0ff; padding: 16px 30px; text-align: center; border-bottom: 3px solid #055d98;">
              <p style="margin: 0; color: #1a1a2e; font-size: 14px; font-weight: 600;">
                3000+ įrengtų sistemų &middot; Sungrow &amp; Huawei partneriai &middot; APVA subsidija
              </p>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding: 40px 30px 20px 30px;">
              <h2 style="margin: 0 0 16px 0; color: #1a1a2e; font-size: 24px; font-weight: 700;">Sveiki, ${vardas}!</h2>
              <p style="margin: 0; color: #4a4a6a; font-size: 16px; line-height: 1.6;">
                Dėkojame už užklausą. Pagal Jūsų pateiktus parametrus parinkome <strong>optimalius saulės elektrinės sprendimus</strong>, atitinkancius Jūsų poreikius.
              </p>
            </td>
          </tr>

          <!-- Parameters Summary -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <table role="presentation" style="width: 100%; background: linear-gradient(135deg, #e8f0ff 0%, #dde8ff 100%); border-radius: 12px; border-left: 4px solid #055d98;">
                <tr>
                  <td style="padding: 20px 24px;">
                    <p style="margin: 0 0 12px 0; color: #001959; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Jūsų parametrai</p>
                    <table role="presentation" style="width: 100%;">
                      <tr>
                        <td style="padding: 4px 0; color: #1a1a2e; font-size: 15px;">Menesinis vartojimas:</td>
                        <td style="padding: 4px 0; color: #1a1a2e; font-size: 15px; font-weight: 600; text-align: right;">${menesinesSanaudos} kWh</td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0; color: #1a1a2e; font-size: 15px;">Stogo orientacija:</td>
                        <td style="padding: 4px 0; color: #1a1a2e; font-size: 15px; font-weight: 600; text-align: right;">${stogoOrientacija}</td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0; color: #1a1a2e; font-size: 15px;">Stogo plotas:</td>
                        <td style="padding: 4px 0; color: #1a1a2e; font-size: 15px; font-weight: 600; text-align: right;">${stogoPlotas} m&sup2;</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Calculated System -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <table role="presentation" style="width: 100%; background: linear-gradient(135deg, #fff5eb 0%, #ffe8d6 100%); border-radius: 12px; border-left: 4px solid #fd6d15;">
                <tr>
                  <td style="padding: 20px 24px;">
                    <p style="margin: 0 0 12px 0; color: #fd6d15; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Rekomenduojama sistema</p>
                    <table role="presentation" style="width: 100%;">
                      <tr>
                        <td style="padding: 4px 0; color: #1a1a2e; font-size: 15px;">Rekomenduojama galia:</td>
                        <td style="padding: 4px 0; color: #1a1a2e; font-size: 15px; font-weight: 600; text-align: right;">${rekomenduojamaGalia} kWp</td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0; color: #1a1a2e; font-size: 15px;">Moduliu sk.:</td>
                        <td style="padding: 4px 0; color: #1a1a2e; font-size: 15px; font-weight: 600; text-align: right;">${moduliuSk} vnt.</td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0; color: #1a1a2e; font-size: 15px;">Metine gamyba:</td>
                        <td style="padding: 4px 0; color: #1a1a2e; font-size: 15px; font-weight: 600; text-align: right;">${metineGamyba} kWh</td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0; color: #1a1a2e; font-size: 15px;">Sutaupymas per metus:</td>
                        <td style="padding: 4px 0; color: #fd6d15; font-size: 15px; font-weight: 700; text-align: right;">${sutaupymas} &euro;</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          ${apvaSection}

          <!-- Product Comparison Table -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <h3 style="margin: 0 0 20px 0; color: #1a1a2e; font-size: 20px; font-weight: 700;">Rekomenduojami produktai</h3>

              <table role="presentation" style="width: 100%; border-collapse: collapse; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.06);">
                <!-- Table Header -->
                <tr style="background: linear-gradient(135deg, #001959 0%, #055d98 100%);">
                  <th style="padding: 14px 10px; color: #ffffff; font-size: 13px; font-weight: 700; text-align: left; border-right: 1px solid rgba(255,255,255,0.1);">Modulis</th>
                  <th style="padding: 14px 10px; color: #ffffff; font-size: 13px; font-weight: 700; text-align: center; border-right: 1px solid rgba(255,255,255,0.1);">Galia W</th>
                  <th style="padding: 14px 10px; color: #ffffff; font-size: 13px; font-weight: 700; text-align: center; border-right: 1px solid rgba(255,255,255,0.1);">Efektyvumas</th>
                  <th style="padding: 14px 10px; color: #ffffff; font-size: 13px; font-weight: 700; text-align: center; border-right: 1px solid rgba(255,255,255,0.1);">Garantija</th>
                  <th style="padding: 14px 10px; color: #ffffff; font-size: 13px; font-weight: 700; text-align: center;">Kaina</th>
                </tr>

                ${produktuEilutes}
              </table>
            </td>
          </tr>

          <!-- Expert Recommendation -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <table role="presentation" style="width: 100%; background: linear-gradient(135deg, #fff5eb 0%, #ffe8d6 100%); border-radius: 12px; border-left: 4px solid #fd6d15;">
                <tr>
                  <td style="padding: 24px;">
                    <p style="margin: 0 0 12px 0; color: #fd6d15; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Eksperto rekomendacija</p>
                    <p style="margin: 0; color: #4a4a6a; font-size: 15px; line-height: 1.6;">
                      Rekomenduojame <strong>${rekomenduojamaGalia} kWp</strong> saulės elektrinė, kuri pilnai padengs Jūsų metinius elektros poreikius. Su APVA subsidija investicija atsipirks greiciau.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Why LDA Energija Section -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <h3 style="margin: 0 0 24px 0; color: #1a1a2e; font-size: 20px; font-weight: 700; text-align: center;">Kodel LDA Energija?</h3>

              <table role="presentation" style="width: 100%;">
                <tr>
                  <td style="width: 50%; padding: 0 8px 16px 0; vertical-align: top;">
                    <table role="presentation" style="width: 100%; background-color: #f8f9fa; border-radius: 10px; height: 100%;">
                      <tr>
                        <td style="padding: 20px; text-align: center;">
                          <div style="font-size: 32px; margin-bottom: 8px;">&#9728;&#65039;</div>
                          <p style="margin: 0 0 8px 0; color: #1a1a2e; font-size: 15px; font-weight: 700;">3000+ įrengtų sistemų</p>
                          <p style="margin: 0; color: #4a4a6a; font-size: 13px; line-height: 1.5;">Didele patirtis saulės energetikoje</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td style="width: 50%; padding: 0 0 16px 8px; vertical-align: top;">
                    <table role="presentation" style="width: 100%; background-color: #f8f9fa; border-radius: 10px; height: 100%;">
                      <tr>
                        <td style="padding: 20px; text-align: center;">
                          <div style="font-size: 32px; margin-bottom: 8px;">&#9989;</div>
                          <p style="margin: 0 0 8px 0; color: #1a1a2e; font-size: 15px; font-weight: 700;">Oficialus partneriai</p>
                          <p style="margin: 0; color: #4a4a6a; font-size: 13px; line-height: 1.5;">Sungrow &amp; Huawei oficialus atstovai</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="width: 50%; padding: 0 8px 0 0; vertical-align: top;">
                    <table role="presentation" style="width: 100%; background-color: #f8f9fa; border-radius: 10px; height: 100%;">
                      <tr>
                        <td style="padding: 20px; text-align: center;">
                          <div style="font-size: 32px; margin-bottom: 8px;">&#128736;</div>
                          <p style="margin: 0 0 8px 0; color: #1a1a2e; font-size: 15px; font-weight: 700;">Pilna paslauga</p>
                          <p style="margin: 0; color: #4a4a6a; font-size: 13px; line-height: 1.5;">Nuo projekto iki montavimo ir prieziuros</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td style="width: 50%; padding: 0 0 0 8px; vertical-align: top;">
                    <table role="presentation" style="width: 100%; background-color: #f8f9fa; border-radius: 10px; height: 100%;">
                      <tr>
                        <td style="padding: 20px; text-align: center;">
                          <div style="font-size: 32px; margin-bottom: 8px;">&#128222;</div>
                          <p style="margin: 0 0 8px 0; color: #1a1a2e; font-size: 15px; font-weight: 700;">Nemokama konsultacija</p>
                          <p style="margin: 0; color: #4a4a6a; font-size: 13px; line-height: 1.5;">Objekto apziura ir detali konsultacija</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Social Proof -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <table role="presentation" style="width: 100%; background: linear-gradient(135deg, #e8f0ff 0%, #dde8ff 100%); border-radius: 12px; border-left: 4px solid #055d98;">
                <tr>
                  <td style="padding: 24px;">
                    <p style="margin: 0 0 8px 0; color: #1a1a2e; font-size: 15px; line-height: 1.7; font-style: italic;">
                      "Saulės elektrinė irengta per 2 dienas, viskas sutvarkyta profesionaliai. Po pirmu metu elektros sąskaita sumažėjo 75%! Labai rekomenduoju LDA Energija."
                    </p>
                    <p style="margin: 0; color: #055d98; font-size: 13px; font-weight: 700;">&mdash; Tomas K., Kaunas</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td style="padding: 0 30px 40px 30px; text-align: center;">
              <table role="presentation" style="margin: 0 auto;">
                <tr>
                  <td style="background-color: #fd6d15; border-radius: 8px; box-shadow: 0 4px 16px rgba(253, 109, 21, 0.3);">
                    <a href="tel:+37063082999" style="display: inline-block; padding: 16px 40px; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 700; letter-spacing: 0.3px;">
                      Uzsisakyti konsultacija
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin: 16px 0 0 0; color: #4a4a6a; font-size: 14px;">Arba atsakykite į šį laišką &ndash; atsakysime per kelias valandas</p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background: linear-gradient(135deg, #001959 0%, #055d98 100%); padding: 30px; text-align: center;">
              <img src="https://ldaenergia.lt/wp-content/uploads/2025/03/logo-white-2.svg" alt="LDA Energija" style="max-width: 150px; height: auto; margin-bottom: 16px;">
              <p style="margin: 0 0 16px 0; color: #e8e8e8; font-size: 14px; line-height: 1.6;">
                Tel.: +370 630 82999<br>
                Servisas: +370 636 90999<br>
                El. p.: info@ldaenergia.lt
              </p>
              <p style="margin: 0; color: #a8b8d8; font-size: 12px; line-height: 1.5;">
                LDA Energija &middot; Aido g. 6, Giraitė, LT54310, Kauno r.<br>
                <a href="https://ldaenergia.lt" style="color: #a8b8d8;">ldaenergia.lt</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ============================================================
// D1 - 5 saulės energijos privalumai (Day 1)
// ============================================================
function generateD1Email(data) {
  const {
    vardas = 'Kliente'
  } = data;

  return `<!DOCTYPE html>
<html lang="lt">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>5 priežastys rinktis saulės elektrinę</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', 'Open Sans', Arial, sans-serif; background-color: #f4f4f4;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f4f4f4;">
    <tr>
      <td style="padding: 20px 0;">
        <table role="presentation" style="width: 100%; max-width: 700px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #001959 0%, #055d98 100%); padding: 40px 30px; text-align: center;">
              <img src="https://ldaenergia.lt/wp-content/uploads/2025/03/logo-white-2.svg" alt="LDA Energija" style="max-width: 200px; height: auto; margin-bottom: 12px;">
              <p style="margin: 10px 0 0 0; color: #c5d8f0; font-size: 16px;">Išmani energija jūsų namams</p>
            </td>
          </tr>

          <!-- Trust Bar -->
          <tr>
            <td style="background-color: #e8f0ff; padding: 16px 30px; text-align: center; border-bottom: 3px solid #055d98;">
              <p style="margin: 0; color: #1a1a2e; font-size: 14px; font-weight: 600;">
                3000+ įrengtų sistemų &middot; Sungrow &amp; Huawei partneriai &middot; APVA subsidija
              </p>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding: 40px 30px 20px 30px;">
              <h2 style="margin: 0 0 16px 0; color: #1a1a2e; font-size: 24px; font-weight: 700;">Sveiki, ${vardas}!</h2>
              <p style="margin: 0; color: #4a4a6a; font-size: 16px; line-height: 1.6;">
                Jau išsiuntėme jums saulės elektrinės pasiūlymą. Norime trumpai papasakoti, <strong>kodėl saulės elektrinė yra išskirtinė investicija</strong> i jūsų namų energetinį nepriklausomumą.
              </p>
            </td>
          </tr>

          <!-- Benefits Section -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <h3 style="margin: 0 0 24px 0; color: #1a1a2e; font-size: 20px; font-weight: 700; text-align: center;">5 priežastys rinktis saulės elektrinę</h3>

              <!-- Benefit 1 -->
              <table role="presentation" style="width: 100%; margin-bottom: 16px; background: linear-gradient(135deg, #fff5eb 0%, #ffe8d6 100%); border-radius: 12px; border-left: 4px solid #fd6d15;">
                <tr>
                  <td style="width: 60px; padding: 24px 0 24px 24px; vertical-align: top;">
                    <div style="font-size: 40px;">&#9889;</div>
                  </td>
                  <td style="padding: 24px 24px 24px 16px;">
                    <p style="margin: 0 0 8px 0; color: #fd6d15; font-size: 16px; font-weight: 700;">Energijos nepriklausomybė</p>
                    <p style="margin: 0; color: #4a4a6a; font-size: 15px; line-height: 1.6;">
                      Gaminkite savo elektrą tiesiogiai iš saulės. Mazinkite priklausomybe nuo tinklo ir augancio elektros tarifai. Jūsų stogas tampa jūsų elektrine.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Benefit 2 -->
              <table role="presentation" style="width: 100%; margin-bottom: 16px; background: linear-gradient(135deg, #e8f0ff 0%, #dde8ff 100%); border-radius: 12px; border-left: 4px solid #055d98;">
                <tr>
                  <td style="width: 60px; padding: 24px 0 24px 24px; vertical-align: top;">
                    <div style="font-size: 40px;">&#128176;</div>
                  </td>
                  <td style="padding: 24px 24px 24px 16px;">
                    <p style="margin: 0 0 8px 0; color: #055d98; font-size: 16px; font-weight: 700;">Elektros sąskaitų mažinimas iki 80%</p>
                    <p style="margin: 0; color: #4a4a6a; font-size: 15px; line-height: 1.6;">
                      Saulės elektrinė gamina nemokamą elektrą dienos metu. Su kaupikliu galite naudoti saulės energiją ir vakare. Investicija atsipirks per 5–7 metus, o sistema veiks 25+ metus.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Benefit 3 -->
              <table role="presentation" style="width: 100%; margin-bottom: 16px; background: linear-gradient(135deg, #fff5eb 0%, #ffe8d6 100%); border-radius: 12px; border-left: 4px solid #fd6d15;">
                <tr>
                  <td style="width: 60px; padding: 24px 0 24px 24px; vertical-align: top;">
                    <div style="font-size: 40px;">&#127979;</div>
                  </td>
                  <td style="padding: 24px 24px 24px 16px;">
                    <p style="margin: 0 0 8px 0; color: #fd6d15; font-size: 16px; font-weight: 700;">APVA subsidija &ndash; valstybes parama iki 255 EUR/kWp</p>
                    <p style="margin: 0; color: #4a4a6a; font-size: 15px; line-height: 1.6;">
                      Aplinkos projektų valdymo agentūra (APVA) suteikia subsidijas fiziniams asmenims. Tai reikšmingai sumažina pradinę investiciją ir pagreitina atsipirkima.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Benefit 4 -->
              <table role="presentation" style="width: 100%; margin-bottom: 16px; background: linear-gradient(135deg, #e8f0ff 0%, #dde8ff 100%); border-radius: 12px; border-left: 4px solid #055d98;">
                <tr>
                  <td style="width: 60px; padding: 24px 0 24px 24px; vertical-align: top;">
                    <div style="font-size: 40px;">&#127793;</div>
                  </td>
                  <td style="padding: 24px 24px 24px 16px;">
                    <p style="margin: 0 0 8px 0; color: #055d98; font-size: 16px; font-weight: 700;">Ekologiška energija &ndash; mažinkite CO2 pėdsaką</p>
                    <p style="margin: 0; color: #4a4a6a; font-size: 15px; line-height: 1.6;">
                      Saulės energija yra švari ir atsinaujinanti. Kiekvienas kWh pagamintas iš saulės sumažina CO2 emisijas. Prisidekite prie svaresnes aplinkos ateities kartoms.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Benefit 5 -->
              <table role="presentation" style="width: 100%; margin-bottom: 0; background: linear-gradient(135deg, #fff5eb 0%, #ffe8d6 100%); border-radius: 12px; border-left: 4px solid #fd6d15;">
                <tr>
                  <td style="width: 60px; padding: 24px 0 24px 24px; vertical-align: top;">
                    <div style="font-size: 40px;">&#127968;</div>
                  </td>
                  <td style="padding: 24px 24px 24px 16px;">
                    <p style="margin: 0 0 8px 0; color: #fd6d15; font-size: 16px; font-weight: 700;">Nekilnojamojo turto vertės didinimas</p>
                    <p style="margin: 0; color: #4a4a6a; font-size: 15px; line-height: 1.6;">
                      Namas su saulės elektrinė yra patrauklesnis pirkėjams. Tyrimai rodo, kad tokių namų vertė padidėja 3-5%. Tai investicija, kuri didina jūsų turto verte.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- How Solar Works -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <table role="presentation" style="width: 100%; background: linear-gradient(135deg, #f8f9fa 0%, #e8eaed 100%); border-radius: 12px; border-left: 4px solid #1a1a2e;">
                <tr>
                  <td style="padding: 24px;">
                    <p style="margin: 0 0 12px 0; color: #1a1a2e; font-size: 16px; font-weight: 700;">Kaip veikia saulės elektrinė?</p>
                    <p style="margin: 0; color: #4a4a6a; font-size: 15px; line-height: 1.8;">
                      1. <strong>Saulės moduliai</strong> ant stogo paverčia saulės šviesą nuolatinę srovę (DC).<br>
                      2. <strong>Inverteris</strong> konvertuoja DC į kintamąją srovę (AC), kuria naudoja jūsų namai.<br>
                      3. <strong>Perteklinė energija</strong> atiduodama į tinklą arba kaupiama baterijoje.<br>
                      4. <strong>Naktimis ir debesuotu dienu metu</strong> energija imama iš tinklo arba kaupiklio.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td style="padding: 0 30px 40px 30px; text-align: center;">
              <p style="margin: 0 0 20px 0; color: #4a4a6a; font-size: 16px;">Turite klausimų? Mielai atsakysime!</p>
              <table role="presentation" style="margin: 0 auto;">
                <tr>
                  <td style="background-color: #fd6d15; border-radius: 8px; box-shadow: 0 4px 16px rgba(253, 109, 21, 0.3);">
                    <a href="tel:+37063082999" style="display: inline-block; padding: 16px 40px; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 700; letter-spacing: 0.3px;">
                      Gauti pasiūlymą
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin: 16px 0 0 0; color: #4a4a6a; font-size: 14px;">Arba atsakykite į šį laišką</p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background: linear-gradient(135deg, #001959 0%, #055d98 100%); padding: 30px; text-align: center;">
              <img src="https://ldaenergia.lt/wp-content/uploads/2025/03/logo-white-2.svg" alt="LDA Energija" style="max-width: 150px; height: auto; margin-bottom: 16px;">
              <p style="margin: 0 0 16px 0; color: #e8e8e8; font-size: 14px; line-height: 1.6;">
                Tel.: +370 630 82999<br>
                Servisas: +370 636 90999<br>
                El. p.: info@ldaenergia.lt
              </p>
              <p style="margin: 0; color: #a8b8d8; font-size: 12px; line-height: 1.5;">
                LDA Energija &middot; Aido g. 6, Giraitė, LT54310, Kauno r.<br>
                <a href="https://ldaenergia.lt" style="color: #a8b8d8;">ldaenergia.lt</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ============================================================
// D3 - Specialus pasiūlymas + APVA (Day 3)
// ============================================================
function generateD3Email(data) {
  const {
    vardas = 'Kliente',
    tipas = 'Saulės elektrinė',
    rekomenduojamaGalia = 0,
    topProduktas = {},
    originalKaina = 0,
    nuolaidosKaina = 0,
    apvaSubsidija = 0,
    dominaAPVA = false
  } = data;

  const apvaSection = dominaAPVA ? `
          <!-- APVA Calculation -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <table role="presentation" style="width: 100%; background: linear-gradient(135deg, #e8f0ff 0%, #dde8ff 100%); border-radius: 12px; border-left: 4px solid #055d98;">
                <tr>
                  <td style="padding: 24px;">
                    <p style="margin: 0 0 12px 0; color: #001959; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">APVA subsidijos skaiciavimas</p>
                    <table role="presentation" style="width: 100%;">
                      <tr>
                        <td style="padding: 6px 0; color: #1a1a2e; font-size: 15px;">Sistemos galia:</td>
                        <td style="padding: 6px 0; color: #1a1a2e; font-size: 15px; font-weight: 600; text-align: right;">${rekomenduojamaGalia} kWp</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color: #1a1a2e; font-size: 15px;">Subsidijos norma:</td>
                        <td style="padding: 6px 0; color: #1a1a2e; font-size: 15px; font-weight: 600; text-align: right;">iki 255 &euro;/kWp</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color: #1a1a2e; font-size: 15px;">Galima subsidija:</td>
                        <td style="padding: 6px 0; color: #055d98; font-size: 16px; font-weight: 700; text-align: right;">${apvaSubsidija} &euro;</td>
                      </tr>
                      <tr>
                        <td colspan="2" style="padding: 12px 0 0 0; border-top: 1px solid #c5d8f0;">
                          <p style="margin: 0; color: #055d98; font-size: 15px; font-weight: 700;">
                            Kaina su nuolaida ir APVA: ${nuolaidosKaina - apvaSubsidija} &euro;
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>` : '';

  return `<!DOCTYPE html>
<html lang="lt">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Specialus pasiūlymas -5%</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', 'Open Sans', Arial, sans-serif; background-color: #f4f4f4;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f4f4f4;">
    <tr>
      <td style="padding: 20px 0;">
        <table role="presentation" style="width: 100%; max-width: 700px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">

          <!-- Header with Urgency -->
          <tr>
            <td style="background: linear-gradient(135deg, #001959 0%, #055d98 100%); padding: 40px 30px; text-align: center; position: relative;">
              <div style="background-color: #fd6d15; color: #ffffff; font-size: 13px; font-weight: 700; padding: 8px 16px; border-radius: 20px; display: inline-block; margin-bottom: 16px;">
                Galioja 48 valandas
              </div>
              <br>
              <img src="https://ldaenergia.lt/wp-content/uploads/2025/03/logo-white-2.svg" alt="LDA Energija" style="max-width: 200px; height: auto; margin-bottom: 12px;">
              <p style="margin: 10px 0 0 0; color: #c5d8f0; font-size: 16px;">Ekskluzyvus pasiūlymas jums</p>
            </td>
          </tr>

          <!-- Trust Bar -->
          <tr>
            <td style="background-color: #e8f0ff; padding: 16px 30px; text-align: center; border-bottom: 3px solid #055d98;">
              <p style="margin: 0; color: #1a1a2e; font-size: 14px; font-weight: 600;">
                3000+ įrengtų sistemų &middot; Sungrow &amp; Huawei partneriai &middot; APVA subsidija
              </p>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding: 40px 30px 20px 30px;">
              <h2 style="margin: 0 0 16px 0; color: #1a1a2e; font-size: 24px; font-weight: 700;">Sveiki, ${vardas}!</h2>
              <p style="margin: 0; color: #4a4a6a; font-size: 16px; line-height: 1.6;">
                Dėkojame už susidomėjimą mūsų pasiūlymu. Norime padaryti sprendimą dar lengvesnį &ndash; <strong>specialiai jums siūlome 5% nuolaidą</strong> jūsų saulės elektrinei.
              </p>
            </td>
          </tr>

          <!-- Big Discount Badge -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <table role="presentation" style="width: 100%; background-color: #fd6d15; border-radius: 16px; box-shadow: 0 8px 24px rgba(253, 109, 21, 0.3);">
                <tr>
                  <td style="padding: 40px 30px; text-align: center;">
                    <div style="font-size: 72px; font-weight: 700; color: #ffffff; line-height: 1; margin-bottom: 12px;">-5%</div>
                    <p style="margin: 0 0 8px 0; color: #fff5eb; font-size: 18px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Speciali nuolaida</p>
                    <p style="margin: 0; color: #ffffff; font-size: 16px; line-height: 1.5;">
                      Jūsų saulės elektrinei &ndash; ${tipas}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- TOP Recommended Product with Price Comparison -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <h3 style="margin: 0 0 20px 0; color: #1a1a2e; font-size: 20px; font-weight: 700;">Rekomenduojama konfiguracija</h3>

              <table role="presentation" style="width: 100%; border-collapse: collapse; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.06);">
                <tr style="background: linear-gradient(135deg, #001959 0%, #055d98 100%);">
                  <th style="padding: 14px 16px; color: #ffffff; font-size: 13px; font-weight: 700; text-align: left;">Parametras</th>
                  <th style="padding: 14px 16px; color: #ffffff; font-size: 13px; font-weight: 700; text-align: right;">Reiksme</th>
                </tr>
                <tr style="background-color: #ffffff;">
                  <td style="padding: 14px 16px; color: #1a1a2e; font-size: 15px; border-bottom: 1px solid #e8e8e8;">Produktas</td>
                  <td style="padding: 14px 16px; color: #1a1a2e; font-size: 15px; font-weight: 600; text-align: right; border-bottom: 1px solid #e8e8e8;">${topProduktas.modulis || topProduktas.gamintojas + ' ' + topProduktas.modelis || ''}</td>
                </tr>
                <tr style="background-color: #f8f9fa;">
                  <td style="padding: 14px 16px; color: #1a1a2e; font-size: 15px; border-bottom: 1px solid #e8e8e8;">Sistemos galia</td>
                  <td style="padding: 14px 16px; color: #1a1a2e; font-size: 15px; font-weight: 600; text-align: right; border-bottom: 1px solid #e8e8e8;">${rekomenduojamaGalia} kWp</td>
                </tr>
                <tr style="background-color: #ffffff;">
                  <td style="padding: 14px 16px; color: #1a1a2e; font-size: 15px; border-bottom: 1px solid #e8e8e8;">Originali kaina</td>
                  <td style="padding: 14px 16px; color: #4a4a6a; font-size: 15px; text-align: right; border-bottom: 1px solid #e8e8e8; text-decoration: line-through;">${originalKaina} &euro;</td>
                </tr>
                <tr style="background: linear-gradient(135deg, #fff5eb 0%, #ffe8d6 100%);">
                  <td style="padding: 14px 16px; color: #fd6d15; font-size: 16px; font-weight: 700;">Kaina su -5% nuolaida</td>
                  <td style="padding: 14px 16px; color: #fd6d15; font-size: 18px; font-weight: 700; text-align: right;">${nuolaidosKaina} &euro;</td>
                </tr>
              </table>
            </td>
          </tr>

          ${apvaSection}

          <!-- CTA Button -->
          <tr>
            <td style="padding: 0 30px 40px 30px; text-align: center;">
              <table role="presentation" style="margin: 0 auto;">
                <tr>
                  <td style="background-color: #fd6d15; border-radius: 8px; box-shadow: 0 4px 16px rgba(253, 109, 21, 0.3);">
                    <a href="tel:+37063082999" style="display: inline-block; padding: 16px 40px; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 700; letter-spacing: 0.3px;">
                      Uzsisakyti su nuolaida
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin: 16px 0 0 0; color: #4a4a6a; font-size: 14px;">Nuolaida galioja 48 valandas nuo sio laisko gavimo</p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background: linear-gradient(135deg, #001959 0%, #055d98 100%); padding: 30px; text-align: center;">
              <img src="https://ldaenergia.lt/wp-content/uploads/2025/03/logo-white-2.svg" alt="LDA Energija" style="max-width: 150px; height: auto; margin-bottom: 16px;">
              <p style="margin: 0 0 16px 0; color: #e8e8e8; font-size: 14px; line-height: 1.6;">
                Tel.: +370 630 82999<br>
                Servisas: +370 636 90999<br>
                El. p.: info@ldaenergia.lt
              </p>
              <p style="margin: 0; color: #a8b8d8; font-size: 12px; line-height: 1.5;">
                LDA Energija &middot; Aido g. 6, Giraitė, LT54310, Kauno r.<br>
                <a href="https://ldaenergia.lt" style="color: #a8b8d8;">ldaenergia.lt</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ============================================================
// D5 - Galutinis priminimas (Day 5)
// ============================================================
function generateD5Email(data) {
  const {
    vardas = 'Kliente'
  } = data;

  return `<!DOCTYPE html>
<html lang="lt">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Priminimas: jūsų saulės elektrinės pasiūlymas</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', 'Open Sans', Arial, sans-serif; background-color: #f4f4f4;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f4f4f4;">
    <tr>
      <td style="padding: 20px 0;">
        <table role="presentation" style="width: 100%; max-width: 700px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #001959 0%, #055d98 100%); padding: 40px 30px; text-align: center;">
              <img src="https://ldaenergia.lt/wp-content/uploads/2025/03/logo-white-2.svg" alt="LDA Energija" style="max-width: 200px; height: auto; margin-bottom: 12px;">
              <p style="margin: 10px 0 0 0; color: #c5d8f0; font-size: 16px;">Saulės energijos sprendimai</p>
            </td>
          </tr>

          <!-- Trust Bar -->
          <tr>
            <td style="background-color: #e8f0ff; padding: 16px 30px; text-align: center; border-bottom: 3px solid #055d98;">
              <p style="margin: 0; color: #1a1a2e; font-size: 14px; font-weight: 600;">
                3000+ įrengtų sistemų &middot; Sungrow &amp; Huawei partneriai &middot; APVA subsidija
              </p>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding: 40px 30px 20px 30px;">
              <h2 style="margin: 0 0 16px 0; color: #1a1a2e; font-size: 24px; font-weight: 700;">Sveiki, ${vardas}!</h2>
              <p style="margin: 0; color: #4a4a6a; font-size: 16px; line-height: 1.6;">
                Norime priminti apie jūsų saulės elektrinės pasiūlymą. Suprantame, kad sprendimui reikia laiko, todėl norime suteikti visą reikiamą informaciją.
              </p>
            </td>
          </tr>

          <!-- Social Proof -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <table role="presentation" style="width: 100%; background: linear-gradient(135deg, #e8f0ff 0%, #dde8ff 100%); border-radius: 16px;">
                <tr>
                  <td style="padding: 30px; text-align: center;">
                    <div style="font-size: 48px; font-weight: 700; color: #001959; line-height: 1; margin-bottom: 8px;">3000+</div>
                    <p style="margin: 0; color: #055d98; font-size: 18px; font-weight: 600;">namų jau naudoja saulės energiją su LDA Energija</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Testimonials -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <table role="presentation" style="width: 100%; background: linear-gradient(135deg, #fff5eb 0%, #ffe8d6 100%); border-radius: 12px; border-left: 4px solid #fd6d15;">
                <tr>
                  <td style="padding: 24px;">
                    <p style="margin: 0 0 8px 0; color: #1a1a2e; font-size: 15px; line-height: 1.7; font-style: italic;">
                      "Per pirmuosius metus elektros sąskaita sumažėjo 78%. Saulės elektrinė buvo viena geriausia investicija, kurią padariau. LDA Energija komanda profesionali ir atsakinga."
                    </p>
                    <p style="margin: 0; color: #fd6d15; font-size: 13px; font-weight: 700;">&mdash; Andrius M., Vilnius</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Discount Reminder -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <table role="presentation" style="width: 100%; background: linear-gradient(135deg, #f8f9fa 0%, #e8eaed 100%); border-radius: 12px; border-left: 4px solid #1a1a2e;">
                <tr>
                  <td style="padding: 24px;">
                    <p style="margin: 0 0 12px 0; color: #1a1a2e; font-size: 16px; font-weight: 700;">Nuolaidos galiojimas</p>
                    <p style="margin: 0; color: #4a4a6a; font-size: 15px; line-height: 1.6;">
                      Primename, kad mūsų specialus <strong>-5% nuolaidos pasiūlymas</strong> vis dar gali buti aktualus. Susisiekite su mumis ir mes uztikrinsime geriausia kaina jūsų saulės elektrinei.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Final Message -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <table role="presentation" style="width: 100%; background: linear-gradient(135deg, #e8f0ff 0%, #dde8ff 100%); border-radius: 12px;">
                <tr>
                  <td style="padding: 24px; text-align: center;">
                    <p style="margin: 0 0 12px 0; color: #1a1a2e; font-size: 16px; line-height: 1.6;">
                      <strong>Tai paskutinis mūsų priminimas.</strong>
                    </p>
                    <p style="margin: 0; color: #4a4a6a; font-size: 15px; line-height: 1.6;">
                      Daugiau netrukdysime. Bet atsiminkite &ndash; <strong>mūsų durys visada atviros</strong>. Galite kreiptis bet kada, kai tik busite pasirenge.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td style="padding: 0 30px 30px 30px; text-align: center;">
              <p style="margin: 0 0 16px 0; color: #1a1a2e; font-size: 16px; font-weight: 600;">Turite klausimų? Rasykite arba skambinkite</p>
              <table role="presentation" style="margin: 0 auto;">
                <tr>
                  <td style="background-color: #fd6d15; border-radius: 8px; box-shadow: 0 4px 16px rgba(253, 109, 21, 0.3);">
                    <a href="tel:+37063082999" style="display: inline-block; padding: 16px 40px; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 700; letter-spacing: 0.3px;">
                      Susisiekti dabar
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin: 16px 0 0 0; color: #4a4a6a; font-size: 14px;">
                Tel.: +370 630 82999 &middot; Servisas: +370 636 90999<br>
                El. p.: info@ldaenergia.lt
              </p>
            </td>
          </tr>

          <!-- Warm Goodbye -->
          <tr>
            <td style="padding: 0 30px 40px 30px; text-align: center;">
              <p style="margin: 0; color: #4a4a6a; font-size: 15px; line-height: 1.6;">
                Linkime sėkmės priimant sprendima!<br>
                <strong>LDA Energija komanda</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background: linear-gradient(135deg, #001959 0%, #055d98 100%); padding: 30px; text-align: center;">
              <img src="https://ldaenergia.lt/wp-content/uploads/2025/03/logo-white-2.svg" alt="LDA Energija" style="max-width: 150px; height: auto; margin-bottom: 16px;">
              <p style="margin: 0 0 16px 0; color: #e8e8e8; font-size: 14px; line-height: 1.6;">
                Tel.: +370 630 82999<br>
                Servisas: +370 636 90999<br>
                El. p.: info@ldaenergia.lt
              </p>
              <p style="margin: 0; color: #a8b8d8; font-size: 12px; line-height: 1.5;">
                LDA Energija &middot; Aido g. 6, Giraitė, LT54310, Kauno r.<br>
                <a href="https://ldaenergia.lt" style="color: #a8b8d8;">ldaenergia.lt</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// Export all templates as functions
module.exports = {
  generateD0Email,
  generateD1Email,
  generateD3Email,
  generateD5Email
};
