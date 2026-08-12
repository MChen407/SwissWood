<script setup lang="ts">
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
</script>

<template>
  <DefaultLayout>
    <!-- Hero -->
    <section class="py-14 text-white" style="background:#4A2C1A;">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 class="font-display text-4xl font-semibold">Politique de confidentialité</h1>
        <p class="mt-3" style="color:#E8D4A8;">Dernière mise à jour : 11 août 2026</p>
      </div>
    </section>

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-8">
      <div class="bg-white rounded-xl border p-8" style="border-color:#E2DCD1; box-shadow:0 2px 12px rgba(43,36,32,0.06);">
        <p class="leading-relaxed mb-4" style="color:#7A7167; font-size:15px;">
          SwissWood Sàrl (« SwissWood », « nous », « notre » ou « nos ») accorde une grande importance à la protection des données personnelles de ses clients, visiteurs et utilisateurs.
        </p>
        <p class="leading-relaxed mb-4" style="color:#7A7167; font-size:15px;">
          La présente politique explique quelles données personnelles nous pouvons collecter, pourquoi nous les utilisons, avec qui elles peuvent être partagées et quels sont les droits des personnes concernées.
        </p>
        <p class="leading-relaxed" style="color:#7A7167; font-size:15px;">
          Elle s'applique au site internet de SwissWood, aux commandes effectuées en ligne, aux demandes de renseignements, aux communications avec nos clients et aux services associés à nos activités commerciales.
        </p>
      </div>

      <div class="bg-white rounded-xl border p-8" style="border-color:#E2DCD1; box-shadow:0 2px 12px rgba(43,36,32,0.06);">
        <h2 class="font-display text-xl font-semibold mb-4" style="color:#4A2C1A;">1. Responsable du traitement</h2>
        <p class="leading-relaxed mb-4" style="color:#7A7167; font-size:15px;">Le responsable du traitement des données est :</p>
        <p class="mb-2 font-semibold" style="color:#4A2C1A;">SwissWood Sàrl</p>
        <p class="leading-relaxed mb-2" style="color:#7A7167; font-size:15px;">
          Rue du Bois 18<br />
          1003 Lausanne<br />
          Canton de Vaud<br />
          Suisse
        </p>
        <p class="text-sm mb-2" style="color:#7A7167;">
          E-mail : <a href="mailto:privacy@swisswood.example" class="font-medium" style="color:#6B4226;">privacy@swisswood.example</a><br />
          Téléphone : <span class="font-medium" style="color:#4A2C1A;">+41 21 555 14 80</span>
        </p>
        <p class="text-xs" style="color:#C89B5D;">Les coordonnées ci-dessus sont fictives dans le présent modèle.</p>
      </div>

      <div class="bg-white rounded-xl border p-8" style="border-color:#E2DCD1; box-shadow:0 2px 12px rgba(43,36,32,0.06);">
        <h2 class="font-display text-xl font-semibold mb-4" style="color:#4A2C1A;">2. Données personnelles collectées</h2>
        <p class="leading-relaxed mb-5" style="color:#7A7167; font-size:15px;">
          Selon votre utilisation de notre site et de nos services, nous pouvons collecter notamment :
        </p>

        <h3 class="font-semibold mb-2" style="color:#4A2C1A;">Données d'identification</h3>
        <ul class="list-disc pl-5 space-y-1.5 mb-5 text-sm" style="color:#7A7167;">
          <li>nom et prénom ;</li>
          <li>raison sociale ;</li>
          <li>adresse postale ;</li>
          <li>pays de résidence ou de livraison ;</li>
          <li>adresse e-mail ;</li>
          <li>numéro de téléphone.</li>
        </ul>

        <h3 class="font-semibold mb-2" style="color:#4A2C1A;">Données relatives aux commandes</h3>
        <ul class="list-disc pl-5 space-y-1.5 mb-5 text-sm" style="color:#7A7167;">
          <li>produits commandés ;</li>
          <li>quantités ;</li>
          <li>prix ;</li>
          <li>adresse de facturation ;</li>
          <li>adresse de livraison ;</li>
          <li>historique des commandes ;</li>
          <li>informations nécessaires au suivi de livraison ;</li>
          <li>échanges avec notre service clientèle.</li>
        </ul>

        <h3 class="font-semibold mb-2" style="color:#4A2C1A;">Données relatives au paiement</h3>
        <p class="leading-relaxed mb-3" style="color:#7A7167; font-size:15px;">
          Les paiements peuvent être traités par des prestataires de paiement externes.
        </p>
        <p class="leading-relaxed mb-3" style="color:#7A7167; font-size:15px;">
          SwissWood ne conserve pas nécessairement les données complètes de carte bancaire lorsque celles-ci sont directement traitées par un prestataire de paiement sécurisé.
        </p>
        <p class="leading-relaxed" style="color:#7A7167; font-size:15px;">
          Nous pouvons toutefois recevoir certaines informations nécessaires à la confirmation et au suivi du paiement, telles que le statut de la transaction, la référence de paiement ou les quatre derniers chiffres d'un moyen de paiement lorsque le prestataire les communique.
        </p>

        <h3 class="font-semibold mb-2 mt-5" style="color:#4A2C1A;">Données techniques</h3>
        <p class="leading-relaxed mb-3" style="color:#7A7167; font-size:15px;">
          Lors de votre navigation, certaines informations techniques peuvent être collectées automatiquement, notamment :
        </p>
        <ul class="list-disc pl-5 space-y-1.5 text-sm" style="color:#7A7167;">
          <li>adresse IP ;</li>
          <li>type d'appareil ;</li>
          <li>navigateur utilisé ;</li>
          <li>système d'exploitation ;</li>
          <li>pages consultées ;</li>
          <li>date et heure de connexion ;</li>
          <li>données relatives à la navigation ;</li>
          <li>données nécessaires à la sécurité du site.</li>
        </ul>
      </div>

      <div class="bg-white rounded-xl border p-8" style="border-color:#E2DCD1; box-shadow:0 2px 12px rgba(43,36,32,0.06);">
        <h2 class="font-display text-xl font-semibold mb-4" style="color:#4A2C1A;">3. Finalités du traitement</h2>
        <p class="leading-relaxed mb-4" style="color:#7A7167; font-size:15px;">Nous pouvons utiliser les données personnelles pour :</p>
        <ul class="list-disc pl-5 space-y-1.5 text-sm" style="color:#7A7167;">
          <li>traiter et exécuter les commandes ;</li>
          <li>préparer et expédier les produits ;</li>
          <li>organiser la livraison ;</li>
          <li>communiquer avec les clients ;</li>
          <li>établir les factures ;</li>
          <li>gérer les paiements ;</li>
          <li>assurer le service après-vente ;</li>
          <li>répondre aux demandes de renseignements ;</li>
          <li>prévenir les fraudes et les abus ;</li>
          <li>assurer la sécurité du site ;</li>
          <li>améliorer nos produits et services ;</li>
          <li>analyser l'utilisation du site ;</li>
          <li>respecter nos obligations légales ;</li>
          <li>gérer les éventuels litiges ;</li>
          <li>envoyer des communications commerciales lorsque les conditions légales applicables sont remplies.</li>
        </ul>
      </div>

      <div class="bg-white rounded-xl border p-8" style="border-color:#E2DCD1; box-shadow:0 2px 12px rgba(43,36,32,0.06);">
        <h2 class="font-display text-xl font-semibold mb-4" style="color:#4A2C1A;">4. Commandes et livraison internationale</h2>
        <p class="leading-relaxed mb-4" style="color:#7A7167; font-size:15px;">
          SwissWood peut transmettre certaines données personnelles à des prestataires nécessaires à l'exécution de la commande.
        </p>
        <p class="leading-relaxed mb-4" style="color:#7A7167; font-size:15px;">Il peut notamment s'agir :</p>
        <ul class="list-disc pl-5 space-y-1.5 mb-5 text-sm" style="color:#7A7167;">
          <li>de transporteurs ;</li>
          <li>de sociétés de livraison ;</li>
          <li>de prestataires logistiques ;</li>
          <li>de prestataires de paiement ;</li>
          <li>de prestataires informatiques ;</li>
          <li>de prestataires d'hébergement ;</li>
          <li>de prestataires chargés du service clientèle ;</li>
          <li>de représentants ou intermédiaires douaniers lorsque cela est nécessaire.</li>
        </ul>
        <p class="leading-relaxed" style="color:#7A7167; font-size:15px;">
          Lorsque la livraison est effectuée dans un pays étranger, certaines données peuvent être communiquées aux transporteurs, autorités douanières ou autres organismes légalement compétents afin de permettre l'importation et la livraison du colis.
        </p>
      </div>

      <div class="bg-white rounded-xl border p-8" style="border-color:#E2DCD1; box-shadow:0 2px 12px rgba(43,36,32,0.06);">
        <h2 class="font-display text-xl font-semibold mb-4" style="color:#4A2C1A;">5. Transmission à des tiers</h2>
        <p class="leading-relaxed mb-4" style="color:#7A7167; font-size:15px;">
          SwissWood ne vend pas les données personnelles de ses clients.
        </p>
        <p class="leading-relaxed mb-4" style="color:#7A7167; font-size:15px;">
          Certaines données peuvent néanmoins être communiquées à des tiers lorsque cela est nécessaire :
        </p>
        <ul class="list-disc pl-5 space-y-1.5 mb-5 text-sm" style="color:#7A7167;">
          <li>à l'exécution d'une commande ;</li>
          <li>à la livraison ;</li>
          <li>au traitement d'un paiement ;</li>
          <li>à l'hébergement et à la sécurité informatique ;</li>
          <li>au respect d'une obligation légale ;</li>
          <li>à la prévention des fraudes ;</li>
          <li>à la défense des intérêts légitimes de SwissWood.</li>
        </ul>
        <p class="leading-relaxed" style="color:#7A7167; font-size:15px;">
          Les prestataires concernés ne peuvent utiliser les données que dans le cadre des services qui leur sont confiés et conformément aux exigences légales applicables.
        </p>
      </div>

      <div class="bg-white rounded-xl border p-8" style="border-color:#E2DCD1; box-shadow:0 2px 12px rgba(43,36,32,0.06);">
        <h2 class="font-display text-xl font-semibold mb-4" style="color:#4A2C1A;">6. Transferts internationaux</h2>
        <p class="leading-relaxed mb-4" style="color:#7A7167; font-size:15px;">
          En raison de son activité internationale, SwissWood peut être amenée à traiter ou à faire traiter certaines données personnelles dans des pays situés hors de Suisse.
        </p>
        <p class="leading-relaxed" style="color:#7A7167; font-size:15px;">
          Lorsque cela est nécessaire, SwissWood prend les mesures appropriées prévues par la législation applicable en matière de protection des données.
        </p>
      </div>

      <div class="bg-white rounded-xl border p-8" style="border-color:#E2DCD1; box-shadow:0 2px 12px rgba(43,36,32,0.06);">
        <h2 class="font-display text-xl font-semibold mb-4" style="color:#4A2C1A;">7. Cookies</h2>
        <p class="leading-relaxed mb-4" style="color:#7A7167; font-size:15px;">
          Le site peut utiliser des cookies et technologies similaires afin de :
        </p>
        <ul class="list-disc pl-5 space-y-1.5 mb-5 text-sm" style="color:#7A7167;">
          <li>assurer le fonctionnement du site ;</li>
          <li>mémoriser certaines préférences ;</li>
          <li>mesurer l'audience ;</li>
          <li>améliorer l'expérience utilisateur ;</li>
          <li>sécuriser les services ;</li>
          <li>éventuellement proposer des contenus ou communications personnalisés.</li>
        </ul>
        <p class="leading-relaxed mb-3" style="color:#7A7167; font-size:15px;">
          Lorsque la législation applicable l'exige, certains cookies ne seront utilisés qu'après obtention du consentement de l'utilisateur.
        </p>
        <p class="leading-relaxed" style="color:#7A7167; font-size:15px;">
          L'utilisateur peut également configurer son navigateur afin de limiter ou de bloquer certains cookies.
        </p>
      </div>

      <div class="bg-white rounded-xl border p-8" style="border-color:#E2DCD1; box-shadow:0 2px 12px rgba(43,36,32,0.06);">
        <h2 class="font-display text-xl font-semibold mb-4" style="color:#4A2C1A;">8. Communications commerciales</h2>
        <p class="leading-relaxed mb-3" style="color:#7A7167; font-size:15px;">
          SwissWood peut envoyer des communications commerciales lorsque la législation applicable le permet.
        </p>
        <p class="leading-relaxed mb-3" style="color:#7A7167; font-size:15px;">
          L'utilisateur peut à tout moment demander l'arrêt de ces communications ou utiliser le lien de désinscription prévu dans les e-mails concernés.
        </p>
        <p class="leading-relaxed" style="color:#7A7167; font-size:15px;">
          La désinscription des communications commerciales n'empêche pas l'envoi de communications strictement nécessaires à l'exécution d'une commande, à la sécurité du compte ou à une obligation contractuelle.
        </p>
      </div>

      <div class="bg-white rounded-xl border p-8" style="border-color:#E2DCD1; box-shadow:0 2px 12px rgba(43,36,32,0.06);">
        <h2 class="font-display text-xl font-semibold mb-4" style="color:#4A2C1A;">9. Durée de conservation</h2>
        <p class="leading-relaxed mb-4" style="color:#7A7167; font-size:15px;">
          SwissWood conserve les données personnelles pendant la durée nécessaire aux finalités pour lesquelles elles ont été collectées.
        </p>
        <p class="leading-relaxed mb-4" style="color:#7A7167; font-size:15px;">
          Certaines données peuvent être conservées plus longtemps lorsque cela est nécessaire pour :
        </p>
        <ul class="list-disc pl-5 space-y-1.5 mb-5 text-sm" style="color:#7A7167;">
          <li>respecter une obligation légale ou comptable ;</li>
          <li>établir ou défendre un droit ;</li>
          <li>gérer un litige ;</li>
          <li>assurer la sécurité ;</li>
          <li>respecter les obligations fiscales et commerciales applicables.</li>
        </ul>
        <p class="leading-relaxed" style="color:#7A7167; font-size:15px;">
          Une fois les données devenues inutiles et lorsqu'aucune obligation légale ne justifie leur conservation, elles sont supprimées ou anonymisées dans la mesure du possible.
        </p>
      </div>

      <div class="bg-white rounded-xl border p-8" style="border-color:#E2DCD1; box-shadow:0 2px 12px rgba(43,36,32,0.06);">
        <h2 class="font-display text-xl font-semibold mb-4" style="color:#4A2C1A;">10. Sécurité</h2>
        <p class="leading-relaxed mb-4" style="color:#7A7167; font-size:15px;">
          SwissWood met en œuvre des mesures techniques et organisationnelles raisonnables afin de protéger les données personnelles contre :
        </p>
        <ul class="list-disc pl-5 space-y-1.5 mb-5 text-sm" style="color:#7A7167;">
          <li>l'accès non autorisé ;</li>
          <li>la perte ;</li>
          <li>la destruction ;</li>
          <li>la modification ;</li>
          <li>la divulgation non autorisée ;</li>
          <li>les autres formes de traitement illicite.</li>
        </ul>
        <p class="leading-relaxed" style="color:#7A7167; font-size:15px;">
          Aucun système informatique ne pouvant garantir une sécurité absolue, SwissWood ne peut toutefois garantir une sécurité totale des informations transmises sur Internet.
        </p>
      </div>

      <div class="bg-white rounded-xl border p-8" style="border-color:#E2DCD1; box-shadow:0 2px 12px rgba(43,36,32,0.06);">
        <h2 class="font-display text-xl font-semibold mb-4" style="color:#4A2C1A;">11. Droits des personnes concernées</h2>
        <p class="leading-relaxed mb-4" style="color:#7A7167; font-size:15px;">
          Sous réserve des conditions et limites prévues par la législation applicable, les personnes concernées peuvent notamment disposer de droits concernant :
        </p>
        <ul class="list-disc pl-5 space-y-1.5 mb-5 text-sm" style="color:#7A7167;">
          <li>l'accès à leurs données personnelles ;</li>
          <li>la rectification de données inexactes ;</li>
          <li>la suppression de certaines données ;</li>
          <li>la limitation de certains traitements ;</li>
          <li>l'opposition à certains traitements ;</li>
          <li>la révocation d'un consentement lorsque le traitement repose sur celui-ci ;</li>
          <li>la portabilité de certaines données lorsque les conditions légales sont remplies.</li>
        </ul>
        <p class="leading-relaxed mb-4" style="color:#7A7167; font-size:15px;">Toute demande peut être adressée à :</p>
        <p class="mb-4"><a href="mailto:privacy@swisswood.example" class="font-medium" style="color:#6B4226;">privacy@swisswood.example</a></p>
        <p class="leading-relaxed" style="color:#7A7167; font-size:15px;">
          SwissWood peut demander des informations raisonnables permettant de vérifier l'identité du demandeur lorsque cela est nécessaire pour protéger les données
        </p>
      </div>
    </div>
  </DefaultLayout>
</template>
