const express = require('express')
const app = express()
const mysql = require('mysql');
const randomString = require('random-string-gen');
const data = {
    port : 3000,
    host : '',
    user : '',
    password : '',
    database : ''
}

let db = mysql.createPool({
    host     : data.host,
    user     : data.user,
    password : data.password,
    database : data.database,
});

db.query(`CREATE TABLE IF NOT EXISTS \`hastebin\` (\`link\` varchar(8) NOT NULL, \`code\` LONGTEXT NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8;`)

app.use(express.urlencoded({ extended: false }))
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('index', { title: 'Hastebin Clone', code: "" })
})

app.post('/', (req, res) => {
    let code = req.body.code
    let link = randomString(8)

    db.query(`INSERT INTO \`hastebin\` (\`link\`, \`code\`) VALUES ('${link}', '${code.replace(/'/g, '\\\'')}')`, (err, result) => {
        if(err) return console.log(err)
    })
    res.redirect(`/${link}`)
})

app.get('/:link', (req, res) => {
    let link = req.params.link
    db.query(`SELECT * FROM \`hastebin\` WHERE \`link\` = '${link}'`, (err, result) => {
        if(err) return res.send(err)

        if(result.length == 0) return res.render('index', { title: `Hastebin - ${link}`, code: "LINK INVÁLIDO" })

        res.render('index', { title: 'Hastebin Clone', code: result[0].code })
    })
})

app.listen(data.port, () => {
    console.log(`Hastebin disponível em http://localhost:${data.port}`)
})