## PTX-server (Open transport data api platform in Taiwan 🇹🇼)

A proxy server for [Public Transport Data eXchange](https://.ptx.transportdata.tw)

Features:

- [Authorization](https://ptxmotc.gitbooks.io/ptx-api-documentation/content/api/HMac.html)
- In memory cache
  - Authorization token for [5 min](https://ptxmotc.gitbooks.io/ptx-api-documentation/content/api/HMac.html)
  - Each api endpoint for [30 seconds](https://gist.github.com/ptxmotc/383118204ecf7192bdf96bc0197bb981)
- Deployment with [now.sh](https://zeit.co/now)

For more information & guide:

- [ptx-api-documentation](https://ptxmotc.gitbooks.io/ptx-api-documentation/content/) in Traditional Chinese

Deploy example:

```bash
# With now.sh
$now -e APP_ID="YOUR_APP_ID" -e APP_KEY="YOUR_APP_KEY"

# Without now.sh
$APP_ID="YOUR_APP_ID" APP_KEY="YOUR_APP_KEY" node index.js

# Test
$http "localhost:$PORT/MOTC/v2/Rail/TRA/Station?$top=10&$format=JSON"
$curl "localhost:$PORT/MOTC/v2/Rail/TRA/Station?$top=10&$format=JSON"
```
