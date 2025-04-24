// Alap osztály az egyetemi dolgozókhoz
class EgyetemiDolgozo {
    constructor(nev, cim, fizetes) {
        this.nev = nev;
        this.cim = cim;
        this.fizetes = fizetes;
        this.element = null; // DOM elem referenciája
    }

    // Metódus a fizetés módosítására
    fizetesModosit(emeles) {
        this.fizetes += emeles;
        // Csak akkor frissítjük a DOM-ot, ha a this.element létezik
        if (this.element) {
            const fizetesElement = this.element.querySelector('.fizetes');
            if (fizetesElement) {
                fizetesElement.textContent = `Fizetés: ${this.fizetes} Ft`;
            }
        }
    }

    // Metódus a dolgozó adatainak megjelenítésére
    render() {
        this.element = document.createElement('div');
        this.element.className = 'employee-card';
        this.element.innerHTML = `
            <h3>${this.nev}</h3>
            <p>Cím: ${this.cim}</p>
            <p class="fizetes">Fizetés: ${this.fizetes} Ft</p>
        `;
        return this.element;
    }
}

// Alkalmazott osztály, amely örököl az EgyetemiDolgozo-ból
class Alkalmazott extends EgyetemiDolgozo {
    constructor(nev, cim, fizetes, csoport) {
        super(nev, cim, fizetes); // Szülőosztály konstruktorának hívása
        this.csoport = csoport;
        this.munkakorok = [];
    }

    // Munkakör hozzáadása
    munkakor(munkakor) {
        this.munkakorok.push(munkakor);
        // Csak akkor frissítjük a DOM-ot, ha a this.element létezik
        if (this.element) {
            const munkakorokElement = this.element.querySelector('.munkakorok');
            if (munkakorokElement) {
                munkakorokElement.textContent = `Munkakörök: ${this.munkakorok.join(', ')}`;
            }
        }
    }

    // Munkakörök számának lekérdezése
    munkakorokSzama() {
        return this.munkakorok.length;
    }

    // A render metódus felülírása az alkalmazott-specifikus adatokkal
    render(index) {
        this.element = super.render(); // Szülő render metódusának hívása
        this.element.innerHTML += `
            <p>Csoport: ${this.csoport}</p>
            <p class="munkakorok">Munkakörök: ${this.munkakorok.join(', ')}</p>
            <button onclick="employees[${index}].fizetesModosit(5000)">Fizetés emelése (5000 Ft)</button>
            <button onclick="employees[${index}].fizetesModosit(-5000)">Fizetés csökkentése (5000 Ft)</button>
            <button onclick="deleteEmployee(${index})">Törlés</button>
        `;
        return this.element;
    }
}

// Alkalmazottak kezelése és megjelenítése
let employees = [];

document.addEventListener('DOMContentLoaded', () => {
    console.log('Oldal betöltve, alkalmazottak létrehozása...');

    // Alkalmazottak létrehozása
    const alkalmazott1 = new Alkalmazott('Kovács Péter', 'Budapest, Fő utca 1', 300000, 'IT Osztály');
    alkalmazott1.munkakor('Szoftverfejlesztő');
    alkalmazott1.munkakor('Rendszergazda');

    const alkalmazott2 = new Alkalmazott('Nagy Éva', 'Debrecen, Kossuth utca 2', 320000, 'Pénzügyi Osztály');
    alkalmazott2.munkakor('Könyvelő');
    alkalmazott2.munkakor('Bérszámfejtő');

    const alkalmazott3 = new Alkalmazott('Szabó Anna', 'Szeged, Tisza part 3', 310000, 'HR Osztály');
    alkalmazott3.munkakor('Toborzó');
    alkalmazott3.munkakor('Képzési Koordinátor');

    // Alkalmazottak hozzáadása a globális tömbhöz
    employees.push(alkalmazott1, alkalmazott2, alkalmazott3);

    // Alkalmazottak megjelenítése a DOM-ban
    renderEmployees();
});

// Alkalmazottak megjelenítése
function renderEmployees() {
    const container = document.getElementById('employeesContainer');
    if (container) {
        // Töröljük a jelenlegi tartalmat
        container.innerHTML = '';
        // Újrarendereljük az összes alkalmazottat
        employees.forEach((alkalmazott, index) => {
            const alkalmazottElement = alkalmazott.render(index);
            container.appendChild(alkalmazottElement);
        });
    } else {
        console.error('Az employeesContainer elem nem található!');
    }
}

// Új alkalmazott hozzáadása
window.addNewEmployee = function() {
    const name = document.getElementById('newName').value.trim();
    const address = document.getElementById('newAddress').value.trim();
    const salary = parseInt(document.getElementById('newSalary').value);
    const department = document.getElementById('newDepartment').value.trim();

    // Validáció
    if (!name || !address || isNaN(salary) || !department) {
        alert('Kérlek, tölts ki minden mezőt helyesen!');
        return;
    }

    // Új alkalmazott létrehozása
    const newEmployee = new Alkalmazott(name, address, salary, department);
    employees.push(newEmployee);

    // Űrlap mezők törlése
    document.getElementById('newName').value = '';
    document.getElementById('newAddress').value = '';
    document.getElementById('newSalary').value = '';
    document.getElementById('newDepartment').value = '';

    // Alkalmazottak újrarenderelése
    renderEmployees();
};

// Alkalmazott törlése
window.deleteEmployee = function(index) {
    employees.splice(index, 1); // Törlés a tömbből
    renderEmployees(); // Újrarenderelés
};