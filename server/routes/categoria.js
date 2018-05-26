const express = require('express');
let { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');
let Categoria = require('../models/categoria');
let app = express();


//=================================================================================
//  Mostrar todas las categorias
//=================================================================================
app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Categoria.count({}, (err, total) => {
                res.json({
                    ok: true,
                    categorias,
                    total
                })
            })
        })
});

//=================================================================================
//  Mostrar una categoria por ID
//=================================================================================
app.get('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: `Categoria con id ${id} no encontrado`
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    })
});

//=================================================================================
//  Crear una nueva categoria
//=================================================================================
app.post('/categoria', verificaToken, (req, res) => {

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

//=================================================================================
//  Edita una categoria
//=================================================================================
app.put('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {
    let id = req.params.id;

    let body = req.body;

    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: `Categoria con id ${id} no encontrado`
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    })
});

//=================================================================================
// Borra una catergoria
//=================================================================================
app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {

    let id = req.params.id;

    // BORRAMOS LA CATEGORIA DE LA BASE DE DATOS
    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoriaBorrada) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: `Categoria con id ${id} no encontrado`
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaBorrada
        });
    })
});



module.exports = app;