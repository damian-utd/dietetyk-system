# System wspierający dietetyków w personalizacji planów żywieniowych

Projekt inżynierski przedstawiający aplikację webową, która wspiera dietetyków w procesie tworzenia spersonalizowanych planów żywieniowych dla pacjentów.  
System umożliwia zarządzanie profilami pacjentów, analizę ich danych zdrowotnych oraz generowanie planów żywieniowych z uwzględnieniem alergii i chorób.

---

## Technologie

**Frontend:**  
- React.js  
- HTML, CSS (modułowy styling)  
- Vite  
- RemixIcon   

**Backend:**  
- Node.js (Express.js)   
- PostgreSQL
- Docker 

---

## Funkcjonalności (dev)

- Tworzenie i edycja profili pacjentów  
- Uzupełnianie kwestionariuszy zdrowotnych (waga, wzrost, aktywność, schorzenia)  
- Automatyczne obliczanie wskaźników BMI, BMR i TDEE  
- Generowanie planów dietetycznych z wykluczeniem produktów na podstawie alergii  
- Historia planów i notatki dla pacjentów  
- Eksport planów do plików PDF  
- Bezpieczne logowanie i przechowywanie danych  

---

## Architektura systemu

Aplikacja działa w architekturze klient–serwer:

1. **Frontend (React)** – interfejs użytkownika uruchamiany w przeglądarce.  
2. **Backend (Express)** – obsługuje logikę biznesową, autentykację i komunikację z bazą.  
3. **Baza danych (PostgreSQL)** – przechowuje dane użytkowników, pacjentów i planów.  
4. **Docker** – konteneryzuje frontend, backend i bazę danych dla łatwego uruchamiania środowiska. (backend i baza danych wewnątrz kontenera, frontend widzi backend przez proxy)

---


