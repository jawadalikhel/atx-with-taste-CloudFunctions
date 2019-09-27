exports.myTestFunction = (req, res) => {
    // let message = req.query.message || req.body.message || 'Hello World!';
    res.set('Access-Control-Allow-Origin', "*")
    res.set('Access-Control-Allow-Methods', 'GET, POST')

    const message = {
        msg: 'Hello gCloud function!'
    }
    res.status(200).send(message);
};