#Features disponiveis:
- Pegar dados do usuário
- Pegar lista de posts do usuário
- Pegar lista de posts das publicações do usuário
- Criar novo post

##IMPORTANTE: Adicionar uma variavel de ambiente 'MEDIUM_ACESS_TOKEN' com o token de integração do Medium

###Exemplo de uso:

```js
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
```
