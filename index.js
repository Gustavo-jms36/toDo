const express = require('express');
const path = require('path');
const fs = require('fs/promises')

const app = express();

app.use(express.json());

const jsonPath = path.resolve('./file/toDos.json');

app.get('/tasks', async (req, res) => {
    //Obtener el json
    const jsonFile = await fs.readFile(jsonPath, 'utf-8');
    //Enviar la respuesta
    res.send(jsonFile);
});

//CREACION DE TASKS DENTRO DEL JSON
app.post('/tasks', async (req, res) =>{
    //NOS ENVIAN LA INFORMACION DENTRO DEL BODY DE LA PETICION
    const todo = req.body;
    //OBTENER EL ARREGLO DESDE EL JSON FILE
    const todosArray = JSON.parse(await fs.readFile(jsonPath, 'utf-8'));
    //GENERAR UN NUEVO ID
    const lastIndex = todosArray.length - 1;
    const newId = todosArray[lastIndex].id + 1; 
    //AGREGAR LA TASKS EN EL ARREGLO
    todosArray.push({...todo, id: newId});
    //ESCRIBIR LA INFORMACION EN EL JASON
    await fs.writeFile(jsonPath, JSON.stringify(todosArray));
    res.end();
});


//ACTUALIZACION DE TODA LA INFORMACION DE LAS TASKS
//ENVIAR POR EL BODY EL ID DE LA TASKS A ACTUALIZAR
app.put('/tasks', async (req, res) => {
    //OBTENER EL ARREGLO DESDE EL JSON FILE
    const todosArray = JSON.parse(await fs.readFile(jsonPath, 'utf-8'));
    const {title, description, status, id} = req.body;
    //BUSCAR EL ID DE LA TASKS DENTRO DEL ARREGLO
    const todosIndex = todosArray.findIndex(todo => todo.id === id);
    if (todosIndex >= 0) {
        todosArray[todosIndex].title = title;
        todosArray[todosIndex].description = description;
        todosArray[todosIndex].status = status;
    }
    //ESCRIBIR LA INFORMACION EN EL JASON
    await fs.writeFile(jsonPath, JSON.stringify(todosArray));
    res.send('Tarea actualizada');
});


//ELIMINAR TASKS
app.delete('/tasks',async (req, res) => {
    //OBTENER EL ARREGLO DESDE EL JSON FILE
    const todosArray = JSON.parse(await fs.readFile(jsonPath, 'utf-8'));
    const { id } = req.body;
    // ENCONTRAR EL ID DE LA TASKS A ELIMINAR
    const todosIndex = todosArray.findIndex(todo => todo.id === id);
    // ELIMINAR DEL ARREGLO
    todosArray.splice(todosIndex, 1)
    // ESCRIBIR EL JSON
    await fs.writeFile(jsonPath, JSON.stringify(todosArray));
    res.end();
})


const PORT = 8000;

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
})