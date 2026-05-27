# System wspierający dietetyków w personalizacji planów żywieniowych

Projekt inżynierski przedstawiający aplikację webową, która wspiera dietetyków w procesie tworzenia spersonalizowanych planów żywieniowych dla pacjentów.  
System umożliwia zarządzanie profilami pacjentów, analizę ich danych zdrowotnych oraz tworzenie spersonalizowanych planów żywieniowych z uwzględnieniem alergii i chorób.

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
3. **Baza danych (PostgreSQL)** – przechowuje dane użytkowników, pacjentów i planów, produktów żywieniowych.   
4. **Docker** – konteneryzuje frontend, backend i bazę danych dla łatwego uruchamiania środowiska.

Użytkownik ma dostęp tylko do warstwy aplikacji, która po wcześniejszej autoryzacji i uwierzytelnianiu uzyskuje dostęp do warstwy serwerowej. Dostęp do baz danych wyłącznie wewnątrz podsieci Docker. 

---

## Przykładowe widoki

**Tworzenie planów żywieniowych**

<img width="1920" height="1214" alt="pacjent" src="https://github.com/user-attachments/assets/bc52644f-d488-4ac4-8ceb-afdca11c356e" />





**Profil pacjenta**

<img width="1920" height="2253" alt="kreator_planu" src="https://github.com/user-attachments/assets/62a99524-be79-4157-8777-7afaa44e85d1" />


