var budgetController = (function() {
    return {}
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
        console.log("OK");
        var input = UICtrl.getInput(); //Ottieni input
        //Aggiungi al budget controller
        //Aggiungi alla UI
        //Calcola budget
        //Mostra il budget
    }

    //Aggiunta voce di budget
    document.querySelector(UICtrl.DOMstrings.inputButton).addEventListener("click", ctrlAddItem);

    document.addEventListener("keypress", function(event){
        if(event.keyCode === 13 || event.which === 13){ //Enter
            ctrlAddItem();
        }
    });

    return {}
})(budgetController, UIController);