require('isomorphic-fetch')

//fetch price Coingecko
async function fetchPrice_coingecko(name) {
  const name_l = name.toLowerCase();
  //const url='https://api.coingecko.com/api/v3/simple/price?ids='+name_l+'&vs_currencies=usd';

  const url = 'https://api.coingecko.com/api/v3/coins/' + name_l + '/market_chart?vs_currency=usd&days=1&interval=daily'

  let priceInfo = null;
  await fetch(url).then(function(response) {
    return response.json();
  }).then(function(res_data) {
    priceInfo = res_data;
  }).catch(function(err) {
    console.log('Fetch Error :-S');
    throw err;
  });

  if (!priceInfo) { return; }

  const currentprice = parseFloat(priceInfo['prices'][1][1]).toFixed(12);

  return { price: currentprice, change: "" }
}


//Jupiter fetch price
async function fetchPrice(symbol) {

  const url = 'https://price.jup.ag/v1/price?id=' + symbol
  /*
  for BNB tokens use url below. replace symbol with a mint address
  const url='https://api.pancakeswap.info/api/v2/tokens/'+symbol
  */
  let priceInfo = null;
  await fetch(url).then(function(response) {
    return response.json();
  }).then(function(res_data) {
    priceInfo = res_data;
  }).catch(function(err) {
    console.log('Fetch Error :-S');
    throw err;
  });

  if (!priceInfo) { return; }
  if (!priceInfo.data) { return; }
  if (!priceInfo.data.price) { return; }

  return { price: priceInfo.data.price, change: "" }
}


//update the bot
async function updateBot(inputs, client) {

  let guilds = client.guilds.cache.map(x => x.id);

  for (let guild_id of guilds) {

    try {
      let guild = client.guilds.cache.get(guild_id)

      let member = guild.members.cache.get(client.user.id)

      if (inputs.USE_COINGECKO_PRICING) {
        let priceinfo = await fetchPrice_coingecko(inputs.TOKEN_NAME);
        member.setNickname("$ " + priceinfo.price);


      } else {
        let priceinfo = await fetchPrice(inputs.TOKEN_SYMBOL)
        member.setNickname("$ " + priceinfo.price);
        client.user.setActivity(inputs.WATCHING, { type: 'WATCHING' })
      }
    } catch (e) {
      console.log(e)
    }
  }

  return
}

module.exports = {
  updateBot
}
