const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const indexCategoria = {};
const Categoria = require('../models/categoria');
const Usuario = require('../models/usuario');

indexCategoria.categoriasGet = async(req = request, res = response) => {
    
    //const categorias = await Categoria.find({}).lean();
    //console.log(usuarios)

    const categorias = await Categoria.aggregate(
        
        [
            {$match:{estado:true}},
            {
                $lookup:
                {
                    from:"usuarios",
                    localField:"usuario",
                    foreignField:"_id",
                    as: "categoria_usuario"
                }
            },
            { $unwind: "$categoria_usuario"}
        ]
    );
    //console.log(categorias)
    res.render('categorias/listCategory',{categorias});
}

indexCategoria.categoriaPost = async(req, res = response) => {
    const collecctionUsuario =  await Usuario.find({}).lean();
    res.render('categorias/NewCategory',{collecctionUsuario});
}
indexCategoria.categoriaCreate = async(req, res) => {
    
    
    //console.log(categorias)
    
    //console.log(req.body)
    const { nombre, estado, usuario} = req.body;
    //console.log(categorias);

    

    const categoria = new Categoria({ nombre, estado, usuario });
    //console.log(categoria);
    // Guardar en BD
    await categoria.save();
    res.redirect('/categorias');
    
   //console.log(categorias)
    
}
indexCategoria.editCategoria = async (req,res) =>{
    const categoria= await Categoria.findById(req.params.id).lean();
    /*const categoria = await Categoria.aggregate(
        
        [
            {
                $lookup:
                {
                    from:"usuarios",
                    localField:"usuario",
                    foreignField:"_id",
                    as: "categoria_usuario"
                }
            },
            { $unwind: "$categoria_usuario"}
        ]
    );
    //console.log(categoria)*/
    const collecctionUsuario =  await Usuario.find({}).lean();

    res.render('categorias/edit',{categoria,collecctionUsuario});
}

indexCategoria.categoriaPut = async(req, res = response) => {
    
    //const id = req.params;
    //const {nombre,estado,usuario} = req.body;
    /*const { _id, password, google, correo, ...resto } = req.body;

    if ( password ) {
        // Encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt );
    }*/
    //console.log(id)
    //console.log(req.body)
    await Categoria.findByIdAndUpdate( req.params.id,req.body);

    res.redirect("/categorias")
}

indexCategoria.categoriaPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - usuariosPatch'
    });
}

indexCategoria.categoriasDelete = async(req, res = response) => {

    const { id } = req.params;

    // Fisicamente lo borramos
    const categoria = await Categoria.findByIdAndDelete( id );

    //const usuario = await Usuario.findByIdAndUpdate( id, { estado: false } );
    res.redirect('/categorias');

    //res.json(usuario);
}
module.exports = indexCategoria;