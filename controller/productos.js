const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const indexProducto = {};
const Producto = require('../models/producto');
const Categoria = require('../models/categoria');
const Usuario = require('../models/usuario');

indexProducto.productosGet = async(req = request, res = response) => {
    
    //const productos = await Producto.find({}).lean();

    const productos = await Producto.aggregate(
        
        [
            {$match:
                {
                    estado:true
                }
            },
            {
                $lookup:
                {
                    from:"usuarios",
                    localField:"usuario",
                    foreignField:"_id",
                    as: "producto_usuario"
                }

            },
            { 
                $unwind: "$producto_usuario"
            },
            {
                $lookup:
                {
                    from:"categorias",
                    localField:"categoria",
                    foreignField:"_id",
                    as: "categoria_usuario"
                }

            },
            { 
                $unwind: "$categoria_usuario"
            },
        ]
    );
    //console.log(categoriasFunc)
    //console.log(productos); 

    res.render('productos/listproducts',{productos});
}

indexProducto.productoPost = async(req, res = response) => {

    const categorias = await Categoria.find({}).lean();
    const usuarios = await Usuario.find({}).lean();
    res.render('productos/newproduct',{categorias,usuarios});
}
indexProducto.productoCreate = async(req, res) => {
    
    const { nombre,estado,usuario,precio,categoria,descripcion,img} = req.body

    const producto = new Producto({nombre,estado,usuario,precio,categoria,descripcion,img})
    //console.log(req.body)
    await producto.save();
    res.redirect('/productos')
    
}
indexProducto.editproducto = async (req,res) =>{
    const producto= await Producto.findById(req.params.id).lean();
    //console.log(producto)
    const usuarios =  await Usuario.find({}).lean();
    const categorias =  await Categoria.find({}).lean();

    res.render('productos/edit',{producto,usuarios,categorias})
}

indexProducto.productoPut = async(req, res = response) => {
    
    await Producto.findByIdAndUpdate( req.params.id,req.body);

    res.redirect("/productos")
}

indexProducto.productoPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - usuariosPatch'
    });
}

indexProducto.productosDelete = async(req, res = response) => {

    const { id } = req.params;

    // Fisicamente lo borramos
    const producto = await Producto.findByIdAndDelete( id );

    //const usuario = await Usuario.findByIdAndUpdate( id, { estado: false } );
    res.redirect('/productos');

    //res.json(usuario);
}
module.exports = indexProducto;