module.exports = {
    createUser: (req, res) => {
        console.log('device in user controller');
        const db = req.app.get('db');
        const {device_id, token} = req.body;

        console.log('creating the user');
        console.log('device_id ', device_id);

        db.createUser(device_id, token).then((data)=>res.status('200').send(data)).catch((error)=> {
            console.log(error)
        })
    },
    addTime: (req, res) => {
        console.log('device_time');
        const db = req.app.get('db');
        const {device_time, device_id} = req.body;

        console.log('adding time now');

        db.addTime(device_time, device_id).then((data)=>res.status('200').send(data)).catch((error)=> {
            console.log('error ', error)
        })
    },
    getTime: (req, res) => {
        const db = req.app.get('db');
        const {device_id} = req.params;

        console.log('device ', device_id);

        db.getTime(device_id).then((data)=>res.status('200').send(data)).catch((error)=> {
            console.log('error ', error)
        })
    },
    getTokens: (req, res) => {
        const db = req.app.get('db');
        const {device_id} = req.params;

        console.log('device ', device_id);
        db.getTime(device_id).then((data)=>res.status('200').send(data)).catch((error)=> {
            console.log(error)
        })
    }
}
