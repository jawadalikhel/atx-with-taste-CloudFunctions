const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });
const Admin = require("firebase-admin")
const fetch = require('node-fetch');

Admin.initializeApp();

exports.saveAllBrewriesFromCityFromGooglePlacesToFirestore = functions.https.onRequest(async (req, res) => {
    await cors(req, res, async () => {
        const db = Admin.firestore()
        let data = [];
        const city = 'austin';
        const getAllBrewries = fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=breweries+in+${city}&key=AIzaSyDRUpBESMbs6306QTg9QeIvQmbhApYl2Qw`)
            .then(data => data.json())
            .then(async (jsonData) => {
                // console.log('jsonData ------->>>> ', jsonData)

                let array = [];
                await jsonData.results.forEach((item) => {
                    // console.log(item, '<----- ITEMMMMMM')
                    let obj = {
                        address: item.formatted_address,
                        position: { lat: item.geometry.location.lat, lng: item.geometry.location.lng },
                        place_id: item.place_id,
                        name: item.name,
                        rating: item.rating
                    }
                    data.push(obj);
                })

                console.log(data, '<----- DATAAAAA')

                await db.collection('Cities').doc('Austin')
                    .collection('Breweries').doc('-AllBreweries')
                    .set({ data: data })
            })
    })
});

// exports.saveAllBrewriesFromCityFromGooglePlacesToFirestore = functions.https.onRequest(async (req, res) => {
//     await cors(req, res, async () => {
//         const db = Admin.firestore()
//         let data = [];
//         // const getData = (nextPageToken) => {
//         let city = 'austin';

//         const getAllBrewries = fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=breweries+in+${city}&key=AIzaSyDRUpBESMbs6306QTg9QeIvQmbhApYl2Qw`)
//             .then(data => data.json())
//             .then(async (jsonData) => {
//                 console.log('jsonData ------->>>> ', jsonData)
// let array = [];
// await jsonData.results.forEach((item) => {
//     console.log(item, '<----- ITEMMMMMM')
//     let obj = {
//         address: item.formatted_address,
//         position: { lat: item.geometry.location.lat, lng: item.geometry.location.lng },
//         place_id: item.place_id,
//         name: item.name,
//         rating: item.rating
//     }
//     data.push(obj);
// })

// console.log(data, '<----- DATAAAAA')

// if (nextPageToken.length > 2) {
// console.log('NEXT PAGE TOKEN', jsonDa)

// let url = 'https://maps.googleapis.com/maps/api/place/textsearch/json?query=breweries+in+' + city + '&key=AIzaSyDRUpBESMbs6306QTg9QeIvQmbhApYl2Qw&pagetoken=';
// url = url.concat(nextPageToken);
// console.log(url)
// const getAllBrewries = fetch(url)
//     .then(data => data.json())
//     .then(async (jsonData) => {
//         console.log(jsonData)
//         let array = [];
//         await jsonData.results.forEach((item) => {
//             let obj = {
//                 address: item.formatted_address,
//                 position: { lat: item.geometry.location.lat, lng: item.geometry.location.lng },
//                 place_id: item.place_id,
//                 name: item.name,
//                 rating: item.rating
//             }
//             data.push(obj);
//         })
//   await data.push(array);
// console.log(jsonData)
// await console.log(jsonData.next_page_token, '---2')
// await console.log(jsonData, 'JSONDATA')
// await db.collection('Cities').doc('Austin')
//     .collection('Breweries').doc('-AllBreweries')
//     .set({ data: data })

// if (jsonData.next_page_token) {
//     await setTimeout(() => {
//         getData(jsonData.next_page_token);
//     }, 2000);
//     // throw(err);
// } else {
//     res.status(200).json({
//         data: data
//     })
//     return;
// }
// })
// } 
// else {
// const getAllBrewries = fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=breweries+in+${city}&key=AIzaSyDRUpBESMbs6306QTg9QeIvQmbhApYl2Qw`)
//     .then(data => data.json())
//     .then(async (jsonData) => {
//         console.log('jsonData ------->>>> ', jsonData)
//         let array = [];
//         await jsonData.results.forEach((item) => {
//             console.log(item, '<----- ITEMMMMMM')
//             let obj = {
//                 address: item.formatted_address,
//                 position: { lat: item.geometry.location.lat, lng: item.geometry.location.lng },
//                 place_id: item.place_id,
//                 name: item.name,
//                 rating: item.rating
//             }
//             data.push(obj);
//         })

//         console.log(data, '<----- DATAAAAA')

//   await data.push(array);
//  await console.log(jsonData.next_page_token, '---1')

// if (jsonData.next_page_token) {
//     console.log('NEXT PAGE TOKEN 2', jsonData.next_page_token)
//     await setTimeout(() => {
//         getData(jsonData.next_page_token);
//     }, 2000);
//     // await ;
//     // throw(err);                  

// } else {
//     res.status(200).json({
//         data: data
//     })
//     return;
// }

// })
// }

// return;

// const getAllBrewriesJson = await getAllBrewries.json();
// console.log(getAllBrewriesJson, '235253')
// }
// await getData('a');
// await db.collection('Cities').doc('Austin')
// .collection('Breweries').doc('-AllBreweries')
// .set({ data: data })
// await res.status(200).json({
// data: data
// })      
// })
// });



exports.saveEachBreweryFromGooglePlacesToFirestore = functions.https.onRequest(async (req, res) => {
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
});