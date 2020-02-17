const se_scraper = require('se-scraper');
const axios = require('axios');


// var results = null;

// while(true) {

// cities = ['OAKLAND', 'SAN LEANDRO', 'PLEASANTON', 'DUBLIN']

const args = process.argv.slice(2)

console.log(args[0])
console.log(args[1])

if(args[0] && args[1]){
  params = { county: args[0], limit:10000, offset:args[1] }
}
else if(args[0]){
 params = {limit:10000, offset:args[0] }
}
else{
  params = {limit:100}
}

axios.post('https://protected-peak-85531.herokuapp.com/get_100_addresses', params )
    .then(function (response) {
      addresses = response.data;
      console.log(addresses)
      

      while(addresses.length > 0){
        temp_addr = []
        if(addresses.length > 100){
          temp_addr = addresses.slice(0,100);
          addresses = addresses.slice(100, -1);
        }
        else{
          temp_addr = addresses.slice(0,-1);
          addresses = []
        }

        console.log("*"*100)

        console.log(temp_addr)

        console.log("$"*100)




        address_id_object = {}
        

        for (var i = 0; i < temp_addr.length; i++) {
          address_id_object[temp_addr[i]["address"]] = temp_addr[i]["id"]
        }

        console.log(address_id_object)

        keywords = []
        for(var k in address_id_object) keywords.push(k);


        (async () => {
          let scrape_job = {
              search_engine: 'bing',
              keywords: keywords,
              num_pages: 1,
          };

          var scraper = new se_scraper.ScrapeManager();
          scraper.start();

          var results = se_scraper.scrape({}, scrape_job);

          console.dir(results, {depth: null, colors: true});

          scraper.quit();

          


          console.log("**********************")

          final_data = {}



          for(var i=0; i< keywords.length; i++){
            if(results["results"][keywords[i]]['1']['results'].length > 0){
              final_data[address_id_object[keywords[i]]] = results["results"][keywords[i]]['1']['results']
            }
          }

          console.log(final_data)


          axios.post('https://protected-peak-85531.herokuapp.com/save_100_addresses', { 'final_data':final_data })
          .then(function (response) {
            console.log(response)
          })
          .catch(function (error) {
              console.log("Proabably not a valid city");
          });


        })();



      };


  })
    .catch(function (error) {
        console.log(error);
        console.log("Proabably not a valid city");
    });

