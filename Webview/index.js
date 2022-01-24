const init = async () => {
    
    // Update index.html as page loads...

    const status = `status:<br/>&nbsp;&nbsp;`;
    const cursor = `<span class="cursor">&nbsp;&block;<span>`;
    
    // Get the current tip height while waiting for the next ws = ...options: ['blocks'] to push...

    const { bitcoin: { blocks } } = mempoolJS({ hostname: 'mempool.space' });
    const blocksTipHeight = await blocks.getBlocksTipHeight();
    document.getElementById("block_height").textContent = JSON.stringify(blocksTipHeight, undefined, 2);

    // ... and grab the current block's data, hash, etc.

    if (blocks){
        const hash = await blocks.getBlocksTipHash();
        const blockNow = await blocks.getBlock({ hash });
        document.getElementById("block_data").textContent = "block: " + JSON.stringify(blockNow, undefined, 2).replace(/[^a-zA-Z0-9 \.\:\[\]\r\n\r\n]/g, "");
        clearTimeout(checkcnx); // Trash the looping page reload (checkcnx is first defined in index.html)
    }

    // Open websocket...

    const { bitcoin: { websocket } } = mempoolJS({ hostname: 'mempool.space' });
    const ws = websocket.initClient({ options: ['blocks', 'stats'], }); // Other available options ['blocks', 'stats', 'mempool-blocks', 'live-2h-chart']
    document.getElementById("status").innerHTML = status + "connecting to mempool.space" + cursor;
    
    // Do something if internet connection is interrupted...

    window.addEventListener('offline', function() {
                            const checkcnx = setTimeout(function(){
                                                        location.reload();
                                                    }, 10000);
                            document.getElementById("status").innerHTML = status + "connection offline" + cursor;
                            });
    
    // Render data...
    
    ws.addEventListener('message', function incoming({data}) {
                        const pushdata = JSON.parse(data.toString());
                        
                        document.getElementById("status").innerHTML = status + "connected to <a href='https://mempool.space/'>mempool.space</a>";
                        
                        // Push data arrives from const ws = ...options: ['blocks']. approx. every 5~15 minutes.
                        
                        if (pushdata.block) {
                        document.getElementById("block_height").textContent = JSON.parse(pushdata.block.height);
                        document.getElementById("block_data").textContent = "block: " + (JSON.stringify(pushdata.block, undefined, 2)).replace(/[^a-zA-Z0-9 \.\:\[\]\r\n\r\n]/g, "");
                        }
                        
                        // Push data arrives from const ws = ...options: ['stats'], approx. every 5 seconds.
                        
                        if (pushdata.transactions) {
                        var i = 0;
                        var k = Object.keys(pushdata.transactions).length;
                        var t = 5000 / k;
                        // Debug incremental ticker, if it keeps working without errors, eventually delete this comment.
                        // If the websocket hiccups – sends an empty JSON? – txticker setInterval gets it's knickers twisted.
                        // console.log(
                        //            "data: ", pushdata.transactions,
                        //            "keys: ", k,
                        //            );
                                if (k >= 1) {
                                        const txticker = setInterval(function(){
                                                                     // ... part of above debug.
                                                                     // console.log(
                                                                     //             "i = ", i,
                                                                     //             "k = ", k,
                                                                     //             );
                                                                     var ticker1 = pushdata.transactions[i].txid;
                                                                     var ticker2 = (pushdata.transactions[i].value / 100000000);
                                                                     var ticker3 = pushdata.transactions[i].fee;
                                                                     var ticker4 = pushdata.transactions[i].vsize;
                                                                     document.getElementById("txid_alt").textContent = ticker1;
                                                                     document.getElementById("txid").textContent = "txid: " + ticker1;
                                                                     document.getElementById("value").textContent = "value: " + ticker2 + " BTC";
                                                                     document.getElementById("fee").textContent = "fee: " + ticker3 + " sats";
                                                                     document.getElementById("vsize").textContent = "size: " + ticker4 + " vBytes";
                                                                     document.getElementById("mempool_info").textContent = "mempool: " + (JSON.stringify(pushdata.mempoolInfo, undefined, 2)).replace(/[^a-zA-Z0-9 \.\:\[\]\r\n\r\n]/g, "");
                                                                     if (i === (k - 1)) {let i = 0; clearInterval(txticker);} else {i++;};
                                                                    }, t);
                                } else {
                                        clearInterval(txticker);
                                }

                        }
                        });
};
init();
