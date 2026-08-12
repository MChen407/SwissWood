<script setup lang="ts">
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
</script>

<template>
  <DefaultLayout>
    <!-- Hero -->
    <section class="py-14 text-white" style="background:#4A2C1A;">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 class="font-display text-4xl font-semibold">Mentions légales</h1>
        <p class="mt-3" style="color:#E8D4A8;">Informations légales relatives au site de SwissWood.</p>
      </div>
    </section>

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-8">
      <div class="bg-white rounded-xl border p-8" style="border-color:#E2DCD1; box-shadow:0 2px 12px rgba(43,36,32,0.06);">
        <h2 class="font-display text-xl font-semibold mb-4" style="color:#4A2C1A;">1. Éditeur du site</h2>
        <p class="mb-4 leading-relaxed" style="color:#7A7167; font-size:15px;">Le présent site internet est édité par :</p>
        <p class="mb-2 font-semibold" style="color:#4A2C1A;">SwissWood Sàrl</p>
        <p class="leading-relaxed mb-2" style="color:#7A7167; font-size:15px;">
          Société à responsabilité limitée de droit suisse<br />
          Rue du Bois 18<br />
          1003 Lausanne<br />
          Canton de Vaud<br />
          Suisse
        </p>
        <ul class="space-y-1.5 mb-4 text-sm" style="color:#7A7167;">
          <li>IDE / CHE : <span class="font-medium" style="color:#4A2C1A;">CHE-123.456.789</span></li>
          <li>TVA : <span class="font-medium" style="color:#4A2C1A;">CHE-123.456.789 TVA</span></li>
          <li>E-mail : <a href="mailto:contact@swisswood.example" class="font-medium" style="color:#6B4226;">contact@swisswood.example</a></li>
          <li>Téléphone : <span class="font-medium" style="color:#4A2C1A;">+41 21 555 14 80</span> <em class="text-xs" style="color:#C89B5D;">(numéro fictif)</em></li>
          <li>Site internet : <a href="http://www.swisswood.example" class="font-medium" style="color:#6B4226;">www.swisswood.example</a> <em class="text-xs" style="color:#C89B5D;">(adresse fictive)</em></li>
        </ul>
        <p class="leading-relaxed" style="color:#7A7167; font-size:15px;">
          Directeur / représentant : <span class="font-medium" style="color:#4A2C1A;">Jean Dupont</span> <em class="text-xs" style="color:#C89B5D;">(nom fictif)</em>
        </p>
      </div>

      <div class="bg-white rounded-xl border p-8" style="border-color:#E2DCD1; box-shadow:0 2px 12px rgba(43,36,32,0.06);">
        <h2 class="font-display text-xl font-semibold mb-4" style="color:#4A2C1A;">2. Activité</h2>
        <p class="leading-relaxed mb-4" style="color:#7A7167; font-size:15px;">
          SwissWood est une société spécialisée dans la commercialisation de bois et de produits dérivés du bois.
        </p>
        <p class="leading-relaxed mb-4" style="color:#7A7167; font-size:15px;">
          La société propose notamment des produits destinés aux particuliers et aux professionnels, sous réserve de la disponibilité des produits et des restrictions applicables à certains pays.
        </p>
        <p class="leading-relaxed mb-4" style="color:#7A7167; font-size:15px;">
          SwissWood peut organiser la livraison de ses produits en Suisse ainsi que dans différents pays européens et africains.
        </p>
        <p class="leading-relaxed" style="color:#7A7167; font-size:15px;">
          Les possibilités de livraison peuvent varier en fonction du produit commandé, du pays de destination, des réglementations douanières et des restrictions applicables aux produits en bois.
        </p>
      </div>

      <div class="bg-white rounded-xl border p-8" style="border-color:#E2DCD1; box-shadow:0 2px 12px rgba(43,36,32,0.06);">
        <h2 class="font-display text-xl font-semibold mb-4" style="color:#4A2C1A;">3. Propriété intellectuelle</h2>
        <p class="leading-relaxed mb-4" style="color:#7A7167; font-size:15px;">
          L'ensemble des éléments présents sur le site, notamment les textes, photographies, logos, marques, illustrations, graphismes, vidéos, icônes, éléments visuels, documents et logiciels, est protégé par les dispositions applicables en matière de propriété intellectuelle.
        </p>
        <p class="leading-relaxed mb-4" style="color:#7A7167; font-size:15px;">
          Sauf autorisation écrite préalable de SwissWood, toute reproduction, représentation, modification, distribution, publication ou exploitation, totale ou partielle, du contenu du site est interdite.
        </p>
        <p class="leading-relaxed" style="color:#7A7167; font-size:15px;">
          La marque, le nom « SwissWood », les logos et les éléments graphiques associés sont la propriété de SwissWood ou sont utilisés avec l'autorisation de leurs titulaires.
        </p>
      </div>

      <div class="bg-white rounded-xl border p-8" style="border-color:#E2DCD1; box-shadow:0 2px 12px rgba(43,36,32,0.06);">
        <h2 class="font-display text-xl font-semibold mb-4" style="color:#4A2C1A;">4. Responsabilité</h2>
        <p class="leading-relaxed mb-4" style="color:#7A7167; font-size:15px;">
          SwissWood s'efforce de fournir sur son site des informations exactes, à jour et accessibles.
        </p>
        <p class="leading-relaxed mb-4" style="color:#7A7167; font-size:15px;">
          Toutefois, SwissWood ne peut garantir l'absence totale d'erreurs, d'omissions ou d'interruptions temporaires du site.
        </p>
        <p class="leading-relaxed mb-4" style="color:#7A7167; font-size:15px;">
          Les photographies des produits sont présentées à titre illustratif. De légères différences de teinte, de texture, de veinage, de dimensions ou d'aspect peuvent exister entre les photographies et les produits effectivement livrés, notamment en raison des caractéristiques naturelles du bois.
        </p>
        <p class="leading-relaxed" style="color:#7A7167; font-size:15px;">
          SwissWood ne saurait être tenue responsable des dommages résultant d'une utilisation non conforme des produits, du non-respect des recommandations d'utilisation ou de facteurs échappant raisonnablement à son contrôle.
        </p>
      </div>

      <div class="bg-white rounded-xl border p-8" style="border-color:#E2DCD1; box-shadow:0 2px 12px rgba(43,36,32,0.06);">
        <h2 class="font-display text-xl font-semibold mb-4" style="color:#4A2C1A;">5. Liens externes</h2>
        <p class="leading-relaxed mb-4" style="color:#7A7167; font-size:15px;">
          Le site peut contenir des liens vers des sites internet exploités par des tiers.
        </p>
        <p class="leading-relaxed" style="color:#7A7167; font-size:15px;">
          SwissWood n'exerce aucun contrôle sur ces sites et ne peut être tenue responsable de leur contenu, de leur disponibilité ou de leurs pratiques en matière de protection des données.
        </p>
      </div>

      <div class="bg-white rounded-xl border p-8" style="border-color:#E2DCD1; box-shadow:0 2px 12px rgba(43,36,32,0.06);">
        <h2 class="font-display text-xl font-semibold mb-4" style="color:#4A2C1A;">6. Droit applicable</h2>
        <p class="leading-relaxed" style="color:#7A7167; font-size:15px;">
          Les présentes mentions légales sont soumises au droit suisse, sous réserve des dispositions impératives éventuellement applicables au consommateur situé dans son pays de résidence.
        </p>
      </div>

      <div class="bg-white rounded-xl border p-8" style="border-color:#E2DCD1; box-shadow:0 2px 12px rgba(43,36,32,0.06);">
        <h2 class="font-display text-xl font-semibold mb-4" style="color:#4A2C1A;">7. Contact</h2>
        <p class="leading-relaxed mb-4" style="color:#7A7167; font-size:15px;">Pour toute question concernant le site ou les activités de SwissWood :</p>
        <p class="mb-2 font-semibold" style="color:#4A2C1A;">SwissWood Sàrl</p>
        <p class="leading-relaxed mb-2" style="color:#7A7167; font-size:15px;">
          Rue du Bois 18<br />
          1003 Lausanne<br />
          Suisse
        </p>
        <p class="text-sm" style="color:#7A7167;">
          E-mail : <a href="mailto:contact@swisswood.example" class="font-medium" style="color:#6B4226;">contact@swisswood.example</a><br />
          Téléphone : <span class="font-medium" style="color:#4A2C1A;">+41 21 555 14 80</span>
        </p>
      </div>
    </div>
  </DefaultLayout>
</template>
