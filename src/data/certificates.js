// Certificates shown on /certificates, and described to crawlers as the
// `hasCredential` list on the Person schema in src/lib/structuredData.js.
//
// `width`/`height` are the images' real intrinsic pixel sizes. They let the
// browser reserve the right box before the bytes arrive, so the grid doesn't
// reflow as each certificate decodes.
//
// `url` is the public credential page. Entries without one render no Verify
// link rather than a link that opens a blank tab — and are left out of the
// structured data, since an unverifiable credential is not worth asserting.
//
// `color` picks one of the four marker colours in sketchbook.css.
export const certificates = [
  {
    title: 'Data Analytics Foundations',
    issuer: 'DeepLearning.AI',
    image: '/certificates/cert1.webp',
    width: 1024,
    height: 768,
    url: 'https://learn.deeplearning.ai/certificates/2272a4ee-5c3e-4b27-95fd-b7bd70b0bd27',
    color: 'blue',
  },
  {
    title: 'Fast Prototyping of GenAI Apps',
    issuer: 'DeepLearning.AI',
    image: '/certificates/cert2.webp',
    width: 1024,
    height: 768,
    url: 'https://learn.deeplearning.ai/certificates/907381d1-8616-4b35-9eac-d588876d0d19',
    color: 'red',
  },
  {
    title: 'AI Engineer for Data Scientists',
    issuer: 'DataCamp',
    image: '/certificates/cert3.webp',
    width: 1719,
    height: 988,
    color: 'green',
  },
  {
    title: 'Data Engineer',
    issuer: 'DataCamp',
    image: '/certificates/cert4.webp',
    width: 1719,
    height: 988,
    color: 'green',
  },
  {
    title: 'Machine Learning',
    issuer: 'Coursera',
    image: '/certificates/cert5.webp',
    width: 1650,
    height: 1275,
    color: 'blue',
  },
];

export default certificates;
