// @ts-nocheck
const crypto = require("crypto");
const http = require("http");
const https = require("https");

// Init env
const { V1_APP_ID, V1_APP_KEY, V2_APP_ID, V2_APP_KEY } = process.env;
let { API_HOST, API_PORT, PORT } = process.env;
if (!V1_APP_ID) throw new TypeError("Miss V1_APP_ID!");
if (!V1_APP_KEY) throw new TypeError("Miss V1_APP_KEY!");
if (!V2_APP_ID) throw new TypeError("Miss V2_APP_ID!");
if (!V2_APP_KEY) throw new TypeError("Miss V2_APP_KEY!");
if (!API_HOST) API_HOST = API_HOST || "ptx.transportdata.tw";
if (!PORT) PORT = Number(PORT) || undefined;
if (!API_PORT) API_PORT = Number(API_PORT) || 443;

function getAuthHeader({ path, V1_APP_ID, V1_APP_KEY, V2_APP_ID, V2_APP_KEY }) {
  if (path.toLowerCase().includes("v1")) {
    username = V1_APP_ID;
    key = V1_APP_KEY;
  } else {
    username = V2_APP_ID;
    key = V2_APP_KEY;
  }
  const date_str = new Date().toUTCString();
  const hmac_sha1 = crypto
    .createHmac("sha1", key)
    .update("x-date: " + date_str)
    .digest()
    .toString("base64");
  const Authorization = [
    'hmac username="',
    username,
    '", algorithm="hmac-sha1", headers="x-date", signature="',
    hmac_sha1,
    '"'
  ].join("");

  return {
    Authorization,
    "X-Date": date_str,
    "Accept-Encoding": "identity"
  };
}

const NodeCache = require("node-cache");
const cache = new NodeCache();
const HEADERS_KEY = "headers";
function sendProxy(req, res, cache) {
  let headers = cache.get(HEADERS_KEY);
  const path = req.url;
  if (!headers) {
    console.log("Headers expired.");
    headers = getAuthHeader({ V1_APP_ID, V1_APP_KEY, V2_APP_ID, V2_APP_KEY });
    cache.set(HEADERS_KEY, headers, 300); // 5min
  }
  const proxy = https.request(
    {
      hostname: API_HOST,
      port: API_PORT,
      path,
      method: req.method,
      headers: Object.assign(req.headers, headers),
      rejectUnauthorized: false
    },
    proxy_res => {
      res.writeHead(proxy_res.statusCode, proxy_res.headers);
      proxy_res.pipe(
        res,
        { end: true }
      );
      let tempBuf = [];
      proxy_res.on("data", data => {
        tempBuf.push(data);
      });
      proxy_res.on("end", () => {
        cache.set(
          path,
          {
            headers: proxy_res.headers,
            data: Buffer.concat(tempBuf)
          },
          60
        ); // 1min
      });
      proxy_res.on("error", console.error);
    }
  );
  req.pipe(
    proxy,
    { end: true }
  );
}
/** Assume using legacy nodejs http/https */
const handler = (req, res) => {
  const path = req.url;
  cache.get(path, (err, val) => {
    if (err) console.error(err);
    if (!val) {
      sendProxy(req, res, cache);
      console.warn("Not Using cache.");
    } else {
      console.log("Using cache.");
      // Write head
      // Write body
      res.writeHead(200, val.headers);
      res.end(val.data.toString());
    }
  });
};

const server = http.createServer(handler).on("error", console.error);

server.listen(PORT, () =>
  console.log("start proxy at :", server.address().port)
);
