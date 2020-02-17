const se_scraper = require('se-scraper');
const axios = require('axios');


// var results = null;

// while(true) {

// cities = ['OAKLAND', 'SAN LEANDRO', 'PLEASANTON', 'DUBLIN']

const args = process.argv.slice(2)

console.log(args[0])
console.log(args[1])

if(args[0] && args[1]){
  params = { county: args[0], limit:100, offset:args[1] }
}
else if(args[0]){
 params = {limit:100, offset:args[0] }
}
else{
  params = {limit:100}
}

axios.post('https://protected-peak-85531.herokuapp.com/get_100_addresses', params )
    .then(function (response) {
      addreses = response.data;
      console.log(addreses)
      var keywords = [];
      for(var k in addreses) keywords.push(k);

      (async () => {
        let scrape_job = {
            search_engine: 'bing',
            keywords: keywords,
            num_pages: 1,
        };

        var results = await se_scraper.scrape({}, scrape_job);

        console.dir(results, {depth: null, colors: true});

        


        console.log("**********************")

        final_data = {}



        for(var i=0; i< keywords.length; i++){
          if(results["results"][keywords[i]]['1']['results'].length > 0){
            final_data[addreses[keywords[i]]] = results["results"][keywords[i]]['1']['results']
          }
        }

        console.log(final_data)

        if(!(Object.entries(final_data).length === 0 && final_data.constructor === Object)){
          axios.post('https://protected-peak-85531.herokuapp.com/save_100_addresses', { 'final_data':final_data })
          .then(function (response) {
            console.log(response)
          })
          .catch(function (error) {
              console.log("Proabably not a valid city");
          });
        }


      })();

  })
    .catch(function (error) {
        console.log(error);
        console.log("Proabably not a valid city");
    });

