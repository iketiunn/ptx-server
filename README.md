```
# With now.sh
$now -e V1_APP_ID="YOUR_V1_APP_ID" -e V1_APP_KEY="YOUR_V1_APP_KEY" -e V2_APP_ID="YOUR_V2_APP_ID" -e V2_APP_KEY="YOUR_V2_APP_KEY"

# With out now.sh
$V1_APP_ID="YOUR_V1_APP_ID" V1_APP_KEY="urf3-YOUR_V1_APP_KEY" V2_APP_ID="YOUR_V2_APP_ID" V2_APP_KEY="urf3-YOUR_V2_APP_KEY" node index

# Test
$http "localhost:$PORT/MOTC/v2/Rail/TRA/Station?$top=10&$format=JSON"
$curl "localhost:$PORT/MOTC/v2/Rail/TRA/Station?$top=10&$format=JSON"
```
