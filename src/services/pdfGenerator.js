const puppeteer = require('puppeteer');

/**
 * Service de génération de PDF pour le questionnaire de dénombrement
 */
class PDFGeneratorService {
  /**
   * Génère le HTML du questionnaire de dénombrement
   * @param {Object} menage - Données du ménage
   * @returns {string} HTML du questionnaire
   */
  generateQuestionnaireHTML(menage) {
    const {
      Cod_menage,
      PaysId,
      DistrictId,
      RegionId,
      DepartementId,
      SousprefId,
      SecteurAdministratifId,
      ZonedenombreId,
      VillageId,
      LocaliteId,
      HasanacProducteur,
      NomChefMenage,
      PrenomChefMenage,
      ContactChefMenage,
      NombreExploitants,
      ExploitantIsPresent,
      RepresentantIsPresent,
      NomRepresentant,
      PrenomRepresentant,
      ContactRepresentant,
      MilieuResidence,
      CoordonneesGPS,
      EnqueteurId,
      createdAt
    } = menage;

    // Extraire les noms des entités géographiques
    const pays = PaysId?.Lib_pays || 'N/A';
    const district = DistrictId?.Lib_district || 'N/A';
    const region = RegionId?.Lib_region || 'N/A';
    const departement = DepartementId?.Lib_Departement || 'N/A';
    const souspref = SousprefId?.Lib_Souspref || 'N/A';
    const secteur = SecteurAdministratifId?.Lib_secteur || 'N/A';
    const zonedenombre = ZonedenombreId?.Cod_ZD || 'N/A';
    const village = VillageId?.Lib_village || 'N/A';
    const localite = LocaliteId?.Lib_localite || 'N/A';
    const enqueteur = EnqueteurId ? `${EnqueteurId.Nom_ut || ''} ${EnqueteurId.Pren_ut || ''}` : 'N/A';
    const contactenqueteur = EnqueteurId ? `${EnqueteurId.Tel || ''}` : 'N/A';
console.log('PDFGeneratorService: Enquêteur:', EnqueteurId);
    // Déterminer le milieu de résidence
    let milieuLabel = 'Non défini';
    if (MilieuResidence === 1) milieuLabel = 'Urbain';
    else if (MilieuResidence === 2) milieuLabel = 'Semi-urbain';
    else if (MilieuResidence === 3) milieuLabel = 'Rural';

    // Coordonnées GPS
    const gpsCoords = CoordonneesGPS?.coordinates 
      ? `Longitude: ${CoordonneesGPS.coordinates[0]}, Latitude: ${CoordonneesGPS.coordinates[1]}`
      : 'Non renseignées';

    const dateCreation = createdAt ? new Date(createdAt).toLocaleDateString('fr-FR') : new Date().toLocaleDateString('fr-FR');

    return `
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Questionnaire Dénombrement</title>
</head>
<body>

<!-- PAGE 1 -->
<h1 style="text-align:center;">FORMULAIRE DE DÉNOMBREMENT DES PRODUCTEURS D’ANACARDE</h1>

<p style="font-size:14px;"><b>CONFIDENTIALITÉ :</b> Les renseignements recueillis dans ce questionnaire seront traités de manière strictement confidentielle conformément à la loi n°2013-450 du 19 juin 2013 relative à la statistique.</p>

<br>

<h2>SECTION 1 : INFORMATIONS PRÉLIMINAIRES DE L'ENQUÊTE</h2>

<table width="100%" border="1" cellspacing="0" cellpadding="6">
<tr>
<td width="50%"><b>Q1. Date de l'enquête :</b> ${dateCreation}</td>
<td width="50%"><b>Q2. Numéro du questionnaire :</b> ............................</td>
</tr>
<tr>
<td colspan="2"><b>Q3. Nom & Prénom(s) de l'Enquêteur :</b> ${enqueteur}</td>
</tr>
<tr>
<td colspan="2"><b>Q4. Coordonnées GPS du ménage :</b> ${gpsCoords}</td>
</tr>
<tr>
<td colspan="2"><b>Q5. Contact de l'enquêteur :</b> ${contactenqueteur}</td>
</tr>
</table>

<br><br>

<h2>SECTION 2 : SITUATION GÉOGRAPHIQUE</h2>

<table width="100%" border="1" cellspacing="0" cellpadding="6">
<tr>
<td><b>Q6. District :</b> ${district}</td>
<td><b>Q7. Région :</b> ${region}</td>
</tr>
<tr>
<td><b>Q8. Département :</b> ${departement}</td>
<td><b>Q9. Sous-préfecture :</b> ${souspref}</td>
</tr>
<tr>
<td><b>Q10. Secteur administratif :</b> ${secteur}</td>
<td><b>Q11. Numéro ZD :</b> ${zonedenombre}</td>
</tr>
<tr>
<td colspan="2"><b>Q12. Localité :</b> ${village}</td>
</tr>
<tr>
<td colspan="2"><b>Q13. Quartier / Campement :</b> ${localite}</td>
</tr>
<tr>
<td colspan="2">
<b>Q14. Milieu de résidence :</b><br>
${milieuLabel}
</td>
</tr>
<tr>
<td colspan="2"><b>Q15. Numéro ménage :</b> ${Cod_menage}</td>
</tr>
</table>

<br><br>

<h2>SECTION 3 : RENSEIGNEMENTS SUR LE MÉNAGE</h2>

<table width="100%" border="1" cellspacing="0" cellpadding="6">
<tr>
<td >
<b>Q16. Y a-t-il des exploitants d’anacarde dans le ménage ?</b><br>
</td>
<td >
${HasanacProducteur ? 'Oui' : 'Non'}
</td>
</tr>

<tr>
<td><b>Q17. Nom du Chef de ménage :</b></td>
<td>${NomChefMenage}</td>
</tr>

<tr>
<td><b>Q18. Prénom du Chef de ménage :</b></td>
<td>${PrenomChefMenage}</td>
</tr>

<tr>
<td><b>Q19. Contact du Chef de ménage :</b></td>
<td>${ContactChefMenage}</td>
</tr>

<tr>
<td><b>Q20. Nombre d’exploitants d’anacarde :</b></td>
<td>${NombreExploitants}</td>
</tr>

<tr>
<td >
<b>Q21. Le(s) exploitant(s) d’anacarde est/sont présent(s) ?</b>

</td>
<td >
${ExploitantIsPresent? 'Oui' : 'Non'}
</td>
</tr>

<tr>
<td >
<b>Q22. Y a-t-il un représentant de l’exploitant ?</b><br>

</td>
<td >
${RepresentantIsPresent? 'Oui' : 'Non'}
</td>
</tr>

<tr>
<td><b>Q23. Nom du représentant :</b></td>
<td>${NomRepresentant}</td>
</tr>

<tr>
<td><b>Q24. Prénom du représentant :</b></td>
<td>${PrenomRepresentant}</td>
</tr>

<tr>
<td><b>Q25. Contact du représentant :</b></td>
<td>${ContactRepresentant}</td>
</tr>

</table>

<br><br><br>

</body>
</html>
    `;
  }

  /**
   * Génère un PDF à partir des données du ménage
   * @param {Object} menage - Données du ménage avec populations
   * @returns {Promise<Buffer>} Buffer du PDF généré
   */
  async generatePDF(menage) {
    let browser = null;
    let page = null;
    
    try {
      console.log('PDFGenerator: Début génération pour ménage', menage.Cod_menage);
      
      // Générer le HTML
      const html = this.generateQuestionnaireHTML(menage);
      console.log('PDFGenerator: HTML généré, longueur:', html.length);

      // Lancer Puppeteer avec options optimisées
      console.log('PDFGenerator: Lancement de Puppeteer...');
      browser = await puppeteer.launch({
        headless: 'new',
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu'
        ]
      });

      page = await browser.newPage();
      console.log('PDFGenerator: Page créée');
      
      // Charger le HTML avec timeout augmenté
      await page.setContent(html, {
        waitUntil: 'networkidle0',
        timeout: 30000
      });
      console.log('PDFGenerator: HTML chargé dans la page');

      // Générer le PDF
      console.log('PDFGenerator: Génération du PDF...');
      const pdfData = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20px',
          right: '20px',
          bottom: '20px',
          left: '20px'
        },
        preferCSSPageSize: false
      });

      // Convertir explicitement en Buffer (Puppeteer peut retourner un Uint8Array)
      const pdfBuffer = Buffer.isBuffer(pdfData) ? pdfData : Buffer.from(pdfData);
      
      console.log('PDFGenerator: PDF généré avec succès, taille:', pdfBuffer.length);
      console.log('PDFGenerator: Type:', Buffer.isBuffer(pdfBuffer) ? 'Buffer' : typeof pdfBuffer);
      
      // Vérifier que c'est bien un Buffer valide
      if (!Buffer.isBuffer(pdfBuffer)) {
        throw new Error('Le résultat de page.pdf() n\'est pas un Buffer');
      }
      
      if (pdfBuffer.length === 0) {
        throw new Error('Le PDF généré est vide');
      }

      return pdfBuffer;
    } catch (error) {
      console.error('PDFGenerator: Erreur lors de la génération du PDF:', error);
      console.error('PDFGenerator: Stack:', error.stack);
      throw error;
    } finally {
      // Fermer proprement le navigateur
      try {
        if (page) {
          await page.close();
          console.log('PDFGenerator: Page fermée');
        }
        if (browser) {
          await browser.close();
          console.log('PDFGenerator: Navigateur fermé');
        }
      } catch (closeError) {
        console.error('PDFGenerator: Erreur lors de la fermeture:', closeError);
      }
    }
  }
}

module.exports = new PDFGeneratorService();
