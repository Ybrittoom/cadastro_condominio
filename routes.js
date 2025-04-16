//routes.js
const express = require('express')
const router = express.Router()
const db = require('./db')

console.log('Tipo de db.query:', typeof db.query)


console.log('Arquivo DB carregado de:', require.resolve('./db'))

console.log('Tipo de db:', typeof db)
console.log('Tem função query?', typeof db.query)

// GET - Buscar todos os moradores + info do ape
router.get('/moradores', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT
                m.*,
                CASE m.sexo WHEN 1 THEN 'Masculino' ELSE 'Feminino' END AS sexo_formatado,
                a.apartamento, a.garagem
            FROM moradores m
            JOIN ape a ON m.bloco = a.bloco AND m.andar = a.andar AND m.ape = a.apartamento
            `)
        res.json(rows)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// POST - cadastrar novo morador
router.post('/moradores', async (req, res) => {
    const {
        nome,
        idade,
        email,
        telefone,
        cpf,
        sexo,
        estado_civil,
        bloco,
        andar,
        ape
    } = req.body
    try {
        const [result] = await db.query(`
            INSERT INTO moradores (
                nome,
                idade,
                email,
                telefone,
                cpf,
                sexo,
                estado_civil,
                bloco,
                andar,
                ape
            ) VALUES (
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                ?
            )`,
            [
                nome,
                idade,
                email,
                telefone,
                cpf,
                sexo,
                estado_civil,
                bloco,
                andar,
                ape
            ]
        )
        res.json({ id: result.insertId })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// PUT - Atualizar morador
router.put('/moradores/:id', async (req,  res) => {
    const { id } = req.params
    const { 
        nome,
        idade,
        email,
        telefone,
        cpf,
        sexo,
        estado_civil,
        bloco,
        andar,
        ape
    } = req.body
    try {
        await db.query(`
            UPDATE moradores SET
                nome = ?,
                idade = ?,
                email = ?,
                telefone = ?,
                cpf = ?,
                sexo = ?,
                estado_civil = ?,
                bloco = ?,
                andar = ?,
                ape = ?
            WHERE id = ?
            `,
            [
                nome,
                idade,
                email,
                telefone,
                cpf,
                sexo,
                estado_civil,
                bloco,
                andar,
                ape,
                id
            ]
        )
        res.json({ message: 'Morador atualizado com sucesso' })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// DELETE - Deletar morador
router.delete('/moradores/:id', async (req, res) => {
    const { id } = req.params 
    try {
        await db.query(`
            DELETE FROM moradores WHERE id = ?`, [id])
            res.json({ message: 'Morador deletado com sucesso'})
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

module.exports = router