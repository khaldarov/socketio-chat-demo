const redis = require("redis");

exports.connect = async () => {
    const client = redis.createClient();

    await client.connect();

    return client;
}
