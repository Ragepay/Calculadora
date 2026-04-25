class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.clear();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.readyToReset = false;
    }

    delete() {
        if (this.currentOperand === '0' || this.currentOperand === 'Error') return;
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        if (this.currentOperand === '') this.currentOperand = '0';
    }

    appendNumber(number) {
        if (this.readyToReset) {
            this.currentOperand = number.toString();
            this.readyToReset = false;
            return;
        }
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number.toString();
        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
    }

    chooseOperation(operation) {
        if (this.currentOperand === 'Error') this.clear();
        if (this.currentOperand === '0' && this.previousOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = ''; 
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand || 0);
        
        if (isNaN(prev)) return;

        switch (this.operation) {
            case '+': computation = prev + current; break;
            case '-': computation = prev - current; break;
            case '×': computation = prev * current; break;
            case '÷':
                if (current === 0) {
                    computation = 'Error';
                } else {
                    computation = prev / current;
                }
                break;
            case '^': computation = Math.pow(prev, current); break;
            default: return;
        }
        
        if (typeof computation === 'number') {
            // Prevenir errores raros de flotantes en JavaScript, ej: 0.1 + 0.2
            computation = Math.round(computation * 10000000000) / 10000000000;
        }
        
        this.currentOperand = computation;
        this.operation = undefined;
        this.previousOperand = '';
        this.readyToReset = true;
    }

    getDisplayNumber(number) {
        if (number === 'Error') return 'Error';
        if (number === '') return '';
        
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        
        let integerDisplay;
        if (isNaN(integerDigits)) {
            integerDisplay = '0';
        } else {
            // Localización a español para separar los miles con puntos (1.000)
            integerDisplay = integerDigits.toLocaleString('es-ES', { maximumFractionDigits: 0 });
        }
        
        if (decimalDigits != null) {
            return `${integerDisplay},${decimalDigits}`; // Coma para decimales
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        this.currentOperandTextElement.innerText = this.getDisplayNumber(this.currentOperand);
        if (this.operation != null) {
            this.previousOperandTextElement.innerText = 
                `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandTextElement.innerText = '';
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const numberButtons = document.querySelectorAll('[data-number]');
    const operationButtons = document.querySelectorAll('[data-operation]');
    const equalsButton = document.querySelector('[data-action="compute"]');
    const deleteButton = document.querySelector('[data-action="delete"]');
    const clearButton = document.querySelector('[data-action="clear"]');
    const previousOperandTextElement = document.querySelector('[data-previous-operand]');
    const currentOperandTextElement = document.querySelector('[data-current-operand]');

    // --- Lógica del tema oscuro/claro ---
    const themeBtn = document.getElementById('theme-btn');
    const currentTheme = localStorage.getItem('theme') || 'dark';

    if (currentTheme === 'light') {
        document.body.classList.add('light-theme');
        themeBtn.innerText = '🌙';
    }

    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        const isLight = document.body.classList.contains('light-theme');
        themeBtn.innerText = isLight ? '🌙' : '☀️';
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });

    const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);
    calculator.updateDisplay();

    numberButtons.forEach(button => {
        button.addEventListener('click', () => {
            calculator.appendNumber(button.getAttribute('data-number'));
            calculator.updateDisplay();
        });
    });

    operationButtons.forEach(button => {
        button.addEventListener('click', () => {
            calculator.chooseOperation(button.getAttribute('data-operation'));
            calculator.updateDisplay();
        });
    });

    equalsButton.addEventListener('click', () => { calculator.compute(); calculator.updateDisplay(); });
    clearButton.addEventListener('click', () => { calculator.clear(); calculator.updateDisplay(); });
    deleteButton.addEventListener('click', () => { calculator.delete(); calculator.updateDisplay(); });

    // Agregamos soporte integral para teclado
    document.addEventListener('keydown', (e) => {
        if ((e.key >= '0' && e.key <= '9') || e.key === '.' || e.key === ',') {
            calculator.appendNumber(e.key === ',' ? '.' : e.key);
            calculator.updateDisplay();
        }
        if (e.key === '=' || e.key === 'Enter') { e.preventDefault(); calculator.compute(); calculator.updateDisplay(); }
        if (e.key === 'Backspace') { calculator.delete(); calculator.updateDisplay(); }
        if (e.key === 'Escape') { calculator.clear(); calculator.updateDisplay(); }
        if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
            calculator.chooseOperation(e.key === '*' ? '×' : (e.key === '/' ? '÷' : e.key));
            calculator.updateDisplay();
        }
        if (e.key === '^') { calculator.chooseOperation('^'); calculator.updateDisplay(); }
    });
});