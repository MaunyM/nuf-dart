Serveur MCP
===========

Pour permettre à Claude de me donner des conseils, j'aimerais que le serveur expose une api compatible mcp en respectant l'architecture actuelle.

Améliorations techniques
========================

- [ ] Migrer entièrement vers l'App Router (supprimer le mélange pages/ + app/)
- [ ] Gestion d'erreurs réseau : saveGameState avale silencieusement les erreurs (.catch(() => {}))
- [ ] Persistance côté client : sauvegarder l'état de la partie en localStorage/sessionStorage
- [ ] Mutation dans updatePlayerScore : utiliser scores.map() au lieu de muter puis spread
- [ ] Tests : couvrir les reducers x01, cricket, monster avec des tests unitaires
- [ ] Accessibilité : ajouter role, tabIndex et onKeyDown sur les <g> SVG interactifs
- [ ] Bundle : remplacer `import _ from "lodash"` par `structuredClone()` ou `import cloneDeep from "lodash/cloneDeep"`
