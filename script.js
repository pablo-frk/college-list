// Função para adicionar um aluno
const addPeople = async () => {
    let studentName = document.getElementById('student-name').value;
    let collegeName = document.getElementById('college-select').value;

    if (studentName && collegeName) {
        try {
            const response = await fetch('http://localhost:3000/add-student', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    studentName: studentName,
                    collegeName: collegeName
                })
            });

            if (!response.ok) {
                throw new Error('Erro na requisição: ' + response.statusText);
            }

            // Se o backend retornar JSON, utilize isso:
            const data = await response.json();
            console.log(data); // Verifique o conteúdo da resposta

            // Atualiza a lista de alunos
            updateList();

            // Limpa os campos de entrada
            document.getElementById('student-name').value = '';
            document.getElementById('college-select').value = '';

        } catch (error) {
            console.error('Erro ao enviar dados:', error);
        }
    } else {
        alert('Por favor, preencha todos os campos.');
    }
};

// Função para atualizar a lista de alunos
const updateList = async () => {
    try {
        const response = await fetch('http://localhost:3000/students');
        if (!response.ok) {
            throw new Error('Erro ao buscar lista de alunos');
        }

        const students = await response.json();
        console.log('Dados recebidos do servidor:', students); // Depuração para verificar os dados recebidos

        const listElement = document.getElementById('listPeople');
        listElement.innerHTML = ''; // Limpa a lista atual

        // Verifica se `students` é um objeto
        if (typeof students === 'object') {
            for (let college in students) {
                let collegeDiv = document.createElement('div');
                collegeDiv.classList.add('mb-4');

                let collegeTitle = document.createElement('h3');
                collegeTitle.textContent = college;
                collegeTitle.classList.add('text-xl', 'font-bold');
                collegeDiv.appendChild(collegeTitle);

                let list = document.createElement('ol');
                list.classList.add('list-decimal', 'pl-5');

                students[college].forEach(student => {
                    // Verifica se `student` é uma string ou objeto
                    if (typeof student === 'string') {
                        // Se for string, assume que o nome é o conteúdo e o ID não está presente
                        let listItem = document.createElement('li');
                        listItem.textContent = student;
                        listItem.classList.add('mb-1');
                        list.appendChild(listItem);
                    } else if (typeof student === 'object' && student.studentName && student.id) {
                        // Se for objeto, usa o nome e ID
                        let listItem = document.createElement('li');
                        listItem.textContent = student.studentName; // Adiciona o nome do aluno
                        listItem.classList.add('mb-1');

                        // Adiciona um atributo `data-id` ao item da lista
                        listItem.setAttribute('data-id', student.id);
                        list.appendChild(listItem);
                    } else {
                        console.error('Formato inesperado do aluno:', student);
                    }
                });

                collegeDiv.appendChild(list);
                listElement.appendChild(collegeDiv);
            }
        } else {
            console.error('Formato inesperado da resposta: students não é um objeto');
        }
    } catch (error) {
        console.error('Erro ao atualizar a lista:', error);
    }
};


// Função para resetar a lista
const resetList = async () => {
    const password = prompt('Digite a senha para resetar a lista:');
  
    if (password === 'frk2805') {
      try {
        const response = await fetch('http://localhost:3000/reset-students', {
          method: 'DELETE',
        });
  
        if (response.ok) {
          alert('Lista resetada com sucesso!');
          updateList(); // Atualiza a lista após o reset
        } else {
          alert('Erro ao resetar a lista.');
        }
      } catch (error) {
        console.error('Erro ao enviar requisição de reset:', error);
        alert('Erro ao resetar a lista.');
      }
    } else {
      alert('Senha incorreta.');
    }
  };
  
  
  // Adicionar evento ao botão de reset
  document.getElementById('reset-button').addEventListener('click', resetList);
  
// Chama a função updateList para inicializar a lista na página
updateList();
