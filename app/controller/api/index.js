const express = require('express');
const router = express.Router();

// API routes
router.get('', function (req, res) {

    console.warn("call to GET api");

    const user = (req.user && req.user.username) || 'anonymous';

    console.warn(req.query);
    const { source, slice } = req.query;

    req.app.db.findAnnotations({
        fileID : `${source}&slice=${slice}`,
        user : user
    })
        .then(annotations=>res.status(200).send(annotations))
        .catch(e=>res.state(500).send({err:JSON.stringify(e)}))
});

router.post('', function (req, res) {

    console.warn("call to POST api");

    if(req.body.action === 'save') {
        const { source, slice, Hash, annotation } = req.body;

        const user = (req.user && req.user.username) || 'anonymous';

        req.app.db.updateAnnotation({
            fileID : `${source}&slice=${slice}`,
            user,
            Hash,
            annotation
        })
            .then(() => res.status(200).send())
            .catch((e) => res.status(500).send({err:JSON.stringify(e)}));
    }else{
        res.status(500).send({err:'actions other than save are no longer supported.'});
    }
});

module.exports = router;