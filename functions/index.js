const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });
const Admin = require("firebase-admin")
const fetch = require('node-fetch');

Admin.initializeApp();

// exports.saveEachBreweryFromGooglePlacesToFirestore = functions.https.onRequest(async (req, res) 

exports.saveAllBrewriesFromCityFromGooglePlacesToFirestore = functions.https.onRequest(async (req, res) => {
    await cors(req, res, async () => {
        const db = Admin.firestore()
        let data = [];
        const getData = (nextPageToken) => {
            let city = 'austin';

            if (nextPageToken.length > 2) {
                // console.log('NEXT PAGE TOKEN', jsonDa)

                let url = 'https://maps.googleapis.com/maps/api/place/textsearch/json?query=breweries+in+' + city + '&key=AIzaSyDRUpBESMbs6306QTg9QeIvQmbhApYl2Qw&pagetoken=';
                url = url.concat(nextPageToken);
                console.log(url)
                const getAllBrewries = fetch(url)
                    .then(data => data.json())
                    .then(async (jsonData) => {
                        console.log(jsonData)
                        let array = [];
                        await jsonData.results.forEach((item) => {
                            let obj = {
                                address: item.formatted_address,
                                position: { lat: item.geometry.location.lat, lng: item.geometry.location.lng },
                                place_id: item.place_id,
                                name: item.name,
                                rating: item.rating
                            }
                            data.push(obj);
                        })
                        //   await data.push(array);
                        // console.log(jsonData)
                        // await console.log(jsonData.next_page_token, '---2')
                        // await console.log(jsonData, 'JSONDATA')


                        if (jsonData.next_page_token) {
                            await setTimeout(() => {
                                getData(jsonData.next_page_token);
                            }, 2000);
                            // throw(err);
                        } else {
                            res.status(200).json({
                                data: data
                            })
                            return;
                        }
                    })
            } else {
                const getAllBrewries = fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=breweries+in+${city}&key=AIzaSyDRUpBESMbs6306QTg9QeIvQmbhApYl2Qw`)
                    .then(data => data.json())
                    .then(async (jsonData) => {
                        // console.log(jsonData, 'next')
                        let array = [];
                        await jsonData.results.forEach((item) => {
                            let obj = {
                                address: item.formatted_address,
                                position: { lat: item.geometry.location.lat, lng: item.geometry.location.lng },
                                place_id: item.place_id,
                                name: item.name,
                                rating: item.rating
                            }
                            data.push(obj);
                        })
                        //   await data.push(array);
                        //  await console.log(jsonData.next_page_token, '---1')
                        console.log('Helllllloooooo')
                        console.log(data, '<-------- data')

                        await db.collection('AllBreweries').doc('Cities')
                            .collection('Austin').doc('Breweries')
                            .set({ data: data })
                            .then((result) => {
                                console.log(result, '<------ resultttt')
                            })

                        // if (jsonData.next_page_token) {
                        //     console.log('Helllllloooooo2')
                        //     console.log(data, '<-------- data2')
                        //     console.log('NEXT PAGE TOKEN 2', jsonData.next_page_token)
                        //     await setTimeout(() => {
                        //         getData(jsonData.next_page_token);
                        //     }, 2000);
                        //     // await ;
                        //     // throw(err);                  

                        // } else {
                        //     console.log('Helllllloooooo3')
                        //     console.log(data, '<-------- data3')
                        //     res.status(200).json({
                        //         data: data
                        //     })
                        //     return;
                        // }

                    })
            }

            return;

            // const getAllBrewriesJson = await getAllBrewries.json();
            // console.log(getAllBrewriesJson, '235253')
        }
        await getData('a');
        // await db.collection('Cities').doc('Austin')
        //     .collection('Breweries').doc('-AllBreweries')
        //     .set({ data: data })
        //   await res.status(200).json({
        //       data: data
        //   })      
    })
});