import Proyecto from "../Models/Proyecto.js"
import Usuario from "../Models/Usuario.js"

const obtenerProyectos = async ( req, res ) => {
    const proyectos = await Proyecto.find({
        '$or' : [
            {'colaboradores': { $in: req.usuario}},
            {'creador': { $in: req.usuario}},
        ],
    })
        .select('-tareas')

    res.json(proyectos)
}

const nuevoProyecto = async ( req, res ) => {
    const proyecto = new Proyecto(req.body)
    proyecto.creador = req.usuario._id

    try {
        const proyectoAlmacenado = await proyecto.save();
        res.json(proyectoAlmacenado)
    } catch (error) {
        console.log(error)
    }
}

const obtenerProyecto = async ( req, res ) => {
        const { id } = req.params;

        try {
            const proyecto = await Proyecto.findById(id)
            .populate({ 
                path: 'tareas', 
                populate: { path: 'completado', select: 'nombre'}})
            .populate('colaboradores', 'nombre email')
            if (proyecto.creador.toString() !== req.usuario._id.toString() 
                && !proyecto.colaboradores.some( 
                colaborador => colaborador._id.toString() === req.usuario._id.toString())) {
                const error = new Error('Acción no válida')
                return res.status(401).json({msg: error.message})
            }

            res.json(proyecto)
    
        } catch (error) {
            error = new Error('No encontrado')
            return res.status(404).json({msg: error.message})
        }

        
}
const editarProyecto = async ( req, res ) => {
    const { id } = req.params;

    
    try {
        const proyecto = await Proyecto.findById(id);
        
        if (proyecto.creador.toString() !== req.usuario._id.toString() ) {
            const error = new Error('Acción no válida')
            return res.status(401).json({msg: error.message})
        }

        proyecto.nombre = req.body.nombre || proyecto.nombre;
        proyecto.descripcion = req.body.descripcion || proyecto.descripcion;
        proyecto.fechaEntrega = req.body.fechaEntrega || proyecto.fechaEntrega;
        proyecto.cliente = req.body.cliente || proyecto.cliente;
        
            try {
                const proyectoAlmacenado = await proyecto.save()
                 res.json(proyectoAlmacenado)
            } catch (error) {
                console.log(error)
            }

    } catch (error) {
        error = new Error('Proyecto no encontrado')
        return res.status(404).json({msg: error.message})
    }
   
}
const eliminarProyecto = async ( req, res ) => {
    const { id } = req.params;

        
    try {
        const proyecto = await Proyecto.findById(id);

        if (proyecto.creador.toString() !== req.usuario._id.toString() ) {
            const error = new Error('Acción no válida')
            return res.status(401).json({msg: error.message})
        }

        try {
            await proyecto.deleteOne();
            res.json({msg: 'Proyecto Eliminado'})
        } catch (error) {
            console.log(error)
        }

    } catch (error) {
        error = new Error('Proyecto no encontrado')
        return res.status(404).json({msg: error.message})
    }
}
const buscarColaborador = async ( req, res ) => {
    const { email } = req.body;

    const usuario = await Usuario.findOne({email}).select('-confirmado -createdAt -password -token -updatedAt -__v')

    if (!usuario) {
        const error = new Error('Usuario no encontrado')
        return res.status(404).json({ msg: error.message});
    }

    res.json(usuario)

}
const agregarColaborador = async ( req, res ) => {

   const proyecto = await Proyecto.findById(req.params.id)

   if(!proyecto) {
       const error = new Error('Proyecto no Encontrado')
       return res.status(404).json(error.message)
   }
   if(proyecto.creador.toString() !== req.usuario._id.toString()){
        const error = new Error('Accion no Válida')
        return res.status(404).json(error.message)
   }

   const { email } = req.body;

    const usuario = await Usuario.findOne({email}).select('-confirmado -createdAt -password -token -updatedAt -__v')

    if (!usuario) {
        const error = new Error('Usuario no encontrado')
        return res.status(404).json({ msg: error.message});
    }

    // ver que el colaborador no es el admin del proyecto
    if( proyecto.creador.toString() === usuario._id.toString()) {
        const error = new Error('El creador del proyecto no puede ser colaborador')
        return res.status(404).json({ msg: error.message});
    }
    
    //Revisar que no este ya agregado el colaborador al proyecto
    if (proyecto.colaboradores.includes(usuario._id)) {
        const error = new Error('El usuario ya pertenece al Proyecto')
        return res.status(404).json({ msg: error.message});
    }

    //Esta bien, se puede agregar
    proyecto.colaboradores.push(usuario._id)
    await proyecto.save()
    res.json({msg: 'Colaborador Agregado Correctamente'})

}
const eliminarColaborador = async ( req, res ) => {
    const proyecto = await Proyecto.findById(req.params.id)

    if(!proyecto) {
        const error = new Error('Proyecto no Encontrado')
        return res.status(404).json(error.message)
    }
    if(proyecto.creador.toString() !== req.usuario._id.toString()){
         const error = new Error('Accion no Válida')
         return res.status(404).json(error.message)
    }

    //Esta bien, se puede eliminar
    proyecto.colaboradores.pull(req.body.id)
    await proyecto.save()
    res.json({msg: 'Colaborador Eliminado Correctamente'})

}


export { 
         obtenerProyectos,
         nuevoProyecto,
         obtenerProyecto,
         editarProyecto,
         eliminarProyecto,
         buscarColaborador,
         agregarColaborador,
         eliminarColaborador
        }
