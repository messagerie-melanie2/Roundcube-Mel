<?php
function listJavaScriptFiles($dir) {
    $js_files = [];
    
    $files = scandir($dir);
    foreach ($files as $file) {
        if ($file == "." || $file == "..") {
            continue;
        }
        $path = $dir . '/' . $file;
        if (is_dir($path)) {
            $js_files = array_merge($js_files, listJavaScriptFiles($path));
        } elseif (pathinfo($path, PATHINFO_EXTENSION) == 'js') {
            $js_files[] = $path;
        }
    }

    return $js_files;
}

function update_js_version($files, $regex_import, $version) {
    echo "[build]Passage des scripts en version $version.....\n";
    foreach ($files as $value) {
        // Lire le contenu du fichier JavaScript
        $fileContent = file_get_contents($value);

        if ($fileContent !== false) {
            $write = true;
            if (strpos($value, '/always_load/load_module.js') !== false) {
                $fileContent = str_replace("const VERSION = 'X.X.X", "const VERSION = '$version", $fileContent);
            }
            else {
                $last_version = explode("\n", $fileContent)[0];
                if (strpos($last_version, '//?v=') !== false) {
                    $last_version = str_replace('//?v=', '', $last_version);
                }
                else $last_version = null;
    
                if ($last_version !== null) {
                    $fileContent = str_replace("?v=$last_version", "?v=$version", $fileContent);
                }
                else {
                    $matches = null;
                    preg_match_all($regex_import, $fileContent, $matches);
                    $matches = $matches[0];
    
                    if ($matches !== null && count($matches) > 0) {
                        for ($i=0, $len = count($matches); $i < $len; ++$i) { 
                            if (strpos($matches[$i], '.js') !== false) {
                                $old = $matches[$i];
                                $matches[$i] = str_replace('.js', ".js?v=$version", $matches[$i]);
                                $fileContent = str_replace($old, $matches[$i], $fileContent);
                            }
                        }
        
                        $fileContent = "//?v=$version\n$fileContent";
                    }
                    else $write = false;
                }
            }

            // Écrire le contenu modifié dans le fichier (remplace le contenu existant)
            if ($write) {
                if (file_put_contents($value, $fileContent) === false) {
                    echo "###[build]Impossible d'écrire dans le fichier JavaScript $value\n";
                }
            }
        } else {
            echo "###[build]Impossible de lire le fichier JavaScript.\n";
        }
    }
}

echo "[build]Démarrage de l'écriture des version....\n";

// Spécifiez le répertoire racine de votre projet ici
$projectDirectory = __DIR__.'/plugins';
$import_regex = '/(import[ \n\t]*([\'"])([^\'"\n]+)(?:[\'"]))|(import([ \n\t]*(?:[^ \n\t\{\}]+[ \n\t]*,?)?(?:[ \n\t]*\{(?:[ \n\t]*[^ \n\t"\'\{\}]+[ \n\t]*,?)+\})?[ \n\t]*)from[ \n\t]*([\'"])([^\'"\n]+)(?:[\'"]))/';
include_once 'version.php';
$version = Version::VERSION.'.'.Version::BUILD;

$files = listJavaScriptFiles($projectDirectory);
update_js_version($files, $import_regex, $version);
echo "[build]Fin de l'écriture !\n";
?>

