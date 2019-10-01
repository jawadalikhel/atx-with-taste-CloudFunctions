// exports.myTestFunction = (req, res) => {
//     // let message = req.query.message || req.body.message || 'Hello World!';
//     res.set('Access-Control-Allow-Origin', "*")
//     res.set('Access-Control-Allow-Methods', 'GET, POST')

//     const message = {
//         msg: 'Hello gCloud function!'
//     }
//     res.status(200).send(message);
// };

const cors = require('cors')({ origin: true });
const Admin = require("firebase-admin")
const fetch = require('node-fetch');

Admin.initializeApp();


exports.saveBreweriesFromGooglePlacesToDB = async (req, res) => {
    await cors(req, res, async () => {
        const db = Admin.firestore()
        const getAllBreweries = await db.collection('Cities').doc('Austin')
            .collection('Breweries').doc('-AllBreweries')
            .onSnapshot(async (results) => {
                results = results.data().data
                // console.log(results)
                for (let i = 0; i < results.length; i++) {
                    await console.log(results[i])
                    await fetch('https://maps.googleapis.com/maps/api/place/details/json?placeid=' + results[i].place_id + '&fields=name,rating,formatted_phone_number,formatted_address,opening_hours,photos,place_id,price_level,reviews,website&key=AIzaSyDRUpBESMbs6306QTg9QeIvQmbhApYl2Qw')
                        .then((item) => {
                            item.json().then(async (data) => {
                                let photos = [];
                                console.log(data.result.name)
                                for (let i = 0; i < data.result.photos.length; i++) {
                                    let photo = data.result.photos[i];
                                    await setTimeout(async () => {
                                        await fetch('https://maps.googleapis.com/maps/api/place/photo?maxwidth=1000&photoreference=' + photo.photo_reference + '&key=AIzaSyDRUpBESMbs6306QTg9QeIvQmbhApYl2Qw')
                                            .then((doneR) => {
                                                doneR.json().then((item) => {
                                                    console.log(item)
                                                    photos.push(item);
                                                })
                                            })
                                    }, 2000);

                                }
                                data.result.photos = photos;
                                await db.collection('Cities').doc('Austin')
                                    .collection('Breweries').doc(data.result.name)
                                    .set(data.result)
                            })
                        })
                }
                //  await this.setState({
                //    brews: results
                //  })
                return results
            })
        return;
    })
    return;
};

// exports.fetchBreweries = async (req, res) => {
//     await cors(req, res, async () => {
//         let data = [];
//         const getData = (nextPageToken) => {
//             let city = 'austin';

//             if (nextPageToken.length > 2) {
//                 // console.log('NEXT PAGE TOKEN', jsonDa)

//                 let url = 'https://maps.googleapis.com/maps/api/place/textsearch/json?query=breweries+in+' + city + '&key=AIzaSyDRUpBESMbs6306QTg9QeIvQmbhApYl2Qw&pagetoken=';
//                 url = url.concat(nextPageToken);
//                 console.log(url)
//                 const getAllBrewries = fetch(url)
//                     .then(data => data.json())
//                     .then(async (jsonData) => {
//                         console.log(jsonData, '<------ jsonData')
//                         await data.push(jsonData);
//                         // console.log(jsonData)
//                         // await console.log(jsonData.next_page_token, '---2')
//                         // await console.log(jsonData, 'JSONDATA')


//                         if (jsonData.next_page_token) {
//                             await setTimeout(() => {
//                                 getData(jsonData.next_page_token);
//                             }, 2000);
//                             // throw(err);
//                         } else {
//                             res.status(200).json({
//                                 data: data
//                             })
//                             return;
//                         }
//                     })
//             } else {
//                 const getAllBrewries = fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=breweries+in+${city}&key=AIzaSyDRUpBESMbs6306QTg9QeIvQmbhApYl2Qw`)
//                     .then(data => data.json())
//                     .then(async (jsonData) => {
//                         console.log(jsonData, '<---- next jsonData')
//                         await data.push(jsonData)
//                         //  await console.log(jsonData.next_page_token, '---1')

//                         if (jsonData.next_page_token) {
//                             console.log('NEXT PAGE TOKEN 2', jsonData.next_page_token)
//                             await setTimeout(() => {
//                                 getData(jsonData.next_page_token);
//                             }, 2000);
//                             // await ;
//                             // throw(err);                  

//                         } else {
//                             res.status(200).json({
//                                 data: data
//                             })
//                             return;
//                         }

//                     })
//             }

//             return;

//             // const getAllBrewriesJson = await getAllBrewries.json();
//             // console.log(getAllBrewriesJson, '235253')
//         }
//         await getData('a');
//         //   await res.status(200).json({
//         //       data: data
//         //   })      
//     })
// };