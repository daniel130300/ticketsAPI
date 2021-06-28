const MongoDB = require('../../utilities/db');
const { ObjectId } = require('mongodb').ObjectID;

let db;
let helpDeskCollection;

(async function(){
    try
    {
      if (!helpDeskCollection)
      {
        db = await MongoDB.getDB();
        helpDeskCollection = db.collection("helpDesk");
        if(process.env.ENSURE_INDEX == 1)
        {
          
        }
      }
    }
    catch(ex)
    {
      console.log(ex);
      process.exit(1);
    }
})();

module.exports.getAll = async ()=>{
    try 
    {
        let docsCursor = helpDeskCollection.find({});
        let rows = await docsCursor.toArray()
        return rows;
    } 
    catch(ex)
    {
        console.log(ex);
        throw(ex);
    }
}

module.exports.addOne = async (tipo, observacion, servicio, identidad, nombre, correo, estado)=>{
    try
    {
        let datetime = new Date();

        let newHelpDesk = 
        {
            fecha: datetime,
            tipo: tipo,
            observacion: observacion,
            servicioAfectado: servicio,

            usuario: 
            {
                identidad: identidad,
                nombre: nombre,
                correo: correo
            },

            holder:
            {
                identidad: null,
                nombre: null,
                correo: null,
            },

            estado: estado,

            notas:[],
            fechaCierre: null,

            usuarioCierre: 
            {
                identidad: null,
                nombre: null,
                correo: null
            }, 

            tipoCierre: null,

            evaluacion:
            {
                eficiencia: null,
                satisfaccion: null,
                conformidad: null
            }
        }

        let result = await helpDeskCollection.insertOne(newHelpDesk);
        return result.ops;
    }
    catch(ex)
    {
        console.log(ex);
        throw(ex);
    }
}

module.exports.addNota = async (id, observacion, accion, identidad, nombre, correo) =>{
    try 
    {
        const _id = new ObjectId(id);
        const filter = {"_id": _id};
        let datetime = new Date();
        const updateObj = 
        {
            "$push":
            {   
                "notas":
                {
                    fecha: datetime,
                    observacion: observacion,
                    accion: accion,
                    usuario: 
                    {
                      identidad: identidad,
                      nombre: nombre,
                      correo: correo
                    }
                }
            }
        };

        let result = await helpDeskCollection.updateOne(filter, updateObj);
        return result;
    } 
    catch(ex) 
    {
        console.log(ex);
        throw(ex);
    }
}

module.exports.cerrarTicket = async (id, identidad, nombre, correo, tipoCierre) => {
    try 
    {
        const _id = new ObjectId(id);
        const filter = { "_id": _id };
        let datetime = new Date();
        const updateObj = 
        {
            "$set":
            {   
                "estado":"CLE",
                "fechaCierre": datetime,
                "usuarioCierre": 
                {
                    identidad: identidad,
                    nombre: nombre,
                    correo: correo
                },
                "tipoCierre": tipoCierre
            }
        };
        let result = await helpDeskCollection.updateOne(filter, updateObj);
        return result;
    } 
    catch (ex) 
    {
        console.log(ex);
        throw (ex);
    }
}

module.exports.evaluarTicket = async (id, eficiencia, satisfaccion, conformidad) => {
    try 
    {
        const _id = new ObjectId(id);
        const filter = { "_id": _id };
        const updateObj = 
        {
            "$set":
            {   
                "evaluacion":
                {
                    eficiencia: eficiencia,
                    satisfaccion: satisfaccion,
                    conformidad: conformidad
                } 
            }
        };

        let result = await helpDeskCollection.updateOne(filter, updateObj);
        return result;
    } 
    catch (ex) 
    {
        console.log(ex);
        throw (ex);
    }
}

module.exports.capturarTicket = async (id, identidad, nombre, correo) => {
    try 
    {
        const _id = new ObjectId(id);
        const filter = { "_id": _id };
        const updateObj = 
        {
            "$set":
            {   
                "holder":
                {
                    identidad: identidad,
                    nombre: nombre, 
                    correo: correo
                } 
            }
        };

        let result = await helpDeskCollection.updateOne(filter, updateObj);
        return result;
    } 
    catch (ex) 
    {
        console.log(ex);
        throw (ex);
    }
}

module.exports.getById = async (id)=>{
    try 
    {
        const _id = new ObjectId(id);
        const filter =  {_id: _id};
        let row = await helpDeskCollection.findOne(filter);
        return row;
    } 
    catch(ex)
    {
        console.log(ex);
        throw(ex);
    }
}

module.exports.getAllFacet = async (estado, page) => {

    const itemsPerPage = 25;

    try 
    {
        let options = 
        {
            skip: (page - 1) * itemsPerPage,
            limit: itemsPerPage
        };

        const filter =  {estado: estado};    
        
        let docsCursor = helpDeskCollection.find(filter, options);
        let rownum = await docsCursor.count();
        let rows = await docsCursor.toArray()
        return {rownum, rows, page};  
    } 
    catch (ex) 
    {
      console.log(ex);
      throw (ex);
    }
}

module.exports.getAllFacetSortByAge = async (estado, page) => {

    const itemsPerPage = 25;

    try 
    {
        let options = 
        {
            skip: (page - 1) * itemsPerPage,
            limit: itemsPerPage,
            sort:[["fecha", -1]]
        };

        const filter =  {estado: estado};    
        
        let docsCursor = helpDeskCollection.find(filter, options);
        let rownum = await docsCursor.count();
        let rows = await docsCursor.toArray()
        return {rownum, rows, page};  
    } 
    catch (ex) 
    {
      console.log(ex);
      throw (ex);
    }
}

module.exports.getByUserFacet= async (identidad, estado, page) => {

    const itemsPerPage = 25;

    try 
    {
        let options = 
        {
            skip: (page - 1) * itemsPerPage,
            limit: itemsPerPage,
            sort:[["fecha", -1]]
        };

        const filter =  {estado: estado, "usuario.identidad": identidad};    
        
        let docsCursor = helpDeskCollection.find(filter, options);
        let rownum = await docsCursor.count();
        let rows = await docsCursor.toArray()
        return {rownum, rows, page};  
    } 
    catch (ex) 
    {
      console.log(ex);
      throw (ex);
    }
}

module.exports.getByHolderFacet= async (identidad, estado, page) => {

    const itemsPerPage = 25;

    try 
    {
        let options = 
        {
            skip: (page - 1) * itemsPerPage,
            limit: itemsPerPage,
            sort:[["fecha", -1]]
        };

        const filter =  {estado: estado, "holder.identidad": identidad};    
        
        let docsCursor = helpDeskCollection.find(filter, options);
        let rownum = await docsCursor.count();
        let rows = await docsCursor.toArray()
        return {rownum, rows, page};  
    } 
    catch (ex) 
    {
      console.log(ex);
      throw (ex);
    }
}