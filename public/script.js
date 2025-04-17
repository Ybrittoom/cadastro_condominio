const API_URL = 'http://localhost:3000/api/moradores' // esse /api vem do app.use('/api', ...)

async function listarMoradores() {
    const res = await fetch(API_URL)
    const data = await res.json()
    console.log('Resposta da API:', data)
    const lista = document.getElementById('listaMoradores')
    lista.innerHTML = ''

    if (Array.isArray(data)) {
        data.forEach(m => {
            const li = document.createElement('li')
            li.innerHTML = `
                ${m.nome} (${m.idade} anos) - Apartamento ${m.ape}
                <button onclick="remover(${m.id})">Remover</button>
                <button onclick='editar(${JSON.stringify(m)})'>Editar</button>
            `
            lista.appendChild(li)
        })
    } else {
        console.error('Resposta inválida da API:', data)
    }
}

document.getElementById('formCadastro').addEventListener('submit', async (e) => {
    e.preventDefault()
    const form = e.target
    const formData = new FormData(form)
    const dados = Object.fromEntries(formData.entries())
    dados.idade = parseInt(dados.idade)
    dados.sexo = parseInt(dados.sexo)
    dados.bloco = parseInt(dados.bloco)
    dados.andar = parseInt(dados.andar)
    dados.ape = parseInt(dados.ape)

    //verificar se e ediçao ou novo
    if (form.dataset.editando === 'true') {
        await fetch(`${API_URL}/${form.dataset.idEditando}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json'}, 
            body: JSON.stringify(dados)
        })
        form.dataset.editando = 'false'
        form.dataset.idEditando = ''
    } else {
        await fetch(API_URL, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(dados)
        })
    }

    form.reset()
    listarMoradores()
})

async function remover(id) {
    if (confirm('Tem certeza que deseja remover este morador?')) {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
        listarMoradores()
    }
}

function editar(morador) {
    const form = document.getElementById('formCadastro')
    Object.keys(morador).forEach(key => {
        if (form.elements[key]) form.elements[key].value = morador[key]
    })
    form.dataset.editando = 'true'
    form.dataset.idEditando = morador.id

}

listarMoradores()

