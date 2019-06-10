```
# With now.sh
$now -e APP_ID="YOUR_APP_ID" -e APP_KEY="YOUR_APP_KEY"

# With out now.sh
$APP_ID="YOUR_APP_ID" APP_KEY="urf3-YOUR_APP_KEY" node index

# Test
$http "localhost:$PORT/MOTC/v2/Rail/TRA/Station?$top=10&$format=JSON"
$curl "localhost:$PORT/MOTC/v2/Rail/TRA/Station?$top=10&$format=JSON"
```
