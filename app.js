var budgetController = (function() {

    var Expense = function(id, description, value) { //Function constructor
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function(totalIncome){
        if(totalIncome>0)
            this.percentage = Math.round((this.value / totalIncome) * 100);
        else
            this.percentage = -1;
    };

    Expense.prototype.getPercentage = function(){ return this.percentage; };

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
        },
        budget: 0,
        percentage: -1,
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

    var deleteItem = function(type, id){
        var ids, index;

        //Map funziona similmente al foreach ma per ogni elemento restituisco un elemento che voglio faccia parte dell'
        // array che la funzione map costruisce e restituisce
        ids = data.allItems[type].map(function (current){
            return current.id;
        });

        index = ids.indexOf(id); //restituisce -1 se non trova l'elemento cercato

        if(index !== -1)
        {
            data.allItems[type].splice(index,1); //Elimina gli elementi che partono dall'indice index e ne elimina 1 (numero del secondo param)
        }
        
    };

    var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(el){ //Cicla un tipo di spese e ne calcola la somma
            sum += el.value;
        });
        data.totals[type] = sum; //Aggiorna la somma per il tipo (inc/exp) nella struttura dati
    };

    var calculateBudget = function() {
        //Calcola entrare / uscite totali
        calculateTotal("exp");
        calculateTotal("inc");
        
        data.budget = data.totals.inc - data.totals.exp; //Calcola budget (entrate-uscite)
        if(data.totals.inc > 0){
            data.percentage = Math.floor((data.totals.inc / data.totals.exp)*100); //Calcola percentuale delle spese
        } else {
            data.percentage = -1;
        }
    }

    var calculatePercentages = function() {
        data.allItems.exp.forEach(function(current) {
            current.calcPercentage(data.totals.inc);
        });
    }

    var getPercentages = function(){
        var allPerc = data.allItems.exp.map(function (cur) {
            return cur.getPercentage();
        });
        return allPerc;
    }

    return {
        addItem: addItem,
        deleteItem: deleteItem,
        calculateBudget: calculateBudget,
        getBudget: function() { return {
            budget: data.budget,
            totalInc: data.totals.inc,
            totalExp: data.totals.exp,
            percentage: data.percentage
        }},
        calculatePercentages: calculatePercentages,
        getPercentages: getPercentages,
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
        budgetLabel: ".budget__value",
        incomeLabel: ".budget__income--value",
        expenseLabel: ".budget__expenses--value",
        percentageLabel: ".budget__expenses--percentage",
        container: ".container",
        expensesPercLabel: ".item__percentage",
        dateLabel: ".budget__title--month",
    }

    var addListItem = function(obj, type) {
        var html, newHtml, element;

        //Template html da inserire
        if(type === 'inc'){
            element = DOMstrings.incomeContainer;
            html = `<div class="item clearfix" id="inc-%id%">
                <div class="item__description">%description%</div>
                <div class="right clearfix"><div class="item__value">%value%</div>
                <div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i>
                <button></div></div></div>`;
        }
        else if(type === 'exp'){
            element = DOMstrings.expenseContainer;
            html = `<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div>
                <div class="right clearfix"><div class="item__value">%value%</div>
                <div class="item__percentage">21%</div><div class="item__delete">
                <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`;
        }

        //Sostituisco gli identificatori nel template sopra
        newHtml = html.replace('%id%', obj.id);
        newHtml = newHtml.replace('%description%', obj.description);
        newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));
        
        //Inserisco il nuovo HTML come child dell'elemento
        document.querySelector(element).insertAdjacentHTML('beforeend', newHtml); 
    };

    var deleteListItem = function(selectorID) { //selectorID = ID nell'html dell'oggetto da eliminare
        var parent, element;
        element = document.getElementById(selectorID);
        parent = element.parentNode;
        parent.removeChild(element); //Per rimuovere un elemento devo eliminarlo cavandolo dai figli del nodo padre
    };

    var displayBudget = function(obj) {
        var type = obj.budget > 0 ? 'inc' : 'exp';
        document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
        document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, "inc");
        document.querySelector(DOMstrings.expenseLabel).textContent = formatNumber(obj.totalExp, "exp");
        
        if(obj.percentage > 0){
            document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage+"%";
        } else {
            document.querySelector(DOMstrings.percentageLabel).textContent = "---";
        }
    };

    //querySelectorAll mi restituisce un NodeArray (non un array) quindi il foreach me lo costruisco
    var nodeListForEach = function(list, callback){ 
        for(var i = 0; i<list.length; i++){
            callback(list[i], i); //per ogni elemento chiamo la funzione di callback passandogli i parametri conformemente a quello che succede con il foeach
        }
    };

    var displayPercentages = function (percentages){
        var fields = document.querySelectorAll(DOMstrings.expensesPercLabel); //Ottengo tutte le label delle percentuali che devo aggiornare

        nodeListForEach(fields, function(current,index){ //Ora uso la funzione foreach che ho appena creato
            if(percentages[index] > 0){
                current.textContent = percentages[index]+"%";
            } else {
                current.textContent = "---";
            }
        });
        
    }

    var displayMonth = function(){
        var now, year, month, months;
        now = new Date(); //Ottenere data attuale
        // var christmas = new Date(2020, 11, 25); //Ottenere una data specifica

        year = now.getFullYear(); // Restituisce anno, es. 2020
        month = now.getMonth(); //Restituisce mese in numero es. 4 (= aprile)
        months = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];
        document.querySelector(DOMstrings.dateLabel).textContent = months[month] + " " + year;
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

    var formatNumber = function(num,type){
        var numSplit, int, dec;
        num = Math.abs(num); //Rimuove il segno (+ e - li aggiungo io in base a inc o exp)
        num = num.toFixed(2); //Mantiene 2 decimali dopo la virgola !! MA RESTITUISCE UNA STRINGA
        numSplit = num.split('.'); //Separo la parte intera dalla parte decimale
        int = numSplit[0];
        if(int.length>3){
            int = int.substr(0, int.length-3)+","+int.substr(int.length-3,3); //Aggiungo la , delle migliaia dopo 3 cifre
        }
        dec = numSplit[1];

        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
    }

    var changedType = function(){
        var fields = document.querySelectorAll( //Recupero tutti gli elementi per i quali devo cambiare la classe
            DOMstrings.inputType + "," +
            DOMstrings.inputDescription + ","+
            DOMstrings.inputValue);
        nodeListForEach(fields, function(cur) {
            cur.classList.toggle('red-focus'); //Aggiunge la classe CSS se non c'è e la rimuove se c'è
        });
    };


    return {
        getInput: function(){
            return { /*Posso dichiare le funzioni pubbliche direttamente qui oppure fuori dal return
                        ad ogni modo posso comunque accedere a tutti i dati privati nella stessa maniera */
                type : document.querySelector(DOMstrings.inputType).value, //inc o exp
                description : document.querySelector(DOMstrings.inputDescription).value,
                value : parseFloat(document.querySelector(DOMstrings.inputValue).value),
            }
        },
        getDOMstrings: function() { return DOMstrings },
        clearFields: clearFields,
        addListItem: addListItem,
        deleteListItem: deleteListItem,  
        displayBudget: displayBudget, 
        displayPercentages: displayPercentages,
        displayMonth: displayMonth,
        changedType: changedType,
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
            updateBudget();
            updatePercentages();
        }
    }

    var ctrlDeleteItem = function(event) {
        var itemID, type, ID;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id; //DOM traversing (clicco su bottone ma voglio selezionare tutto il div)
        if(itemID){
            splitID = itemID.split('-'); //dalla stringa inc-<id> o exp-<id> estraggo le due componenti type e id
            type= splitID[0];
            ID = parseInt(splitID[1]);

            budgetCtrl.deleteItem(type, id); //Elimina oggetto dalla struttura dati
            UICtrl.deleteListItem(itemID);//Elimina l'intero div parent dalla UI
            updateBudget();//Aggiorna e mostra budget
            updatePercentages();
        }
    };
    
    var updateBudget = function () {
        var budget;
        budgetCtrl.calculateBudget();//Calcola budget
        budget = budgetCtrl.getBudget();
        UICtrl.displayBudget(budget);//Mostra il budget sulla UI
    }

    var setupEventListeners = function() {

        var DOMstrings = UICtrl.getDOMstrings();
        document.querySelector(DOMstrings.inputButton).addEventListener("click", ctrlAddItem);

        document.addEventListener("keypress", function(event){
            if(event.keyCode === 13 || event.which === 13){ //Enter
                ctrlAddItem();
            }
        });

        //Aggiungo l'evento su un container anche se l'evento click partirà da un elemento che è un suo figlio / nipote
        document.querySelector(DOMstrings.container).addEventListener("click", ctrlDeleteItem); 

        document.querySelector(DOM.inputType). addEventListenerListener('change', UICtrl.changedType);
    }

    var updatePercentages = function() {
        budgetCtrl.calculatePercentages; //calcola le percentuali
        var percentages = budgetCtrl.getPercentages(); //Ottiene le percentuali dal budget controller
        UICtrl.displayPercentages();//Aggiorna le percentuali sulla UI
    }
    
    return {
        init: function() {
            setupEventListeners();
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1});
            UICtrl.displayMonth();
        },
        ctrlAddItem: ctrlAddItem,
        ctrlDeleteItem: ctrlDeleteItem,
        updateBudget: updateBudget,
    }
})(budgetController, UIController);

controller.init();