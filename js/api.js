const ES_INDEX = {
    COVID: "covid_data_index",
    HATE: "hate_index",
    DETOXIFY: "detoxify_index",
    LANGUAGE: "language_index",
    WORD_CLOUD: "word_index",
    INTEREST: "interest_index"
}

const DATA_TYPES = {
    COVID: "covid",
    HATE: "hate",
    DETOXIFY: "detoxify",
    LANGUAGE: "language",
    WORD_CLOUD: "word_cloud",
    INTEREST: "interest"
}

const ES_QUERY_JSON_FILES = {
    COVID: "covid_data_index.json",
    HATE: "hate_index.json",
    DETOXIFY: "detoxify_index.json",
    LANGUAGE: "language_index.json",
    WORD_CLOUD: "word_cloud_index.json",
    INTEREST: "interest_index.json",
}


class ElasticSearchAPI {

    constructor() {
        this.endpoint = "https://localhost:9200"
    }

    async getESJSONFile(filename) {
        console.log("Query from JSON files instead");
        const folderPath = "./data/es-response/"
        const response = await fetch(folderPath + filename);
        return await response.json();
    }

    async getData(type) {
        const folderPath = "./data/es-response/"
        console.log("Trying to connect to ElasticSearch");
        switch (type) {
            case DATA_TYPES.COVID:
                return this.search(ES_INDEX.COVID)
                    .catch(error => {
                        return this.getESJSONFile(ES_QUERY_JSON_FILES.COVID);
                    });
                break;
            case DATA_TYPES.HATE:
                return this.search(ES_INDEX.HATE).
                    catch(error => {
                        return this.getESJSONFile(ES_QUERY_JSON_FILES.HATE);
                    });
                break;
            case DATA_TYPES.DETOXIFY:
                return this.search(ES_INDEX.DETOXIFY)
                    .catch(error => {
                        return this.getESJSONFile(ES_QUERY_JSON_FILES.DETOXIFY);
                    });
                break;
            case DATA_TYPES.LANGUAGE:
                return this.search(ES_INDEX.LANGUAGE)
                    .catch(error => {
                        return this.getESJSONFile(ES_QUERY_JSON_FILES.LANGUAGE);
                    });
                break;
            case DATA_TYPES.WORD_CLOUD:
                return this.search(ES_INDEX.WORD_CLOUD)
                    .catch(error => {
                        return this.getESJSONFile(ES_QUERY_JSON_FILES.WORD_CLOUD);
                    });
                break;
            case DATA_TYPES.INTEREST:
                return this.search(ES_INDEX.INTEREST)
                    .catch(error => {
                        return this.getESJSONFile(ES_QUERY_JSON_FILES.INTEREST);
                    });
                break;
        }
    }

    async search(index, query = "") {
        const baseQuery = "size=1500"
        if (query) {
            baseQuery += `&q=${query}`
        }
        const response = await fetch(`${this.endpoint}/${index}/_search?${baseQuery}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Elasticsearch Connection Error.");
                }
                return response;
            })
            .catch(error => {
                throw new Error("Elasticsearch Connection Error.");
            });
        console.log(response);
        const data = await response.json()
        return data
    }

    parseObjResponse(response) {
        const hits = response.hits.hits;
        return hits[0]._source;
    }

    parseResponse(response) {
        const hits = response.hits.hits
        const parsedHits = hits.map(hit => {
            return hit._source
        })
        return parsedHits
    }

}