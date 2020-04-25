var budgetController = (function() {

    var Expense = function(id, description, value) { //Function constructor
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
    }

    var addItem = function(type, des, val){
        var newItem, ID;
        if(data.allItems[type].length > 0)
            ID = data.allItems[type][data.allItems[type].length-1].id +1; //Crea nuovo id (last +1)
        else
            ID = 0;

        //Crea nuovo oggetto
        if (type === "exp"){
            newItem = new Expense(ID, des, val);
        } else if (type === "inc"){
            newItem = new Income(ID, des, val);
        }

        //Aggiunge all'array
        data.allItems[type].push(newItem);
        return newItem;
    };

    return {
        addItem: addItem,
    }
})();

var UIController = (function() {
    var DOMstrings = {
        inputType: ".add__type",
        inputDescription: ".add__description",
        inputValue: ".add__value",
        inputButton: ".add__btn",
        incomeContainer: ".income__list",
        expenseContainer: ".expenses__list",
    }

    var addListItem = function(obj, type) {
        var html, newHtml, element;

        //Template html da inserire
        if(type === 'inc'){
            element = DOMstrings.incomeContainer;
            html = `<div class="item clearfix" id="income-%id%">
                <div class="item__description">%description%</div>
                <div class="right clearfix"><div class="item__value">%value%</div>
                <div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i>
                <button></div></div></div>`;
        }
        else if(type === 'exp'){
            element = DOMstrings.expenseContainer;
            html = `<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div>
                <div class="right clearfix"><div class="item__value">%value%</div>
                <div class="item__percentage">21%</div><div class="item__delete">
                <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`;
        }

        //Sostituisco gli identificatori nel template sopra
        newHtml = html.replace('%id%', obj.id);
        newHtml = newHtml.replace('%description%', obj.description);
        newHtml = newHtml.replace('%value%', obj.value);
        
        //Inserisco il nuovo HTML come child dell'elemento
        document.querySelector(element).insertAdjacentHTML('beforeend', newHtml); 
    };

    var clearFields = function() {
        var fields, fieldsArray;
        fields = document.querySelectorAll(DOMstrings.inputDescription + ", "+ DOMstrings.inputValue);
        fieldsArray = Array.prototype.slice.call(fields); //Converte da stringa a array
        fieldsArray.forEach(function (currentEl, index, readOnlyArray){ //Cicla sull'array
            currentEl.value = ""; //Pulisce il campo
        });
        fieldsArray[0].focus(); //Imposta il focus sul primo campo da ricompilare
    };


    return {
        getInput: function(){
            return {
                type : document.querySelector(DOMstrings.inputType).value, //inc o exp
                description : document.querySelector(DOMstrings.inputDescription).value,
                value : parseFloat(document.querySelector(DOMstrings.inputValue).value),
            }
        },
        DOMstrings: DOMstrings,
        clearFields: clearFields,
        addListItem: addListItem,        
    }
})();

var controller = (function(budgetCtrl, UICtrl) {

    var ctrlAddItem = function() {
        var input, newItem;
        input = UICtrl.getInput(); //Ottieni input
        if(input.description !== "" && !isNaN(input.value) && input.value > 0){ // Input check
            newItem = budgetCtrl.addItem(input.type, input.description, input.value); //Aggiungi al budget controller
            UIController.addListItem(newItem,input.type); //Aggiungi alla UI
            UIController.clearFields(); //Pulisce gli input
            //Calcola budget
            //Mostra il budget
        }
    }

    
    var updateBudget = function () {
        //Calcola budget
        //Mostra il budget sulla UI
    }

    var setupEventListeners = function() {

        document.querySelector(UICtrl.DOMstrings.inputButton).addEventListener("click", ctrlAddItem);

        document.addEventListener("keypress", function(event){
            if(event.keyCode === 13 || event.which === 13){ //Enter
                ctrlAddItem();
            }
        });
    }
    
    return {
        init: function() {
            setupEventListeners();
        },
        ctrlAddItem: ctrlAddItem,
        updateBudget: updateBudget,
    }
})(budgetController, UIController);

controller.init();