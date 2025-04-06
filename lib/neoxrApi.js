module.exports = class NeoxrApi {
   constructor(url = '', apiKey = '') {
      this.baseUrl = url;
      this.apiKey = apiKey;
   }
   
   async spotify(str) {
      let json = str.startsWith('https') ? await Func.fetchJson(this.baseUrl + '/spotify?url=' + str + '&apikey=' + this.apiKey) : await Func.fetchJson(this.baseUrl + '/spotify-search?q=' + str + '&apikey=' + this.apiKey)
      if (json?.creator) {
         json.creator = process.env.DEVELOPER || "© Nyoman Developers";
      }
      return json
   }
   
   async neoxr(api, options = {}) {
      if (!api) throw new Error("API endpoint tidak boleh kosong");
      const query = new URLSearchParams({ ...options, apikey: this.apiKey }).toString();
      const url = `${this.baseUrl}${api}?${query}`;
      let json = await Func.fetchJson(url);
      if (json?.creator) {
         json.creator = process.env.DEVELOPER || "© Nyoman Developers";
      }
      return json;
   }
};