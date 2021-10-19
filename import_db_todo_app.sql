-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Počítač: 127.0.0.1
-- Vytvořeno: Úte 19. říj 2021, 08:59
-- Verze serveru: 10.4.11-MariaDB
-- Verze PHP: 7.3.17

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Databáze: `db_todo_app`
--
CREATE DATABASE IF NOT EXISTS `db_todo_app` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `db_todo_app`;

-- --------------------------------------------------------

--
-- Struktura tabulky `registracni_tokeny`
--

CREATE TABLE `registracni_tokeny` (
  `id` int(11) NOT NULL,
  `email` varchar(300) COLLATE utf8_unicode_ci NOT NULL,
  `token` varchar(300) COLLATE utf8_unicode_ci NOT NULL,
  `heslo` varchar(300) COLLATE utf8_unicode_ci NOT NULL,
  `lang` tinytext COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Struktura tabulky `seznamy`
--

CREATE TABLE `seznamy` (
  `id` bigint(20) NOT NULL,
  `nazev_seznamu` text COLLATE utf8_unicode_ci DEFAULT NULL,
  `poradi` int(11) DEFAULT NULL,
  `user` text COLLATE utf8_unicode_ci DEFAULT NULL,
  `sdilen_s` longtext COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Struktura tabulky `stringy`
--

CREATE TABLE `stringy` (
  `id` bigint(20) NOT NULL,
  `cz` longtext COLLATE utf8_unicode_ci DEFAULT NULL,
  `en` longtext COLLATE utf8_unicode_ci DEFAULT NULL,
  `de` longtext COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Vypisuji data pro tabulku `stringy`
--

INSERT INTO `stringy` (`id`, `cz`, `en`, `de`) VALUES
(1, 'zatím žádný seznam', 'no list yet', 'noch keine Liste'),
(2, 'Moje seznamy', 'My lists', 'Meine Listen'),
(3, 'Sdílené seznamy', 'Shared Lists', 'Gemeinsame Listen'),
(4, 'odhlásit', 'logout', 'abmelden'),
(5, '+ přidat seznam', '+ add list', '+ Liste hinzufügen'),
(6, 'Nastavení', 'Settings', 'Einstellungen'),
(7, 'Jazyk', 'Language', 'Sprache'),
(8, 'česky', 'czech', 'Tschechisch'),
(9, 'anglicky', 'english', 'Englisch'),
(10, 'žádný seznam', 'no list', 'keine Liste'),
(11, 'přidat', 'add', 'hinzufügen'),
(12, 'přidat nový úkol', 'add new task', 'neue Aufgabe hinzufügen'),
(13, 'přidat nový podúkol', 'add new subtask', 'neue Unteraufgabe hinzufügen'),
(14, 'Opravdu chcete svůj účet vymazat? Pokud ano, nejdříve zadejte heslo:', 'Are you sure you want to delete your account? If yes, enter the password first:', 'Wollen Sie Ihr Konto wirklich löschen? Wenn ja, geben Sie bitte zuerst Ihr Passwort ein:'),
(15, 'Vymazání účtu', 'Deleting an account', 'Löschung eines Kontos'),
(16, 'OK', 'OK', 'OK'),
(17, 'Uživatel nenalezen', 'User not found', 'Benutzer nicht gefunden'),
(18, 'Chybné heslo', 'Wrong password', 'Falsches Passwort'),
(19, 'Chybné nastavení', 'Incorrect setting', 'Falsche Einstellungen'),
(20, 'Změna nastavení selhala', 'Setting change failed', 'Ändern der Einstellungen fehlgeschlagen'),
(21, 'Motiv', 'Scheme', 'Motiv'),
(22, 'světlý', 'light', 'helles'),
(23, 'tmavý', 'dark', 'dunkel'),
(24, 'Vymazat můj účet', 'Delete my account', 'Mein Konto löschen'),
(25, 'Žádný seznam k otevření', 'No list to open', 'Keine Liste zu öffnen'),
(26, 'Přihlášený uživatel nebyl nalezen v databázi', 'The logged in user was not found in the database', 'Der eingeloggte Benutzer wurde nicht in der Datenbank gefunden'),
(27, 'Neznámý typ otvíraného seznamu', 'Unknown open list type', 'Unbekannter Typ der offenen Liste'),
(28, 'Nepřihlášený uživatel', 'Not logged in user', 'Nicht eingeloggter Benutzer'),
(29, 'ID seznamu přijatého na server není číslo', 'The ID of the list received on the server is not a number', 'Die ID der auf dem Server empfangenen Liste ist keine Nummer'),
(30, 'Seznam který chcete otevřít již neexistuje, nebo nemáte oprávnění vidět a upravovat ho.', 'The list you want to open no longer exists, or you do not have permission to see and edit it.', 'Die Liste, die Sie öffnen möchten, existiert nicht mehr, oder Sie haben keine Berechtigung, sie zu sehen und zu bearbeiten.'),
(31, 'SQL chyba', 'SQL error', 'SQL-Fehler'),
(32, 'seznam sdílen s:', 'list shared with:', 'Liste geteilt mit:'),
(33, 'Neznámá chyba', 'Unknown error', 'Unbekannter Fehler'),
(34, 'Sdílení se nepodařilo zrušit', 'Sharing failed to cancel', 'Freigabe scheiterte beim Abbrechen'),
(35, 'zatím nemáte v tomto seznamu žádný úkol', 'you have no tasks in this list yet', 'Sie haben noch keine Aufgaben in dieser Liste'),
(36, 'Seznam, do kterého chcete přidat úkol buď nebyl nalezen, nebo nemáte oprávnění upravovat jeho úkoly.', 'Either the list to which you want to add the task was not found or you do not have permission to edit its tasks.', 'Entweder wurde die Liste, zu der Sie die Aufgabe hinzufügen möchten, nicht gefunden oder Sie haben keine Berechtigung, die Aufgaben zu bearbeiten.'),
(37, 'Úkol, kterému chcete přidat podúkol neexistuje.', 'The task to which you want to add a subtask does not exist.', 'Die Aufgabe, zu der Sie eine Unteraufgabe hinzufügen möchten, existiert nicht.'),
(38, 'seznam s vámi sdílí uživatel', 'list is shared with you by', 'mit Ihnen geteilt von'),
(39, 'Úprava úkolu', 'Modifying the task', 'Ändern der Aufgabe'),
(40, 'Zde můžete zadat nový text pro daný úkol', 'Here you can enter new text for the task', 'Hier können Sie einen neuen Text für die Aufgabe eingeben'),
(41, 'Pokoušíte se upravit úkol, který neexistuje, nebo nespadá pod právě otevřený seznam', 'You are trying to edit a task that does not exist or does not belong to the currently opened list', 'Sie versuchen, eine Aufgabe zu bearbeiten, die es nicht gibt oder die nicht in der aktuell geöffneten Liste enthalten ist'),
(42, 'Nepodařilo se uložit nový text úkolu do databáze. SQL chyba', 'Failed to save new task text to the database. SQL error', 'Der neue Aufgabentext konnte nicht in der Datenbank gespeichert werden. SQL-Fehler'),
(43, 'Chyba při mazání úkolů z databáze. Byl vymazán jiný počet úkolů, než se měl vymazat.', 'Error when deleting tasks from the database. A different number of tasks were deleted than should have been deleted.', 'Fehler beim Löschen von Aufgaben aus der Datenbank. Es wurde eine andere Anzahl von Aufgaben gelöscht, als eigentlich hätte gelöscht werden müssen.'),
(44, 'Neznáma chyba na serveru související se změnou pozice úkolu', 'Unknown server error related to task position change', 'Unbekannter Serverfehler im Zusammenhang mit einer Aufgabenpositionsänderung'),
(45, 'Nový kontakt pro sdílení', 'New contact for sharing', 'Neuer Kontakt zum Teilen'),
(46, 'Zadejte e-mail uživatele, se kterým chcete sdílet tento seznam. Pokud uživatel zatím není registrovaný, po své registraci seznam uvidí.', 'Enter the email of the user you want to share this list with. If the user is not yet registered, the user will see the list after he register himself.', 'Geben Sie die E-Mail-Adresse des Benutzers ein, für den Sie diese Liste freigeben möchten. Wenn der Benutzer noch nicht registriert ist, kann er die Liste sehen, sobald er registriert ist.'),
(47, 'Seznam, který chcete sdílet s jiným uživatelem buď neexistuje, nebo nejste jeho vlastník, takže nemáte právo nové sdílení nastavit.', 'The list you want to share with another user either doesn\'t exist or you don\'t own it, so you don\'t have the right to set up a new share.', 'Die Liste, die Sie für einen anderen Benutzer freigeben möchten, existiert entweder nicht oder Sie besitzen sie nicht, so dass Sie nicht das Recht haben, eine neue Freigabe einzurichten.'),
(48, 'Chybný formát e-mailu', 'Incorrect e-mail format', 'Falsches E-Mail-Format'),
(49, 'S tímto uživatelem již seznam sdílíte', 'You already share a list with this user', 'Sie teilen diese Liste bereits mit diesem Benutzer'),
(50, 'Neznámá chyba při nastavování sdílení seznamu s novým uživatelem', 'Unknown error when setting up list sharing with a new user', 'Unbekannter Fehler beim Einrichten der Listenfreigabe für einen neuen Benutzer'),
(51, 'SQL chyba při ukládání dat do databáze. Ovlivněno více seznamů.', 'SQL error when saving data to the database. Multiple lists affected.', 'SQL-Fehler beim Speichern von Daten in der Datenbank. Mehrere Listen betroffen.'),
(52, 'Id seznamu není číslo', 'Id list is not a number', 'Id-Liste ist keine Nummer'),
(53, 'Seznam, který se chystáte smazat buď neexistuje, nebo nejste jeho vlastníkem a tudíž ho nemáte právo vymazat', 'The list you are about to delete either does not exist or you are not the owner of the list and therefore do not have the right to delete it', 'Die Liste, die Sie löschen möchten, existiert entweder nicht oder Sie sind nicht der Eigentümer der Liste und haben daher nicht das Recht, sie zu löschen'),
(54, 'Seznam nebyl vymazán', 'The list has not been deleted', 'Die Liste wurde nicht gelöscht'),
(55, 'SQL chyba databáze při mazání úkolů z mazaného seznamu', 'SQL database error when deleting tasks from the deleted list', 'SQL-Datenbankfehler beim Löschen von Aufgaben aus der Löschliste'),
(56, 'Opravdu chcete tento seznam vymazat?', 'Do you really want to delete this list?', 'Wollen Sie diese Liste wirklich löschen?'),
(57, 'Ano', 'Yes', 'Ja'),
(58, 'Ne', 'No', 'Nein'),
(59, 'Název seznamu', 'List name', 'Name der Liste'),
(60, 'Zadejte prosím nový název tohoto seznamu', 'Please enter a new name for this list', 'Bitte geben Sie einen neuen Namen für diese Liste ein'),
(61, 'Seznam, který se chystáte přejmenovat buď neexistuje, nebo nejste jeho vlastníkem a tudíž ho nemáte právo vymazat', 'The list you are about to rename either does not exist, or you are not the owner and therefore do not have the right to delete it', 'Die Liste, die Sie umbenennen möchten, existiert entweder nicht, oder Sie sind nicht der Eigentümer der Liste und haben daher nicht das Recht, sie zu löschen'),
(62, 'Nelze vytvořit úkol bez textu', 'Cannot create a task without text', 'Aufgabe ohne Text kann nicht erstellt werden'),
(63, 'Název seznamu', 'List name', 'Name der Liste'),
(64, 'Zadejte prosím název nového seznamu', 'Please enter the name of the new list', 'Bitte geben Sie den Namen der neuen Liste ein'),
(65, 'Název nového seznamu nemůže být prázdný', 'The name of the new list cannot be empty', 'Der Name der neuen Liste darf nicht leer sein'),
(66, 'Uživatel s tímto emailem není v databázi', 'User with this email is not in the database', 'Benutzer mit dieser E-Mail ist nicht in der Datenbank'),
(67, 'Změnit heslo', 'Change password', 'Passwort ändern'),
(68, 'Změna hesla', 'Change password', 'Passwort ändern'),
(69, 'Zadejte staré heslo a dvakrát nové heslo', 'Enter the old password and the new password twice', 'Geben Sie das alte und das neue Kennwort zweimal ein'),
(70, 'Staré heslo', 'Old password', 'Altes Passwort'),
(71, 'Nové heslo', 'New password', 'Neues Passwort'),
(72, 'Nové heslo znovu', 'New password again', 'Wieder neues Passwort'),
(73, 'Chyba. Nejste přihlášeni, nebo Váš e-mail není v naší databázi uživatelů', 'Error. You are not logged in or your email is not in our user database', 'Fehler. Sie sind nicht eingeloggt oder Ihre E-Mail ist nicht in unserer Benutzerdatenbank'),
(74, 'Všechny 3 položky jsou povinné', 'All 3 items are mandatory', 'Alle 3 Punkte sind obligatorisch'),
(75, 'Potvrzení nového hesla se neshoduje s novým heslem', 'The new password confirmation does not match the new password', 'Die Bestätigung des neuen Passworts stimmt nicht mit dem neuen Passwort überein'),
(76, 'Nové heslo je moc krátké. Min. 8 znaků', 'The new password is too short. Min. 8 characters', 'Das neue Passwort ist zu kurz. Min. 8 Zeichen'),
(77, 'Staré heslo není správně', 'Old password is not correct', 'Altes Passwort ist nicht korrekt'),
(78, 'Nové heslo nesmí být stejné jako předchozí heslo', 'The new password must not be the same as the previous password', 'Das neue Passwort darf nicht mit dem vorherigen Passwort identisch sein.'),
(79, 'Nové heslo neuloženo', 'New password not saved', 'Neues Passwort nicht gespeichert'),
(80, 'nové heslo úspěšně uloženo', 'new password successfully saved', 'neues Passwort erfolgreich gespeichert'),
(81, 'Chyba při ukládání hesla do databáze', 'Error saving password to database', 'Fehler beim Speichern des Passworts in der Datenbank'),
(82, 'Přihlášení', 'Login', 'Anmeldung'),
(83, 'Přihlásit se', 'Login', 'Einloggen'),
(84, 'heslo', 'password', 'Passwort'),
(85, 'Registrovat se', 'Register now', 'Jetzt anmelden'),
(86, 'Zapomenuté heslo', 'Forgotten password', 'Vergessenes Passwort'),
(87, 'Obnova hesla', 'Password recovery', 'Passwort-Wiederherstellung'),
(88, 'Obnovit heslo', 'Reset password', 'Passwort zurücksetzen'),
(89, 'Na e-mail Vám bylo zasláno nové náhradní heslo. Použijte ho prosím pro přihlášení a doporučujeme si ho ihned po přihlášení změnit.', 'A new replacement password has been sent to your email. Please use it to log in and we recommend that you change it immediately after logging in.', 'Ein neues Ersatzpasswort wurde Ihnen per E-Mail zugesandt. Bitte verwenden Sie ihn zum Einloggen, und wir empfehlen Ihnen, ihn sofort nach dem Einloggen zu ändern.'),
(90, 'Uživatel s tímto e-mailem nebyl nalezen', 'User with this e-mail could not be found', 'Benutzer mit dieser E-Mail konnte nicht gefunden werden'),
(91, 'E-mail musí být vyplněn', 'E-mail must be filled in', 'E-Mail muss ausgefüllt werden'),
(92, 'SQL chyba při ukládání nového hesla do databáze', 'SQL error when saving a new password to the database', 'SQL-Fehler beim Speichern eines neuen Passworts in der Datenbank'),
(93, 'Registrace', 'Registration', 'Registrierung'),
(94, 'heslo znovu: ', 'password again: ', 'Passwort wieder: '),
(95, 'Máte již učet?', 'Already have an account?', 'Sie haben bereits ein Konto?'),
(96, 'Přihlaste se', 'Log in', 'Einloggen'),
(97, 'Hesla se neshodují', 'Passwords don\'t match', 'Passwörter stimmen nicht überein'),
(98, 'Heslo musí mít minimálně 8 znaků', 'The password must be at least 8 characters long', 'Das Passwort muss mindestens 8 Zeichen lang sein'),
(99, 'Uživatel s tímto e-mailem již existuje', 'A user with this email already exists', 'Ein Benutzer mit dieser E-Mail existiert bereits'),
(100, 'Email odeslán', 'Email sent', 'E-Mail gesendet'),
(101, 'Registraci dokončíte kliknutím na odkaz', 'To complete your registration, click on the link we have sent to your email', 'Um Ihre Anmeldung abzuschließen, klicken Sie auf den Link, den wir Ihnen per E-Mail geschickt haben'),
(102, ', který jsme Vám odeslali na e-mail', NULL, NULL),
(103, 'heslo: ', 'password: ', 'Passwort: '),
(104, 'Nesprávný uživatel nebo heslo', 'Invalid user or password', 'Falscher Benutzer oder falsches Passwort'),
(105, 'Nedokončená registrace', 'Incomplete registration', 'Unvollständige Registrierung'),
(106, 'Nedokončili jste registraci kliknutím na odkaz, kterým jsme Vám zaslali na email.', 'You did not complete your registration by clicking on the link we emailed you.', 'Sie haben Ihre Anmeldung nicht abgeschlossen, indem Sie auf den Link geklickt haben, den wir Ihnen per E-Mail geschickt haben.'),
(107, 'Dokončení registrace ToDo-app', 'Completing ToDo-app registration', 'Abschluss der ToDo-App-Registrierung'),
(108, 'jazyk: ', 'Language: ', 'Sprache: '),
(109, 'Chyba databáze.', 'Database error.', 'Datenbank-Fehler.'),
(110, 'Nepodařilo se dokončit registraci. Token nebo email není platný.', 'Failed to complete registration. Token or email is not valid.', 'Die Registrierung konnte nicht abgeschlossen werden. Token oder E-Mail ist nicht gültig.'),
(111, 'Dokončení registrace', 'Completion of registration', 'Abschluss der Registrierung'),
(112, 'Nepodařilo se dokončit registraci. Chyba při vkládání uživatele do databáze', 'Failed to complete registration. Error when adding user to database', 'Die Registrierung konnte nicht abgeschlossen werden. Fehler beim Hinzufügen von Benutzern zur Datenbank'),
(113, 'Nepodařilo se dokončit registraci. Chyba kontroly vložení uživatele do databáze.', 'Failed to complete registration. Error checking user insertion into database.', 'Die Registrierung konnte nicht abgeschlossen werden. Fehlerprüfung der Benutzereingabe in die Datenbank.'),
(114, 'Nepodařilo se dokončit registraci.', 'Failed to complete registration.', 'Die Registrierung konnte nicht abgeschlossen werden.'),
(115, 'německy', 'German', 'Deutsch'),
(116, 'Dokončení registrace ToDo-app', 'Completing ToDo-app registration', 'Abschluss der ToDo-App-Registrierung'),
(117, 'Registraci do aplikace ToDoApp dokončíte kliknutím na následující odkaz:', 'Click on the following link to complete the ToDoApp registration:', 'Klicken Sie auf den folgenden Link, um die ToDoApp-Registrierung abzuschließen:'),
(118, 'Můj první ukázkový seznam', 'My first sample list', 'Meine erste Probenliste'),
(119, 'Vyplnit registrační formulář', 'Fill in the registration form', 'Füllen Sie das Anmeldeformular aus'),
(120, 'Kliknout na odkaz v e-mailu', 'Click on the link in the email', 'Klicken Sie auf den Link in der E-Mail'),
(121, 'Začít používat aplikaci ToDoApp', 'Start using ToDoApp', 'Mit ToDoApp beginnen'),
(122, 'Vytvořit svůj vlastní nový seznam', 'Create your own new list', 'Erstellen Sie Ihre eigene neue Liste'),
(123, 'Vymazat původní ukázový seznam', 'Delete the original sample list', 'Originale Probenliste löschen'),
(124, 'Chyba, při ukládání registračního kódu', 'Error saving registration code', 'Fehler beim Speichern des Registrierungscodes');

-- --------------------------------------------------------

--
-- Struktura tabulky `ukoly`
--

CREATE TABLE `ukoly` (
  `id` bigint(20) NOT NULL,
  `level_ukolu` int(11) NOT NULL,
  `text_ukolu` text COLLATE utf8_unicode_ci DEFAULT NULL,
  `checked` tinyint(1) DEFAULT NULL,
  `rozbaleny` tinyint(1) DEFAULT NULL,
  `parent_seznam` bigint(20) DEFAULT NULL,
  `parent_ukol` bigint(20) DEFAULT NULL,
  `pozice` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Struktura tabulky `users`
--

CREATE TABLE `users` (
  `id` bigint(20) NOT NULL,
  `email` varchar(500) COLLATE utf8_unicode_ci NOT NULL,
  `heslo` varchar(500) COLLATE utf8_unicode_ci NOT NULL,
  `color_scheme` int(11) NOT NULL DEFAULT 0 COMMENT '0 - výchozí, light; 1 - dark',
  `jazyk` varchar(10) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'cz',
  `posledni_otevreny_seznam` bigint(20) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Klíče pro exportované tabulky
--

--
-- Klíče pro tabulku `registracni_tokeny`
--
ALTER TABLE `registracni_tokeny`
  ADD PRIMARY KEY (`id`);

--
-- Klíče pro tabulku `seznamy`
--
ALTER TABLE `seznamy`
  ADD PRIMARY KEY (`id`);

--
-- Klíče pro tabulku `stringy`
--
ALTER TABLE `stringy`
  ADD PRIMARY KEY (`id`);

--
-- Klíče pro tabulku `ukoly`
--
ALTER TABLE `ukoly`
  ADD PRIMARY KEY (`id`);

--
-- Klíče pro tabulku `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pro tabulky
--

--
-- AUTO_INCREMENT pro tabulku `registracni_tokeny`
--
ALTER TABLE `registracni_tokeny`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT pro tabulku `seznamy`
--
ALTER TABLE `seznamy`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT pro tabulku `stringy`
--
ALTER TABLE `stringy`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=125;

--
-- AUTO_INCREMENT pro tabulku `ukoly`
--
ALTER TABLE `ukoly`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=243;

--
-- AUTO_INCREMENT pro tabulku `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
