const axios = require('axios');
const rssToJson = require('rss-to-json');
const dotenv = require('dotenv')
dotenv.config()

class RssToJson{
  static async get(url){
    let json = await rssToJson.parse(url);
    return json;
  }
}

class RequestHelper {
  static async get(url, config = {}) {
    try {
      const response = await axios.get(url, config)
      return response.data
    } catch (error) {
      throw new Error(error?.response?.data?.errors?.map(e => e.message).join(' ') || error.message || "Unknown error")
    }
  }

  static async post(url, data, config) {
    try {
      const response = await axios.post(url, data, config)
      return response.data
    } catch (error) {
      throw new Error(error?.response?.data?.errors?.map(e => e.message).join(' ') || error.message || "Unknown error")
    }
  }
}

class Medium{
  static #url = 'https://api.medium.com/v1';
  static #urlRss = 'https://medium.com/feed';
  static #config = {
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${process.env.MEDIUM_ACESS_TOKEN}`,
      Accept: "application/json",
      "Accept-Charset": "utf-8",
    },
  }
  static userData = null;
  static userPosts = null;
  static publicationsPosts = null;

  static async getUser(){
    const resGetUser = await RequestHelper.get(`${this.#url}/me`, this.#config)
    this.userData = resGetUser.data
    return this.userData
  }

  static async getPosts(){
    if(!this.userData) await this.getUser()
    const resGetPost = await RssToJson.get(`${this.#urlRss}/@${this.userData.username}`)
    this.userPosts = resGetPost.items
    return this.userPosts
  }

  static async getPublicationsPosts(){
    if(!this.userData) await this.getUser()
    const resGetPosts = await RequestHelper.get(`${this.#url}/users/${this.userData.id}/publications`, this.#config)
    const publications = resGetPosts.data

    this.publicationsPosts = []
    for (const publication of publications) {
      const postResponse = await RequestHelper.get(`https://api.medium.com/v1/publications/${publication.id}/posts`);
      const posts = postResponse.data.posts;

      posts.forEach(post => {
        this.publicationsPosts.push(post)
      });
    }

    return this.publicationsPosts
  }

  static async createPost({
    title,
    html,
    tags
  }){
    if(!this.userData) await this.getUser()
    const resCreatePost = await RequestHelper.post(`${this.#url}/users/${this.userData.id}/posts`, {
      title,
      contentFormat: "html",
      content: html,
      tags,
      publishStatus: "public"
    }, this.#config)
    return resCreatePost;
  }
}

module.exports = Medium;