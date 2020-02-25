const puppeteer = require('puppeteer');
const axios = require('axios');

const args = process.argv.slice(2)

if(args[0]){
 params = {offset:args[0]}
}
else{
  params = {}
}

axios.post('https://protected-peak-85531.herokuapp.com/get_3_yelp_links', params)
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
        
        if(links[i]["yelp_link"] && links[i]["yelp_link"].includes("biz")){
          console.log(links[i]["yelp_link"]);
          const page = await browser.newPage();
          await page.goto(links[i]["yelp_link"], {waitUntil: 'networkidle2'});
          const html = await page.content();
          axios.post('https://protected-peak-85531.herokuapp.com/save_yelp_data', { 'id': links[i]["id"], 'html':html })
          .then(function (response) {
            // console.log(response)
          })
          .catch(function (error) {
              // console.log("Something went wrong");
          });
        }
        else{
          console.log("empty")
          axios.post('https://protected-peak-85531.herokuapp.com/save_yelp_data', { 'id': links[i]["id"], 'html':'empty' })
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



