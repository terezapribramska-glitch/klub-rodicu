import { collection, config, fields, singleton } from '@keystatic/core';

const required = { validation: { isRequired: true } } as const;

const publikace = fields.object(
  {
    publikovano: fields.checkbox({
      label: 'Zveřejnit na webu',
      description: 'Vypnuté položky zůstávají v administraci, ale na webu je nezobrazujte.',
      defaultValue: true,
    }),
    poradi: fields.integer({
      label: 'Pořadí',
      description: 'Nižší číslo se zobrazí dříve.',
      defaultValue: 0,
    }),
  },
  { label: 'Zveřejnění a řazení', layout: [6, 6] },
);

const seo = fields.object(
  {
    title: fields.text({ label: 'SEO titulek', description: 'Nepovinné; jinak se použije titulek položky.' }),
    description: fields.text({ label: 'SEO popis', description: 'Krátký popis pro vyhledávače.', multiline: true }),
  },
  { label: 'Vyhledávače a sdílení', description: 'Obě pole jsou nepovinná.' },
);

export default config({
  storage: {
    kind: 'github',
    repo: 'terezapribramska-glitch/klub-rodicu',
  },
  locale: 'cs-CZ',
  ui: {
    brand: { name: 'Administrace Klubu rodičů' },
    navigation: {
      Obsah: ['novinky', 'dokumenty', 'zapisy', 'cerpani'],
      'Informace na webu': ['kontakty', 'nastaveniWebu'],
    },
  },
  collections: {
    novinky: collection({
      label: 'Novinky',
      slugField: 'title',
      path: 'src/content/novinky/*',
      format: { contentField: 'content' },
      columns: ['publishedAt', 'featured'],
      schema: {
        title: fields.slug({ name: { label: 'Titulek novinky' }, ...required }),
        publishedAt: fields.date({ label: 'Datum zveřejnění', ...required }),
        summary: fields.text({
          label: 'Krátký úvod',
          description: 'Zobrazí se ve výpisu novinek a při sdílení.',
          multiline: true,
          ...required,
        }),
        coverImage: fields.image({ label: 'Hlavní fotografie', directory: 'public/media/novinky', publicPath: '/media/novinky/' }),
        coverImageAlt: fields.text({ label: 'Popis fotografie' }),
        publikace,
        featured: fields.checkbox({ label: 'Připnout na úvodní stránku', defaultValue: false }),
        seo,
        content: fields.markdoc({ label: 'Obsah novinky' }),
      },
    }),
    dokumenty: collection({
      label: 'Dokumenty',
      slugField: 'title',
      path: 'src/content/dokumenty/*',
      format: { contentField: 'emptyContent' },
      columns: ['category', 'year'],
      schema: {
        title: fields.slug({ name: { label: 'Název dokumentu' }, ...required }),
        category: fields.select({
          label: 'Kategorie',
          options: [
            { label: 'Stanovy', value: 'stanovy' },
            { label: 'Výroční zprávy', value: 'vyrocni-zpravy' },
            { label: 'Ostatní dokumenty', value: 'ostatni' },
          ],
          defaultValue: 'ostatni',
        }),
        year: fields.integer({ label: 'Rok', defaultValue: new Date().getFullYear(), ...required }),
        description: fields.text({ label: 'Stručný popis', multiline: true }),
        file: fields.file({
          label: 'Soubor ke stažení',
          description: 'Nahrajte finální PDF dokument.',
          directory: 'public/soubory/dokumenty',
          publicPath: '/soubory/dokumenty/',
          ...required,
        }),
        publikace,
        emptyContent: fields.emptyContent({ extension: 'mdoc' }),
      },
    }),
    zapisy: collection({
      label: 'Zápisy z jednání',
      slugField: 'title',
      path: 'src/content/zapisy-z-jednani/*',
      format: { contentField: 'emptyContent' },
      columns: ['meetingDate'],
      schema: {
        title: fields.slug({
          name: { label: 'Název zápisu', description: 'Např. „Zápis z jednání výboru – 15. 9. 2026“.' },
          ...required,
        }),
        meetingDate: fields.date({ label: 'Datum jednání', ...required }),
        file: fields.file({ label: 'Zápis v PDF', directory: 'public/soubory/zapisy', publicPath: '/soubory/zapisy/', ...required }),
        publikace,
        emptyContent: fields.emptyContent({ extension: 'mdoc' }),
      },
    }),
    cerpani: collection({
      label: 'Přehled čerpání',
      slugField: 'year',
      path: 'src/content/cerpani-prispevku/*',
      format: { contentField: 'emptyContent' },
      columns: ['year'],
      schema: {
        year: fields.slug({
          name: { label: 'Rok', description: 'Použijte čtyřmístný rok, například 2026.' },
          ...required,
        }),
        file: fields.file({ label: 'Přehled v PDF', directory: 'public/soubory/cerpani', publicPath: '/soubory/cerpani/', ...required }),
        publikace,
        emptyContent: fields.emptyContent({ extension: 'mdoc' }),
      },
    }),
  },
  singletons: {
    kontakty: singleton({
      label: 'Kontakty',
      path: 'src/content/kontakty',
      schema: {
        obecne: fields.object(
          {
            email: fields.text({ label: 'E-mail', ...required }),
            address: fields.text({ label: 'Adresa', multiline: true }),
          },
          { label: 'Obecné kontakty' },
        ),
        vedeni: fields.array(
          fields.object({
            name: fields.text({ label: 'Jméno a příjmení', ...required }),
            role: fields.text({
              label: 'Pozice',
              description: 'Např. předseda výboru, člen výboru nebo zástupce školy.',
              ...required,
            }),
            email: fields.text({ label: 'E-mail' }),
            photo: fields.image({ label: 'Fotografie', directory: 'public/media/kontakty', publicPath: '/media/kontakty/' }),
          }),
          { label: 'Vedení Klubu rodičů', itemLabel: (props) => props.fields.name.value || 'Nový člen' },
        ),
        zastupciSkoly: fields.array(
          fields.object({
            name: fields.text({ label: 'Jméno a příjmení', ...required }),
            role: fields.text({ label: 'Pozice', description: 'Např. zástupce školy.' }),
            email: fields.text({ label: 'E-mail' }),
          }),
          { label: 'Zástupci školy', itemLabel: (props) => props.fields.name.value || 'Nová osoba' },
        ),
        tridniVybory: fields.array(
          fields.object({
            className: fields.text({ label: 'Třída', ...required }),
            chairName: fields.text({ label: 'Předseda/předsedkyně' }),
            chairEmail: fields.text({ label: 'E-mail předsedy/předsedkyně' }),
            treasurerName: fields.text({ label: 'Pokladník/pokladnice' }),
            treasurerEmail: fields.text({ label: 'E-mail pokladníka/pokladnice' }),
          }),
          { label: 'Třídní výbory', itemLabel: (props) => props.fields.className.value || 'Nová třída' },
        ),
      },
    }),
    nastaveniWebu: singleton({
      label: 'Nastavení webu',
      path: 'src/content/nastaveni-webu',
      schema: {
        organizace: fields.object(
          {
            associationName: fields.text({ label: 'Název spolku', ...required }),
            schoolName: fields.text({ label: 'Název školy', ...required }),
            ico: fields.text({ label: 'IČO' }),
            dataBox: fields.text({ label: 'Datová schránka' }),
          },
          { label: 'Obecné údaje' },
        ),
        platby: fields.object(
          {
            membershipFee: fields.integer({ label: 'Výše členského příspěvku', defaultValue: 500, ...required }),
            currency: fields.select({ label: 'Měna', options: [{ label: 'Kč', value: 'CZK' }], defaultValue: 'CZK' }),
            accountNumber: fields.text({ label: 'Číslo účtu', ...required }),
            iban: fields.text({ label: 'IBAN' }),
            bic: fields.text({ label: 'BIC / SWIFT' }),
            variableSymbol: fields.text({ label: 'Variabilní symbol' }),
            paymentNote: fields.text({ label: 'Poznámka k platbě', multiline: true }),
            qrCode: fields.image({ label: 'QR kód pro platbu', directory: 'public/media/nastaveni', publicPath: '/media/nastaveni/' }),
          },
          { label: 'Platby' },
        ),
      },
    }),
  },
});
