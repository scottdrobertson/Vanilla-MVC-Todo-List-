window.onload = () => {
    let model = new Model();
    let view = new View();
    let controller = new Controller(model, view);
    controller.renderTitle();
    controller.renderInput();
    controller.renderTodoList();

   
}

class Model {
    constructor(){
        this.todoList = [{todo: "woah", id: 1, complete: false},
                         {todo: "beaches are crazy", id: 2, complete: false}
                        ]
    }

    //generic get function. returns todolist array.
    getTodoList(){
        return this.todoList;
    }

    //take string for a "todo" and place it as a property called todo inside a todo object
    //lots of todo in this comment, haha. tldr is string go in object.
    addTodo = (todo) => {
        if(todo.length === 0){
            todo = "Empty todo!"
        }
        if(this.todoList.length > 0){
            this.todoList.push({todo: todo, id: this.todoList[this.todoList.length - 1].id + 1, complete: false});
        }else{
            this.todoList.push({todo: todo, id: 1, complete: false});
        }
    }

    //set todoList to a filtered todo list excluding whatever object in the array matched the id that was passed in
    deleteTodo = (id) => {
        this.todoList = this.todoList.filter(todo => todo.id != id );

    }

    //map through array, put todo with matching id through the switcharoo to toggle true/false and reutrn it, if no matching id return as is
    changeCompleteProperty = (id) => {
        this.todoList = this.todoList.map(todo => {
            if(todo.id == id){
                if(todo.complete == false){
                    todo.complete = true;
                    return todo;
                }else if (todo.complete == true){
                    todo.complete = false;
                    return todo;
                }
            }else{
                return todo;
            }
        })
    }

    //map through array, update todo with matching id with newTodoText and then return. if id doesn't match, return as is.
    updateModel(newTodoText, id){

        this.todoList = this.todoList.map((item) => {
            if(item.id == id){
                item.todo = newTodoText
                return item;
            }else {
                return item;
            }
        })
        console.log("Model updated. New model is:");
        console.log(this.getTodoList());
    }
}

class View {
    constructor(){
        
    }

    //remove all children from DOM (app innerhtml ="")
    clearView(){
        let app = document.getElementById('app');
        app.innerHTML = "";
    }

    renderTitle(){ 
        let root = document.getElementById('root');
        let container = document.createElement('div');
        let logoText = document.createElement('p');

        container.setAttribute('id', 'header-container');
        logoText.setAttribute('class', 'header-text');
        logoText.setAttribute('id', 'logo-text');
        
        container.append(logoText);
        root.prepend(container);
    }
    
    //renders the input box and the add button for it at the top
    renderInput(handleAddEvent){
        
        //clear app children elements
        this.clearView();

        //creating elements
        let app = document.getElementById('app');
        let ul = document.createElement('ul');
        let inputContainer = document.createElement('div');
        let input = document.createElement('input');
        let addButton = document.createElement('button');

        //adding properties to addButton
        addButton.append('Add');
        addButton.setAttribute('class', 'button');
        addButton.setAttribute('id', 'add');
        addButton.addEventListener('mouseup', () => handleAddEvent(input.value)); //click event for add handled in controller

        //adding properties to input box
        input.setAttribute('type', 'text');
        input.setAttribute('id', 'todoInput');

        //set the ul id where todos will be rendered later
        ul.setAttribute('id', 'list');

        //add input and add button to div container
        inputContainer.append(input); 
        inputContainer.append(addButton);
        inputContainer.setAttribute('class', 'input-container');

        //append input container and ul to app 
        app.append(inputContainer);
        app.append(ul);
    }

    //renders the todo list, takes in copy of data in the model via the controller
    renderTodoList(todoList, handleDeleteEvent, handleCheckBoxEvent, handleEditEvent){
        //clear the list to be ready for appending
        let ul = document.getElementById('list');
        while(ul.firstChild){
            ul.removeChild(ul.firstChild);
        }
        
        //for each todo in the todoList passed in the function
        for(let i = 0; i < todoList.length; i++){
            
            //create elements
            let todoText = document.createElement('p');
            let li = document.createElement('li');
            let buttonContainer = document.createElement('div');
            let deleteButton = document.createElement('button');
            let editButton = document.createElement('button');
            let checkbox = document.createElement('input');
            
            //set checkbox properties
            checkbox.setAttribute('type', 'checkbox');
            checkbox.setAttribute('todo-id', todoList[i].id);
            checkbox.checked = todoList[i].complete;
            checkbox.addEventListener('mouseup', () => handleCheckBoxEvent(todoList[i].id))

            //set p element where the todo text is stored properties
            todoText.append(todoList[i].todo);
            todoText.setAttribute('complete', todoList[i].complete);
            todoText.setAttribute('contenteditable', false);
            todoText.setAttribute('p-id', todoList[i].id);
            

            //set edit button properties
            editButton.append('Edit');
            editButton.setAttribute('class', 'button');
            editButton.setAttribute('id', 'edit-btn');
            editButton.addEventListener('mouseup', () => {
                //even listener for mouse click
                //basically a toggle for the edit button to switch the element to be editable or not
                if(todoText.contentEditable == "true"){
                    todoText.setAttribute('contenteditable', false);
                    editButton.innerHTML = "Edit";
                    editButton.setAttribute('id', 'edit-btn');
                    handleEditEvent(todoText.innerText, todoList[i].id);
                } else if(todoText.contentEditable == "false"){
                    todoText.setAttribute('contenteditable', true);
                    editButton.setAttribute('id', 'save-btn');
                    editButton.innerHTML = "Save";
                    todoText.focus();
                    
                }
            });

            //delete button properties
            deleteButton.append('Delete');
            deleteButton.setAttribute('class', 'button');
            deleteButton.setAttribute('id', 'delete-btn');
            deleteButton.addEventListener('mouseup', () => handleDeleteEvent(todoList[i].id));

            buttonContainer.setAttribute('id', 'btn-container')

            //appending everything to DOM
            ul.append(li);
            li.append(todoText);
            li.append(buttonContainer);
            buttonContainer.append(checkbox);
            buttonContainer.append(editButton);
            buttonContainer.append(deleteButton);
        }
    }
}

class Controller {
    constructor(model, view){
        this.model = model;
        this.view = view;
        this.renderInput = () => {
            view.renderInput(this.handleAddEvent.bind(this));
        }
        
        //render each item in list
        this.renderTodoList = () => {
            //pass non-hot data to the view and Handler functions with Controller context bound to each
            view.renderTodoList(
                model.getTodoList(),
                this.handleDeleteEvent.bind(this),
                this.handleCheckBoxEvent.bind(this),
                this.handleEditEvent.bind(this)
            );
        }

        this.renderTitle = () => {
            view.renderTitle();
        }

    }
    

    //delete button clicked
    handleDeleteEvent(id){
        this.model.deleteTodo(parseInt(id));
        this.renderTodoList();
    }

    //check box clicked
    handleCheckBoxEvent(id){
        this.model.changeCompleteProperty(parseInt(id));
        this.renderTodoList();
    }

    //add button clicked
    handleAddEvent(todo){
        this.model.addTodo(todo);
        this.renderInput();
        this.renderTodoList();
    }

    //edit event clicked
    handleEditEvent(newTodoText, todoId){
        this.model.updateModel(newTodoText, todoId);
    }

    

}