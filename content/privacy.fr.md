# Politique de confidentialité

Cette page explique quelles données ce site collecte, comment elles sont stockées, et quels sont vos droits.

## 1. Données collectées

Ce site est une application React statique. Le contenu du portfolio (réalisations, services, forfaits, témoignages) est servi depuis une base MySQL gérée via une API fine en lecture seule, puis rendu côté serveur.

Lorsque vous interagissez avec le site, les catégories de données suivantes peuvent être impliquées :

- **Soumissions du formulaire de contact.** Nom, e-mail, entreprise, téléphone, pays, service, budget, délai, message, pièce jointe éventuelle et estimation ROI. Stockés dans la table `portfolio_leads` sur le serveur de base de données.
- **Préférences de cookies.** Un petit ensemble de cookies internes : `currency_preference` (votre devise sélectionnée), `detected_currency` (détection géographique, définie par le middleware), et une clé de stockage de session contenant l'estimation du calculateur de ROI que vous pouvez pré-remplir dans le formulaire de contact.
- **Journaux serveur agrégés.** L'hébergeur enregistre l'enveloppe de requête standard (IP, user agent, code de statut, temps de réponse) pendant 30 jours. Les journaux ne sont pas joints à votre soumission de formulaire.
- **Réservation et WhatsApp.** Une demande de réservation ou un clic WhatsApp peut créer une trace légère avec la page source et des données de prévention des abus.

## 2. Formulaire de contact

Lorsque vous soumettez le formulaire de contact, l'envoi est protégé par Cloudflare Turnstile, un honeypot invisible, un contrôle de vitesse et une limitation par adresse IP. Il est validé dans le navigateur et sur le serveur. Les soumissions sont écrites dans la table `portfolio_leads`; des notifications et un e-mail de confirmation sont envoyés au propriétaire et, lorsque cela s'applique, à vous. Les pièces jointes PDF, DOC, DOCX, PNG ou JPEG facultatives, jusqu'à 5 Mo, sont stockées hors de la racine publique. Le propriétaire examine les soumissions dans le gestionnaire de portfolio imsabbar OS.

Le corps de votre message, votre e-mail et votre nom sont stockés. Un hachage irréversible de votre adresse IP et votre user agent sont stockés à des fins de prévention des abus; l'adresse IP brute n'est pas stockée par le moteur de leads. Vous pouvez demander l'accès, la correction ou la suppression de vos données en contactant le propriétaire.

## 3. Cookies

Ce site utilise uniquement des cookies internes. Aucun traqueur publicitaire, aucune Google Analytics sous sa forme par défaut, aucun script d'analyse tiers.

| Cookie | Rôle | Durée |
|---|---|---|
| `currency_preference` | Mémorise votre devise sélectionnée (USD / EUR / GBP / AED / MAD). | 30 jours |
| `detected_currency` | Définie à partir du pays de la requête. | 30 jours |
| `theme` | Mémorise votre préférence clair/sombre. | 1 an |

Vous pouvez les effacer à tout moment depuis votre navigateur.

## 4. Vos droits

Vous pouvez demander une copie des données que nous détenons à votre sujet, demander leur rectification ou leur suppression. Envoyez votre demande à l'adresse e-mail affichée dans le pied de page.

## 5. Mises à jour de cette politique

Toute modification de cette politique est publiée sur cette page avec une date de « dernière mise à jour » actualisée. Les modifications importantes seront également reflétées dans le formulaire de contact afin que les visiteurs récurrents soient informés.
