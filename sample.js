const MediumApi = require('./src/index.js');

(async () => {
  await MediumApi.getUser()
  await MediumApi.getPosts()
  await MediumApi.getPublicationsPosts()
  await MediumApi.createPost({
    title: 'Teste',
    html: '<h1>Teste</h1>',
    tags: ['teste', 'testando']
  })
})();