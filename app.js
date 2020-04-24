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

    return {
        addItem: function(type, des, val){
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
        }
    }
})();

var UIController = (function() {
    var DOMstrings = {
        inputType: ".add__type",
        inputDescription: ".add__description",
        inputValue: ".add__value",
        inputButton: ".add__btn",
    }

    return {
        getInput: function(){
            return {
                type : document.querySelector(DOMstrings.inputType).value, //inc o exp
                description : document.querySelector(DOMstrings.inputDescription).value,
                value : document.querySelector(DOMstrings.inputValue).value,
            }
        },
        DOMstrings: DOMstrings,
    }
})();

var controller = (function(budgetCtrl, UICtrl) {

    var ctrlAddItem = function() {
        var input, newItem;
        input = UICtrl.getInput(); //Ottieni input
        newItem = budgetCtrl.addItem(input.type, input.description, input.value); //Aggiungi al budget controller
        //Aggiungi alla UI
        //Calcola budget
        //Mostra il budget
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
        }
    }
})(budgetController, UIController);

controller.init();