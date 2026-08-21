import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { ESSENCE_DATA } from '../src/constants/essences.js'
import type { ProductEssence } from '../src/constants/index.js'

const prisma = new PrismaClient()

const WOOD_IMAGES = [
  'https://images.pexels.com/photos/129733/pexels-photo-129733.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/172284/pexels-photo-172284.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/167699/pexels-photo-167699.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/915984/pexels-photo-915984.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
]

interface SeedTranslations {
  en: { name: string; description: string }
  es: { name: string; description: string }
  de: { name: string; description: string }
}

interface SeedProduct {
  essence: ProductEssence
  description: string
  translations: SeedTranslations
  priceEur: number
  priceUsd: number
  priceFcfa: number
  stock: number
  characteristics: Record<string, string>
}

// Noms des essences par langue (pour générer les noms produits).
const ESSENCE_LABELS: Record<ProductEssence, { en: string; es: string; de: string }> = {
  Chene: { en: 'Oak', es: 'Roble', de: 'Eiche' },
  Charme: { en: 'Hornbeam', es: 'Carpe', de: 'Hainbuche' },
  Hetre: { en: 'Beech', es: 'Haya', de: 'Buche' },
  Frene: { en: 'Ash', es: 'Fresno', de: 'Esche' },
  Orme: { en: 'Elm', es: 'Olmo', de: 'Ulme' },
  Erable: { en: 'Maple', es: 'Arce', de: 'Ahorn' },
  Noyer: { en: 'Walnut', es: 'Nogal', de: 'Nussbaum' },
  Olivier: { en: 'Olive wood', es: 'Olivo', de: 'Olivenholz' },
  Chataignier: { en: 'Chestnut', es: 'Castaño', de: 'Kastanie' },
  Acacia: { en: 'Acacia', es: 'Acacia', de: 'Akazie' },
  Bouleau: { en: 'Birch', es: 'Abedul', de: 'Birke' },
  Merisier: { en: 'Cherry', es: 'Cerezo', de: 'Kirsche' },
  ArbresFruitiers: { en: 'Orchard fruitwood', es: 'Árboles frutales', de: 'Obstbaumholz' },
  Robinier: { en: 'Black locust', es: 'Robinia', de: 'Robinie' },
  Peuplier: { en: 'Poplar', es: 'Álamo', de: 'Pappel' },
  Aulne: { en: 'Alder', es: 'Aliso', de: 'Erle' },
  Tilleul: { en: 'Linden', es: 'Tilo', de: 'Linde' },
  Saule: { en: 'Willow', es: 'Sauce', de: 'Weide' },
  Platane: { en: 'Plane tree', es: 'Plátano', de: 'Platane' },
  Pin: { en: 'Pine', es: 'Pino', de: 'Kiefer' },
  Sapin: { en: 'Fir', es: 'Abeto', de: 'Tanne' },
  Epicea: { en: 'Spruce', es: 'Picea', de: 'Fichte' },
  Meleze: { en: 'Larch', es: 'Alerce', de: 'Lärche' },
}

function translatedNames(essence: ProductEssence) {
  const labels = ESSENCE_LABELS[essence]
  return {
    en: `${labels.en} firewood logs`,
    es: `Leños de ${labels.es}`,
    de: `${labels.de} Brennholz`,
  }
}

const seedProducts: SeedProduct[] = [
  // ── Groupe 1 — Feuillus durs ─────────────────────────────────────────
  {
    essence: 'Chene',
    description:
      'Le chêne est un classique du chauffage : bois dense, feu très long et chaleur soutenue. Nécessite un séchage de deux ans pour une combustion optimale.',
    translations: {
      en: { name: translatedNames('Chene').en, description: 'Oak is a heating classic: dense wood, a very long-lasting fire and steady warmth. It requires two years of seasoning for optimal combustion.' },
      es: { name: translatedNames('Chene').es, description: 'El roble es un clásico de la calefacción: madera densa, fuego muy duradero y calor constante. Requiere dos años de secado para una combustión óptima.' },
      de: { name: translatedNames('Chene').de, description: 'Eiche ist ein Klassiker zum Heizen: dichtes Holz, sehr lange Brenndauer und anhaltende Wärme. Für eine optimale Verbrennung braucht sie zwei Jahre Trocknung.' },
    },
    priceEur: 8600,
    priceUsd: 9300,
    priceFcfa: 5600000,
    stock: 200,
    characteristics: { durete: 'Très élevée', flamme: 'Longue', rendement: 'Excellent', type: 'Bûches' },
  },
  {
    essence: 'Charme',
    description:
      'Le charme est la référence absolue en bois de chauffage : très dense, long feu et excellent pouvoir calorifique. Idéal pour les poêles à rendement élevé.',
    translations: {
      en: { name: translatedNames('Charme').en, description: 'Hornbeam is the absolute benchmark for firewood: very dense, long-burning and an excellent heat output. Ideal for high-efficiency stoves.' },
      es: { name: translatedNames('Charme').es, description: 'El carpe es la referencia absoluta como leña: muy denso, de larga combustión y excelente poder calorífico. Ideal para estufas de alto rendimiento.' },
      de: { name: translatedNames('Charme').de, description: 'Hainbuche ist die absolute Referenz unter den Brennhölzern: sehr dicht, lange Brenndauer und exzellenter Heizwert. Ideal für hocheffiziente Öfen.' },
    },
    priceEur: 8500,
    priceUsd: 9200,
    priceFcfa: 5500000,
    stock: 120,
    characteristics: { durete: 'Très élevée', flamme: 'Longue et régulière', rendement: 'Excellent', type: 'Bûches' },
  },
  {
    essence: 'Hetre',
    description:
      'Le hêtre offre une combustion vive et régulière avec un pouvoir calorifique remarquable. Facile à fendre, il est très apprécié pour le chauffage domestique.',
    translations: {
      en: { name: translatedNames('Hetre').en, description: 'Beech burns bright and steady with remarkable heat output. Easy to split, it is highly valued for domestic heating.' },
      es: { name: translatedNames('Hetre').es, description: 'El haya arde con llama viva y regular, con un notable poder calorífico. Fácil de rajar, es muy apreciado para la calefacción doméstica.' },
      de: { name: translatedNames('Hetre').de, description: 'Buche brennt lebhaft und gleichmäßig mit bemerkenswertem Heizwert. Leicht zu spalten, ist sie für das Heizen zu Hause sehr beliebt.' },
    },
    priceEur: 8000,
    priceUsd: 8700,
    priceFcfa: 5200000,
    stock: 150,
    characteristics: { durete: 'Élevée', flamme: 'Vive', rendement: 'Excellent', type: 'Bûches' },
  },
  {
    essence: 'Frene',
    description:
      'Le frêne se consume facilement, même légèrement humide, avec un bon pouvoir calorifique. Très apprécié pour son feu vif et son faible taux de cendre.',
    translations: {
      en: { name: translatedNames('Frene').en, description: 'Ash burns easily, even when slightly damp, with good heat output. Highly valued for its lively flame and low ash content.' },
      es: { name: translatedNames('Frene').es, description: 'El fresno se quema fácilmente, incluso ligeramente húmedo, con buen poder calorífico. Muy apreciado por su llama viva y su poca ceniza.' },
      de: { name: translatedNames('Frene').de, description: 'Esche brennt leicht, auch leicht feucht, mit gutem Heizwert. Sehr beliebt für ihre lebhafte Flamme und geringe Aschebildung.' },
    },
    priceEur: 7800,
    priceUsd: 8500,
    priceFcfa: 5100000,
    stock: 160,
    characteristics: { durete: 'Élevée', flamme: 'Vive', rendement: 'Très bon', type: 'Bûches' },
  },
  {
    essence: 'Orme',
    description:
      "L'orme brûle longtemps et chauffe fort, avec un pouvoir calorifique comparable au chêne. Son bois dense convient parfaitement aux hivers rigoureux.",
    translations: {
      en: { name: translatedNames('Orme').en, description: 'Elm burns long and hot, with heat output comparable to oak. Its dense wood is perfect for harsh winters.' },
      es: { name: translatedNames('Orme').es, description: 'El olmo arde mucho tiempo y calienta intensamente, con un poder calorífico comparable al roble. Su madera densa es ideal para inviernos rigurosos.' },
      de: { name: translatedNames('Orme').de, description: 'Ulme brennt lange und gibt starke Wärme ab, mit einem Heizwert vergleichbar mit Eiche. Ihr dichtes Holz eignet sich perfekt für raue Winter.' },
    },
    priceEur: 7900,
    priceUsd: 8600,
    priceFcfa: 5150000,
    stock: 80,
    characteristics: { durete: 'Très élevée', flamme: 'Longue', rendement: 'Excellent', type: 'Bûches' },
  },
  {
    essence: 'Erable',
    description:
      "L'érable produit une flamme stable et une chaleur agréable avec un pouvoir calorifique correct. C'est un bon compromis pour le chauffage quotidien.",
    translations: {
      en: { name: translatedNames('Erable').en, description: 'Maple produces a stable flame and pleasant warmth with decent heat output. A good compromise for everyday heating.' },
      es: { name: translatedNames('Erable').es, description: 'El arce produce una llama estable y un calor agradable con un poder calorífico correcto. Un buen compromiso para la calefacción diaria.' },
      de: { name: translatedNames('Erable').de, description: 'Ahorn erzeugt eine stabile Flamme und angenehme Wärme bei ordentlichem Heizwert. Ein guter Kompromiss für das tägliche Heizen.' },
    },
    priceEur: 7000,
    priceUsd: 7600,
    priceFcfa: 4550000,
    stock: 100,
    characteristics: { durete: 'Élevée', flamme: 'Stable', rendement: 'Bon', type: 'Bûches' },
  },
  {
    essence: 'Noyer',
    description:
      'Le noyer est un feuillu dense au feu soutenu et homogène. Un très bon compromis entre longévité de la braise et belle flamme.',
    translations: {
      en: { name: translatedNames('Noyer').en, description: 'Walnut is a dense hardwood with a steady, even fire. An excellent balance between long-lasting embers and a beautiful flame.' },
      es: { name: translatedNames('Noyer').es, description: 'El nogal es un frondoso denso de fuego sostenido y uniforme. Un excelente equilibrio entre brasa duradera y bella llama.' },
      de: { name: translatedNames('Noyer').de, description: 'Nussbaum ist ein dichtes Laubholz mit gleichmäßiger, anhaltender Brenndauer. Eine ausgezeichnete Balance zwischen langer Glut und schöner Flamme.' },
    },
    priceEur: 7400,
    priceUsd: 8000,
    priceFcfa: 4800000,
    stock: 70,
    characteristics: { durete: 'Élevée', flamme: 'Soutenue', rendement: 'Bon', type: 'Bûches' },
  },
  {
    essence: 'Olivier',
    description:
      "L'olivier est un bois extrêmement dense offrant une chaleur puissante et durable. Rare et précieux, il se consume très lentement.",
    translations: {
      en: { name: translatedNames('Olivier').en, description: 'Olive wood is extremely dense, delivering powerful and lasting heat. Rare and precious, it burns very slowly.' },
      es: { name: translatedNames('Olivier').es, description: 'El olivo es una madera extremadamente densa que aporta un calor potente y duradero. Raro y preciado, se consume muy lentamente.' },
      de: { name: translatedNames('Olivier').de, description: 'Olivenholz ist extrem dicht und spendet kräftige, langanhaltende Wärme. Selten und wertvoll, verbrennt es sehr langsam.' },
    },
    priceEur: 8800,
    priceUsd: 9500,
    priceFcfa: 5750000,
    stock: 60,
    characteristics: { durete: 'Très élevée', flamme: 'Forte', rendement: 'Excellent', type: 'Bûches' },
  },

  // ── Groupe 2 — Feuillus mi-durs / intermédiaires ────────────────────
  {
    essence: 'Chataignier',
    description:
      'Le châtaignier offre un feu vif et régulier avec un bon pouvoir calorifique. Attention aux projections : idéal pour les cheminées fermées et poêles.',
    translations: {
      en: { name: translatedNames('Chataignier').en, description: 'Chestnut offers a lively, regular fire with good heat output. Watch out for sparks: best suited to closed fireplaces and stoves.' },
      es: { name: translatedNames('Chataignier').es, description: 'El castaño ofrece un fuego vivo y regular con buen poder calorífico. Cuidado con las chispas: ideal para chimeneas cerradas y estufas.' },
      de: { name: translatedNames('Chataignier').de, description: 'Kastanie bietet ein lebhaftes, gleichmäßiges Feuer mit gutem Heizwert. Vorsicht vor Funkenflug: ideal für geschlossene Kamine und Öfen.' },
    },
    priceEur: 7400,
    priceUsd: 8000,
    priceFcfa: 4800000,
    stock: 110,
    characteristics: { durete: 'Élevée', flamme: 'Régulière', rendement: 'Bon', type: 'Bûches' },
  },
  {
    essence: 'Acacia',
    description:
      "L'acacia, également appelé faux-acacia, produit un bois charnu au feu long et chaud. Son pouvoir calorifique se rapproche des feuillus durs.",
    translations: {
      en: { name: translatedNames('Acacia').en, description: 'Acacia, also known as black locust, produces dense wood with a long, hot fire. Its heat output rivals that of hardwoods.' },
      es: { name: translatedNames('Acacia').es, description: 'La acacia, también llamada robinia, produce una madera densa de fuego largo y cálido. Su poder calorífico roza el de las frondosas duras.' },
      de: { name: translatedNames('Acacia').de, description: 'Akazie, auch Robinie genannt, liefert dichtes Holz mit lange heißem Feuer. Ihr Heizwert kommt an Harthölzer heran.' },
    },
    priceEur: 8100,
    priceUsd: 8800,
    priceFcfa: 5300000,
    stock: 85,
    characteristics: { durete: 'Très élevée', flamme: 'Longue', rendement: 'Excellent', type: 'Bûches' },
  },
  {
    essence: 'Bouleau',
    description:
      'Le bouleau s\'allume facilement et produit une belle flamme vive, idéale pour démarrer le feu. Son écorce constitue un excellent allume-feu naturel.',
    translations: {
      en: { name: translatedNames('Bouleau').en, description: 'Birch lights easily and produces a beautiful bright flame, perfect for starting fires. Its bark is an excellent natural firelighter.' },
      es: { name: translatedNames('Bouleau').es, description: 'El abedul se enciende fácilmente y produce una bonita llama viva, ideal para iniciar el fuego. Su corteza es un excelente encendedor natural.' },
      de: { name: translatedNames('Bouleau').de, description: 'Birke entzündet sich leicht und erzeugt eine schöne helle Flamme – perfekt zum Anfeuern. Ihre Rinde ist ein hervorragender natürlicher Anzünder.' },
    },
    priceEur: 7200,
    priceUsd: 7800,
    priceFcfa: 4700000,
    stock: 180,
    characteristics: { durete: 'Moyenne', flamme: 'Vive et lumineuse', rendement: 'Bon', type: 'Bûches' },
  },
  {
    essence: 'Merisier',
    description:
      'Le merisier offre une flamme agréable et régulière avec un pouvoir calorifique modéré. Léger, il est facile à fendre et à allumer.',
    translations: {
      en: { name: translatedNames('Merisier').en, description: 'Cherry offers a pleasant, regular flame with moderate heat output. Light and easy to split and light.' },
      es: { name: translatedNames('Merisier').es, description: 'El cerezo ofrece una llama agradable y regular con un poder calorífico moderado. Ligero, fácil de rajar y de encender.' },
      de: { name: translatedNames('Merisier').de, description: 'Kirsche bietet eine angenehme, gleichmäßige Flamme bei moderatem Heizwert. Leicht und einfach zu spalten und zu entzünden.' },
    },
    priceEur: 6900,
    priceUsd: 7500,
    priceFcfa: 4500000,
    stock: 75,
    characteristics: { durete: 'Moyenne', flamme: 'Régulière', rendement: 'Bon', type: 'Bûches' },
  },
  {
    essence: 'ArbresFruitiers',
    description:
      'Les bois fruitiers regroupent pommiers, cerisiers et autres essences de vergers : des bûches denses au feu odorant et soutenu.',
    translations: {
      en: { name: translatedNames('ArbresFruitiers').en, description: 'Orchard fruitwoods include apple, cherry and other orchard species: dense logs with a fragrant, sustained fire.' },
      es: { name: translatedNames('ArbresFruitiers').es, description: 'Las maderas frutales reúnen manzano, cerezo y otras especies de huerto: leños densos de fuego oloroso y sostenido.' },
      de: { name: translatedNames('ArbresFruitiers').de, description: 'Obstbaumhölzer umfassen Apfel, Kirsche und weitere Obstbaumsorten: dichte Scheite mit duftendem, anhaltendem Feuer.' },
    },
    priceEur: 7100,
    priceUsd: 7700,
    priceFcfa: 4620000,
    stock: 95,
    characteristics: { durete: 'Élevée', flamme: 'Odorante', rendement: 'Bon', type: 'Bûches' },
  },
  {
    essence: 'Robinier',
    description:
      'Le robinier produit un bois très dense et un feu extrêmement chaud. Il doit être bien sec avant combustion pour un rendement optimal.',
    translations: {
      en: { name: translatedNames('Robinier').en, description: 'Black locust produces very dense wood and an extremely hot fire. It must be well seasoned before burning for optimal efficiency.' },
      es: { name: translatedNames('Robinier').es, description: 'La robinia produce una madera muy densa y un fuego extremadamente caliente. Debe estar bien seca antes de quemarla para un rendimiento óptimo.' },
      de: { name: translatedNames('Robinier').de, description: 'Robinie liefert sehr dichtes Holz und ein extrem heißes Feuer. Für einen optimalen Wirkungsgrad sollte sie gut getrocknet sein.' },
    },
    priceEur: 8200,
    priceUsd: 8900,
    priceFcfa: 5350000,
    stock: 90,
    characteristics: { durete: 'Très élevée', flamme: 'Forte', rendement: 'Excellent', type: 'Bûches' },
  },

  // ── Groupe 3 — Résineux & feuillus tendres ──────────────────────────
  {
    essence: 'Peuplier',
    description:
      "Le peuplier s'allume facilement mais se consume rapidement. Son faible pouvoir calorifique le destine aux feux de cheminée d'agrément ou en complément.",
    translations: {
      en: { name: translatedNames('Peuplier').en, description: 'Poplar lights easily but burns quickly. Its low heat output makes it best for decorative fireplace fires or as a complement.' },
      es: { name: translatedNames('Peuplier').es, description: 'El álamo se enciende fácilmente pero se consume rápido. Su bajo poder calorífico lo destina a chimeneas decorativas o como complemento.' },
      de: { name: translatedNames('Peuplier').de, description: 'Pappel entzündet sich leicht, brennt aber schnell ab. Wegen ihres geringen Heizwerts eignet sie sich für dekorative Kaminfeuer oder als Ergänzung.' },
    },
    priceEur: 5200,
    priceUsd: 5700,
    priceFcfa: 3400000,
    stock: 140,
    characteristics: { durete: 'Faible', flamme: 'Rapide', rendement: 'Faible', type: 'Bûches' },
  },
  {
    essence: 'Aulne',
    description:
      "L'aulne s'allume aisément et brûle sans produire d'étincelles, ce qui le rend agréable en foyer ouvert. Idéal en complément d'une essence dense.",
    translations: {
      en: { name: translatedNames('Aulne').en, description: 'Alder lights readily and burns without sparking, making it pleasant in open hearths. Ideal alongside a denser wood.' },
      es: { name: translatedNames('Aulne').es, description: 'El aliso se enciende con facilidad y arde sin chispas, lo que lo hace agradable en hogares abiertos. Ideal junto a una madera densa.' },
      de: { name: translatedNames('Aulne').de, description: 'Erle entzündet sich leicht und brennt ohne Funkenflug – angenehm im offenen Kamin. Ideal in Kombination mit einem dichten Holz.' },
    },
    priceEur: 6800,
    priceUsd: 7400,
    priceFcfa: 4400000,
    stock: 85,
    characteristics: { durete: 'Faible', flamme: 'Sans étincelles', rendement: 'Moyen', type: 'Bûches' },
  },
  {
    essence: 'Tilleul',
    description:
      'Le tilleul brûle rapidement avec peu d\'étincelles. Sa flamme douce convient aux cheminées ouvertes, mais son pouvoir calorifique reste modéré.',
    translations: {
      en: { name: translatedNames('Tilleul').en, description: 'Linden burns quickly with few sparks. Its gentle flame suits open fireplaces, though its heat output remains moderate.' },
      es: { name: translatedNames('Tilleul').es, description: 'El tilo arde rápido y con pocas chispas. Su llama suave conviene a chimeneas abiertas, aunque su poder calorífico es moderado.' },
      de: { name: translatedNames('Tilleul').de, description: 'Linde brennt schnell und mit wenigen Funken. Ihre sanfte Flamme passt zum offenen Kamin, der Heizwert bleibt jedoch mäßig.' },
    },
    priceEur: 6500,
    priceUsd: 7100,
    priceFcfa: 4200000,
    stock: 95,
    characteristics: { durete: 'Faible', flamme: 'Douce', rendement: 'Moyen', type: 'Bûches' },
  },
  {
    essence: 'Saule',
    description:
      "Le saule brûle facilement avec un pouvoir calorifique modéré. Léger et facile à fendre, il constitue un appoint économique pour le chauffage.",
    translations: {
      en: { name: translatedNames('Saule').en, description: 'Willow burns easily with moderate heat output. Light and easy to split, it is an economical top-up fuel for heating.' },
      es: { name: translatedNames('Saule').es, description: 'El sauce arde fácilmente con un poder calorífico moderado. Ligero y fácil de rajar, es un combustible económico de apoyo.' },
      de: { name: translatedNames('Saule').de, description: 'Weide brennt leicht bei moderatem Heizwert. Leicht und einfach zu spalten, ist sie ein wirtschaftlicher Zusatzbrennstoff.' },
    },
    priceEur: 5600,
    priceUsd: 6100,
    priceFcfa: 3650000,
    stock: 130,
    characteristics: { durete: 'Faible', flamme: 'Facile', rendement: 'Moyen', type: 'Bûches' },
  },
  {
    essence: 'Platane',
    description:
      'Le platane brûle sans projeter d\'étincelles avec un pouvoir calorifique convenable. Très apprécié pour un usage en cheminée ouverte.',
    translations: {
      en: { name: translatedNames('Platane').en, description: 'Plane tree burns without spitting sparks and delivers decent heat. Much appreciated for open-fireplace use.' },
      es: { name: translatedNames('Platane').es, description: 'El plátano arde sin proyectar chispas y aporta un calor conveniente. Muy apreciado para el uso en chimeneas abiertas.' },
      de: { name: translatedNames('Platane').de, description: 'Platane brennt ohne Funkenflug und liefert ordentliche Wärme. Sehr beliebt für den offenen Kamin.' },
    },
    priceEur: 6300,
    priceUsd: 6900,
    priceFcfa: 4100000,
    stock: 100,
    characteristics: { durete: 'Moyenne', flamme: 'Sans étincelles', rendement: 'Moyen', type: 'Bûches' },
  },
  {
    essence: 'Pin',
    description:
      'Le pin s\'allume rapidement et produit une belle flamme vive grâce à sa résine. Il se consume assez vite et peut produire des projections.',
    translations: {
      en: { name: translatedNames('Pin').en, description: 'Pine lights fast and produces a lovely bright flame thanks to its resin. It burns fairly quickly and can throw sparks.' },
      es: { name: translatedNames('Pin').es, description: 'El pino se enciende rápido y produce una hermosa llama viva gracias a su resina. Se consume bastante rápido y puede proyectar chispas.' },
      de: { name: translatedNames('Pin').de, description: 'Kiefer entzündet sich schnell und erzeugt dank ihres Harzes eine schöne helle Flamme. Sie brennt recht zügig ab und kann spritzen.' },
    },
    priceEur: 5500,
    priceUsd: 6000,
    priceFcfa: 3600000,
    stock: 170,
    characteristics: { durete: 'Faible', flamme: 'Vive et résineuse', rendement: 'Moyen', type: 'Bûches' },
  },
  {
    essence: 'Sapin',
    description:
      'Le sapin s\'allume très facilement avec une flamme claire et rapide. Densité faible, il sert principalement de bois d\'allumage.',
    translations: {
      en: { name: translatedNames('Sapin').en, description: 'Fir lights very easily with a clear, quick flame. Its low density makes it mainly kindling wood.' },
      es: { name: translatedNames('Sapin').es, description: 'El abeto se enciende muy fácilmente con una llama clara y rápida. Su baja densidad lo hace principalmente madera de encendido.' },
      de: { name: translatedNames('Sapin').de, description: 'Tanne entzündet sich sehr leicht mit klarer, schneller Flamme. Ihre geringe Dichte macht sie vor allem zu Anmachholz.' },
    },
    priceEur: 5400,
    priceUsd: 5900,
    priceFcfa: 3500000,
    stock: 190,
    characteristics: { durete: 'Faible', flamme: 'Claire et rapide', rendement: 'Faible', type: 'Bûches' },
  },
  {
    essence: 'Epicea',
    description:
      "L'épicéa s'allume très rapidement et produit une flamme haute et claire, parfait pour démarrer un feu. Densité faible, il se consume vite.",
    translations: {
      en: { name: translatedNames('Epicea').en, description: 'Spruce ignites very quickly, producing a tall clear flame that is perfect for starting fires. Low density means it burns away fast.' },
      es: { name: translatedNames('Epicea').es, description: 'El abeto rojo se enciende muy rápidamente y produce una llama alta y clara, perfecto para iniciar el fuego. Su baja densidad hace que se consuma pronto.' },
      de: { name: translatedNames('Epicea').de, description: 'Fichte entzündet sich sehr schnell und erzeugt eine hohe, klare Flamme – perfekt zum Anfeuern. Ihre geringe Dichte lässt sie rasch abbrennen.' },
    },
    priceEur: 5900,
    priceUsd: 6400,
    priceFcfa: 3800000,
    stock: 220,
    characteristics: { durete: 'Faible', flamme: 'Haute et claire', rendement: 'Moyen', type: 'Bûches' },
  },
  {
    essence: 'Meleze',
    description:
      'Le mélèze est le résineux le plus dense : un bon feu soutenu et assez durable, au léger parfum résineux.',
    translations: {
      en: { name: translatedNames('Meleze').en, description: 'Larch is the densest softwood: a good, fairly durable fire with a light resinous scent.' },
      es: { name: translatedNames('Meleze').es, description: 'El alerce es la conífera más densa: buen fuego sostenido y bastante duradero, con un ligero perfume resinoso.' },
      de: { name: translatedNames('Meleze').de, description: 'Lärche ist das dichteste Nadelholz: ein gutes, recht anhaltendes Feuer mit leichtem Harzaroma.' },
    },
    priceEur: 6200,
    priceUsd: 6700,
    priceFcfa: 4050000,
    stock: 120,
    characteristics: { durete: 'Moyenne', flamme: 'Soutenue', rendement: 'Bon', type: 'Bûches' },
  },
]

const products = seedProducts.map((seed, index) => {
  const data = ESSENCE_DATA[seed.essence]
  return {
    name: `Bûches de ${data.label}`,
    slug: `buches-de-${seed.essence.toLowerCase()}`,
    essence: seed.essence,
    description: seed.description,
    translations: seed.translations,
    priceEur: seed.priceEur,
    priceUsd: seed.priceUsd,
    priceFcfa: seed.priceFcfa,
    stock: seed.stock,
    dimensions: {
      length_mm: 250,
      width_mm: 100,
      thickness_mm: 100,
      weight_kg_m3: data.densite_sec_kg_m3,
    },
    images: [WOOD_IMAGES[index % WOOD_IMAGES.length]],
    characteristics: {
      densite_vert_kg_m3: data.densite_vert_kg_m3,
      densite_sec_kg_m3: data.densite_sec_kg_m3,
      pouvoir_calorifique: data.pouvoir_calorifique,
      sechage: '2 ans',
      origine: 'Suisse et Europe',
      certification: 'PEFC',
      ...seed.characteristics,
    },
  }
})

const cmsContent = [
  {
    key: 'hero_title',
    value: "Des bois de chauffage d'excellence",
    type: 'text',
    label: 'Titre hero principal',
    translations: {
      en: { value: 'Premium firewood, delivered to your door' },
      es: { value: 'Leña de excelencia, entregada en tu puerta' },
      de: { value: 'Erstklassiges Brennholz, bis vor die Tür geliefert' },
    },
  },
  {
    key: 'hero_subtitle',
    value:
      'SwissWood sélectionne et livre les essences les plus performantes pour chauffer votre foyer, saison après saison, à travers toute l’Europe.',
    type: 'text',
    label: 'Sous-titre hero',
    translations: {
      en: { value: 'SwissWood selects and delivers the highest-performing wood essences to heat your home, season after season, across Europe.' },
      es: { value: 'SwissWood selecciona y entrega las especies de madera más eficientes para calentar tu hogar, temporada tras temporada, por toda Europa.' },
      de: { value: 'SwissWood wählt und liefert die leistungsfähigsten Holzarten, um Ihr Zuhause Saison für Saison in ganz Europa zu heizen.' },
    },
  },
  {
    key: 'about_text',
    value:
      'Depuis plus de 20 ans, SwissWood fournit des bois de chauffage certifiés aux familles et professionnels exigeants, avec un pouvoir calorifique optimal et des essences durables.',
    type: 'text',
    label: 'Texte à propos',
    translations: {
      en: { value: 'For over 20 years, SwissWood has supplied certified firewood to demanding families and professionals, with optimal heat output and sustainable essences.' },
      es: { value: 'Desde hace más de 20 años, SwissWood suministra leña certificada a familias y profesionales exigentes, con un poder calorífico óptimo y especies sostenibles.' },
      de: { value: 'Seit über 20 Jahren beliefert SwissWood anspruchsvolle Familien und Profis mit zertifiziertem Brennholz – optimalem Heizwert und nachhaltigen Holzarten.' },
    },
  },
  { key: 'contact_email', value: 'contact@swisswood.ch', type: 'text', label: 'Email de contact', translations: {} },
  { key: 'contact_phone', value: '+41 22 123 45 67', type: 'text', label: 'Téléphone', translations: {} },
  { key: 'contact_address', value: 'Rue du Bois 12, 1201 Genève, Suisse', type: 'text', label: 'Adresse', translations: {} },
]

async function main(): Promise<void> {
  console.log('🌱 Démarrage du seed...')

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    })
  }
  console.log(`✅ ${products.length} produits insérés`)

  for (const entry of cmsContent) {
    await prisma.cmsContent.upsert({
      where: { key: entry.key },
      update: entry,
      create: entry,
    })
  }
  console.log(`✅ ${cmsContent.length} contenus CMS insérés`)

  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? 'admin@swisswood.ch'
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? 'Admin123!'
  const passwordHash = await bcrypt.hash(adminPassword, 12)

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: passwordHash,
      firstName: 'SwissWood',
      lastName: 'Admin',
      role: 'super_admin',
      emailVerified: true,
      country: 'Suisse',
    },
  })
  console.log(`✅ Admin initial : ${adminEmail}`)

  console.log('🎉 Seed terminé')
}

main()
  .catch((error) => {
    console.error('❌ Erreur pendant le seed :', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
