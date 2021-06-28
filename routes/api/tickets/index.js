const express = require('express');
const router = express.Router();
const { getAllFacet, addOne, addNota, cerrarTicket, evaluarTicket, capturarTicket, getById, getAllFacetSortByAge, getByUserFacet, getByHolderFacet } = require('./tickets.model');

router.get(
    "/:estado/:page",
    async (req, res)=>{
        try
        {
            let {estado, page} = req.params;
            let rows = await getAllFacet(estado, page);
            res.status(200).json(rows);
        }
        catch(ex)
        {
            res.status(500).json({"msg":"Error"});
        }
    }
);

router.get(
    "/ticketsage/:estado/:page",
    async (req, res)=>{
        try
        {
            let {estado, page} = req.params;
            let rows = await getAllFacetSortByAge(estado, page);
            res.status(200).json(rows);
        }
        catch(ex)
        {
            res.status(500).json({"msg":"Error"});
        }
    }
);

router.get(
    "/ticketsbyuser/:identidad/:estado/:page",
    async (req, res)=>{
        try
        {
            let {identidad, estado, page} = req.params;
            let rows = await getByUserFacet(identidad, estado, page);
            res.status(200).json(rows);
        }
        catch(ex)
        {
            res.status(500).json({"msg":"Error"});
        }
    }
);

router.get(
    "/ticketsbyholder/:identidad/:estado/:page",
    async (req, res)=>{
        try
        {
            let {identidad, estado, page} = req.params;
            let rows = await getByHolderFacet(identidad, estado, page);
            res.status(200).json(rows);
        }
        catch(ex)
        {
            res.status(500).json({"msg":"Error"});
        }
    }
);


router.get(
    "/ticketbyid/:id",
    async (req, res)=>{
        try
        {
            let {id} = req.params;
            let row = await getById(id);
            res.status(200).json(row);
        }
        catch(ex)
        {
            res.status(500).json({ "msg": "Error" });
        }
    }
);

router.post(
    "/new",
    async (req, res)=>{
        try
        {
            let { tipo, observacion, servicio, identidad, nombre, correo, estado } = req.body;
            let docInserted = await addOne(tipo, observacion, servicio, identidad, nombre, correo, estado);
            res.status(200).json(docInserted);
        }
        catch(ex)
        {
            res.status(500).json({"msg":"Error"});
        }
    }
);

router.put(
    "/addnota/:id",
    async (req, res)=>{
        try
        {
            const {id} = req.params;
            const { observacion, accion, identidad, nombre, correo } = req.body;
            let result = await addNota(id, observacion, accion, identidad, nombre, correo);
            res.status(200).json(result);
        }
        catch(ex)
        {
            res.status(500).json({ "msg": "Error" });
        }
    }
);

router.put(
    "/cerrar/:id",
    async (req, res)=>{
        try
        {
            const {id} = req.params;
            const { identidad, nombre, correo, tipoCierre } = req.body;
            let result = await cerrarTicket(id, identidad, nombre, correo, tipoCierre);
            res.status(200).json(result);
        }
        catch(ex)
        {
            res.status(500).json({ "msg": "Error" });
        }
    }
);

router.put(
    "/evaluar/:id",
    async (req, res)=>{
        try
        {
            const {id} = req.params;
            const { eficiencia, satisfaccion, conformidad } = req.body;
            let _eficiencia = parseInt(eficiencia);
            let _satisfaccion = parseInt(satisfaccion);
            let _conformidad = parseInt(conformidad);

            let result = await evaluarTicket(id, _eficiencia, _satisfaccion, _conformidad);
            res.status(200).json(result);
        }
        catch(ex)
        {
            res.status(500).json({ "msg": "Error" });
        }
    }
);

router.put(
    "/capturar/:id",
    async (req, res)=>{
        try
        {
            const {id} = req.params;
            const { identidad, nombre, correo } = req.body;
            let result = await capturarTicket(id, identidad, nombre, correo);
            res.status(200).json(result);
        }
        catch(ex)
        {
            res.status(500).json({ "msg": "Error" });
        }
    }
);

module.exports = router;
