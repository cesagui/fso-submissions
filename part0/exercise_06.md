```mermaid
sequenceDiagram
    participant browser
    participant server

    browser ->> server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate server
    server ->> browser: the new note has been created
    deactivate server
    Note right of browser: The browser is remains on the same page, javascript code is executed upon form submit to re-render the list.
```