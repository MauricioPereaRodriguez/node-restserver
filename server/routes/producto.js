const express = require('express');
let { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');
let Producto = require('../models/producto');
let app = express();


//=================================================================================
//  Mostrar todos las productos
//=================================================================================
app.get('/producto', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(limite)
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Producto.count({ disponible: true }, (err, total) => {
                res.json({
                    ok: true,
                    productos,
                    total
                })
            })
        })
});

//=================================================================================
//  Mostrar una producto por ID
//=================================================================================
app.get('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Producto.findById(id, (err, productoDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                return res.status(404).json({
                    ok: false,
                    err: {
                        message: `Producto con id ${id} no encontrado`
                    }
                });
            }

            res.status(201).json({
                ok: true,
                producto: productoDB
            });
        }).sort('nombre')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
});

//=================================================================================
//  Mostrar una producto por ID
//=================================================================================
app.get('/producto/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                productos
            })
        })

});

//=================================================================================
//  Crear una nueva producto
//=================================================================================
app.post('/producto', verificaToken, (req, res) => {

    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    });
});

//=================================================================================
//  Edita una producto
//=================================================================================
app.put('/producto/:id', [verificaToken, verificaAdminRole], (req, res) => {
    let id = req.params.id;

    let body = req.body;

    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: `Producto con id ${id} no encontrado`
                }
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    })
});

//=================================================================================
// Borra una catergoria
//=================================================================================
app.delete('/producto/:id', [verificaToken, verificaAdminRole], (req, res) => {

    let id = req.params.id;

    let cambiaEstadoDisponible = {
        disponible: false
    };

    // CAMBIA EL ESTADO DISPONIBLE DEL PRODUCTO EN LA BASE DE DATOS
    Producto.findByIdAndUpdate(id, cambiaEstadoDisponible, { new: true, runValidators: true }, (err, ProductoBorrado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!ProductoBorrado) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: `Producto con id ${id} no encontrado`
                }
            });
        }

        res.json({
            ok: true,
            producto: ProductoBorrado
        });
    })
});



module.exports = app;