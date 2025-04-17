<?php
header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');
header('Connection: keep-alive');

// Végtelen ciklus, hogy folyamatosan küldjünk adatokat
while (true) {
    // Aktuális idő küldése
    $time = date('Y-m-d H:i:s');
    echo "data: Szerver idő: $time\n\n";
    
    // Kimenet azonnali elküldése
    ob_flush();
    flush();
    
    // 60 másodperc várakozás a következő üzenet előtt
    sleep(60);
}
?>