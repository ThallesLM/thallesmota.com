# thallesmota.com

Site de **Thalles Mota, Consultoria em Análise de Dados**: análise de dados e machine learning para TCC, dissertação, tese e artigo científico em saúde. Atendimento online.

No ar em **https://thallesmota.com**.

## Como é feito

HTML e CSS puros, sem framework e sem etapa de build. Publicado com GitHub Pages a partir da branch `main`.

```
├── index.html          # página principal
├── privacidade.html    # política de privacidade e de cookies (LGPD)
├── css/style.css       # todo o visual (cores e fontes no topo, em :root)
├── js/consentimento.js # aviso de cookies e etiqueta do Google Ads
├── fonts/              # Plus Jakarta Sans (woff2) e a licença dela (OFL.txt)
├── img/                # fotos (.jpg e .webp), ícones e imagem de prévia
├── CNAME               # domínio próprio
└── robots.txt, sitemap.xml, site.webmanifest, favicon.ico
```

## Privacidade

- Nenhum script de terceiros é carregado antes do consentimento. A fonte é servida pelo próprio site.
- O aviso de cookies segue o Guia Orientativo de Cookies da ANPD (2022): "Rejeitar" e "Aceitar" têm o mesmo destaque, a publicidade vem desligada e a escolha pode ser mudada pelo rodapé.
- A etiqueta do Google Ads só carrega depois do aceite e só mede conversões (sem personalização de anúncios e sem Analytics).

## Ver no computador

```
python3 -m http.server 8080
```

e abrir http://localhost:8080.

## Direitos

Textos, fotos, depoimentos e identidade visual: © 2026 Thalles Mota, todos os direitos reservados. O código está visível porque o GitHub Pages publica a partir deste repositório. Isso não concede licença de uso.

A fonte Plus Jakarta Sans é distribuída sob a SIL Open Font License 1.1 (ver `fonts/OFL.txt`).
