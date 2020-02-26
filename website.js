const puppeteer = require('puppeteer');
const axios = require('axios');

const args = process.argv.slice(2)

if(args[0]){
 params = {offset:args[0]}
}
else{
  params = {}
}

axios.post('https://protected-peak-85531.herokuapp.com/get_100_root_links', params)
  .then(function (response) {
    links = response.data;

    console.log(links);

    // for (var i = 0; i < links.length; i++) {
    //   // console.log(links[i])
    //   link = links[i]["yelp_link"]
    //   console.log(link)

    (async () => {
      const browser = await puppeteer.launch();

      for (var i = 0; i < links.length; i++) {
        console.log(links[i]["link"]);

        try{
          const page = await browser.newPage();
          await page.goto(links[i]["link"], {waitUntil: 'networkidle2'});
          const html = await page.content();
          axios.post('https://protected-peak-85531.herokuapp.com/save_website_content', { 'id': links[i]['id'], 'html':html })
          .then(function (response) {
            // console.log(response)
          })
          .catch(function (error) {
              // console.log("Something went wrong");
          });
        }
        catch(err){
          axios.post('https://protected-peak-85531.herokuapp.com/save_website_content', { 'id': links[i]['id'], 'html':'error' })
          .then(function (response) {
            // console.log(response)
          })
          .catch(function (error) {
              // console.log("Something went wrong");
          });
        }
        
      }

      

      await browser.close();
    })();
    // }

  })
  .catch(function (error) {
      console.log(error);
      console.log("Proabably not a valid city");
  });



