# To-Do List

Een moderne, responsieve to-do list applicatie gebouwd met React, PHP en SQLite. Perfect voor het organiseren van studietaken en het bijhouden van voortgang.

![Studie Dashboard](https://img.shields.io/badge/Status-Active-brightgreen)
![PHP Version](https://img.shields.io/badge/PHP-7.4+-blue)
![React](https://img.shields.io/badge/React-18-61dafb)

## ✨ Features

- **Taakbeheer**: Voeg toe, bewerk en verwijder taken
- **Prioriteiten**: Stel prioriteit in (Hoog, Normaal, Laag)
- **Deadlines**: Voeg vervaldatums toe aan taken
- **Filtering**: Filter taken op status (Alle, Actief, Voltooid)
- **Persistente opslag**: Data wordt opgeslagen in SQLite database
- **Responsive design**: Werkt op desktop en mobiele apparaten
- **Real-time updates**: Direct feedback bij acties

## 🚀 Technologieën

- **Frontend**: React 18 (via CDN), JavaScript ES6+
- **Backend**: PHP 7.4+
- **Database**: SQLite
- **Styling**: CSS3 met moderne gradients en backdrop-filter
- **HTTP**: REST API met JSON

## 📋 Vereisten

- PHP 7.4 of hoger
- Webserver (Apache/Nginx) of lokale ontwikkelomgeving zoals Laragon/XAMPP
- SQLite ondersteuning (standaard in PHP)
- Moderne webbrowser met JavaScript ondersteuning

## 🛠️ Installatie

1. **Clone of download het project:**
   ```bash
   git clone https://github.com/KevinvdWeert/To-Do-list.git
   ```

2. **Plaats bestanden in webserver directory:**
   - Voor Laragon: `c:\laragon\www\`
   - Voor XAMPP: `c:\xampp\htdocs\`

3. **Zorg dat PHP SQLite extensie is geactiveerd:**
   - Controleer of `extension=sqlite3` is ingeschakeld in `php.ini`

4. **Start je webserver en navigeer naar het project:**
   ```
   http://localhost/To-Do-list/
   ```

## 📁 Projectstructuur

```
To-Do-list/
├── index.php          # Hoofdpagina met HTML structuur
├── App.jsx           # React componenten en applicatielogica
├── api.php           # REST API endpoint voor database operaties
├── style.css         # CSS styling en responsieve design
├── tasks.sql         # SQLite database (wordt automatisch aangemaakt)
└── README.md         # Dit bestand
```

## 🔧 API Endpoints

De applicatie gebruikt een RESTful API via `api.php`:

| Method | Endpoint | Beschrijving |
|--------|----------|--------------|
| GET    | `/api.php` | Haal alle taken op |
| POST   | `/api.php` | Maak nieuwe taak aan |
| PUT    | `/api.php` | Update bestaande taak |
| DELETE | `/api.php?id={id}` | Verwijder taak |

### Request/Response voorbeelden:

**Nieuwe taak aanmaken (POST):**
```json
{
  "text": "Studeren voor tentamen",
  "priority": "hoog",
  "due": "2025-11-05"
}
```

**Taak updaten (PUT):**
```json
{
  "id": 1,
  "done": true
}
```

## 🎨 Design Features

- **Dark theme**: Moderne donkere interface
- **Glassmorphism**: Transparante effecten met backdrop-filter
- **Gradient backgrounds**: Subtiele kleurovergangen
- **Smooth transitions**: Vloeiende animaties
- **Typography**: Inter font voor optimale leesbaarheid

## 💾 Database Schema

De SQLite database wordt automatisch aangemaakt met de volgende tabel:

```sql
CREATE TABLE tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    done INTEGER NOT NULL DEFAULT 0,
    priority TEXT DEFAULT 'normaal',
    due TEXT NULL
);
```

## 🔄 Workflow

1. **Taak toevoegen**: Vul tekst, deadline en prioriteit in
2. **Prioriteit instellen**: Kies tussen Hoog (rood), Normaal (blauw), Laag (grijs)
3. **Filtering**: Gebruik de filter knoppen om specifieke taken te bekijken
4. **Taken beheren**: Markeer als voltooid, bewerk of verwijder taken
5. **Opruimen**: Gebruik "Wis Voltooid" om voltooide taken te verwijderen

## 🐛 Troubleshooting

**Database fouten:**
- Controleer of de webserver schrijfrechten heeft in de project directory
- Zorg dat SQLite extensie is geactiveerd in PHP

**JavaScript fouten:**
- Controleer of alle CDN links bereikbaar zijn
- Zorg dat JavaScript is ingeschakeld in je browser

**CSS niet geladen:**
- Controleer of `style.css` correct wordt geladen
- Verify dat de webserver CSS bestanden kan serveren

## 🔮 Toekomstige uitbreidingen

- [ ] Categorieën voor taken
- [ ] Herinneringen en notificaties
- [ ] Export functionaliteit
- [ ] Donker/licht thema schakelaar
- [ ] Drag & drop voor prioriteiten
- [ ] Multi-user ondersteuning
- [ ] Mobile app versie

## 👥 Bijdragen

Bijdragen zijn welkom! Hier's hoe je kunt helpen:

1. Fork het project
2. Maak een feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit je wijzigingen (`git commit -m 'Add some AmazingFeature'`)
4. Push naar de branch (`git push origin feature/AmazingFeature`)
5. Open een Pull Request

## 📄 Licentie

Dit project is open source. Voel je vrij om het te gebruiken en aan te passen voor je eigen doeleinden.

## 👨‍💻 Auteur

**Kevin van de Weert**
- GitHub: [@KevinvdWeert](https://github.com/KevinvdWeert)

## 🙏 Credits

- React team voor het geweldige framework
- Inter font family voor de mooie typografie
- Inspiration van moderne dashboard designs

---

**Geniet van het organiseren van je taken! 📝✨**