const router = require('express').Router();
let validateJWT = require("../middleware/validate-jwt");
const { LogModel } = require('../models');

/*
/
POST Request
Create Log
*/

router.post('/', validateJWT, async (req, res) => {
    const { description, definition, result } = req.body.log;
    const { id } = req.user
    const logEntry = {
        description,
        definition,
        result,
        owner_id: id
    }
    try {
        const newLog = await LogModel.create(logEntry);
        res.status(200).json(newLog);
    } catch(err) {
        res.status(500).json({error: err});
    }
});

/*
/
GET request
Gets all logs for an individual user
*/

router.get('/', validateJWT, async (req, res) => {
    let { id } = req.user
    try {
        const userLogs = await LogModel.findAll({ where: { owner_id: id } });
    res.status(200).json(userLogs);
    } catch (err) {
        res.status(500).json({ error : err });
    }
});

/*
/:id
Get request
Gets all logs by id for an individual user
*/

router.get('/:id', async(req,res) => {
    const { id } = req.params;
    try {
        const results = await LogModel.findAll({
            where: {
                id: id
            }
        });
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({error:err});
    }
});

/*
/:id
PUT request
Allows individuals logs to be updated by a user
*/

router.put('/:id', validateJWT, async (req, res) => {
    const { description, definition, result } = req.body.log;
    const logId = req.params.id;
    const userId = req.user.id;
    

    const query = {
        where: {
            id: logId,
            owner_id: userId
        }
    };
    
    const updatedLog = {
        description: description,
        definition: definition,
        result: result
    };

    try {
        const update = await LogModel.update(updatedLog, query);
        res.status(200).json({
            message: `Log Entry ${logId} has been updated`
        });
    } catch (err) {
        res.status(500).json({
            message: `${err}`
        });
    }
});

/*
/:id
DELETE request
Allows individuals logs to be deleted by a user
*/

router.delete('/:id', validateJWT, async (req, res) => {
    const ownerId = req.user.id;
    const logId = req.params.id;

    try {
        const query = {
        where: {
        id: logId,
        //owner_id: ownerId
        }
        };
        await LogModel.destroy(query);
        res.status(200).json({message: `Log Entry ${logId} Destroyed 4 Ever`});
    } catch (err) {
        res.status(500).json({error: err});
    }
});

module.exports = router