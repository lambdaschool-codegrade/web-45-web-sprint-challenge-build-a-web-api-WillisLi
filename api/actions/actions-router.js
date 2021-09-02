const express = require('express');
const Actions = require('./actions-model');
const router = express.Router();

router.get('/', (req, res) => {
    Actions.get()
        .then(actions => {
            if (!actions) {
                res.status(200).json([])
            } else {
                res.status(200).json(actions)
            }
        })
        .catch(error => {
            res.status(404).json({ message: 'could not find actions'})
        })
})
 
router.get('/:id', (req, res) => {
    const actionId = req.params.id;
    Actions.get(actionId)
        .then(action => {
            if (action) {
                res.status(200).json(action);
            } else {
                res.status(404).json( {message: "cannot find action with given id"} )
            }
        })
        .catch(error => {
            res.status(404).json({ message: 'could not find actions'})
        })
})

router.post('/', (req, res, next) => {
    const newAction = req.body;
    if (!newAction.notes || !newAction.description || !newAction.completed || !newAction.project_id) {
        res.status(400).json( {message: "missing body requirements"})
    } else {
        Actions.insert(newAction)
            .then(insertedAction => {
                res.status(201).json(insertedAction)
            })
            .catch(next);
    }
})

router.put('/:id', (req, res, next) => {
    const actionId = req.params.id;
    const updatedAction = req.body;
    if (!updatedAction.notes || !updatedAction.description || !updatedAction.completed || !updatedAction.project_id) {
        res.status(400).json( {message: "missing body requirements"})
    } else {
        Actions.update(actionId, updatedAction)
            .then(insertedAction => {
                if (insertedAction) {
                    res.status(201).json(insertedAction)
                } else {
                    res.status(404).json( {message: "action could not be found with given id"} )
                }
            })
            .catch(next);
    }
})

router.delete('/:id', (req, res, next) => {
    const actionId = req.params.id;
    Actions.remove(actionId)
        .then(deletedAction => {
            if (deletedAction) {
                res.status(200).json()
            } else {
                res.status(404).json( {message: "action could not be found with given id"} )
            }
        })
        .catch(next);
}) 
 
module.exports = router;