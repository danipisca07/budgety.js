var budgetController = (function() {
    return {}
})();

var UIController = (function() {
    return {}
})();

var controller = (function(budgetCtrl, UICtrl) {

    var ctrlAddItem = function() {
        //Ottieni input
        //Aggiungi al budget controller
        //Aggiungi alla UI
        //Calcola budget
        //Mostra il budget
    }

    //Aggiunta voce di budget
    document.querySelector(".add__btn").addEventListener("click", ctrlAddItem);
    
    document.addEventListener("keypress", function(event){
        if(event.keyCode === 13 || event.which === 13){ //Enter
            ctrlAddItem();
        }
    });

    return {}
})(budgetController, UIController);